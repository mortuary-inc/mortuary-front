import { Key, MasterEditionV1, MasterEditionV2, Metadata } from '@metaplex-foundation/mpl-token-metadata';
import * as anchor from '@project-serum/anchor';
import { web3 } from '@project-serum/anchor';
import { MintLayout, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token';
import { ENV, TokenInfo, TokenListProvider } from '@solana/spl-token-registry';
import { MetadataJson } from 'web3/model/MetadataJson';
import { getMasterEditionAddress, getMetadataAddress } from './Accounts';
import { convertOptionalBignum } from './BigNumberUtils';
import { getMinionsByMint, getVoxelsByMint } from './Commons';
import { getRpcUrl } from './ConnectionHelper';
import { getInfos } from './Metaplex';
import { loadMetadataUri } from './NFTLoader';

export type TokenInfos = {
  uiAmount: string;
  amount: anchor.BN;
  address: string;
  mint: string;
  isNFT: boolean;
  name?: string;
  iconUrl?: string;
};

let tokenMap: Map<string, TokenInfo>;

export async function loadTokenList() {
  if (tokenMap != null) return Promise.resolve(tokenMap);

  let provider = new TokenListProvider();
  let res = provider.resolve().then((tokens) => {
    const tokenList = tokens.filterByChainId(ENV.MainnetBeta).getList();
    tokenMap = tokenList.reduce((map, item) => {
      map.set(item.address, item);
      return map;
    }, new Map());
    return tokenMap;
  });
  return res;
}

export async function getTokenAccountsByOwner(connection: web3.Connection, owner: web3.PublicKey) {
  let [data, voxels, minions] = await Promise.all([
    connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID }),
    getVoxelsByMint(),
    getMinionsByMint(),
  ]);

  let result = data.value.filter((d) => {
    let info = d.account.data.parsed?.info;
    if(info.state === "frozen") {
      console.log("Ignoring frozen token account: " + d.pubkey + "/" + info.mint);
      return false;
    }
    return true;
  }).map((d) => {
    let info = d.account.data.parsed?.info;
    return {
      pubkey: d.pubkey.toString(),
      mint: info.mint as string,
      amount: new anchor.BN(info.tokenAmount.amount as string),
      uiAmount: info.tokenAmount.uiAmountString as string,
      isNFT: false,
    };
  });

  result = result.filter((a) => {
    if (a.mint == null) return false;
    if (a.uiAmount == null) return false;

    let isVoxels = voxels.has(a.mint);
    if (isVoxels) return false;
    let isMinions = minions.has(a.mint);
    if (isMinions) return false;

    return true;
  });

  let one = new anchor.BN(1);
  let mintIDs = result.map((r) => new web3.PublicKey(r.mint));
  let mints = new Map<string, anchor.web3.AccountInfo<Buffer>>();
  let mints0 = await getInfos(connection, mintIDs, true);
  mints0.forEach((v, e) => {
    mints.set(e.toString(), v);
  });
  result.forEach((info) => {
    let mintData = mints.get(info.mint);
    if (mintData) {
      const data = Buffer.from(mintData.data);
      const mintInfo = MintLayout.decode(data);
      let supply: anchor.BN = u64.fromBuffer(mintInfo.supply);
      if (supply.gt(one)) {
        info.isNFT = false;
      } else {
        info.isNFT = true;
      }
    }
  });

  return result;
}

export type TokenLoaderCallback = (loaded: number, total: number) => void;

export async function loadOwnedTokens(owner: web3.PublicKey, cb?: TokenLoaderCallback) {
  let connection = new web3.Connection(getRpcUrl());

  const accounts = await getTokenAccountsByOwner(connection, owner);

  let loaded = 0;
  let total = accounts.length;
  if (cb) cb(loaded, total);

  const accountByMint = new Map<string, string>();
  const metadataAddressByMint = new Map<string, string>();
  const metadataPdaLookups = accounts.map((e) => {
    accountByMint.set(e.mint, e.pubkey);
    let pda = getMetadataAddress(new web3.PublicKey(e.mint)).then((pda0) => {
      metadataAddressByMint.set(e.mint, pda0.toBase58());
      return pda0;
    });
    return pda;
  });

  const [metadataAddresses] = await Promise.all([Promise.all(metadataPdaLookups)]);
  const [metadataAccounts, tokenListMap] = await Promise.all([getInfos(connection, metadataAddresses, true), loadTokenList()]);

  const metadataByMint = new Map<string, Metadata>();
  metadataAccounts.forEach((metadataAccount, key) => {
    try {
      if (typeof metadataAccount.owner == 'string') metadataAccount.owner = new web3.PublicKey(metadataAccount.owner);
      let [metadata] = Metadata.fromAccountInfo(metadataAccount);
      metadataByMint.set(metadata.mint.toBase58(), metadata);
    } catch (e) {
      console.error('fail to read metadata', e);
    }
  });

  const accountsWithoutTokenInfo = accounts.reduce((prev, curr) => {
    let mint = curr.mint;
    let ti = tokenListMap.get(mint);
    if (ti != null) {
      loaded++;
      return prev;
    }

    let metadata = metadataByMint.get(mint);
    if (metadata == null || metadata.data == null || metadata.data.uri == null) {
      loaded++;
      return prev;
    }

    prev.push(metadata);
    return prev;
  }, [] as Metadata[]);

  if (cb) cb(loaded, total);

  const offchainMetadata = await loadOffchainMetadata(accountsWithoutTokenInfo, (loaded0, total0) => {
    if (cb) cb(loaded + loaded0, total);
  });

  let results: TokenInfos[] = [];
  for (let account of accounts) {
    let mint = account.mint.toString();
    let uiAmount = account.uiAmount;
    let name: string | undefined;
    let iconUrl: string | undefined;

    let ti = tokenListMap.get(mint);
    let on = metadataByMint.get(mint);
    let off = offchainMetadata.get(mint);
    if (ti != null) {
      name = ti.name;
      iconUrl = ti.logoURI;
    } else if (off != null) {
      name = off.name;
      iconUrl = off.image;
    } else if (on != null) {
      name = on.data.name;
    }

    if (!name) {
      let addr = account.pubkey.toString();
      name = addr.slice(0, 6) + '..';
    }

    let isNFT = account.isNFT;

    let data: TokenInfos = {
      address: account.pubkey.toString(),
      mint,
      amount: account.amount,
      uiAmount,
      name,
      iconUrl,
      isNFT,
    };
    results.push(data);
  }

  results.sort((a, b) => {
    if (a.uiAmount === b.uiAmount) {
      if (a.name == null && b.name == null) return 0;
      if (a.name == null) return -1;
      if (b.name == null) return 1;
      return a.name.localeCompare(b.name);
    }
    return a.uiAmount.localeCompare(b.uiAmount);
  });

  return results;
}

export async function loadOffchainMetadata(metadatas: Metadata[], cb?: TokenLoaderCallback) {
  let batch = 10;
  let jsonByMint = new Map<string, MetadataJson>();

  let loaded = 0;

  for (let i = 0; i < metadatas.length; i = i + batch) {
    try {
      let promises: Array<Promise<any>> = [];
      for (let j = 0; j < batch && i + j < metadatas.length; j++) {
        let d = metadatas[i + j];
        let p = loadMetadataUri(d);
        promises.push(p);
      }
      let result = await Promise.allSettled(promises);
      loaded += result.length;
      result.forEach((v, idx) => {
        let arrayIdx = idx + i;
        if (v.status === 'fulfilled') {
          let mint = metadatas[arrayIdx].mint.toBase58();
          jsonByMint.set(mint, v.value as MetadataJson);
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      if (cb) cb(loaded, metadatas.length)
    }
  }

  return jsonByMint;
}


export async function tryLoadMetaplexData(connection: web3.Connection, tokens: TokenInfos[]) {

  let burnableMetaplex: {
    mint: string;
    metadataAddress: string;
    tokenAddress: string;
    masterEditionAddress: string;
    collectionMetadataAddress?: string;
  }[] = [];

  // ignore token with 0 or non-nft tokens
  tokens = tokens.filter((token) => {
    if (token.amount.toNumber() <= 0) return false;
    if (!token.isNFT) return false;
    return true;
  });
  if(tokens.length <= 0) return burnableMetaplex;

  const accountByMint = new Map<string, string>();
  const metadataAddressByMint = new Map<string, string>();
  const editionAddressByMint = new Map<string, string>();
  const metadataPdaLookups = tokens
    .map((e) => {
      accountByMint.set(e.mint, e.address);
      let pda = getMetadataAddress(new web3.PublicKey(e.mint)).then((pda0) => {
        metadataAddressByMint.set(e.mint, pda0.toBase58());
        return pda0;
      });
      return pda;
    });

  const mintByMasterEditionPDA = new Map<string, string>();
  const masterEditionLookups = tokens
    .map((e) => {
      let editionPDA = getMasterEditionAddress(new web3.PublicKey(e.mint)).then((pda) => {
        mintByMasterEditionPDA.set(pda.toBase58(), e.mint);
        return pda;
      });
      return editionPDA;
    });

  const [metadataAddresses, masterEditionAddresses] = await Promise.all([
    Promise.all(metadataPdaLookups),
    Promise.all(masterEditionLookups),
  ]);

  const [metadataAccounts, masterEditionAccounts] = await Promise.all([getInfos(connection, metadataAddresses, true), getInfos(connection, masterEditionAddresses, true)]);

  const masterEditionByMint = new Map<string, MasterEditionV1 | MasterEditionV2>();
  masterEditionAccounts.forEach((account, key) => {
    try {
      const editionkey = account.data.length > 0 ? account.data[0] : -1;
      if (editionkey === Key.MasterEditionV1 || editionkey === Key.MasterEditionV2) {
        // let ownerPubkey = typeof account.owner == 'string' ? new web3.PublicKey(account.owner) : account.owner;
        // account.owner = ownerPubkey;
        let masterEdition: MasterEditionV1 | MasterEditionV2;
        if (editionkey === Key.MasterEditionV1) {
          [masterEdition] = MasterEditionV1.fromAccountInfo(account);
        } else {
          [masterEdition] = MasterEditionV2.fromAccountInfo(account);
        }
        let maxSupply = convertOptionalBignum(masterEdition.maxSupply, 99);
        if (maxSupply <= 1) {
          let mint = mintByMasterEditionPDA.get(key.toString());
          if (!mint) {
            console.warn('No mint associated to edition: ' + key);
          } else {
            masterEditionByMint.set(mint, masterEdition);
            editionAddressByMint.set(mint, key.toString());
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse MasterEdition', e);
    }
  });

  const entries = Array.from(metadataAccounts.entries());

  for (let entry of entries) {
    try {
      let ownerPubkey = typeof entry[1].owner == 'string' ? new web3.PublicKey(entry[1].owner) : entry[1].owner;
      let account = entry[1];
      account.owner = ownerPubkey;
      let [metadata] = Metadata.fromAccountInfo(account);
      let mint = metadata.mint.toBase58();
      let address = accountByMint.get(mint) as string;
      let masterEdition = masterEditionByMint.get(mint);
      if (!masterEdition) continue;

      let metadataAddress = metadataAddressByMint.get(mint) as string;
      let masterEditionAddress = editionAddressByMint.get(mint);
      if (!masterEditionAddress) continue;

      let collectionMetadataAddress: string | undefined = undefined;
      if (metadata.collection != null && metadata.collection.verified && metadata.collectionDetails == null) {
        collectionMetadataAddress = (await getMetadataAddress(metadata.collection.key)).toBase58();
      }

      burnableMetaplex.push({
        mint,
        tokenAddress: address,
        metadataAddress,
        masterEditionAddress,
        collectionMetadataAddress,
      });

    } catch (e) {
      console.error('fail to read metadata', e);
    }

  }
  
  return burnableMetaplex;
}