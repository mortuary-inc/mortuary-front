import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Routes } from 'routes/conf';
import { useMortuaryContext } from 'context/MortuaryContext';

const MortuaryDisconnected = () => {
  const { viewWallet } = useMortuaryContext();

  /* USER is not connected */
  if (!viewWallet) {
    return (
      <div className="border-4 border-secondary-h bg-secondary rounded-xl md:w-1/2 mx-auto text-center p-4 md:p-8 max-w-xl">
        <p className="font-sansLight">
          Mortuary Inc highly recommends using a dedicated - burner - wallet containing only your dead NFTs before using the burning tool. Mortuary holders now
          have the opportunity to open their plots to the public and set up an $ASH tax, allowing non-holders to burn their NFTs in exchange for a part of the
          $ASH rewards. If you want to collect more $ASH and tax others using your own burning facilities, you can secure your own funeral plot on {''}
          <a href="https://magiceden.io/marketplace/mortuary_inc" className="underline-purple" target="_blank" rel="noreferrer">
            Magic Eden
          </a>
          .<br />
          <br />
          By using Mortuary Inc. services, you acknowledge that you have read, understood and accepted {''}
          <a href={Routes.TermCondition} className="underline-purple">
            terms and conditions
          </a>
          .
        </p>
        <div className="mortuary-wallet-btn-wrapper mt-4">
          <WalletMultiButton className={`mortuary-wallet-btn`}>
            <span>Select Wallet</span>
          </WalletMultiButton>
        </div>
      </div>
    );
  }

  return <></>;
};

export default MortuaryDisconnected;
