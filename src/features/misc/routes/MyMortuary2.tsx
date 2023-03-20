import { web3 } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BURN_V2_FREQUENCY } from 'config';
import { Mode, MortuaryContext } from 'context/MortuaryContext';
import Mortuary from 'features/Mortuary/Mortuary2';
import MortuarySlots, { IMortuarySlotsData } from 'features/Mortuary/MortuarySlots2';
import {
  cleanNecrologyData,
  ICleanNecrologyData, INecroStats
} from 'features/Necrology/api/NecrologyModel2';
import NecrologyRenderUser from 'features/Necrology/NecrologyRenderUser';
import { INFTData, newINFData } from 'features/NFT/api/NFTModel';
import GraveYardNFT from 'features/NFT/GraveYard/CollectionNFT2';
import { useEffect, useRef, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import * as fireAPI from 'services/helloFire';
import { BoosterRule } from 'web3/Booster';
import { getWalletByMint, loadOwnedNfts } from 'web3/NFTLoader';
import { extractVoxels, getPlotSize } from 'web3/VoxelBurning';
//
// my-mortuary/:mint
// - has a voxel owner, I can watch and burn NFT in my wallet
//
const MyMortuary = () => {
  const unmounted = useRef(false);
  const { mint } = useParams<{ mint: string }>();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [viewWallet, setViewWallet] = useState<string>('');
  const [isLoadingNft, setLoadingNft] = useState<boolean>(true);
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

  useEffect(() => {
    (async () => {
      if (!publicKey) return;
      if (!mint) return;

      const mintOwner = await getWalletByMint(connection, new web3.PublicKey(mint));
      if (mintOwner == null || mintOwner != publicKey.toString()) {
        setLoadingNft(false);
        return;
      }
      setVoxelMint(mint);
    })();
  }, [publicKey]);

  useEffect(() => {
    (async () => {
      if (!publicKey) return;
      if (!voxelMint) return;

      let response = await loadOwnedNfts(connection, publicKey, true);

      if (unmounted.current) return;

      const nftItems = response.map((item) => newINFData(item));

      const voxelSelected0 = nftItems.find((n) => n.metadata.mint.toBase58() === voxelMint);
      if (voxelSelected0 == null) {
        console.log('voxel ' + mint + ' not found in wallet');
        setLoadingNft(false);
        return;
      }

      let { voxels, boosters } = extractVoxels(nftItems);
      let burnables = nftItems.filter((n) => n.metadata.mint.toBase58() !== voxelMint)

      if (voxels.length > 0) setVoxels(voxels);
      if (boosters.length > 0) setBoosters(boosters);
      setNfts(burnables);
      setLoadingNft(false);
      setVoxelSelected(voxelSelected0);

      let stats = await fireAPI.getPlotStats(voxelMint);
      setPlotStats(stats);


    fireAPI.getNecroData(true, publicKey.toBase58()).then((burnDataAPI) => {
        if (unmounted.current) return;
        const cleaned = cleanNecrologyData(burnDataAPI, false);
        setNecrologiesData(cleaned);
      });
    })();
  }, [voxelMint, publicKey]);

  const addNFTToBurning = (nfts: INFTData) => {
    const copy = [...recentlyBurnedNFTs] as Partial<IMortuarySlotsData>[];
    console.log("copy (my) " + copy.length)
    copy.push({
      thumbnail:  nfts.image,
      img: nfts.image,
      timestampLimit: Date.now() - BURN_V2_FREQUENCY * 60 * 60 * 1000,
      createTimestampNFT: Date.now(),
    } as Partial<IMortuarySlotsData>);
    console.log("Recently Burned= " + nfts.name + " => " + nfts.image)
    setRecentlyBurnedNFTs(copy);
  };

  let slotCount = 0;
  if (voxelSelected != null) {
    slotCount = getPlotSize(voxelSelected.attributes);
  }

  if (!isLoadingNft && !viewWallet) {
    return <Redirect to={'/my-mortuary/'} />;
  }

  return (
    <MortuaryContext.Provider
      value={{
        mode: Mode.My,
        viewWallet: viewWallet,
        voxelSelected: voxelSelected,
        voxels: voxels,
        boosters: boosters,
        setLoadingNft,
      }}
    >
      <div className="mt-10">
        {voxelSelected == null ? <p></p> : <Mortuary stats={plotStats} isLoading={isLoadingNft} voxelID={mint} />}
        {slotCount === 0 ? (
          <></>
        ) : (
          <MortuarySlots
            necrologiesData={necrologiesData == null ? [] : necrologiesData.necrologyDataCleaned}
            amountSlot={slotCount}
            recentlyBurnedNFTs={recentlyBurnedNFTs}
          />
        )}
        {/*<MortuaryStateText isLoading={isLoadingNft} />*/}
        <GraveYardNFT isLoading={isLoadingNft} nfts={nfts} amountSlot={slotCount} addNFTToBurning={addNFTToBurning} />
        {viewWallet ? <NecrologyRenderUser withStats={true} owner={viewWallet} /> : <></>}
      </div>
    </MortuaryContext.Provider>
  );
};

export default MyMortuary;
