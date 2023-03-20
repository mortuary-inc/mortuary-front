import { INFTData } from 'features/NFT/api/NFTModel';
import { createContext, useContext } from 'react';
import { BoosterRule } from 'web3/Booster';

export interface IMortuaryContext {
  mode: Mode;
  viewWallet: string;
  voxels: Array<INFTData>;
  voxelSelected: INFTData | null;
  boosters: Array<BoosterRule>;
  setLoadingNft?: React.Dispatch<React.SetStateAction<boolean>>;
}

export enum Mode {
  Parlor,
  Commons,
  My,
}

const mortuaryDefaultState: IMortuaryContext = {
  mode: Mode.Parlor,
  viewWallet: '',
  voxelSelected: null,
  voxels: [],
  boosters: [],
  setLoadingNft: null as any,
};
export const MortuaryContext = createContext<IMortuaryContext>(mortuaryDefaultState);

export const useMortuaryContext = () => useContext(MortuaryContext);
