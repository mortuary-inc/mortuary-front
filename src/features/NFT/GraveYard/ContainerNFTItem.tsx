import { ReactComponent as InfoBulleSVG } from 'assets/info_btn.svg';
import { Notification } from 'features/Notification/Notification';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { INFTData } from '../api/NFTModel';
import '../CollectionNFT.css';
import NFTItem from '../NFTItem';
import styles from './GraveYard.module.css';

export interface NFTItemProps {
  item: INFTData;
  openModal: (item: INFTData) => void;
  onNFTSelected?: (item: INFTData, isSelected: boolean) => void;
  isBurning: boolean;
  disableNewSelection?: boolean;
}

const ContainerNFTItem = ({ item, openModal, onNFTSelected, isBurning, disableNewSelection}: NFTItemProps) => {
  const [isSelected, setSelectMode] = useState<boolean>(false);
  
  const doSelect = (e, selected: boolean) => {
    if (e.target.getAttribute('data-name') === 'info') {
      e.preventDefault();
      return;
    }
    if (disableNewSelection) {
      if (selected) {
        let newState = !selected;
        setSelectMode(newState);
        let msg = (newState ? 'Select ' : 'Unselect ') + item.metadata.data.name;
        //console.log(msg);
        if (onNFTSelected) {
          onNFTSelected(item, newState);
        }
      } else {
        toast.custom(<Notification message={`Max reached - unselect another NFT first.`} variant="error" />);
      }
    } else {
      let newState = !selected;
      setSelectMode(newState);
      let msg = (newState ? 'Select ' : 'Unselect ') + item.metadata.data.name;
      //console.log(msg);
      if (onNFTSelected) {
        onNFTSelected(item, newState);
      }
    }
  };

  return (
    <div
      className={
        /*(isClicked ? 'animate-bounce' : '') +*/
        ` ${styles.ContainerNFTItem} relative w-full m-auto border-4 rounded-md cursor-pointer opacity-50  duration-300 hover:opacity-100 hover:border-secondary transform transition` +
        (isSelected ? ' nft-selected border-fourth opacity-100' : ' border-primary')
      }
      onClick={(e) => doSelect(e, isSelected)}
    >
      <NFTItem item={item} isBurning={isBurning} />

      <div className={'NFT overflow-hidden  opacity-0 hover:opacity-100  absolute -inset-4 ml-auto mr-auto z-10'}>
        <div className={' flex rounded-sm h-full '}>
          <div className="hidden md:block absolute right-3 top-3 cursor-pointer z-10" data-name={'info'}>
          <a
                                      href={'https://solscan.io/token/' + item.metadata.mint}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
            <InfoBulleSVG className={`pointer-events-none`} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerNFTItem;
