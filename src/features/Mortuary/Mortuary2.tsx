import { Switch } from '@headlessui/react';
import { web3 } from '@project-serum/anchor';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import ImgixClient from 'api/ImgixClient';
import { ReactComponent as InfoBulleSVG } from 'assets/info_btn.svg';
import MagicEden from 'assets/MagicEden.png';
import ClipboardCopy from 'components/ClipboardCopy';
import { Mode, useMortuaryContext } from 'context/MortuaryContext';
import { INecroStats } from 'features/Necrology/api/NecrologyModel2';
import { NecrologyID } from 'features/Necrology/NecrologyRender2';
import HeaderPlaceHolder from 'features/Placeholders/HeaderPlaceHolder';
import SlotsPlaceHolder from 'features/Placeholders/SlotsPlaceHolder';
import useBurnStat2 from 'hooks/useBurnStat2';
import { scrollToID, truncateAddress } from 'lib/utils';
import { useCallback, useEffect, useState } from 'react';
import Slider from 'react-input-slider';
import { setVoxelBurnTax } from 'web3/Commons';
import { getWalletByMint } from 'web3/NFTLoader';
import { getPlotSize, getVoxelBurn, VoxelBurnAccount } from 'web3/VoxelBurning';
import HelpBox from 'components/HelpBox';
import { Notification } from 'features/Notification/Notification';
import toast from 'react-hot-toast';
import { getRpcUrl } from 'web3/ConnectionHelper';

interface IMortuaryProps {
  stats: INecroStats | null;
  isLoading: boolean;
  owner?: string;
  voxelID?: string;
}

const MortuarySelect = ({ stats, isLoading, owner, voxelID }: IMortuaryProps) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { totalBurned, totalAsh, totalTax } = useBurnStat2(stats, owner, voxelID);
  const { voxelSelected, mode, boosters } = useMortuaryContext();
  const isEditable = mode == Mode.My;

  const [isSaving, setIsSaving] = useState(false);
  const [state, setState] = useState({ x: 4 });
  const [enabled, setEnabled] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [walletDisplay, setWalletDisplay] = useState('');

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
    async (tax: number) => {
      if (!wallet) return;
      if (!voxelSelected) return;

      setIsSaving(true);
      setHasChanged(false);
      let mint = new web3.PublicKey(voxelSelected.metadata.mint);
      let plotSize = getPlotSize(voxelSelected.attributes);
      console.log('Is public? : ' + enabled);
      try {
        await setVoxelBurnTax(connection, wallet as AnchorWallet, mint, tax, plotSize, enabled);
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
    [connection, wallet, voxelSelected]
  );

  const onSaveClick = () => {
    (async () => {
      let tax = enabled ? state.x : 0;
      await setTax(tax);
    })();
  };

  useEffect(() => {
    (async () => {
      if (!voxelSelected) return;
      let connection0 = new web3.Connection(getRpcUrl());
      let voxelBurn = await getVoxelBurn(connection0, new web3.PublicKey(voxelSelected.metadata.mint));
      setInitalState(voxelBurn);

      let plotOwner = await getWalletByMint(connection, new web3.PublicKey(voxelSelected.metadata.mint));
      if (plotOwner != null) setWalletDisplay(truncateAddress(plotOwner));
    })();
  }, [ voxelSelected]);

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

  if (!voxelSelected) {
    return <></>;
  }

  const imageUser = ImgixClient.buildURL(voxelSelected.image||"", { w: 140, fm: 'jpg', q: 50 });

  return (
    <>
      <div className="md:flex w-full lg:w-126 m-auto bg-grayDark rounded-xl p-4 gap-8">
        <div className="flex items-center gap-6 flex-grow-0">
          <div className="w-36 h-36 relative">
            {boosters.length > 0 && (
              <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fourth opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-fourth"></span>
              </span>
            )}
            <img className="rounded-xl w-full h-full object-cover" src={imageUser} alt="Mortuary Biggest Slot" />
          </div>
        </div>
        <div className="flex flex-grow flex-col justify-between">
          <div className="flex justify-between">
            <div>
              {!isEditable && !voxelSelected ? (
                <div className="">
                  <div className="text-white text-xs mb-2 ml-2">PROOF OF CONCEPT</div>
                  <a
                    className="bg-fourth rounded-2xl flex px-4 py-1 items-center"
                    href="https://magiceden.io/marketplace/mortuary_inc"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="text-base">Buy a plot on </span>
                    <img className="h-3 ml-2" src={MagicEden} alt="Magic Eden" />
                  </a>
                </div>
              ) : (
                <div className="text-third font-serif font-extralight text-2xl">{voxelSelected.metadata.data.name.replace('Mortuary Inc', '').replace(/[\u0000-\u001F\u007F-\u009F]/g, "")}</div>
              )}
              <div className="mt-2 rounded-xl text-secondary font-sansLight text-sm bg-primary-h px-3 py-1 inline-block">owner: {walletDisplay}</div>
            </div>
            <div className="flex mt-1 gap-6 border-primary border p-3 rounded-xl">
              <div className="border-r border-primary pr-3">
                <div className="font-sansLight text-secondary text-xs">PLOT STATS</div>
              </div>
              <div>
                <div className="font-sansLight text-fourth text-xs">TOTAL BURNT</div>
                <div className="font-serif text-third text-2xl">{totalBurned.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-sansLight text-fourth text-xs">$ASH GAINED</div>
                <div className="font-serif text-third text-2xl">{(Number(totalAsh) + Number(totalTax)).toLocaleString()}</div>
              </div>
              <div>
                <div className="font-sansLight text-fourth text-xs">TAX GAINED</div>
                <div className="font-serif text-third text-2xl">{totalTax.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="flex mt-4 md:mt-0 justify-between">
            <div className="flex">
              <ClipboardCopy
                className={'md:ml-auto'}
                link={'https://' + window.location.hostname + '/commons/' + voxelSelected?.metadata.mint}
                disabled={enabled ? false : true}
              />
              <button
                className="ml-2 text-secondary font-sansLight text-sm border border-third px-3 py-1 pb-0 rounded-full hover:bg-third hover:text-primary transition-colors ease-in-out"
                onClick={() => scrollToID(NecrologyID)}
              >
                View logs
              </button>
            </div>
            <div className="flex">
              {/* 
              <HelpBox
                classNameBTN=" cursor-pointer z-10 absolute right-0 translate-x-5 top-1/2 transform -translate-y-1/2"
                classNameCont="-translate-x-1/2 left-1/2"
              />*/}
              <div className="flex justify-between">
                <div className="flex md:mr-2">
                  {!isEditable ? (
                    <></>
                  ) : (
                    <Switch.Group>
                      <div className="flex md:items-center flex-col md:flex-row justify-between gap-4">
                        <Switch.Label className="font-sansLight text-fourth text-xs inline-block mt-1 mb-1">{enabled ? 'PUBLIC' : 'PRIVATE'}</Switch.Label>
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
                            className={`${
                              enabled ? 'translate-x-6' : 'translate-x-1'
                            } inline-block w-4 h-4 transform bg-secondary-h rounded-full transition-transform`}
                          />
                        </Switch>
                      </div>
                    </Switch.Group>
                  )}
                </div>
                <div className="pt-4 md:pt-0">
                  <button
                    className={`${
                      hasChanged ? 'opacity-100 hover:bg-third hover:text-primary' : 'opacity-25 cursor-not-allowed '
                    } ml-2 text-secondary font-sansLight text-sm border border-third px-3 py-1 rounded-full hover:bg-third hover:text-primary transition-colors ease-in-out`}
                    onClick={() => onSaveClick()}
                    disabled={isSaving || !hasChanged}
                  >
                    <span className="text-sm align-bottom leading-4">{isSaving ? 'Saving' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MortuarySelect;
