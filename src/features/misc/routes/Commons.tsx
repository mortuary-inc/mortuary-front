import { web3 } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BURN_V2_FREQUENCY } from 'config';
import { Mode, MortuaryContext } from 'context/MortuaryContext';
import Mortuary from 'features/Mortuary/Mortuary';
import MortuarySlots, { IMortuarySlotsData } from 'features/Mortuary/MortuarySlots2';
import MortuaryStateText from 'features/Mortuary/MortuaryStateText';
import {
  cleanNecrologyData,
  ICleanNecrologyData,
  INecroStats,
} from 'features/Necrology/api/NecrologyModel2';
import NecrologyRender from 'features/Necrology/NecrologyRenderUser';
import { INFTData, newINFData } from 'features/NFT/api/NFTModel';
import GraveYardNFT from 'features/NFT/GraveYard/CollectionNFT2';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BoosterRule } from 'web3/Booster';
import { getWalletByMint, loadOwnedMortuaryNfts, loadOwnedNfts } from 'web3/NFTLoader';
import { extractVoxels, getPlotSize } from 'web3/VoxelBurning';
import * as fireAPI from 'services/helloFire';

const Commons = () => {
  const unmounted = useRef(false);
  const { mint } = useParams<{ mint: string }>();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [viewWallet, setViewWallet] = useState<string>('');

  const [isLoadingPlot, setLoadingPlot] = useState<boolean>(true);
  const [isLoadingNft, setLoadingNft] = useState<boolean>(true);

  const [voxelOwner, setVoxelOwner] = useState<web3.PublicKey | null>(null);
  const [voxelMint, setVoxelMint] = useState<string | null>(null);
  const [voxelSelected, setVoxelSelected] = useState<INFTData | null>(null);
  const [voxels, setVoxels] = useState<INFTData[]>([]);
  const [boosters, setBoosters] = useState<BoosterRule[]>([]);
  const [nfts, setNfts] = useState<INFTData[]>([]);
  const [necrologiesData, setNecrologiesData] = useState<ICleanNecrologyData | null>(null);
  const [plotStats, setPlotStats] = useState<INecroStats | null>(null);

  const [recentlyBurnedNFTs, setRecentlyBurnedNFTs] = useState<Partial<IMortuarySlotsData>[]>([]);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (publicKey) setViewWallet(publicKey.toString());
    else setViewWallet('');
  }, [publicKey]);

  // Load voxel owner from the mint
  useEffect(() => {
    (async () => {
      if (!publicKey) return;
      if (!mint) return;

      const mintOwner = await getWalletByMint(connection, new web3.PublicKey(mint));
      if (mintOwner == null) return;
      setVoxelMint(mint);
      setVoxelOwner(new web3.PublicKey(mintOwner));
    })();
  }, [publicKey]);

  // Load voxel and booster from the mint we are exploring
  useEffect(() => {
    (async () => {
      if (!publicKey) return;
      if (!voxelMint) return;
      if (!voxelOwner) return;

      // Load only Mortuary NFT (voxel, minions)
      let voxelOwnerNft = await loadOwnedMortuaryNfts(connection, voxelOwner);

      if (unmounted.current) return;

      const nftItems = voxelOwnerNft.map((item) => newINFData(item));
      const voxelSelected0 = nftItems.find((n) => n.metadata.mint.toBase58() == voxelMint);
      if (voxelSelected0 == null) {
        console.log('voxel ' + mint + ' not found in wallet');
        setLoadingPlot(false);
        return;
      }

      let { voxels, boosters } = extractVoxels(nftItems);

      if (voxels.length > 0) setVoxels(voxels);
      if (boosters.length > 0) setBoosters(boosters);

      setLoadingPlot(false);
      setVoxelSelected(voxelSelected0);

      let stats = await fireAPI.getPlotStats(voxelMint);
      setPlotStats(stats);

      fireAPI.getNecroData(true, publicKey.toBase58()).then((burnDataAPI) => {
        if (unmounted.current) return;
        const cleaned = cleanNecrologyData(burnDataAPI, false);
        setNecrologiesData(cleaned);
      });
    })();
  }, [publicKey, voxelMint, voxelOwner]);

    // https://stackoverflow.com/questions/71993461/how-can-i-make-the-usestate-append-the-data-and-not-overrides-it
  const addNFTToBurning = (nfts: INFTData) => {
    const copy = [...recentlyBurnedNFTs] as Partial<IMortuarySlotsData>[];
    console.log("copy (commons) " + copy.length)
    let x = {
      img:  nfts.image,
      thumbnail:  nfts.image,
      timestampLimit: Date.now() - BURN_V2_FREQUENCY * 60 * 60 * 1000,
      createTimestampNFT: Date.now(),
    } as Partial<IMortuarySlotsData>;
    console.log("Recently Burned= " + nfts.name + " => " + nfts.image)
    setRecentlyBurnedNFTs((recentlyBurnedNFTs) => [...recentlyBurnedNFTs, x]);
    console.log(recentlyBurnedNFTs);
  };

  // Load connected user NFT
  useEffect(() => {
    (async () => {
      if (!publicKey || !isLoadingNft) return;

      let pk = new web3.PublicKey(publicKey);
      // let pk = new web3.PublicKey("H8SPFggFje2kicjRkZVU4QwPqPXPvChmyvCTGAwmqDty");
      let response = await loadOwnedNfts(connection, pk, true);
      if (unmounted.current) return;

      const nftItems = response.map((item) => newINFData(item));

      setNfts(nftItems);
      setLoadingNft(false);
    })();
  }, [publicKey, isLoadingNft]);

  let slotCount = 0;
  if (voxelSelected != null) {
    slotCount = getPlotSize(voxelSelected.attributes);
  }

  return (
    <MortuaryContext.Provider
      value={{
        mode: Mode.Commons,
        viewWallet: viewWallet,
        voxelSelected: voxelSelected,
        voxels: voxels,
        boosters: boosters,
        setLoadingNft,
      }}
    >
      <div className="mt-10">
        {voxelSelected == null ? <p></p> : <Mortuary stats={plotStats} isLoading={isLoadingPlot} voxelID={voxelSelected?.metadata.mint.toBase58()} />}
        {slotCount == 0 ? (
          <></>
        ) : (
          <MortuarySlots
            necrologiesData={necrologiesData == null ? [] : necrologiesData.necrologyDataCleaned}
            amountSlot={slotCount}
            recentlyBurnedNFTs={recentlyBurnedNFTs}
          />
        )}
        <MortuaryStateText isLoading={!viewWallet ? false : isLoadingNft} />
        {publicKey ? <GraveYardNFT isLoading={isLoadingNft} nfts={nfts} amountSlot={slotCount} addNFTToBurning={addNFTToBurning} /> : <></>}
        {viewWallet ? <NecrologyRender withStats={true} owner={viewWallet} /> : <></>}
      </div>
    </MortuaryContext.Provider>
  );
};

export default Commons;
