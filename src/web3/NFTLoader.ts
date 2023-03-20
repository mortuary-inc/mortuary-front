import { Key, MasterEditionV1, MasterEditionV2, Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { BN, web3 } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SOLANA_NETWORK } from 'config';
import { ExpiringCache } from 'lib/cache';
import { fetchWithTimeout } from 'lib/utils';
import { JsonMetadataCreator, MetadataJson } from 'web3/model/MetadataJson';
import { getMasterEditionAddress, getMetadataAddress } from './Accounts';
import { convertOptionalBignum } from './BigNumberUtils';
import { getMinionsByMint, getVoxelsByMint } from './Commons';
import { decodeTokenAccount, getInfo, getInfos } from './Metaplex';
import { doSingleLoad } from './RemoteSingletonLoader';


export type MetadataInfo = {
  metadataAddress: string;
  metadata: Metadata;
  masterEditionAddress?: string;
  masterEdition?: MasterEditionV1 | MasterEditionV2;
  collectionMetadataAddress?: string;
  collectionMetadata?: Metadata;
  json: MetadataJson;
  address: string; // nft account
};

export const blacklistedUpdateAuthorities: Array<string> = [
  '9GkXjep8bDFVQ3gZR3GUqMLBHRfqZD3DBuEYjKYLK6ML',
  'ECCSaN5ra4Lfi7zTQ11SbuAH4krVUeEotngwXGqNjcA7',
  'FZYBGpkvtL6FBECGjuUcEenoQVCbg5fjGP2LkpwVN5i',
];

let metaDataJsonCache: Map<string, MetadataJson> = new Map();
let walletByMintCache = new ExpiringCache<string, string>(1 * 60 * 1000);


export type MetadataAccount = {
  address: string;
  metadata: Metadata;
  metadataAddress: string;
  masterEdition?: MasterEditionV1 | MasterEditionV2;
  masterEditionAddress?: string;
  collectionMetadataAddress?: string;
  collectionMetadata?: Metadata;
};

// like metaplex, but keep track of account address
export async function findDataByOwner(connection: web3.Connection, owner: web3.PublicKey, withMasterEdition: boolean, filter?: (mint: string) => boolean) {
  const accounts0 = await (doSingleLoad("getParsedTokenAccountsByOwner-" + owner.toBase58(), () => {
    return connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });
  }));

  let accounts = accounts0.value.map((d) => {
    let info = d.account.data.parsed?.info;
    return {
      pubkey: d.pubkey.toString(),
      mint: info.mint as string,
      amount: new BN(info.tokenAmount.amount as string),
      uiAmount: info.tokenAmount.uiAmountString as string,
    };
  });

  accounts = accounts.filter((e) => e.amount.eq(new BN(1)));
  if (filter) {
    accounts = accounts.filter((e) => {
      let keep = filter(e.mint);
      return keep;
    })
  };

  console.log("LOADING " + accounts.length + " FOR " + owner.toBase58());

  const accountByMint = new Map<string, string>();
  const metadataAddressByMint = new Map<string, string>();
  const editionAddressByMint = new Map<string, string>();
  const metadataPdaLookups = accounts.map((e) => {
    accountByMint.set(e.mint, e.pubkey);
    let pda = getMetadataAddress(new web3.PublicKey(e.mint)).then((pda0) => {
      metadataAddressByMint.set(e.mint, pda0.toBase58());
      return pda0;
    });
    return pda;
  });

  const mintByMasterEditionPDA = new Map<string, string>();
  const masterEditionLookups = accounts
    .map((e) => {
      let editionPDA = getMasterEditionAddress(new web3.PublicKey(e.mint)).then((pda) => {
        mintByMasterEditionPDA.set(pda.toBase58(), e.mint);
        return pda;
      });
      return editionPDA;
    });

  const [metadataAddresses, masterEditionAddresses] = await Promise.all([
    Promise.all(metadataPdaLookups),
    withMasterEdition ? Promise.all(masterEditionLookups) : Promise.resolve([]),
  ]);

  const [metadataAccounts, masterEditionAccounts] = await Promise.all([getInfos(connection, metadataAddresses, true), getInfos(connection, masterEditionAddresses, true)]);

  const masterEditionByMint = new Map<string, MasterEditionV1 | MasterEditionV2>();
  if (withMasterEdition) {
    masterEditionAccounts.forEach((account, key) => {
      try {
        const editionkey = account.data.length > 0 ? account.data[0] : -1;
        if (editionkey === Key.MasterEditionV1 || editionkey === Key.MasterEditionV2) {
          let ownerPubkey = typeof account.owner == 'string' ? new web3.PublicKey(account.owner) : account.owner;
          account.owner = ownerPubkey;
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
  }

  const entries = Array.from(metadataAccounts.entries());
  const collectionMetadataAddressByCollectionMint = new Map<string, web3.PublicKey>();
  const collectionMetadataByCollectionMint = new Map<string, Metadata>();

  const res: MetadataAccount[] = [];
  for (let entry of entries) {
    try {
      let ownerPubkey = typeof entry[1].owner == 'string' ? new web3.PublicKey(entry[1].owner) : entry[1].owner;
      let account = entry[1];
      account.owner = ownerPubkey;
      let [metadata] = Metadata.fromAccountInfo(account);
      let mint = metadata.mint.toBase58();
      let address = accountByMint.get(mint) as string;
      let masterEdition = masterEditionByMint.get(mint);
      if (withMasterEdition && !masterEdition) continue;

      let metadataAddress = metadataAddressByMint.get(mint) as string;
      let masterEditionAddress = editionAddressByMint.get(mint);

      if (metadata.collection != null && metadata.collection.verified && metadata.collectionDetails == null) {
        let collectionMetadataAddress = await getMetadataAddress(metadata.collection.key);
        collectionMetadataAddressByCollectionMint.set(metadata.collection.key.toBase58(), collectionMetadataAddress);
      }

      res.push({
        address,
        metadata,
        metadataAddress,
        masterEdition,
        masterEditionAddress,
      });
    } catch (e) {
      console.error('fail to read metadata', e);
    }
  }

  // try loading the verified collection
  try {
    let collectionMetadataAddresses = Array.from(collectionMetadataAddressByCollectionMint.values());
    let collectionMetadataAccounts = await getInfos(connection, collectionMetadataAddresses, true);
    collectionMetadataAccounts.forEach((collectionMetadataAccount, key) => {
      try {
        if (typeof collectionMetadataAccount.owner == 'string') collectionMetadataAccount.owner = new web3.PublicKey(collectionMetadataAccount.owner);
        let [collectionMetadata] = Metadata.fromAccountInfo(collectionMetadataAccount);
        collectionMetadataByCollectionMint.set(collectionMetadata.mint.toBase58(), collectionMetadata);
      } catch (e) {
        console.error('fail to read collection metadata from ' + key.toString(), e);
      }
    });

    res.forEach((data) => {
      let metadata = data.metadata;
      if (metadata.collection != null && metadata.collection.verified && metadata.collectionDetails == null) {
        let collectionMint = metadata.collection.key.toBase58();
        data.collectionMetadataAddress = collectionMetadataAddressByCollectionMint.get(collectionMint)?.toBase58();
        data.collectionMetadata = collectionMetadataByCollectionMint.get(collectionMint);
      }
    });

  } catch (e) {
    console.error('fail to read collection metadata', e);
  }

  return res;
}

export type TokenLoaderCallback = (loaded: number, total: number) => void;

// Like loadOwnedNfts, but filtered to get only Voxel and booster
export async function loadOwnedMortuaryNfts(connection: web3.Connection, owner: web3.PublicKey, cb?: TokenLoaderCallback) {
  let [voxels, minions] = await Promise.all([
    getVoxelsByMint(),
    getMinionsByMint(),
  ]);
  let mortuaryNft = loadOwnedNfts(connection, owner, false, cb, (mint : string) => {
    let vox = voxels.get(mint);
    if (SOLANA_NETWORK === 'devnet') return true;
    if(vox) return true;
    let minion = minions.get(mint);
    if(minion) return true;
    return false;
  });
  return mortuaryNft;
}

export async function loadOwnedNfts(connection: web3.Connection, owner: web3.PublicKey, withMasterEdition = false, cb?: TokenLoaderCallback, filter?: (mint: string) => boolean) {

  console.log("GET NFT FROM " + owner.toBase58())

  let ownedMetadata = await findDataByOwner(connection, owner, withMasterEdition, filter);
  ownedMetadata = ownedMetadata.filter((ma) => {
    return ma.metadata.data.uri;
  });

  let loadedAmount = 0;
  let total = ownedMetadata.length;
  if (cb) cb(loadedAmount, total);

  let batch = 50;
  let loaded: Array<MetadataInfo> = [];
  // console.log('Loading ' + ownedMetadata.length + ' json files');
  for (let i = 0; i < ownedMetadata.length; i = i + batch) {
    // console.log('Loading from ' + i);
    let promises: Array<Promise<any>> = [];
    for (let j = 0; j < batch && i + j < ownedMetadata.length; j++) {
      let d = ownedMetadata[i + j];
      let p = loadMetadataUri(d.metadata);
      promises.push(p);
    }

    try {
      let result = await Promise.allSettled(promises);
      // eslint-disable-next-line
      result.forEach((v, idx) => {
        let arrayIdx = idx + i;
        if (v.status === 'rejected') {
          let metadata = ownedMetadata[arrayIdx].metadata;
          console.log('Failed to read json file of ' + metadata.mint + ' :( ' + v.reason);
          let dumbData = createDumbJsonMetadata(ownedMetadata[arrayIdx].metadata);
          metaDataJsonCache.set(ownedMetadata[arrayIdx].metadata.data.uri, dumbData);
          loaded.push({
            json: dumbData,
            metadataAddress: ownedMetadata[arrayIdx].metadataAddress,
            metadata: ownedMetadata[arrayIdx].metadata,
            address: ownedMetadata[arrayIdx].address,
            masterEditionAddress: ownedMetadata[arrayIdx].masterEditionAddress,
            masterEdition: ownedMetadata[arrayIdx].masterEdition,
            collectionMetadataAddress: ownedMetadata[arrayIdx].collectionMetadataAddress,
            collectionMetadata: ownedMetadata[arrayIdx].collectionMetadata,
          });
        }
        if (v.status === 'fulfilled') {
          metaDataJsonCache.set(ownedMetadata[arrayIdx].metadata.data.uri, v.value as MetadataJson);
          loaded.push({
            json: v.value as MetadataJson,
            metadataAddress: ownedMetadata[arrayIdx].metadataAddress,
            metadata: ownedMetadata[arrayIdx].metadata,
            address: ownedMetadata[arrayIdx].address,
            masterEditionAddress: ownedMetadata[arrayIdx].masterEditionAddress,
            masterEdition: ownedMetadata[arrayIdx].masterEdition,
            collectionMetadataAddress: ownedMetadata[arrayIdx].collectionMetadataAddress,
            collectionMetadata: ownedMetadata[arrayIdx].collectionMetadata,
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  loaded = loaded.filter((metadata) => {
    if (blacklistedUpdateAuthorities.indexOf(metadata.metadata.updateAuthority.toBase58()) >= 0) {
      total -= 1;
      return false;
    }
    loadedAmount++;
    return true;
  });

  loaded.sort((a, b) => {
    return a.metadata.data.name.localeCompare(b.metadata.data.name);
  });
  if (cb) cb(loadedAmount, total);
  return loaded;
}

function createDumbJsonMetadata(metadata: Metadata): MetadataJson {
  // Create a "dumb" json metadata with the few info we have
  // It will allow us to go up to the burn stage even if we encountered a CORS issue or json no more hosted issue
  let mdjc: JsonMetadataCreator[] = [];
  metadata.data.creators?.forEach((c) => {
    mdjc.push({
      address: c.address.toBase58(),
      share: c.share,
      verified: c.verified,
    });
  });
  let res: MetadataJson = {
    name: metadata.data.name,
    symbol: metadata.data.symbol,
    description: '',
    seller_fee_basis_points: metadata.data.sellerFeeBasisPoints,
    image: '',
    properties: {
      files: [],
      category: 'image',
      creators: mdjc,
    },
  };
  return res;
}

export async function loadMetadataUri(data: Metadata) {
  let cachedValue = metaDataJsonCache.get(data.data.uri);
  if (cachedValue != null) {
    return Promise.resolve(cachedValue);
  }

  let file = fetchWithTimeout(data.data.uri).then(function (response) {
    var contentType = response.headers.get('content-type');
    if (contentType) {
      return response.json();
    } else {
      return Promise.reject('Error loading ' + data.data.uri);
    }
  });
  return file;
}

// Get token address of biggest holder for a given mint
export async function getHolderByMint(connection: web3.Connection, mint: web3.PublicKey) {
  const tokens = await connection.getTokenLargestAccounts(mint);
  if (tokens && tokens.value.length > 0) {
    return tokens.value[0].address; // since it's an NFT, we just grab the 1st account
  }
}

export async function getWalletByMint(connection: web3.Connection, mint: web3.PublicKey) {
  let v = walletByMintCache.get(mint.toString());
  if (v != null) {
    return v;
  }

  const tokens = await connection.getTokenLargestAccounts(mint);
  if (!tokens || tokens.value.length === 0) return null;

  let biggestAccount = tokens.value[0];
  let account = await getInfo(connection, biggestAccount.address, true);
  let info0 = decodeTokenAccount(biggestAccount.address, account);
  let wallet = info0.owner.toString();
  walletByMintCache.set(mint.toString(), wallet);

  return wallet;
}
