import { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { loadOwnedNfts } from 'web3/NFTLoader';
import { INFTData, newINFData } from 'features/NFT/api/NFTModel';

const useGetWalletNFT = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<INFTData[]>([]);
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (publicKey) {
        let response = await loadOwnedNfts(connection, publicKey);
        const nftItems = response.map((item) => newINFData(item));

        setIsLoading(false);
        setNfts(nftItems);
      }
    })();
  }, [publicKey, connection]);

  return { nfts, base58, isLoading };
};

export default useGetWalletNFT;
