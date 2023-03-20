import { Switch } from '@headlessui/react';
import { web3 } from '@project-serum/anchor';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import ImgixClient from 'api/ImgixClient';
import ClipboardCopy from 'components/ClipboardCopy';
import { INFTData } from 'features/NFT/api/NFTModel';
import HeaderPlaceHolder from 'features/Placeholders/HeaderPlaceHolder';
import SlotsPlaceHolder from 'features/Placeholders/SlotsPlaceHolder';
import { useCallback, useEffect, useState } from 'react';
import Slider from 'react-input-slider';
import { Routes } from 'routes/conf';
import { setVoxelBurnTax } from 'web3/Commons';
import { getPlotSize, getVoxelBurn, VoxelBurnAccount } from 'web3/VoxelBurning';
import { Notification } from 'features/Notification/Notification';
import toast from 'react-hot-toast';
import { getRpcUrl } from 'web3/ConnectionHelper';

interface IMortuaryProps {
  voxel: INFTData;
  isLoading: boolean;
  boosters: number;
}

const MortuarySelect = ({ voxel, boosters, isLoading }: IMortuaryProps) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [isSaving, setIsSaving] = useState(false);
  const [state, setState] = useState({ x: 4 });
  const [enabled, setEnabled] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const setInitalState = (voxelBurn: VoxelBurnAccount | null) => {
    if (voxelBurn) {
      setEnabled(voxelBurn.share > 0);
      if (voxelBurn.share > 0) {
        setEnabled(true);
        setState({ x: voxelBurn.share });
      }
    }
    setHasChanged(false);
  };

  const setTax = useCallback(
    async (tax: number, enabledFlag: boolean) => {
      if (!wallet) return;

      setIsSaving(true);
      setHasChanged(false);
      let mint = new web3.PublicKey(voxel.metadata.mint);
      let plotSize = getPlotSize(voxel.attributes);
      console.log('Enable Set Tax:' + enabledFlag + 'TAX: ' + tax);
      try {
        await setVoxelBurnTax(connection, wallet as AnchorWallet, mint, tax, plotSize, enabledFlag);
      } catch (error: any) {
        console.error(error);
        let msg = 'Something went wrong.';
        if (error && error.message) {
          msg = error.message;
        }
        toast.custom(<Notification message={msg} variant="error" />);
      }
      let voxelBurn = await getVoxelBurn(connection, mint);
      setInitalState(voxelBurn);
      setIsSaving(false);
    },
    [connection, wallet]
  );

  const onSaveClick = () => {
    (async () => {
      console.log('Enabled : ' + enabled);
      let tax = enabled ? state.x : 0;
      await setTax(tax, enabled);
    })();
  };

  useEffect(() => {
    (async () => {
      let connection0 = new web3.Connection(getRpcUrl());
      let voxelBurn = await getVoxelBurn(connection0, new web3.PublicKey(voxel.metadata.mint));
      setInitalState(voxelBurn);
    })();
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="lg:flex lg:justify-between w-full lg:w-126 m-auto bg-grayDark rounded-xl p-4">
          <HeaderPlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
        </div>
        <div className="flex justify-between md:w-118 lg:w-126 m-auto md:p-4 mt-5">
          <SlotsPlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
        </div>
      </div>
    );
  }

  const amountSlot = getPlotSize(voxel.attributes);
  const imageUser = ImgixClient.buildURL(voxel.image||"", { w: 144, fm: 'jpg', q: 60 });

  return (
    <>
      <div className="bg-grayDark rounded-xl p-2 pr-4 border-4 border-primary hover:border-primary-h transition-colors ease-in-out duration-500 mb-2">
        <div className="md:flex gap-4">
          <div className="flex justify-between md:block">
            <a href={Routes.MyMortuary + voxel.metadata.mint}>
              <div className="w-16 h-16 relative">
                {boosters > 0 && (
                  <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fourth opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-fourth"></span>
                  </span>
                )}
                <img className="rounded-bl-xl rounded-br-xl w-full h-full object-cover" src={imageUser} alt="Mortuary Biggest Slot" />
              </div>
            </a>
            <div className='block md:hidden'>
              <a href={Routes.MyMortuary + voxel.metadata.mint} className="p-2 text-secondary">
                ⟶
              </a>
            </div>
          </div>
          <div className="flex-col md:flex-row flex md:flex-grow md:justify-between md:items-center">
            <div className="text-third font-serif font-extralight text-sm md:text-lg">
              <div className="justify-between mt-2 mb-2 md:my-0 md:justify-start flex gap-2">
                {voxel.metadata.data.name.replace('Mortuary Inc ', '').replace(/[\u0000-\u001F\u007F-\u009F]/g, "")}
                <ClipboardCopy link={'https://' + window.location.hostname + '/commons/' + voxel.metadata.mint} disabled={enabled ? false : true} />
              </div>
            </div>

            <div className="flex items-center md:items-start md:justify-between md:items-center">
              <Switch.Group>
                <Switch.Label className="font-sansLight text-fourth text-xs mr-4 inline-block">{enabled ? 'PUBLIC' : 'PRIVATE'}</Switch.Label>
                <Switch
                  checked={enabled}
                  onChange={(v) => {
                    setHasChanged(true);
                    setEnabled(v);
                  }}
                  className={`${
                    enabled ? 'bg-third' : 'bg-primary'
                  } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  <span
                    className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-secondary-h rounded-full transition-transform`}
                  />
                </Switch>
                <button
                  className={`${
                    hasChanged ? 'opacity-100 hover:bg-third hover:text-primary' : 'opacity-25 cursor-not-allowed '
                  } ml-2 text-secondary font-sansLight text-sm border border-third px-3 py-1 rounded-full w-20 transition-colors ease-in-out align-middle relative`}
                  onClick={() => onSaveClick()}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <svg className="animate-spin mx-auto h-5 w-5 text-third" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <span className="text-sm align-bottom leading-4">Save</span>
                  )}
                </button>
              </Switch.Group>
            </div>
            <div className='hidden md:block'>
              <a href={Routes.MyMortuary + voxel.metadata.mint} className="p-2 text-secondary">
                ⟶
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MortuarySelect;
