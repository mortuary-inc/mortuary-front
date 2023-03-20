import * as anchor from '@project-serum/anchor';
import { Program, web3 } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { ASH_MINT_KEY, MASTER_ACCOUNT_KEY, MORTUARY_PROGRAM_ID_KEY, SOLANA_NETWORK, TREASURY_ACCOUNT_KEY } from 'config';
import { getRpcUrl } from './ConnectionHelper';
import { Mortuary } from './idl/mortuary';
import mortuaryidl from './idl/mortuary.json';

export const MORTUARY_PROGRAM_ID = new web3.PublicKey(MORTUARY_PROGRAM_ID_KEY as string);
export const ASH_MINT = new web3.PublicKey(ASH_MINT_KEY as string);
export const MASTER_ACCOUNT = new web3.PublicKey(MASTER_ACCOUNT_KEY as string);
export const TREASURY_ACCOUNT = new web3.PublicKey(TREASURY_ACCOUNT_KEY as string);
export const BANK = new web3.PublicKey(SOLANA_NETWORK === "devnet" ? "9f7uSkxeHoC3HFfVqaU5WRVQzMG5MzqaENAYbVr2eLrM" : "6JmwwD6ZEv3LvkEuzwxxoBZXm7RyhAkqwbRUTLugYmD3");

export const leaked_key = web3.Keypair.fromSecretKey(
  Uint8Array.from([49, 11, 246, 59, 46, 84, 125, 62, 13, 11, 130, 173, 218, 112, 28, 55, 177, 66, 170, 123, 171, 59, 161, 136, 127, 234, 132, 17, 181, 129, 38, 121, 7, 36, 48, 121, 211, 149, 118, 43, 174, 82, 41, 103, 62, 247, 73, 190, 78, 237, 161, 148, 229, 170, 88, 220, 8, 229, 58, 107, 197, 240, 24, 218])
);

export class LocalWallet implements anchor.Wallet {
  constructor(readonly payer: web3.Keypair) {
    this.payer = payer;
  }
  async signTransaction(tx: web3.Transaction): Promise<web3.Transaction> {
    tx.partialSign(this.payer);
    return tx;
  }
  async signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]> {
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }
  get publicKey(): web3.PublicKey {
    return this.payer.publicKey;
  }
}

export const fake_wallet = new LocalWallet(leaked_key);

export async function loadMortuaryProgram(connection: web3.Connection, wallet: AnchorWallet) {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: 'processed',
  });

  // const idl = JSON.parse(fs.readFileSync('./target/idl/candy_machine.json', 'utf8'));
  const idl = mortuaryidl as any;
  const program = new anchor.Program(idl, MORTUARY_PROGRAM_ID, provider) as Program<Mortuary>;
  return program;
}

export const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export async function getMetadataAddress(mint: web3.PublicKey): Promise<web3.PublicKey> {
  const adr = await web3.PublicKey.findProgramAddress(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  );
  return adr[0];
}

export async function getMasterEditionAddress(mint: web3.PublicKey): Promise<web3.PublicKey> {
  const adr = await web3.PublicKey.findProgramAddress(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
    TOKEN_METADATA_PROGRAM_ID
  );
  return adr[0];
}
export async function getCollectionAuthorityRecordAddress(mint: web3.PublicKey, collectionAuthority: web3.PublicKey): Promise<web3.PublicKey> {
  const adr = await web3.PublicKey.findProgramAddress(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('collection_authority'), collectionAuthority.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  );
  return adr[0];
}
export async function getUseAuthorityRecordAddress(mint: web3.PublicKey, useAuthority: web3.PublicKey,): Promise<web3.PublicKey> {
  const adr = await web3.PublicKey.findProgramAddress(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('user'), useAuthority.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  );
  return adr[0];
}

export async function getVoxelBurnAddress(mint: web3.PublicKey) {
  const adr = await web3.PublicKey.findProgramAddress([MORTUARY_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('voxelburn')], MORTUARY_PROGRAM_ID);
  return adr;
}

let lag: number = 1;
export async function getSolanaClockLag(): Promise<number> {
  if (lag) {
    return Promise.resolve(lag);
  }
  try {
    let connection = new web3.Connection(getRpcUrl());
    const epochInfo = await connection.getEpochInfo();
    let blockTime = await connection.getBlockTime(epochInfo.absoluteSlot);
    if (!blockTime) return 0;

    let solanaClock = blockTime * 1000;
    lag = Date.now() - solanaClock;
    return lag;
  } catch (error) {
    console.log('Failed to get epoch info', error);
    return 0;
  }
}


export async function getAshTokenSupply() {
  let connection = new web3.Connection(getRpcUrl());
  let [supply, balance] = await Promise.all([
    connection.getTokenSupply(ASH_MINT),
    connection.getTokenAccountBalance(BANK),
  ]);

  return {
    cap: supply.value.amount,
    pool: balance.value.amount,
  }
}