import { useEffect, useState } from 'react';
import { INecrologyData } from './api/NecrologyModel';
import LazyLoad from 'react-lazyload';
import { SOLANA_NETWORK } from 'config';
import NecrologyItemMobile from './NecrologyItemMobile';
import { useMortuaryContext } from 'context/MortuaryContext';

interface NecrologyItemProps {
  item: INecrologyData;
}

const NecrologyItem = ({ item }: NecrologyItemProps) => {
  const hidden = 'opacity-0';
  const [itemOpacity, setItemOpacity] = useState<string>(hidden);
  const [rowClassName, setRowClassName] = useState('text-secondary');
  const [solscanLink, setSolscanLink] = useState('');
  const { mode, viewWallet } = useMortuaryContext();

  
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
  }, [item]);

  return (
    <div
      className={
        rowClassName +
        ' ' +
        itemOpacity +
        ' transition duration-500 font-sansLight text-sm border border-secondary border-opacity-10 border-l-0 border-r-0 hover:bg-primary-h leading-6'
      }
    >
      <div className="hidden md:flex">
        <div className="py-3 px-1 lg:px-3 w-44 lg:w-48 hidden lg:block">{item.date}</div>
        <div className="py-3 px-1 lg:px-3 w-64 lg:w-80">
          <LazyLoad height={24} classNamePrefix="mb-2 lg:mb-0  block md:inline lazyload">
            <img className="inline rounded-md h-6 w-6 object-cover" src={item.thumbnail + '?h=24'} alt="IDImg" />
          </LazyLoad>
          <span className="align-middle md:ml-3">{item.id}</span>
        </div>
        <div className="py-3 px-1 lg:px-3 w-36 lg:w-48 hidden xl:block">{item.collection}</div>
        {viewWallet ? <div className="py-3 px-1 lg:px-3 w-36">{item.ash}</div> : <div className="py-3 px-1 lg:px-3 w-36">{item.owner}</div>}
        <div className="py-3 px-1 lg:px-3 flex-grow">
          <div className="flex justify-between">
            {/* <div>{item.lastWords}</div> */}
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
