import { web3 } from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { BURN_V2_FREQUENCY } from 'config';
import { Mode, useMortuaryContext } from 'context/MortuaryContext';
import ImageGridPlaceHolder from 'features/Placeholders/ImageGridPlaceHolder';
import { useWriteConnection } from 'hooks/useWriteConnection';
import { createContext, useEffect, useState } from 'react';
import StickyBox from 'react-sticky-box';
import { checkReadyToBurn, doBatchBurn, InitBurnData, initializeBurningAccount } from 'web3/BatchBurn';
import { asVoxelBurnInfo, getPlotSize, getVoxelBurnAccountC } from 'web3/VoxelBurning';
import { INFTData } from '../api/NFTModel';
import '../CollectionNFT.css';
import ContainerNFTItem from './ContainerNFTItem';
import NFTModal from './NFTModal';
import toast from 'react-hot-toast';
import { Notification } from 'features/Notification/Notification';

const defaultCollectionNFTContext = {
  epitaph: {
    id: '',
    text: '',
  },
  setEpitaph: null as any,
};
export const CollectionNFTContext = createContext(defaultCollectionNFTContext);

export type EpitaphData = {
  _id: string;
  mint: string;
  owner: string;
  text: string;
};

interface IMortuaryProps {
  nfts: INFTData[];
  isLoading: boolean;
  amountSlot: number;
  addNFTToBurning?: (nft: INFTData) => void;
}

const CollectionNFT = ({ nfts, isLoading, amountSlot, addNFTToBurning }: IMortuaryProps) => {
  const [nftIndex, setNFTIndex] = useState<number>(-1);
  const [nftsEpitaph, setNFTsEpitaph] = useState<INFTData[]>(nfts);
  const [selectedNFTs, setSelectedNFTs] = useState<INFTData[]>([]);
  let [isOpen, setIsOpen] = useState(false);
  const [contextEpitaph, setContextEpitaph] = useState(defaultCollectionNFTContext.epitaph);
  const { viewWallet, voxelSelected, mode, boosters } = useMortuaryContext();
  const { connection } = useConnection();
  const { connection: writeConnection } = useWriteConnection();
  const wallet = useAnchorWallet();
  const [initBurnData, setInitBurnData] = useState<InitBurnData | null>(null);
  const [maxAllowedBurn, setMaxAllowedBurn] = useState(0);
  const [isBurning, setIsBurning] = useState(false);

  const isPublic = mode === Mode.Parlor;

  // if(boosters.length > 0) {
  //   for(let booster of boosters) {
  //     console.log("Booster: " + booster.name + ", " + booster.account + ", " + booster.ashIfBurn + " : " + booster.match?.boosterNftMintAccount);
  //   }
  // }

  useEffect(() => {
    if (!isOpen && nftIndex) setNFTIndex(-1);
  }, [isOpen, nftIndex]);

  useEffect(() => {
    if (!viewWallet || !nfts.length) return;

          setNFTsEpitaph(
            nfts.map((item) => {
              item.epitaphLog = {
                id: item.metadata.mint.toBase58(),
                text: '',
              };
              //console.log(item);
              return item;
            })
          );
       
  }, [viewWallet, nfts]);

  useEffect(() => {
    if (!voxelSelected) return;
    const getUnavailableSlots = async () => {
      let account = await getVoxelBurnAccountC(voxelSelected.metadata.mint.toBase58());

      let now = Date.now();
      let limit = BURN_V2_FREQUENCY * 60 * 60 * 1000;
      let infos = asVoxelBurnInfo(account);
      let slotsNotAvailable: Array<number> = [];
      infos.lastBurns.forEach((b) => {
        if (b + limit > now) {
          slotsNotAvailable.push(b);
        }
      });

      setMaxAllowedBurn(amountSlot - slotsNotAvailable.length);
    };

    getUnavailableSlots();
  }, [voxelSelected]);

  const onDeselectAll = async () => {
    console.log("Deselect all");
    setSelectedNFTs([]);
  }

  const openModal = (item: INFTData) => {
    setIsOpen(true);
    setNFTIndex(nftsEpitaph.findIndex((nftEpitaph) => nftEpitaph.metadata.mint === item.metadata.mint));
  };

  const onNFTSelected = (item: INFTData, isSelected: boolean) => {
    //console.log("Check selected NFT")
    let copy = [...selectedNFTs];

    if (copy.length > maxAllowedBurn) {
      return;
    }

    /*
    console.log('NFT selected: ' + item.name);
    console.log('Mint: ' + item.metadata.mint);
    console.log('Collection: ' + item.collectionMetadata?.mint + " " + item.collectionMetadata?.data.name);
    */
    if (isSelected) {
      copy.push(item);
    } else {
      copy = copy.filter((n) => n.address !== item.address);
    }
    setSelectedNFTs(copy);
  };

  const removeNFT = (nft: INFTData) => {
    console.log("Remove NFT")
    let copy = nftsEpitaph.filter((n) => n.address !== nft.address);
    setNFTsEpitaph(copy);
  };

  const updateNFT = (nft: INFTData) => {
    let copy = [...nftsEpitaph];
    // let index = copy.findIndex((n) => n.address == nft.address);
    // if(index>=0) {
    setNFTsEpitaph(copy);
    // }
  };

  const initializeBurnAccount = async (initBurnData: InitBurnData, voxelSelected: INFTData) => {
    if (!wallet) return;
    if (!writeConnection) return;

    await initializeBurningAccount(writeConnection, wallet, initBurnData);

    // reload burning data
    await loadInitBurnData(voxelSelected);
  };

  const onBurn = async (initBurnData: InitBurnData, voxelSelected: INFTData) => {
    setIsBurning(true);
    if (!wallet) return;
    if (!writeConnection) return;
    if (selectedNFTs.length <= 0) {
      toast.custom(<Notification message={"Select NFTs before burning... What a poor pyro you make :-)"} variant="error" />);
      setIsBurning(false);
      return
    };

    try {
      console.log('fire');
      selectedNFTs.forEach((n) => (n.uistate.burning = true));
      setNFTsEpitaph([...nftsEpitaph]);

      await doBatchBurn(
        writeConnection,
        connection,
        wallet,
        initBurnData,
        selectedNFTs,
        voxelSelected,
        boosters,
        (nft) => {
          //setBurnedNFTs(burnedNFTs => [...burnedNFTs, nft]);
          //console.log('Burned ' + nft.name);
          toast.custom(<Notification message={'Congrats. You just burnt: ' + nft.name + '🔥'} variant="success" />)
          nft.uistate.burning = false;
          onDeselectAll();
          removeNFT(nft);
          addNFTToBurning && addNFTToBurning(nft);
        },
        (nft, error) => {
          console.error('Failed to burn ' + nft.name, error);
          let msg = 'Failed to burn ' + nft.name + '. ';
          if (error && error.msg) {
            msg += ' ' + error.msg;
          } else if (error && error.message) {
            msg += ' Error ' + error.message;
          }
          toast.custom(<Notification message={msg} variant="error" />);
          setIsBurning(false);
          nft.uistate.burning = false;
          updateNFT(nft);
        }
      ).then((e) => {
        console.log("BURN DONE...")
        setIsBurning(false);
        //console.log(burnedNFTs)
      });
    } catch (error: any) {
      if(selectedNFTs.length>0){
        selectedNFTs.forEach((n) => (n.uistate.burning = false));
        setIsBurning(false);
        updateNFT(selectedNFTs[0]);
      }
      let msg = 'Something went wrong.';
      if (error && error.message) {
        msg = error.message;
      }
      toast.custom(<Notification message={msg} variant="error" />);
    }
  };

  const loadInitBurnData = async (voxelSelected: INFTData) => {
    let booster = (boosters.length > 0 && boosters[0].match) ? boosters[0] : undefined;
    let data = await checkReadyToBurn(
      connection,
      new web3.PublicKey(viewWallet),
      new web3.PublicKey(voxelSelected.metadata.mint),
      getPlotSize(voxelSelected.attributes),
      booster
    );
    setInitBurnData(data);
  };

  useEffect(() => {
    (async () => {
      if (!connection) return;
      if (!voxelSelected) return;
      if (!viewWallet) return;

      await loadInitBurnData(voxelSelected);
    })();
  }, [connection.rpcEndpoint, voxelSelected?.address, viewWallet]);

  /* USER is not connected */
  if (!viewWallet) {
    return <></>;
  }

  /* USER is visiting an address without Mortuary NFT */
  if (!isLoading && isPublic && !voxelSelected) {
    return <></>;
  }

  /* USER is connected */
  if (isLoading)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 justify-items-center mt-8 m-auto gap-2 sm:gap-4 xl:gap-8">
        <ImageGridPlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
        <ImageGridPlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
        <ImageGridPlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
        <ImageGridPlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
        <ImageGridPlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
        <ImageGridPlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
        <ImageGridPlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
        <ImageGridPlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
      </div>
    );

  if (!isLoading && nfts.length && voxelSelected) {
    let burnCountText = selectedNFTs.length > 0 ? ' x' + selectedNFTs.length : '';
    return (
      <CollectionNFTContext.Provider
        value={{
          epitaph: contextEpitaph,
          setEpitaph: setContextEpitaph,
        }}
      >
        <StickyBox offsetTop={20} offsetBottom={20} className={'z-20 text-center'}>
          {initBurnData == null ? (
            <> </>
          ) : initBurnData.instructions.length > 0 ? (
            <>
              <button
                type="button"
                onClick={() => initializeBurnAccount(initBurnData, voxelSelected)}
                className={
                  ' font-sans text-xl bg-fourth py-2 text-primary rounded-xl w-full md:w-6/12 xl:w-4/12 hover:bg-fourth-h transition-colors duration-500 ease-in-out'
                }
              >
                {'Initialize burn account'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onBurn(initBurnData, voxelSelected)}
              className={
                ' font-sans text-xl bg-fourth py-2 text-primary rounded-xl w-full md:w-6/12 xl:w-4/12 hover:bg-fourth-h transition-colors duration-500 ease-in-out'
              }
              disabled={isBurning}>
              
              {isBurning ? (
                    <svg className="animate-spin mx-auto h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    'BURN' + burnCountText
                  )}
            </button>
          )}
        </StickyBox>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 justify-items-center mt-8 m-auto gap-2 sm:gap-4 xl:gap-8 ">
          {nftsEpitaph.map((item, index) => {
            return (
              <ContainerNFTItem
                key={'NFTItem-' + index}
                item={item}
                openModal={openModal}
                onNFTSelected={onNFTSelected}
                isBurning={item.uistate.burning}
                disableNewSelection={selectedNFTs.length >= maxAllowedBurn}
              />
            );
          })}
        </div>
        {nftIndex > -1 && <NFTModal items={nftsEpitaph} itemIndex={nftIndex} setIsOpen={setIsOpen} />}
      </CollectionNFTContext.Provider>
    );
  }

  return <div className="text-center text-secondary text-xl">{mode === Mode.My ? "You are trying to use a plot that's not yours." : 'Wallet empty'}</div>;
};

export default CollectionNFT;
