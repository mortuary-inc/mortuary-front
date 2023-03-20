import * as anchor from '@project-serum/anchor';
import { IdlAccounts, web3 } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { BURN_V2_FREQUENCY, SOLANA_NETWORK,  TREASURY_ACCOUNT_KEY } from 'config';
import { JsonMetadataAttribute } from 'web3/model/MetadataJson';
import { INFTData } from 'features/NFT/api/NFTModel';
import { ExpiringCache } from 'lib/cache';
import { fake_wallet, getMetadataAddress, getVoxelBurnAddress, loadMortuaryProgram, MASTER_ACCOUNT } from './Accounts';
import { BoosterRule, getBoosterRules } from './Booster';
import { accountCache } from './Burning';
import { Mortuary } from './idl/mortuary';
import { getHolderByMint } from './NFTLoader';
import { doSingleLoad } from './RemoteSingletonLoader';
import { getRpcUrl } from './ConnectionHelper';

export type VoxelBurnAccount = IdlAccounts<Mortuary>['voxelBurnAccount'];

export type VoxelBurnInfo = {
  plotSize: number;
  freePlot: number;
  lastBurns: Array<number>;
  lastBurn: number;
};

export function getPlotSize(attributes: JsonMetadataAttribute[] | undefined) {
  if (attributes == null) return -1;

  // need a new collection on devnet... for now just use the old attribut name
  let traitName = SOLANA_NETWORK === 'devnet' ? 'Plot' : 'Plot Size';

  for (let i = 0; i < attributes.length; i++) {
    let at = attributes[i];
    if (at.trait_type === traitName && at.value) return parseInt(at.value);
  }

  return -1;
}

export async function getVoxelBurn(connection: web3.Connection, mint: web3.PublicKey) {
  let address = (await getVoxelBurnAddress(mint))[0];

  const program = await loadMortuaryProgram(connection, fake_wallet);
  let voxelBurn = (await program.account.voxelBurnAccount.fetchNullable(address)) as VoxelBurnAccount | null;
  return voxelBurn;
}

export async function getVoxelBurnAccount(program: anchor.Program<Mortuary>, mint: web3.PublicKey, forceReload: boolean) {
  let address = (await getVoxelBurnAddress(mint))[0];

  let key = address.toString();
  if (forceReload) {
    accountCache.delete(key);
  }

  let data = accountCache.get(key) as VoxelBurnAccount;
  if (data != null) return data;


  let voxelBurnAccount = await doSingleLoad(address.toBase58(), () => {
    return program.account.voxelBurnAccount.fetchNullable(address);
  });

  if (voxelBurnAccount != null) accountCache.set(key, voxelBurnAccount);

  return voxelBurnAccount as VoxelBurnAccount | null;
}

export function asVoxelBurnInfo(account: VoxelBurnAccount) {
  let plotSize = account.plotSize;
  let freePlot = 0;
  let lastBurn = 0;
  let lastBurns: Array<number> = [];

  // convert to minutes
  let limit = BURN_V2_FREQUENCY * 60;
  let now = Date.now() / 60000;
  for (let i = 0; i < plotSize; i++) {
    let burn = account.lastBurn[i] * 60 * 1000;
    lastBurns.push(burn);
    if (burn > lastBurn) lastBurn = burn;
    if (account.lastBurn[i] + limit < now) freePlot++;
  }

  let vb: VoxelBurnInfo = {
    plotSize,
    freePlot,
    lastBurns,
    lastBurn,
  };

  return vb;
}

export async function getOrCreateVoxelBurnAccount(program: anchor.Program<Mortuary>, user: web3.PublicKey, voxelMint: web3.PublicKey, plotSize: number) {
  const [voxelBurnAccount, voxelBurnAccountBump] = await getVoxelBurnAddress(voxelMint);
  let burnAccount = await getVoxelBurnAccount(program, voxelMint, false);

  const voxelAccount = await getHolderByMint(program.provider.connection, voxelMint);
  if (voxelAccount == null) {
    throw new Error('Failed to find Voxel owner for ' + voxelMint.toString());
  }

  let voxelBurnAccountCreationInstruction: web3.TransactionInstruction | null = null;
  if (burnAccount == null) {
    let voxelMetadata = await getMetadataAddress(voxelMint);

    voxelBurnAccountCreationInstruction = await program.instruction.initializeVoxelBurn(voxelBurnAccountBump, plotSize, {
      accounts: {
        masterAccount: MASTER_ACCOUNT,
        user: user,
        voxelMint: voxelMint,
        voxelAccount: voxelAccount,
        voxelMetadata: voxelMetadata,
        voxelBurnAccount: voxelBurnAccount,
        systemProgram: SystemProgram.programId,
      },
    });
  }
  return { voxelBurnAccount, voxelBurnAccountBump, voxelAccount, voxelBurnAccountCreationInstruction, burnAccount };
}

export function isVoxelNft(nft: INFTData) {
  let checkVerified = SOLANA_NETWORK === 'devnet' ? false : true;
  let creatorMatch = nft.metadata.data.creators?.some((c) => c.address.toBase58() === TREASURY_ACCOUNT_KEY && (!checkVerified || (checkVerified && c.verified)));
  if (!creatorMatch) return false;

  let nameMatch = nft.name != null && nft.name.startsWith('Mortuary Inc Plot x');
  if (!nameMatch) return false;

  return true;
}

// split nft into voxels vs burnables
// 1rst voxels is the one with the biggest plot size
export function extractVoxels(allNft: INFTData[]) {
  const voxels: INFTData[] = [];
  const burnables: INFTData[] = [];
  const boosters: BoosterRule[] = [];
  allNft.forEach((n) => {
    // eslint-disable-next-line
    let voxel = isVoxelNft(n);
    voxel ? voxels.push(n) : burnables.push(n);
  });
  voxels.sort((v1, v2) => {
    let v1s = getPlotSize(v1.attributes);
    let v2s = getPlotSize(v2.attributes);
    return v2s - v1s;
  });

  let boosterRules = getBoosterRules();
  allNft.forEach((n) => {
    let boost = isBooster(n, boosterRules);
    if (boost != null) {
      boosters.push(boost);
    }
  });

  return { voxels, burnables, boosters };
}

export async function getNextBurnDateV2(connection: web3.Connection, wallet: AnchorWallet, voxel: web3.PublicKey) {
  
  const program = await loadMortuaryProgram(connection, wallet as AnchorWallet);
  let account = await getVoxelBurnAccount(program, voxel, true);
  if (account == null) {
    return {
      canBurn: true,
      nextBurn: 0,
    };
  }

  let infos = asVoxelBurnInfo(account);
  if (infos.freePlot > 0) {
    return {
      canBurn: true,
      nextBurn: 0,
    };
  }

  infos.lastBurns.sort((a, b) => {
    return a - b;
  });
  return {
    canBurn: false,
    nextBurn: infos.lastBurns[0] / 1000 + BURN_V2_FREQUENCY * 60 * 60,
  };
}

export function isBooster(nft: INFTData, boosters: BoosterRule[]) {

  for (let i = 0; i < boosters.length; i++) {
    let booster = boosters[i];

    let creatorMatch = true;
    if (booster.creator != null) {
      let creatorMatch0 = nft.metadata.data.creators?.some((c) => c.address.toBase58() === booster.creator);
      if (!creatorMatch0) creatorMatch = false;
    }

    let nameMatch = true;
    if (booster.name != null) {
      nameMatch = nft.name != null && nft.name.includes(booster.name);
    }

    if (creatorMatch && nameMatch) {
      let r: BoosterRule = {
        account: booster.account,
        ashByBurn: booster.ashByBurn,
        ashIfBurn: booster.ashIfBurn,
        creator: booster.creator,
        name: booster.name,
        match: {
          boosterAccount: booster.account,
          boosterNftMintAccount: nft.metadata.mint.toBase58(),
        },
      };

      return r;
    }
  }

  return null;
}

let mProgram: anchor.Program<Mortuary>;
let voxelBurnCache = new ExpiringCache<string, VoxelBurnAccount>(1000);

async function getProgram() {
  if (mProgram == null) {
    let connection = new web3.Connection(getRpcUrl());
    mProgram = await loadMortuaryProgram(connection, fake_wallet);
  }
  return mProgram;
}

// cached for 1s
export async function getVoxelBurnAccountC(mint: string) {
  let d = voxelBurnCache.get(mint);
  if (d != null) return d;

  let program = await getProgram();
  let account = (await getVoxelBurnAccount(program, new web3.PublicKey(mint), true)) as VoxelBurnAccount;
  voxelBurnCache.set(mint, account);

  return account;
}
