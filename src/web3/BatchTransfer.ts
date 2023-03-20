import { InstructionSet } from '@holaplex/solana-web3-tools';
import { createBurnNftInstruction } from '@metaplex-foundation/mpl-token-metadata';
import { web3 } from '@project-serum/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { INFTData } from 'features/NFT/api/NFTModel';
import { toMap } from 'tools/collections';
import { sendTransactions, SequenceType } from './metaplex/connection';
import { getTokenAccountsByOwner, TokenInfos, tryLoadMetaplexData } from './TokensLoader';

// for test only, not good one
export async function testBatchWithTransfer(
  writeConnection: web3.Connection,
  readConnection: web3.Connection,
  wallet: AnchorWallet,
  target: web3.PublicKey,
  nfts: INFTData[],
  progressCb: (nft: INFTData) => void,
  errorCb: (nft: INFTData, error: any) => void
) {
  let promises = nfts.map((nft) =>
    createTransferInstruction(writeConnection, wallet.publicKey, target, new web3.PublicKey(nft.address), new web3.PublicKey(nft.metadata.mint))
  );
  let allInstructions = await Promise.all(promises);

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
    (txId, index) => {
      progressCb(nfts[index]);
    },
    (error, index) => {
      console.error(error);
      errorCb(nfts[index], error);
      return true;
    }
  );
  console.log(JSON.stringify(result));
}

async function createTransferInstruction(
  connection: web3.Connection,
  sender: web3.PublicKey,
  target: web3.PublicKey,
  fromAta: web3.PublicKey,
  mint: web3.PublicKey
) {
  let instructions: web3.TransactionInstruction[] = [];

  let toAta = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, target);
  let toAccountInfo = await connection.getAccountInfo(toAta);
  if (toAccountInfo == null) {
    instructions.push(Token.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, toAta, target, sender));
  }
  instructions.push(Token.createTransferInstruction(TOKEN_PROGRAM_ID, fromAta, toAta, sender, [], 1));
  return instructions;
}

export async function doBatchTransfer(
  writeConnection: web3.Connection,
  connection: web3.Connection,
  readConnection: web3.Connection,
  wallet: AnchorWallet,
  target: web3.PublicKey,
  tokens: TokenInfos[],
  progressCb: (index: number) => void,
  errorCb: (index: number, error: any) => void
) {
  let existingTokenAccountsList = await connection.getParsedTokenAccountsByOwner(target, { programId: TOKEN_PROGRAM_ID });
  let existingTokenAccounts = existingTokenAccountsList.value.reduce((prev, curr) => {
    prev.set(curr.pubkey.toString(), curr.account);
    return prev;
  }, new Map<string, any>());

  let allTargetTokenAccountPromises = tokens.map((t) =>
    Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, new web3.PublicKey(t.mint), target)
  );
  let allTargetTokenAccount = await Promise.all(allTargetTokenAccountPromises);
  if (allTargetTokenAccount.length !== tokens.length) {
    throw new Error('Unable to get all ATA for selected mint');
  }

  // max 7 by tx
  let instructionsSets: InstructionSet[] = [];
  let instructions: web3.TransactionInstruction[] = [];
  instructionsSets.push({
    instructions: instructions,
    signers: [],
  });

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    let toAta = allTargetTokenAccount[i];
    let exist = existingTokenAccounts.get(toAta.toString());
    if (!exist) {
      instructions.push(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          new web3.PublicKey(token.mint),
          toAta,
          target,
          wallet.publicKey
        )
      );
    }
    instructions.push(
      Token.createTransferInstruction(TOKEN_PROGRAM_ID, new web3.PublicKey(token.address), toAta, wallet.publicKey, [], token.amount.toNumber())
    );
    instructions.push(Token.createCloseAccountInstruction(TOKEN_PROGRAM_ID, new web3.PublicKey(token.address), wallet.publicKey, wallet.publicKey, []));

    if ((i + 1) % 7 === 0 && i > 0) {
      instructions = [];
      instructionsSets.push({
        instructions: instructions,
        signers: [],
      });
    }
  }

  let result = await sendTransactions(
    writeConnection,
    readConnection,
    wallet,
    instructionsSets,
    SequenceType.Parallel,
    'confirmed',
    // success callback
    (txId, index) => {
      progressCb(index);
    },
    // failure callback
    (error, index) => {
      errorCb(index, error);
      return true;
    }
  );
  console.log(JSON.stringify(result));
}

export async function doBatchBurnAndClose(
  writeConnection: web3.Connection,
  readConnection: web3.Connection,
  wallet: AnchorWallet,
  tokens: TokenInfos[],
  progressCb: (index: number) => void,
  errorCb: (index: number, error: any) => void
) {
  // max 12 by tx
  let instructionsSets: InstructionSet[] = [];
  let instructions: web3.TransactionInstruction[] = [];
  instructionsSets.push({
    instructions: instructions,
    signers: [],
  });

  let allMetaplexData = await tryLoadMetaplexData(readConnection, tokens);
  let metaplexDataByMint = toMap(allMetaplexData, "mint");
  console.log("Metaplex burn candidates: " + allMetaplexData.length);

  let count = 0;
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    let metaplexBurnable = metaplexDataByMint.get(token.mint);
    if (metaplexBurnable) {
      // metaplex burn
      instructions.push(
        createBurnNftInstruction({
          metadata: new web3.PublicKey(metaplexBurnable.metadataAddress),
          owner: wallet.publicKey,
          mint: new web3.PublicKey(metaplexBurnable.mint),
          tokenAccount: new web3.PublicKey(metaplexBurnable.tokenAddress),
          masterEditionAccount: new web3.PublicKey(metaplexBurnable.masterEditionAddress),
          splTokenProgram: TOKEN_PROGRAM_ID,
          collectionMetadata: metaplexBurnable.collectionMetadataAddress ? new web3.PublicKey(metaplexBurnable.collectionMetadataAddress) : undefined,
        })
      );
      count = count + 2;
    } else {
      // Regular burn + close
      if (token.amount.toNumber() > 0) {
        instructions.push(
          Token.createBurnInstruction(
            TOKEN_PROGRAM_ID,
            new web3.PublicKey(token.mint),
            new web3.PublicKey(token.address),
            wallet.publicKey,
            [],
            token.amount.toNumber()
          )
        );
      }
      instructions.push(Token.createCloseAccountInstruction(TOKEN_PROGRAM_ID, new web3.PublicKey(token.address), wallet.publicKey, wallet.publicKey, []));
      count = count + 1;
    }

    if (count % 12 === 0) {
      instructions = [];
      instructionsSets.push({
        instructions: instructions,
        signers: [],
      });
    }
  }

  let result = await sendTransactions(
    writeConnection,
    readConnection,
    wallet,
    instructionsSets,
    SequenceType.Parallel,
    'confirmed',
    // success callback
    (txId, index) => {
      progressCb(index);
    },
    // failure callback
    (error, index) => {
      errorCb(index, error);
      return true;
    }
  );
  console.log(JSON.stringify(result));
}

// aims to be called from the 'main' user wallet (not a burner)
// we do an additonal check that the token amount == 0
export async function doBatchClose(
  writeConnection: web3.Connection,
  readConnection: web3.Connection,
  wallet: AnchorWallet,
  tokens: TokenInfos[],
  progressCb: (index: number) => void,
  errorCb: (index: number, error: any) => void
) {

  let reloaded = await getTokenAccountsByOwner(readConnection, wallet.publicKey);
  for (let token of tokens) {
    let found = reloaded.find((reload) => reload.pubkey === token.address);
    if (!found) throw new Error("Cannot reload data for account " + token.address);
    if (found.amount.toNumber() !== 0) throw new Error("Cannot close account with remaining supply " + token.address + " : " + found.uiAmount);
  }

  // max 12 by tx
  let instructionsSets: InstructionSet[] = [];
  let instructions: web3.TransactionInstruction[] = [];
  instructionsSets.push({
    instructions: instructions,
    signers: [],
  });

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    instructions.push(Token.createCloseAccountInstruction(TOKEN_PROGRAM_ID, new web3.PublicKey(token.address), wallet.publicKey, wallet.publicKey, []));
    if ((i + 1) % 12 === 0 && i > 0) {
      instructions = [];
      instructionsSets.push({
        instructions: instructions,
        signers: [],
      });
    }
  }

  let result = await sendTransactions(
    writeConnection,
    readConnection,
    wallet,
    instructionsSets,
    SequenceType.Parallel,
    'confirmed',
    // success callback
    (txId, index) => {
      progressCb(index);
    },
    // failure callback
    (error, index) => {
      errorCb(index, error);
      return true;
    }
  );
  console.log(JSON.stringify(result));
}
