import { InstructionSet, SmartInstructionSender } from '@holaplex/solana-web3-tools';
import * as anchor from '@project-serum/anchor';

import { MintLayout, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { AccountMeta, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { sendTransactions } from './connection';

export const CANDY_MACHINE_PROGRAM = new anchor.web3.PublicKey(
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ'
);

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

export const getCollectionPDA = async (
  candyMachineAddress: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('collection'), candyMachineAddress.toBuffer()],
    CANDY_MACHINE_PROGRAM
  );
};

export interface CollectionData {
  mint: anchor.web3.PublicKey;
  candyMachine: anchor.web3.PublicKey;
}

export const getCollectionAuthorityRecordPDA = async (
  mint: anchor.web3.PublicKey,
  newAuthority: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('collection_authority'),
        newAuthority.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

interface CandyMachineState {
  authority: anchor.web3.PublicKey;
  itemsAvailable: number;
  itemsRedeemed: number;
  itemsRemaining: number;
  treasury: anchor.web3.PublicKey;
  tokenMint: anchor.web3.PublicKey;
  isSoldOut: boolean;
  isActive: boolean;
  goLiveDate: anchor.BN;
  price: anchor.BN;
  gatekeeper: null | {
    expireOnUse: boolean;
    gatekeeperNetwork: anchor.web3.PublicKey;
  };
  endSettings: null | [number, anchor.BN];
  whitelistMintSettings: null | {
    mode: any;
    mint: anchor.web3.PublicKey;
    presale: boolean;
    discountPrice: null | anchor.BN;
  };
  hiddenSettings: null | {
    name: string;
    uri: string;
    hash: Uint8Array;
  };
  retainAuthority: boolean;
}

export interface CandyMachineAccount {
  id: anchor.web3.PublicKey;
  program: anchor.Program;
  state: CandyMachineState;
}

export const awaitTransactionSignatureConfirmation = async (
  txid: anchor.web3.TransactionSignature,
  timeout: number,
  connection: anchor.web3.Connection,
  commitment: anchor.web3.Commitment = 'recent',
  queryStatus = false
): Promise<anchor.web3.SignatureStatus | null | void> => {
  let done = false;
  let status: anchor.web3.SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  let subId = 0;
  status = await new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (done) {
        return;
      }
      done = true;
      console.log('Rejecting for timeout...');
      reject({ timeout: true });
    }, timeout);
    while (!done && queryStatus) {
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([txid]);
          status = signatureStatuses && signatureStatuses.value[0];
          if (!done) {
            if (!status) {
              console.log('REST null result for', txid, status);
            } else if (status.err) {
              console.log('REST error for', txid, status);
              done = true;
              reject(status.err);
            } else if (!status.confirmations) {
              console.log('REST no confirmations for', txid, status);
            } else {
              console.log('REST confirmation for', txid, status);
              done = true;
              resolve(status);
            }
          }
        } catch (e) {
          if (!done) {
            console.log('REST connection error: txid', txid, e);
          }
        }
      })();
      await sleep(2000);
    }
  });

  //@ts-ignore
  if (connection._signatureSubscriptions[subId]) {
    connection.removeSignatureListener(subId);
  }
  done = true;
  console.log('Returning status', status);
  return status;
};

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  });
};

export const getCandyMachineState = async (
  anchorWallet: anchor.Wallet,
  candyMachineId: anchor.web3.PublicKey,
  connection: anchor.web3.Connection
): Promise<CandyMachineAccount> => {
  const provider = new anchor.AnchorProvider(connection, anchorWallet, {
    preflightCommitment: 'recent',
  });

  const idl = await anchor.Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider);

  const program = new anchor.Program(idl as anchor.Idl, CANDY_MACHINE_PROGRAM, provider);

  const state: any = await program.account.candyMachine.fetch(candyMachineId);
  const itemsAvailable = state.data.itemsAvailable.toNumber();
  const itemsRedeemed = state.itemsRedeemed.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;

  return {
    id: candyMachineId,
    program,
    state: {
      authority: state.authority,
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      isSoldOut: itemsRemaining === 0,
      isActive:
        state.data.goLiveDate.toNumber() < new Date().getTime() / 1000 &&
        (state.endSettings
          ? state.endSettings.endSettingType.date
            ? state.endSettings.number.toNumber() > new Date().getTime() / 1000
            : itemsRedeemed < state.endSettings.number.toNumber()
          : true),
      goLiveDate: state.data.goLiveDate,
      treasury: state.wallet,
      tokenMint: state.tokenMint,
      gatekeeper: state.data.gatekeeper,
      endSettings: state.data.endSettings,
      whitelistMintSettings: state.data.whitelistMintSettings,
      hiddenSettings: state.data.hiddenSettings,
      price: state.data.price,
      retainAuthority: state.data.retainAuthority,
    },
  };
};

const getMasterEdition = async (mint: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

const getMetadata = async (mint: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

const getCandyMachineCreator = async (
  candyMachine: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('candy_machine'), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM
  );
};

const getTokenWallet = async (wallet: anchor.web3.PublicKey, mint: anchor.web3.PublicKey) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
};

export const mintOneToken = async (
  candyMachine: CandyMachineAccount,
  payer: anchor.web3.PublicKey
): Promise<(string | undefined)[]> => {
  let { instructions, signers } = await buildOneTokenMintIntsrcution(candyMachine, payer);
  try {
    let provider = candyMachine.program.provider as anchor.AnchorProvider;
    return (
      await sendTransactions(provider.connection, provider.connection, provider.wallet, [
        { instructions, signers },
      ])
    ).txs.map((t) => t.txid);
  } catch (e) {
    console.log(e);
  }
  return [];
};

export const batchMintToken = async (
  candyMachine: CandyMachineAccount,
  payer: anchor.web3.PublicKey,
  count: number
) => {
  let indices = Array(count)
    .fill(0)
    .map((x, i) => i);
  let instructionSets: InstructionSet[] = [];
  for (let idx of indices) {
    let { instructions, signers } = await buildOneTokenMintIntsrcution(candyMachine, payer);
    instructionSets.push({
      instructions,
      signers,
    });
  }

  let tx: string = '';
  let provider = candyMachine.program.provider as anchor.AnchorProvider;
  const sender = SmartInstructionSender.build(provider.wallet, provider.connection)
    .config({
      maxSigningAttempts: 3,
      abortOnFailure: true,
      commitment: 'recent',
    })
    .withInstructionSets(instructionSets)
    .onProgress((i, txId) => {
      if (i == 0) tx = txId;
      console.log(i + ' success:' + txId);
    })
    .onFailure((error, successfulItems, currentIndex) => {
      console.error('Burn failed on ' + currentIndex, error);
    })
    .onReSign((attempt, i) => {
      console.warn(`ReSigning: ${i} attempt: ${attempt}`);
    });

  await sender.send();
  return tx;
};

export const buildOneTokenMintIntsrcution = async (
  candyMachine: CandyMachineAccount,
  payer: anchor.web3.PublicKey
) => {
  const mint = anchor.web3.Keypair.generate();

  const userTokenAccountAddress = (await getAtaForMint(mint.publicKey, payer))[0];

  const userPayingAccountAddress = candyMachine.state.tokenMint
    ? (await getAtaForMint(candyMachine.state.tokenMint, payer))[0]
    : payer;

  const candyMachineAddress = candyMachine.id;
  const remainingAccounts: AccountMeta[] = [];
  const signers: anchor.web3.Keypair[] = [mint];
  const cleanupInstructions: TransactionInstruction[] = [];
  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports: await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      ),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(TOKEN_PROGRAM_ID, mint.publicKey, 0, payer, payer),
    createAssociatedTokenAccountInstruction(userTokenAccountAddress, payer, payer, mint.publicKey),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccountAddress,
      payer,
      [],
      1
    ),
  ];

  if (candyMachine.state.gatekeeper) {
    remainingAccounts.push({
      pubkey: (await getNetworkToken(payer, candyMachine.state.gatekeeper.gatekeeperNetwork))[0],
      isWritable: true,
      isSigner: false,
    });
    if (candyMachine.state.gatekeeper.expireOnUse) {
      remainingAccounts.push({
        pubkey: CIVIC,
        isWritable: false,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: (await getNetworkExpire(candyMachine.state.gatekeeper.gatekeeperNetwork))[0],
        isWritable: false,
        isSigner: false,
      });
    }
  }
  if (candyMachine.state.whitelistMintSettings) {
    const mint = new anchor.web3.PublicKey(candyMachine.state.whitelistMintSettings.mint);

    const whitelistToken = (await getAtaForMint(mint, payer))[0];
    remainingAccounts.push({
      pubkey: whitelistToken,
      isWritable: true,
      isSigner: false,
    });

    if (candyMachine.state.whitelistMintSettings.mode.burnEveryTime) {
      const whitelistBurnAuthority = anchor.web3.Keypair.generate();

      remainingAccounts.push({
        pubkey: mint,
        isWritable: true,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: whitelistBurnAuthority.publicKey,
        isWritable: false,
        isSigner: true,
      });
      signers.push(whitelistBurnAuthority);
      const exists = await candyMachine.program.provider.connection.getAccountInfo(whitelistToken);
      if (exists) {
        instructions.push(
          Token.createApproveInstruction(
            TOKEN_PROGRAM_ID,
            whitelistToken,
            whitelistBurnAuthority.publicKey,
            payer,
            [],
            1
          )
        );
        cleanupInstructions.push(
          Token.createRevokeInstruction(TOKEN_PROGRAM_ID, whitelistToken, payer, [])
        );
      }
    }
  }

  if (candyMachine.state.tokenMint) {
    const transferAuthority = anchor.web3.Keypair.generate();

    signers.push(transferAuthority);
    remainingAccounts.push({
      pubkey: userPayingAccountAddress,
      isWritable: true,
      isSigner: false,
    });
    remainingAccounts.push({
      pubkey: transferAuthority.publicKey,
      isWritable: false,
      isSigner: true,
    });

    instructions.push(
      Token.createApproveInstruction(
        TOKEN_PROGRAM_ID,
        userPayingAccountAddress,
        transferAuthority.publicKey,
        payer,
        [],
        candyMachine.state.price.toNumber()
      )
    );
    cleanupInstructions.push(
      Token.createRevokeInstruction(TOKEN_PROGRAM_ID, userPayingAccountAddress, payer, [])
    );
  }
  const metadataAddress = await getMetadata(mint.publicKey);
  const masterEdition = await getMasterEdition(mint.publicKey);

  const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(candyMachineAddress);

  instructions.push(
    await candyMachine.program.instruction.mintNft(creatorBump, {
      accounts: {
        candyMachine: candyMachineAddress,
        candyMachineCreator,
        payer: payer,
        wallet: candyMachine.state.treasury,
        mint: mint.publicKey,
        metadata: metadataAddress,
        masterEdition,
        mintAuthority: payer,
        updateAuthority: payer,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        recentBlockhashes: anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      remainingAccounts: remainingAccounts.length > 0 ? remainingAccounts : undefined,
    })
  );

  const [collectionPDA] = await getCollectionPDA(candyMachineAddress);
  const collectionPDAAccount = await candyMachine.program.provider.connection.getAccountInfo(
    collectionPDA
  );

  if (collectionPDAAccount && candyMachine.state.retainAuthority) {
    try {
      console.log("Collection PDA " + collectionPDA.toBase58());
      const collectionData = candyMachine.program.account.collectionPda.coder.accounts.decodeUnchecked("CollectionPDA", collectionPDAAccount.data) as CollectionData;;
      // const collectionData = (await candyMachine.program.account.collectionPda.fetch(
      //   collectionPDA
      // )) as CollectionData;
      console.log(collectionData);
      const collectionMint = collectionData.mint;
      const collectionAuthorityRecord = await getCollectionAuthorityRecordPDA(
        collectionMint,
        collectionPDA
      );
      console.log(collectionMint);
      if (collectionMint) {
        const collectionMetadata = await getMetadata(collectionMint);
        const collectionMasterEdition = await getMasterEdition(collectionMint);
        console.log('Collection PDA: ', collectionPDA.toBase58());
        console.log('Authority: ', candyMachine.state.authority.toBase58());
        instructions.push(
          await candyMachine.program.instruction.setCollectionDuringMint({
            accounts: {
              candyMachine: candyMachineAddress,
              metadata: metadataAddress,
              payer: payer,
              collectionPda: collectionPDA,
              tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
              instructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
              collectionMint,
              collectionMetadata,
              collectionMasterEdition,
              authority: candyMachine.state.authority,
              collectionAuthorityRecord,
            },
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    instructions: instructions.concat(cleanupInstructions),
    signers: signers,
  };
};

export const getAtaForMint = async (
  mint: anchor.web3.PublicKey,
  buyer: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const CIVIC = new anchor.web3.PublicKey('gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs');
export const GATEKEEPER_NETWORK = new anchor.web3.PublicKey(
  'ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6'
);

export const getNetworkExpire = async (
  gatekeeperNetwork: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [gatekeeperNetwork.toBuffer(), Buffer.from('expire')],
    CIVIC
  );
};

export const getNetworkToken = async (
  wallet: anchor.web3.PublicKey,
  gatekeeperNetwork: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      wallet.toBuffer(),
      Buffer.from('gateway'),
      Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
      gatekeeperNetwork.toBuffer(),
    ],
    CIVIC
  );
};
