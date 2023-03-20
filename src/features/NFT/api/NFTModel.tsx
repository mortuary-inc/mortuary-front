
import { MasterEditionV1, MasterEditionV2, Metadata } from '@metaplex-foundation/mpl-token-metadata';
import * as fireAPI from 'services/helloFire';
import { MetadataInfo } from 'web3/NFTLoader';
import { MetadataJson } from '../../../web3/model/MetadataJson';

export interface INFTData extends MetadataJson {
  metadataAddress: string;
  metadata: Metadata;
  masterEditionAddress?: string;
  masterEdition?: MasterEditionV1|MasterEditionV2;
  collectionMetadataAddress?: string;
  collectionMetadata?: Metadata;

  address: string;
  epitaphLog?: {
    id: string;
    text: string;
  };

  uistate: {
    burning: boolean;
    selected:boolean;
  };
}

export function newINFData(item: MetadataInfo) {
  const _item: INFTData = Object.create(item.json);
  _item.address = item.address;
  _item.metadataAddress = item.metadataAddress;
  _item.metadata = item.metadata;
  _item.masterEditionAddress = item.masterEditionAddress;
  _item.masterEdition = item.masterEdition;
  _item.collectionMetadataAddress = item.collectionMetadataAddress;
  _item.collectionMetadata = item.collectionMetadata;
  _item.uistate = { burning: false, selected:false };
  return _item;
}

export interface ICollectionRead {
  _id: string;
  candyMachine: string;
}

export interface ILogRead {
  _id: string;
}

export async function uploadImgAndCreateBurnLog(
  txSignature: string,
  burnedNft: INFTData,
  ownerAddress: string,
  voxel: string,
  ash: number,
  tax: number,
  burnTaxCollector: string,
  boosterMintID: string
) {
  let collectionId = ""
  // fallback id
  
  //let log = await createBurnLog(burnedNft, collectionId, imageId, ownerAddress, false, true, txSignature, voxel, ash, tax, burnTaxCollector, boosterMintID);
  let log2 = await fireAPI.createBurnLog(burnedNft, burnedNft.image, ownerAddress, false, true, txSignature, voxel, ash, tax, burnTaxCollector, boosterMintID);
}