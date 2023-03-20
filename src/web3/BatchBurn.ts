import { InstructionSet, SmartInstructionSender } from '@holaplex/solana-web3-tools';
import * as anchor from '@project-serum/anchor';
import { web3 } from '@project-serum/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { AccountMeta, ParsedAccountData, TransactionInstruction } from '@solana/web3.js';
import { INFTData, uploadImgAndCreateBurnLog } from 'features/NFT/api/NFTModel';
import { ASH_MINT, fake_wallet, getMetadataAddress, loadMortuaryProgram, MASTER_ACCOUNT, TOKEN_METADATA_PROGRAM_ID } from './Accounts';
import { BoosterRule } from './Booster';
import { getMasterAccountData, MortuaryMasterAccount } from './Burning';
import { IDL } from './idl/mortuary';
import { sendTransactions, SequenceType } from './metaplex/connection';
import { getHolderByMint } from './NFTLoader';
import { getOrCreateVoxelBurnAccount } from './VoxelBurning';

export type InitBurnData = {
  masterAccount: MortuaryMasterAccount;
  ashTokenAccount: web3.PublicKey;
  voxelBurnAccount: web3.PublicKey;
  voxelAccount: web3.PublicKey;
  voxelAccountOwner: web3.PublicKey;
  pda: web3.PublicKey;
  instructions: web3.TransactionInstruction[];
  ashTokenAccount2: web3.PublicKey | null;
  boosterAccount: web3.PublicKey | null;
  boosterNftAccount: web3.PublicKey | null;
  boosterMetadata: web3.PublicKey | null;
  boosterRewardByBurn: number;
};


export async function checkReadyToBurn(
  readConnection: web3.Connection,
  wallet: web3.PublicKey,
  voxelMint: web3.PublicKey,
  plotSize: number,
  booster: BoosterRule | undefined,
) : Promise<InitBurnData> {

  let instructions: TransactionInstruction[] = [];
  
  const program = await loadMortuaryProgram(readConnection, fake_wallet);
  const masterAccount = await getMasterAccountData(program);

  // Create $ash associated account if it does not exists yet
  const ashTokenAccount = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, ASH_MINT, wallet);
  const ataInfo = await readConnection.getAccountInfo(ashTokenAccount);
  if (!ataInfo || ataInfo.lamports <= 0) {
    let tx = Token.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, ASH_MINT, ashTokenAccount, wallet, wallet);
    instructions.push(tx);
  }

  // get or create voxel burn account
  const { voxelBurnAccount, voxelAccount, voxelBurnAccountCreationInstruction } = await getOrCreateVoxelBurnAccount(program, wallet, voxelMint, plotSize);
  if (voxelBurnAccountCreationInstruction != null) {
    instructions.push(voxelBurnAccountCreationInstruction);
  }

  // Compute pda key
  const [pda] = await web3.PublicKey.findProgramAddress([Buffer.from(anchor.utils.bytes.utf8.encode('mortuary'))], program.programId);

  // Test if burner != plot owner
  let voxelAccountInfo = await readConnection.getParsedAccountInfo(voxelAccount);
  if (voxelAccountInfo == null) throw new Error('Unable to load voxel account info');
  let voxelAccountOwner = new web3.PublicKey((voxelAccountInfo.value?.data as ParsedAccountData).parsed.info.owner as string);
  let ashTokenAccount2: web3.PublicKey | null = null;
  if (!wallet.equals(voxelAccountOwner)) {
    // We need the ash account of the plot owner to send the tax
    ashTokenAccount2 = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, ASH_MINT, voxelAccountOwner);

    // Are we sure we pay for the renter ?
    const ataInfo2 = await readConnection.getAccountInfo(ashTokenAccount2);
    if (!ataInfo2 || ataInfo2.lamports <= 0) {
      let tx = Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        ASH_MINT,
        ashTokenAccount2,
        voxelAccountOwner,
        wallet
      );
      instructions.push(tx);
    }
  }

  // booster
  let boosterRewardByBurn = 0;
  let boosterAccount: web3.PublicKey | null = null;
  let boosterNftAccount: web3.PublicKey | null = null;
  let boosterMetadata: web3.PublicKey | null = null;
  if (booster != null) {
    let boosterNftAccount0 = await getHolderByMint(readConnection, new web3.PublicKey(booster.match!.boosterNftMintAccount));
    if (boosterNftAccount0 == null) throw new Error('Failed to find booster owner for ' + booster.match!.boosterNftMintAccount);

    boosterMetadata = await getMetadataAddress(new web3.PublicKey(booster.match!.boosterNftMintAccount));
    boosterAccount = new web3.PublicKey(booster.match!.boosterAccount);
    boosterNftAccount = boosterNftAccount0;
    boosterRewardByBurn = booster.ashByBurn;
  }

  let res: InitBurnData = {
    instructions,
    masterAccount,
    pda,
    ashTokenAccount,
    voxelAccount,
    voxelAccountOwner,
    voxelBurnAccount,
    ashTokenAccount2,
    boosterAccount,
    boosterMetadata,
    boosterNftAccount,
    boosterRewardByBurn
  };
  return res;
}


export async function initializeBurningAccount(writeConnection: web3.Connection, wallet: AnchorWallet, initBurnData: InitBurnData) {
  let success = false;
  const sender = SmartInstructionSender.build(wallet, writeConnection)
    .config({
      maxSigningAttempts: 3,
      abortOnFailure: true,
      commitment: 'confirmed',
    })
    .withInstructionSets([
      {
        instructions: initBurnData.instructions,
        signers: [],
      },
    ])
    .onProgress((i, txId) => {
      success = true;
    })
    .onFailure((error, successfulItems, currentIndex) => {
      console.error('Init failed', error);
      success = false;
    })
    .onReSign((attempt, i) => {
      console.warn(`ReSigning: ${i} attempt: ${attempt}`);
    });

  await sender.send();
  return success;
}

export async function prepareBurnInstructions(readConnection: web3.Connection, wallet: AnchorWallet, checkBurnInstruction: InitBurnData, trashNft: INFTData) {
  const program = await loadMortuaryProgram(readConnection, wallet);

  const remainingAccounts: AccountMeta[] = [];

  // 1- Remaining account: tax owner token account
  // Test if burner != plot owner
  if (!wallet.publicKey.equals(checkBurnInstruction.voxelAccountOwner)) {
    // We need the ash account of the plot owner to send the tax
    remainingAccounts.push({ pubkey: checkBurnInstruction.ashTokenAccount2!, isSigner: false, isWritable: true });
    // console.log("ashTokenAccount2: " + checkBurnInstruction.ashTokenAccount2);
  }

  if(trashNft.metadata.collection != null && trashNft.metadata.collection.verified) {
    if (trashNft.collectionMetadataAddress == null) throw new Error('Collection metadata address not loaded for ' + trashNft.metadata.collection.key);
    remainingAccounts.push({
      pubkey: new web3.PublicKey(trashNft.collectionMetadataAddress),
      isSigner: false,
      isWritable: true,
    });
  }

  // booster
  if (checkBurnInstruction.boosterAccount != null) {
    remainingAccounts.push({
      pubkey: checkBurnInstruction.boosterAccount!,
      isSigner: false,
      isWritable: false,
    });
    remainingAccounts.push({
      pubkey: checkBurnInstruction.boosterNftAccount!,
      isSigner: false,
      isWritable: true,
    });
    remainingAccounts.push({
      pubkey: checkBurnInstruction.boosterMetadata!,
      isSigner: false,
      isWritable: false,
    });
  }

  let burnTx = program.instruction.doVoxelBurn3(0, {
    accounts: {
      user: wallet.publicKey,
      voxelBurnAccount: checkBurnInstruction.voxelBurnAccount,
      voxelAccount: checkBurnInstruction.voxelAccount,
      masterAccount: MASTER_ACCOUNT,
      bank: checkBurnInstruction.masterAccount.bank,
      treasury: checkBurnInstruction.masterAccount.treasury,
      pdaAccount: checkBurnInstruction.pda,
      nftBurnAccount: new web3.PublicKey(trashNft.address),
      nftBurnMint: new web3.PublicKey(trashNft.metadata.mint),
      nftBurnMetadata: new web3.PublicKey(trashNft.metadataAddress),
      nftBurnEdition: new web3.PublicKey(trashNft.masterEditionAddress!),
      ashTokenAccount: checkBurnInstruction.ashTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      clock: web3.SYSVAR_CLOCK_PUBKEY,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      metadataProgram: TOKEN_METADATA_PROGRAM_ID,
    },
    remainingAccounts: remainingAccounts,
  });

  return [burnTx];
}

export async function doBatchBurn(
  writeConnection: web3.Connection,
  readConnection: web3.Connection,
  wallet: AnchorWallet,
  checkBurnInstruction: InitBurnData,
  nfts: INFTData[],
  voxelSelected: INFTData,
  boosters: BoosterRule[],
  progressCb: (nft: INFTData) => void,
  errorCb: (nft: INFTData, error: any) => void
) {
  // Simulate a failure
  // console.warn("Simulate error");
  // let last = nfts[0];
  // last.metadata.mint = "38LY5EYsFTbqsfkKTeEu2CTiYwi2MNnPPKttsYLXwbec";

  let ashForBurnBoosters: number[] = [];

  let burnTransactions: Promise<web3.TransactionInstruction[]>[] = [];
  for (let i = 0; i < nfts.length; i++) {
    let ashForBurnBooster = 0;
    let nft = nfts[i];
    let initData = checkBurnInstruction;

    // custom use case when burning booster (If we are burning a booster, send it as booster so that burned == booster, to get the 100 ASH)
    let burningBooster = boosters.find((booster) => booster.match?.boosterNftMintAccount === nft.metadata.mint.toBase58());
    if (burningBooster) {
      console.warn('Burning booster ' + burningBooster.match!.boosterNftMintAccount);
      let boosterNftAccount0 = await getHolderByMint(writeConnection, new web3.PublicKey(burningBooster.match!.boosterNftMintAccount));
      if (boosterNftAccount0 == null) throw new Error('Failed to find booster owner for ' + burningBooster.match!.boosterNftMintAccount);
      initData = {
        ashTokenAccount: checkBurnInstruction.ashTokenAccount,
        ashTokenAccount2: checkBurnInstruction.ashTokenAccount2,
        instructions: checkBurnInstruction.instructions,
        masterAccount: checkBurnInstruction.masterAccount,
        pda: checkBurnInstruction.pda,
        voxelAccount: checkBurnInstruction.voxelAccount,
        voxelAccountOwner: checkBurnInstruction.voxelAccountOwner,
        voxelBurnAccount: checkBurnInstruction.voxelBurnAccount,

        boosterAccount: new web3.PublicKey(burningBooster.match!.boosterAccount),
        boosterMetadata: await getMetadataAddress(new web3.PublicKey(burningBooster.match!.boosterNftMintAccount)),
        boosterNftAccount: boosterNftAccount0,
        boosterRewardByBurn: burningBooster.ashByBurn
      };
      ashForBurnBooster = burningBooster.ashIfBurn;
    } else {
      // just use prefill booster
    }

    console.log(`Preparing to burn ${ashForBurnBooster > 0 ? 'BOOSTER' : ''} ` + nft.name);
    ashForBurnBoosters.push(ashForBurnBooster);
    burnTransactions.push(prepareBurnInstructions(writeConnection, wallet, initData, nft));
  }

  let allInstructions = await Promise.all(burnTransactions);
  let instructionSets = allInstructions.map((instructions) => {
    let set: InstructionSet = {
      instructions: instructions,
      signers: [],
    };
    return set;
  });

  let result = await sendTransactions(
    writeConnection,
    readConnection,
    wallet,
    instructionSets,
    SequenceType.Parallel,
    'confirmed',

    // success callback
    (txId, i) => {
      console.log('onProgress:' + i);
      progressCb(nfts[i]);

      let ashForBurnBooster = ashForBurnBoosters[i];
      let burnTax = checkBurnInstruction.masterAccount.goLiveDate.toNumber();
      let amountOfAsh = checkBurnInstruction.masterAccount.ashByBurn;
      if (checkBurnInstruction.boosterAccount != null) { 
        amountOfAsh = amountOfAsh + checkBurnInstruction.boosterRewardByBurn;
        burnTax = burnTax * 2;
      }
      if (ashForBurnBooster > 0) amountOfAsh = ashForBurnBooster;

      let burnTaxCollector = checkBurnInstruction.voxelAccountOwner.equals(wallet.publicKey) ? '' : checkBurnInstruction.voxelAccountOwner.toString();
      if (burnTaxCollector.length > 0) {
        amountOfAsh -= burnTax;
      } else {
        burnTax = 0;
      }

      console.log('Saving tx ' + txId);
      uploadImgAndCreateBurnLog(
        txId,
        nfts[i],
        wallet.publicKey.toBase58(),
        voxelSelected.metadata.mint.toBase58(),
        amountOfAsh,
        burnTax,
        burnTaxCollector,
        '' // boosterMintID
      );
    },

    // failure callback
    (error, index) => {
      let translatedErr = extractError(error);
      if (translatedErr != null) {
        errorCb(nfts[index], translatedErr);
      } else {
        errorCb(nfts[index], error);
      }
      return true;
    }
  );

  console.log(JSON.stringify(result));
}

let idlErrors: Map<number, string> | null = null;
function getIdlErrors() {
  if (idlErrors != null) return idlErrors;
  idlErrors = anchor.parseIdlErrors(IDL);
  return idlErrors;
}

export function extractError(err: any) {
  console.log("ERROR: " + err);
  if (err.err == null) return null;
  if (err.err.InstructionError == null) return null;

  //'{"InstructionError":[0,{"Custom":326}]}'
  let errData = err.err.InstructionError as any[];
  if (errData.length < 2) return null;

  let code = errData[1].Custom;
  if (code == null) return null;

  let msg = 'custom program error: ' + code;
  let translatedErr = anchor.ProgramError.parse(msg, getIdlErrors());
  return translatedErr;
}
