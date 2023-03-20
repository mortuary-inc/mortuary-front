import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import {
  GlowWalletAdapter, LedgerWalletAdapter,
  PhantomWalletAdapter, SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { SOLANA_NETWORK } from 'config';
import { WriteConnectionProvider } from 'hooks/useWriteConnection';
import { FC, useCallback, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getRpcUrl } from 'web3/ConnectionHelper';
import { Notification } from '../Notification/Notification';
import './wallet.css';

export const Wallet: FC = (props) => {
  const network = SOLANA_NETWORK as WalletAdapterNetwork;

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      //new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
      new GlowWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  const endpoint = useMemo(() => getRpcUrl(), []);

  const onError = useCallback((error: WalletError) => {
    toast.custom(
      <Notification
        message={error.message ? `${error.name}: ${error.message}` : error.name}
        variant="error"
      />
    );
  }, []);

  return (
    <ConnectionProvider endpoint={getRpcUrl()}>
      <WriteConnectionProvider
        endpoint={endpoint}
        config={{
          confirmTransactionInitialTimeout: 60 * 1000,
        }}
      >
        <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
          <WalletModalProvider>{props.children}</WalletModalProvider>
          <Toaster position="bottom-left" reverseOrder={false} />
        </WalletProvider>
      </WriteConnectionProvider>
    </ConnectionProvider>
  );
};
