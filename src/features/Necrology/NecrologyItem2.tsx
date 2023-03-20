import { useEffect, useState } from 'react';
import { INecrologyData } from './api/NecrologyModel2';
import LazyLoad from 'react-lazyload';
import { SOLANA_NETWORK } from 'config';
import NecrologyItemMobile from './NecrologyItemMobile2';
import { useMortuaryContext } from 'context/MortuaryContext';
import ImgixClient from 'api/ImgixClient';
import { Timestamp } from 'firebase/firestore'
import { DateTime } from "luxon";

interface NecrologyItemProps {
  item: INecrologyData;
  isHome?: boolean;
}

const NecrologyItem = ({ item, isHome }: NecrologyItemProps) => {
  const hidden = 'opacity-0';
  const [itemOpacity, setItemOpacity] = useState<string>(hidden);
  const [rowClassName, setRowClassName] = useState('text-secondary');
  const [solscanLink, setSolscanLink] = useState('');
  const { mode, viewWallet } = useMortuaryContext();
  const isHomepage = isHome;
  const [time, setTime ] = useState<string>('');

  useEffect(() => {
    if (!item.isLive) return;

    setRowClassName('bg-fourth text-primary');

    const timer = setTimeout(() => {
      setRowClassName('text-secondary');
      item.isLive = false;
    }, 2000);

    return () => clearTimeout(timer);
  }, [item, item.isLive]);

  useEffect(() => {
    if (item.transactionID) {
      setSolscanLink(`https://solscan.io/tx/${item.transactionID}?cluster=${SOLANA_NETWORK}`);
    }
    setItemOpacity('');
    const t = new Timestamp(item.date["seconds"], item.date["nanoseconds"]);
    const a = t.toMillis();
    setTime(DateTime.fromMillis(a).toRelative({ locale: "en" }))
  }, [item]);

  return (
    <div
      className={
        rowClassName +
        ' ' +
        itemOpacity +
        ' transition duration-500 font-sansLight text-sm  border-b-2 border-primary-h border-l-0 border-r-0 hover:bg-primary-h leading-6'
      }
    >
      <div className="hidden md:flex">
        <div className="py-3 px-1 w-52">{time}</div>
        <div className="py-3 px-1 w-64">
          <LazyLoad height={24} classNamePrefix="mb-2 lg:mb-0  block md:inline lazyload">
            <img className="inline rounded-md h-6 w-6 object-cover" src={ImgixClient.buildURL(item.img, { w: 24, fm: 'jpg', q: 50 })} alt="IDImg" />
          </LazyLoad>
          <span className="align-middle md:ml-3">{item.id}</span>
        </div>
        {isHomepage ? (
          <></>
        )
        :
        (
          <div className="py-3 px-1 w-64 xl:block">{item.collection}</div>
        )
        }
        {viewWallet ? <div className="py-3 px-1 lg:px-3 w-36">{item.ash}</div> : <div className="py-3 px-1 lg:px-3 w-36">{item.owner}</div>}
        <div className="py-3 px-1 flex-grow">
          <div className="flex justify-between">
            {solscanLink && (
              <a href={solscanLink} target="_blank" rel="noopener noreferrer">
                ⟶
              </a>
            )}
          </div>
        </div>
      </div>
      <NecrologyItemMobile item={item} solscanLink={solscanLink} />
    </div>
  );
};

export default NecrologyItem;
