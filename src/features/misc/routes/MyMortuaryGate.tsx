import { web3 } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import SimpleButton from 'components/SimpleButton';
import { Mode, MortuaryContext } from 'context/MortuaryContext';
import MortuaryDisconnected from 'features/Mortuary/MortuaryDisconnected';
import MortuarySelect from 'features/Mortuary/MortuarySelect';
import MortuaryStateText from 'features/Mortuary/MortuaryStateText';
import { INFTData, newINFData } from 'features/NFT/api/NFTModel';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from 'routes/conf';
import { BoosterRule } from 'web3/Booster';
import { findOpenPlots, OpenPlotInfo } from 'web3/Commons';
import { loadOwnedMortuaryNfts, loadOwnedNfts } from 'web3/NFTLoader';
import { extractVoxels } from 'web3/VoxelBurning';
import ImgixClient from 'api/ImgixClient';
import { getRpcUrl } from 'web3/ConnectionHelper';

//export const truncateAddress = (address: string) => address.slice(0, 4) + '...' + address.slice(address.length - 4);
export const truncateAddress = (address: string) => address.slice(0, 4) + '...';

export const getRandom = (arr, n) => {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len) throw new RangeError('getRandom: more elements taken than available');
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

const MyMortuaryGate = () => {
  const unmounted = useRef(false);
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [isLoadingNft, setLoadingNft] = useState<boolean>(true);
  const [viewWallet, setViewWallet] = useState<string>('');
  const [voxels, setVoxels] = useState<INFTData[]>([]);
  const [boosters, setBoosters] = useState<BoosterRule[]>([]);
  const [tokensTotal, setTokensTotal] = useState(0);
  const [tokensLoaded, setTokensLoaded] = useState(0);
  /*
  const [necrologiesData, setNecrologiesData] = useState<ICleanNecrologyData | null>(null);
  const [publicData, setPublicData] = useState<PublicData[]>([]);
  */
  const [plotSelected, setSelectedPlot] = useState<string>('#');
  const history = useHistory();
  let [commons, setCommons] = useState<OpenPlotInfo[]>([]);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (publicKey) setViewWallet(publicKey.toString());
    else setViewWallet('');
  }, [publicKey]);

  useEffect(() => {
    (async () => {
      if (!viewWallet || !connection || !isLoadingNft) return;

      // Load only Mortuary NFT (voxel, minions)
      let response = await loadOwnedMortuaryNfts(connection, new web3.PublicKey(viewWallet), (loaded, total) => {
        console.log('Loaded ' + loaded + '/' + total);
        setTokensLoaded(loaded);
        setTokensTotal(total);
      });

      if (unmounted.current) return;

      const nftItems = response.map((item) => newINFData(item));

      let { voxels, boosters } = extractVoxels(nftItems);

      if (voxels.length > 0) setVoxels(voxels);
      if (boosters.length > 0) setBoosters(boosters);
      setLoadingNft(false);
    })();
  }, [viewWallet, connection, isLoadingNft]);

  useEffect(() => {
    (async () => {
      if (plotSelected === '#') return;
      history.push('/commons/' + plotSelected);
    })();
  }, [plotSelected]);

  useEffect(() => {
    (async () => {
      let connection = new web3.Connection(getRpcUrl());
      let found = await findOpenPlots(connection, 5);
      setCommons(found);
      console.log('LOADED ' + found.length);
    })();
  }, []);

  /*
  if (voxels.length == 1) {
    let mint = voxels[0].metadata.mint;
    return <Redirect to={'/my-mortuary/' + mint} />;
  }
*/
  return (
    <MortuaryContext.Provider
      value={{
        mode: Mode.My,
        viewWallet: viewWallet,
        voxelSelected: null,
        voxels: voxels,
        boosters: boosters,
        setLoadingNft,
      }}
    >
      <div className="mt-10">
        <MortuaryStateText isLoading={!viewWallet ? false : isLoadingNft} />
        {viewWallet ? (
          <div>
            <div className="lg:w-2/4 mx-auto">
              <div className={`${voxels.length != 0 ? 'border-secondary border border-opacity-10 ' : 'border-third border-2'}  p-3 rounded-xl text-sm`}>
                <div className="md:flex justify-between items-center">
                  {voxels.length != 0 ? (
                    <div className="mb-4 md:mb-0 font-sansLight  text-secondary w-2/3 md:w-auto">Select your plot or update the privacy / tax settings.</div>
                  ) : (
                    <div className="mb-4 md:mb-0 font-sansLight  text-secondary w-2/3 md:w-auto">
                      If you don't have a Mortuary plot, you can secure one on {''}
                      <a href="https://magiceden.io/marketplace/mortuary_inc" className="underline-purple" target="_blank" rel="noreferrer">
                        Magic Eden
                      </a>
                    </div>
                  )}
                  <div><SimpleButton link={Routes.Cleaner}>Clean your wallet</SimpleButton></div>
                    
                    {/*
                    <div className="w-1/3 md:w-20 pt-2" style={{ height: '34px' }}>
                    <HelpBox
                      classNameBTN="cursor-pointer z-10 absolute right-0 top-1/2 transform -translate-y-1/2"
                      classNameCont="right-0 md:-translate-x-1/2 md:left-1/2"
                    /> 
                    </div>
                    */}
                  
                </div>
              </div>
            </div>
            <div className={(isLoadingNft? "text-center" : "") + " lg:w-2/4 mt-8 m-auto gap-8 "}>
              { isLoadingNft? 
              
              <button type="button" className="inline-flex px-4 py-2 font-sans leading-6 text-sm shadow rounded-md text-black bg-third hover:bg-third-h transition ease-in-out duration-150 cursor-not-allowed" disabled>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading NFTs {tokensLoaded + '/' + tokensTotal}
              </button>
              :
              
              voxels.map((voxel, idx) => {
                return <MortuarySelect key={'select-' + idx} isLoading={isLoadingNft} voxel={voxel} boosters={boosters.length} />;
              })}
            </div>
            <div className="lg:w-2/4 mt-8 m-auto gap-8">
              <div className="border-secondary border-opacity-10 border p-3 rounded-xl mt-4 text-sm md:mt-0">
                <div className="md:flex justify-between gap-4 items-center">
                  {voxels.length == 0 ? (
                    <div className="mb-4 md:mb-0 font-sansLight  text-secondary">If you don't have your own Mortuary plot, you can use public ones.</div>
                  ) : (
                    <div className="mb-4 md:mb-0 font-sansLight  text-secondary align-middle">List of public plots shared by the community.</div>
                  )}
                  <div>
                    <SimpleButton link={Routes.CommonsList}>See full list</SimpleButton>
                  </div>
                </div>
              </div>
            </div>
            <div className={(Object.keys(commons).length === 0)? "text-center mt-8": "" + " lg:w-2/4 mt-8 m-auto gap-8"}>
              {(Object.keys(commons).length === 0)? 
                  <button type="button" className="inline-flex px-4 py-2 font-sans leading-6 text-sm shadow rounded-md text-black bg-third hover:bg-third-h transition ease-in-out duration-150 cursor-not-allowed" disabled>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading 5 public plots
                </button>
              : 
              commons.map((info, index) => {
                return (
                  <div
                    key={index}
                    className="bg-grayDark rounded-xl p-2 pr-4 border-4 border-primary hover:border-primary-h transition-colors ease-in-out duration-500 mb-2"
                  >
                    <div className="md:flex gap-4 justify-between">
                      <div className="flex justify-between md:block grow-0">
                        <img src={ImgixClient.buildURL(info.img, { w: 64, fm: 'jpg', q: 50 })} style={{ maxWidth: '64px' }} alt={info.name}></img>
                        <span className='block md:hidden'>
                          <a href={'/commons/' + info.voxelBurnAccount.mint} className="p-2 text-secondary">
                            ⟶
                          </a>
                        </span>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-grow justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-sansLight text-secondary text-xs">Plot name</span>
                          <span className="text-third font-serif font-extralight text-sm md:text-lg">{info.name.replace('Mortuary Inc ', '')}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-sansLight text-secondary text-xs">Free / Total slots</span>
                          <span className="text-third font-serif font-extralight text-sm md:text-lg">
                            {info.freePlot} / {info.voxelBurnAccount.plotSize}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-sansLight text-secondary text-xs">Per burn</span>
                          <span className="text-third font-serif font-extralight text-sm md:text-lg">{info.hasBooster ? '+3' : '+2'} $ASH</span>
                        </div>
                        <span className='hidden md:inline'>
                          <a href={'/commons/' + info.voxelBurnAccount.mint} className="p-2 text-secondary">
                            ⟶
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
              }
              
            </div>
          </div>
        ) : (
          <></>
        )}
        <MortuaryDisconnected />

        {/* viewWallet ? <NecrologyRender necrologiesData={necrologiesData} withStats={true} owner={viewWallet} /> : <Necrology withStats={false} /> */}
      </div>
    </MortuaryContext.Provider>
  );
};

export default MyMortuaryGate;
