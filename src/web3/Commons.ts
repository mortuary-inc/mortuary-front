import { web3 } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { TransactionInstruction } from '@solana/web3.js';
import * as sanityAPI from 'api/sanityAPI';
import { fake_wallet, loadMortuaryProgram } from './Accounts';
import { asVoxelBurnInfo, getOrCreateVoxelBurnAccount, VoxelBurnAccount } from './VoxelBurning';
import * as fireAPI from 'services/helloFire';

export async function setVoxelBurnTax(
  connection: web3.Connection,
  wallet: AnchorWallet,
  voxelMint: web3.PublicKey,
  tax: number,
  plotSize: number,
  enabled: boolean
) {
  const program = await loadMortuaryProgram(connection, wallet);

  let additionalTx: TransactionInstruction[] = [];

  // get or create voxel burn account
  const { voxelBurnAccount, voxelBurnAccountBump, voxelAccount, voxelBurnAccountCreationInstruction } = await getOrCreateVoxelBurnAccount(
    program,
    wallet.publicKey,
    voxelMint,
    plotSize
  );
  if (voxelBurnAccountCreationInstruction != null) {
    additionalTx.push(voxelBurnAccountCreationInstruction);
  }

  let txSignature = await program.rpc.setVoxelBurnTax(voxelBurnAccountBump, tax, {
    accounts: {
      user: wallet.publicKey,
      voxelAccount: voxelAccount,
      voxelBurnAccount: voxelBurnAccount,
      voxelMint: voxelMint,
    },
    instructions: additionalTx,
  });
  if (enabled) {
    console.log('Create new log for Plot');
  } else {
    console.log('Update new log for Plot');
  }
  await connection.confirmTransaction(txSignature, 'confirmed');
}

export interface ILogRead {
  _id: string;
}

export type OpenPlotInfo = {
  voxelBurnAccount: VoxelBurnAccount;
  freePlot: number;
  name: string;
  img: string;
  lastBurn: number;
  hasBooster: boolean;
};

let voxelByMint: Map<string, { mint: string, name: string, img: string }>;
let minionByMint: Map<string, { mint: string, name: string, img: string }>;

export async function getVoxelsByMint() {
  if (voxelByMint) return Promise.resolve(voxelByMint);

  let file = await require('../data/voxels.json');
  let dataByMint = file.reduce((prev, curr) => {
    prev.set(curr.mint, curr);
    return prev;
  }, new Map<string, any>());
  voxelByMint = dataByMint;
  return voxelByMint;
}
export async function getMinionsByMint() {
  if (minionByMint) return Promise.resolve(minionByMint);

  let file = await require('../data/minions.json');
  let dataByMint = file.reduce((prev, curr) => {
    prev.set(curr.mint, curr);
    return prev;
  }, new Map<string, any>());
  minionByMint = dataByMint;
  return minionByMint;
}

export async function findOpenPlots(connection: web3.Connection, max = 10) {
  const program = await loadMortuaryProgram(connection, fake_wallet);
  let [data, res, plotsStates] = await Promise.all([require('../data/voxels.json'), program.account.voxelBurnAccount.all([]), fireAPI.getPlotsStates()]);
  res.sort(() => (Math.random() > 0.5 ? 1 : -1));

  console.log('Potential open plot: ' + res.length);
  let statesByMint = plotsStates.reduce((prev, curr) => {
    prev.set(curr.mint, curr);
    return prev;
  }, new Map<string, sanityAPI.SanityPlotsStates>());
  let voxDataByMint = data.reduce((prev, curr) => {
    prev.set(curr.mint, curr);
    return prev;
  }, new Map<string, any>());

  let filtered: Array<OpenPlotInfo> = [];
  for (let i = 0; i < res.length; i++) {
    let v = res[i];
    let voxelBurnAccount = v.account as VoxelBurnAccount;
    if (voxelBurnAccount.share && voxelBurnAccount.share > 0) {
      let states = statesByMint.get(voxelBurnAccount.mint.toString()) || { mint: '', holder: '', boosters: 0 };
      if (states.holder === '1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix') {
        continue;
      }
      let extra = asVoxelBurnInfo(v.account as VoxelBurnAccount);
      if (extra.freePlot > 0) {
        let voxData = voxDataByMint.get(voxelBurnAccount.mint.toString());
        filtered.push({
          voxelBurnAccount: voxelBurnAccount,
          freePlot: extra.freePlot,
          lastBurn: extra.lastBurn,
          hasBooster: states.boosters > 0,
          name: voxData?.name || 'Mortuary Inc Plot x4 #xxxx',
          img: voxData?.img || 'https://www.arweave.net/7Ka-7NU9JOloW_kjO6AVXShVZkn7_6Op_Y49gZokt3U?ext=png',
        });
      } else {
        //console.log("Ignoring non free plot");
      }
    } else {
      //console.log("Ignoring non shared plot");
    }
    if (filtered.length >= max) break;
  }

  console.log('Filtered plot: ' + filtered.length);

  filtered.sort((p1, p2) => {
    if (p1.hasBooster && p2.hasBooster) {
      return p1.lastBurn - p2.lastBurn;
    }
    if (p1.hasBooster) return -1;
    return 1;
  });

  return filtered;
}
