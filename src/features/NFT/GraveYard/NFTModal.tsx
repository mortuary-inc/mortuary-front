import ImgixClient from 'api/ImgixClient';
import burnAsset from 'assets/burn.gif';
import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import SimplePagination from 'components/SimplePagination';
import { useMortuaryContext } from 'context/MortuaryContext';
import { useEffect, useRef, useState } from 'react';
import LazyLoad from 'react-lazyload';
import { INFTData } from '../api/NFTModel';
import styles from './GraveYard.module.css';

interface INFTModalProps {
  items: INFTData[];
  itemIndex: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NFTModal = ({ items, itemIndex: _itemIndex, setIsOpen }: INFTModalProps) => {
  const { setLoadingNft } = useMortuaryContext();
  const hidden = 'opacity-0';
  const [itemOpacity, setItemOpacity] = useState<string>(hidden);
  const [item, setItem] = useState<INFTData>(items[_itemIndex]);
  const [itemIndex, setItemIndex] = useState<number>(_itemIndex);
  const [itemReduce] = useState<boolean>(false);
  const [imageUser, setImageUser] = useState<string>();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!items.length || itemIndex < 0) return;
    const _item = items[itemIndex];
    setItem(_item);

    if (!_item.epitaphLog || !_item.epitaphLog.text) return;
  }, [items, itemIndex]);

  useEffect(() => {
    if (modalRef.current) disableBodyScroll(modalRef.current);
    setItemOpacity('');
  }, []);

  useEffect(() => {
    if(item.image){
      const url = ImgixClient.buildURL(item.image, { w: 598, fm: 'jpg', q: 50 });
      setImageUser(url);
    }
  }, [item.image]);

  const handleCloseModal = (withRefresh: boolean = false) => {
    setItemOpacity(hidden);
    clearAllBodyScrollLocks();
    setTimeout(() => {
      setIsOpen(false);
      if (setLoadingNft && withRefresh) {
        setLoadingNft(true);
      }
    }, 500);
  };

  return (
    <div
      ref={modalRef}
      className={`${styles.GraveYard} ${itemOpacity} transition duration-300 fixed overflow-y-scroll inset-0 bg-gray-500 bg-opacity-40 flex items-center z-20`}
    >
      <div
        className={`bg-secondary transition-colors duration-300 relative w-full md:h-auto md:w-124 m-auto md:rounded-xl p-7`}
      >
        <CloseSVG className={`absolute right-3 top-2 cursor-pointer`} onClick={() => handleCloseModal()} />
        <SimplePagination
          className={`text-primary`}
          index={itemIndex}
          length={items.length}
          setIndex={(_index) => setItemIndex(_index)}
        />
        <div
          className={`text-primary md:absolute w-full left-0 md:w-116 transform md:left-8 text-xl mb-4 md:mb-0 md:px-4 overflow-y-auto md:max-h-116`}
        >
          <p className="mb-2">{item.name}</p>
          <span className="font-sansLight text-xs">SYMBOL</span>
          <p className="text-sm mb-2">{item.symbol}</p>
          <span className="font-sansLight text-xs">MINT</span>
          <p className="text-sm mb-2">{item.metadata.updateAuthority}</p>
          <span className="font-sansLight text-xs">DESCRIPTION</span>
          <p className="text-sm mb-2">{item.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Array.isArray(item.attributes) &&
              item.attributes?.map((attribute, index) => (
                <div className="col-span-1" key={`NFTModalAttr${index}`}>
                  <span className="font-sansLight text-xs">{attribute.trait_type !== undefined ? attribute.trait_type.toUpperCase() : ''}</span>
                  <p className="text-sm">{attribute.trait_type !== undefined ? attribute.value : ''}</p>
                </div>
              ))}
          </div>
        </div>
        <div className={`scale-25 w-full md:w-116 m-auto md:max-h-116 md:h-116 transform transition-all relative duration-500 origin-top-right`}>
          <LazyLoad classNamePrefix={'w-full h-full border-grayNFT border-5 rounded-sm LazyLoad aspect-w-1 aspect-h-1 '}>
            <img className={`${itemReduce ? 'rounded-xl' : ''} w-full h-full object-cover`} src={imageUser} alt={item.name} />
          </LazyLoad>
          <img className={'hidden w-full h-full absolute inset-1 ml-auto mr-auto opacity-50 pr-2 pb-1'} src={burnAsset} alt="Burn" />
        </div>
      </div>
    </div>
  );
};

export default NFTModal;
