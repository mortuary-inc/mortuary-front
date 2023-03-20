import { BURN_V2_FREQUENCY } from 'config';
import { useMortuaryContext } from 'context/MortuaryContext';
import { INecrologyData } from 'features/Necrology/api/NecrologyModel2';
import { useEffect, useRef, useState } from 'react';
import LazyLoad from 'react-lazyload';
import { getSolanaClockLag } from 'web3/Accounts';
import { asVoxelBurnInfo, getVoxelBurnAccountC, VoxelBurnAccount } from 'web3/VoxelBurning';
import './Mortuary.css';
import MortuaryDuration from './MortuaryDuration';
import ImgixClient from 'api/ImgixClient';

export interface IMortuarySlotsData extends INecrologyData {
  timestampLimit: number;
  createTimestampNFT: number;
}

interface IMortuarySlotsProps {
  necrologiesData: INecrologyData[];
  amountSlot: number;
  recentlyBurnedNFTs?: Partial<IMortuarySlotsData>[];
}

const MortuarySlots = ({ necrologiesData, amountSlot, recentlyBurnedNFTs }: IMortuarySlotsProps) => {
  const unmounted = useRef(false);
  const [recentNecrologiesData, setRecentNecrologiesData] = useState<IMortuarySlotsData[]>([]);
  const [needReload, setNeedReload] = useState(false);
  const { voxelSelected } = useMortuaryContext();
  const [imageNFT, setImageNFT] = useState<string>();

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  // TODO use that + necrologie data
  useEffect(() => {
    (async () => {
      if (!voxelSelected) return;
      let account = await getVoxelBurnAccountC(voxelSelected.metadata.mint.toBase58());
      if (account != null) {
        let tmpNecrologiesData = await computeTempNecrologieData(account, necrologiesData);
        setRecentNecrologiesData(tmpNecrologiesData);
      } else {
        // account does not exist yet all plot are free
      }
    })();
  }, [voxelSelected?.metadata.mint, necrologiesData, needReload]);

  //
  // for refresh after 5s if voxelburnchange change
  useEffect(() => {
    (async () => {
      if (!voxelSelected) return;

      let account0 = await getVoxelBurnAccountC(voxelSelected.metadata.mint.toBase58());
      const timer = setTimeout(() => {
        (async () => {
          let account1 = await getVoxelBurnAccountC(voxelSelected.metadata.mint.toBase58());
          let infos0 = asVoxelBurnInfo(account0);
          let infos1 = asVoxelBurnInfo(account1);
          if (infos0.freePlot != infos1.freePlot) {
            setNeedReload(true);
          }
        })();
      }, 10000);
      return () => clearTimeout(timer);
    })();
  }, [voxelSelected?.metadata.mint, necrologiesData.length]);

  return (
    <div className="grid grid-cols-5 gap-2 md:flex md:justify-between md:w-118 lg:w-126 m-auto md:p-4">
      {Array.from({ length: 10 }).map((item, index) => {
        if (recentNecrologiesData.length && index < recentNecrologiesData.length) {
          return (
            <div key={`mortuaryItem${index}`}>
              <LazyLoad height={70} classNamePrefix=" w-full md:w-16 md:h-16 lazyload">
                {/* https://firebasestorage.googleapis.com/v0/b/mortuary-inc-logs.appspot.com/o/logs%2F  ?alt=media*/}
                <img
                  className="inline w-full h-full object-cover opacity-40"
                  src={ImgixClient.buildURL(recentNecrologiesData[index].img, { w: 64, fm: 'jpg', q: 50 })}
                  alt={`mortuaryItem${index}`}
                />
              </LazyLoad>
              <MortuaryDuration hoursLimit={BURN_V2_FREQUENCY} createTimestampNFT={recentNecrologiesData[index].createTimestampNFT} />
            </div>
          );
        } else if (recentlyBurnedNFTs && recentlyBurnedNFTs.length > index - recentNecrologiesData?.length) {
          return (
            <div key={`mortuaryItem${index}`}>
              <LazyLoad height={70} classNamePrefix=" w-full md:w-16 md:h-16 lazyload">
                <img
                  className="inline w-full h-full object-cover opacity-40"
                  src={recentlyBurnedNFTs?.[index - recentNecrologiesData?.length].img + '?h=70'}
                  
                  alt={`mortuaryItem${index}`}
                />
              </LazyLoad>
              <MortuaryDuration
                hoursLimit={BURN_V2_FREQUENCY}
                createTimestampNFT={recentlyBurnedNFTs?.[index - recentNecrologiesData?.length].createTimestampNFT!}
              />
            </div>
          );
        } else if (index < amountSlot) {
          return (
            <div key={`mortuaryItem${index}`} className={`mortuaryItemFree relative`}>
              <div className="bg-secondary-h w-full aspect-w-1 aspect-h-1 md:w-16 md:h-16 md:aspect-none" />
            </div>
          );
        } else {
          return <div key={`mortuaryItem${index}`} className="bg-graySlot w-full aspect-w-1 aspect-h-1 md:w-16 md:h-16 md:aspect-none" />;
        }
      })}
    </div>
  );
};

export default MortuarySlots;

async function computeTempNecrologieData(account: VoxelBurnAccount, necrologiesData: INecrologyData[]) {
  let lag = await getSolanaClockLag();
  let now = Date.now() - lag;
  let limit = BURN_V2_FREQUENCY * 60 * 60 * 1000;
  let infos = asVoxelBurnInfo(account);
  let slotsNotAvailable: Array<number> = [];
  infos.lastBurns.forEach((b) => {
    if (b + limit > now) {
      slotsNotAvailable.push(b);
    }
  });
  // for each slots active, try to find a burn
  const tmpNecrologiesData: IMortuarySlotsData[] = [];
  for (let i = 0; i < slotsNotAvailable.length; i++) {
    if (i < necrologiesData.length) {
      let necrologyData = necrologiesData[i];
      necrologyData['timestampLimit'] = now - limit;
      necrologyData['createTimestampNFT'] = slotsNotAvailable[i];
      tmpNecrologiesData.push(necrologyData as IMortuarySlotsData);
    } else {
      let dumbND: unknown = {
        timestampLimit: now - limit,
        createTimestampNFT: slotsNotAvailable[i],
        thumbnail: {
          asset: {
            url: null,
          },
        },
      };
      tmpNecrologiesData.push(dumbND as IMortuarySlotsData);
    }
  }
  return tmpNecrologiesData;
}
