import { useEffect, useState } from 'react';
import { INFTData } from './api/NFTModel';
import LazyLoad from 'react-lazyload';
import ImgixClient from 'api/ImgixClient';
import burnAsset from 'assets/burn.gif';

export interface NFTItemProps {
  item: INFTData;
  isBurning: boolean;
}

export const NFTItem = ({ item, isBurning }: NFTItemProps) => {
  const [imageUser, setImageUser] = useState<string>();

  useEffect(() => {
    if(item.image){
      const url = ImgixClient.buildURL(item.image, { w: 190, fm: 'jpg', q: 50 });
      setImageUser(url);
    }
  }, [item.image]);

  return (
    <LazyLoad classNamePrefix={' w-full h-full border-grayNFT border-5 rounded-sm LazyLoad aspect-w-1 aspect-h-1 '}>
      <img className=" w-full h-full object-cover" src={imageUser} alt={item.name} />
      <img className={(!isBurning ? 'hidden' : '') + ' w-full h-full absolute inset-1 ml-auto mr-auto opacity-50 pr-2 pb-1'} src={burnAsset} alt="Burn" />
    </LazyLoad>
  );
};

export default NFTItem;
