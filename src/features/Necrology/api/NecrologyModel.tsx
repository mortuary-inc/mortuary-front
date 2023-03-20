import { ETransitionListenSanity } from 'api/sanityAPI';
import { formatDatetime, truncateAddress } from 'lib/utils';

//lastWords, urlImage, thumbnail, isLive
export interface INecrologyData {
  date: string;
  id?: string;
  _id: string;
  collection?: string;
  owner: string;
  //urlImage: string;
  thumbnail: string;
  isLive?: boolean;
  transition?: ETransitionListenSanity;
  transactionID?: string;
  voxelID?: string;
  ash: number;
  tax: number;
  img:string;
}

export interface ICleanNecrologyData {
  necrologyDataCleaned: INecrologyData[];
  king: string;
  collectionBurned: string;
  totalAsh: number;
  totalTax: number;
}

export interface INecroStats {
  king: string;
  collectionBurned: string;
  totalAsh: number;
  totalBurn: number;
  totalTax: number;
}

/**
 * We dont have distinct value in Sanity.io, so I checked Who is the King
 * https://github.com/sanity-io/GROQ/issues/47
 */
export const cleanNecrologyData = (necrologyData: INecrologyData[], withFormatDate = true) => {
  let countKing: { [key: string]: number } = {};
  let countCollectionBurned: { [key: string]: number } = {};
  let totalAsh: number = 0;
  let totalTax: number = 0;

  // Clean Data
  const necrologyDataCleaned = necrologyData.map((value) => {
    // Calcul The king
    if (!countKing[value.owner]) countKing[value.owner] = 0;

    countKing[value.owner]++;

    // Calcul Collection most burnt
    if (value.collection) {
      if (!countCollectionBurned[value.collection]) countCollectionBurned[value.collection] = 0;

      countCollectionBurned[value.collection]++;
    }

    if (withFormatDate) value.date = formatDatetime(value.date);
    if (value.id && value.id.length > 50) value.id = value.id.slice(0, 50) + '...';
    if (value.owner && value.owner.length > 12) value.owner = truncateAddress(value.owner);
    if (value.ash) totalAsh += value.ash;
    return value;
  });

  // order
  let kings = Object.entries(countKing).sort(([, a], [, b]) => b - a);
  let collections = Object.entries(countCollectionBurned).sort(([, a], [, b]) => b - a);

  return {
    necrologyDataCleaned,
    king: Object.keys(kings)[0] ? truncateAddress(kings[0][0]) : '...',
    collectionBurned: Object.keys(collections)[0] ? collections[0][0] : '...',
    totalAsh,
    totalTax,
  };
};

export const computeNecrologyStat = (necrologyData: INecrologyData[]): INecroStats => {
  let countKing: { [key: string]: number } = {};
  let countCollectionBurned: { [key: string]: number } = {};
  let totalAsh: number = 0;
  let totalTax: number = 0;

  necrologyData.forEach((value) => {
    // Calcul The king
    if (!countKing[value.owner]) countKing[value.owner] = 0;
    countKing[value.owner]++;

    // Calcul Collection most burnt
    if (value.collection) {
      if (!countCollectionBurned[value.collection]) countCollectionBurned[value.collection] = 0;
      countCollectionBurned[value.collection]++;
    }

    // ASH
    if (value.ash) totalAsh += value.ash;
    if (value.tax) totalTax += value.tax;

    return value;
  });

  // order
  let kings = Object.entries(countKing).sort(([, a], [, b]) => b - a);
  let collections = Object.entries(countCollectionBurned).sort(([, a], [, b]) => b - a);

  return {
    king: Object.keys(kings)[0] ? truncateAddress(kings[0][0]) : '...',
    collectionBurned: Object.keys(collections)[0] ? collections[0][0] : '...',
    totalAsh,
    totalBurn: necrologyData.length,
    totalTax,
  };
};

