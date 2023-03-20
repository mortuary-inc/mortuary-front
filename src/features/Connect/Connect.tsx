import { useWallet } from '@solana/wallet-adapter-react';
import {  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useMemo } from 'react';
import { Routes } from 'routes/conf';
import { Link } from 'react-router-dom';

const css_button =
  ' burn-btn inline-block font-sans bg-third px-3 py-2 text-primary rounded-xl hover:bg-third-h active:bg-third-h transition-colors duration-500 ease-in-out';

export const WalletMultiButtonWrapper = () => {
  return (
    <div className="mortuary-wallet-btn-wrapper w-full max-w-xs mx-auto md:w-auto md:max-w-none">
      <WalletModalProvider>
          <WalletMultiButton className={`mortuary-wallet-btn ${css_button}`} />
      </WalletModalProvider>
    </div>
  );
};

const Connect = () => {
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  return  (
    <WalletMultiButtonWrapper />
  ) 
};

export default Connect;
