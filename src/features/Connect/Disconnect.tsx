import { useWallet } from '@solana/wallet-adapter-react';
import { MouseEventHandler, useCallback, useMemo } from 'react';
const Disconnect = () => {
  const { publicKey, disconnect } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const handleDisconnect: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      disconnect().catch(() => {});
    },
    [disconnect]
  );

  return !base58 ? (
    <></>
  ) : (
    <button
      onClick={handleDisconnect}
      className=" disconnect-btn w-full md:w-auto inline-block font-sans px-3 py-2 rounded-xl  bg-fourth text-primary hover:bg-fourth-h transition-colors duration-200 ease-in-out"
    >
      Disconnect
    </button>
  );
};

export default Disconnect;
