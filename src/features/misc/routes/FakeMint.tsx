import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { WalletMultiButtonWrapper } from 'features/Connect/Connect';
import { useEffect, useMemo, useState } from 'react';
import * as anchor from '@project-serum/anchor';

import toast, { Toaster } from 'react-hot-toast';
import { Notification } from 'features/Notification/Notification';
import { awaitTransactionSignatureConfirmation, batchMintToken, getCandyMachineState, mintOneToken, shortenAddress } from 'web3/metaplex/candy-machine';

const FakeMintPage = () => {
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  return (
    <>
      <div>!! DEBUG !!</div>
      {!base58 && <WalletMultiButtonWrapper />}
      {base58 && <WalletDisconnectButton />}
      {base58 && <FakeMint />}
    </>
  );
};

export default FakeMintPage;

type CandyMachineInfo = {
  candyMachineId: anchor.web3.PublicKey;
  name: string;
};
const minionMachine: CandyMachineInfo = {
  name: 'Minion',
  candyMachineId: new anchor.web3.PublicKey('674TWZyhQ227grMZ1Q6GQvwcmvhS9Cad3LMqpBzM2Zz8'),
};
const trashMachine: CandyMachineInfo = {
  name: 'Trash',
  candyMachineId: new anchor.web3.PublicKey('4SP2NGyuC6psVWoEP5sr8XothK3VCDenmmzrAcEW6b5h'),
};

const machines = [minionMachine, trashMachine];

const FakeMint = () => {
  // const all = useWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState<number>();
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const isActive = true;
  const wallet = useAnchorWallet();
  // const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const onMint = async (machineInfo: CandyMachineInfo, count: number) => {
    try {
      if (wallet) {
        let candyMachineAccount = await getCandyMachineState(wallet as anchor.Wallet, machineInfo.candyMachineId, connection);

        setIsMinting(true);
        let mintTxId: string | undefined;
        if (count == 1) {
          mintTxId = (await mintOneToken(candyMachineAccount, wallet.publicKey))[0];
        } else {
          mintTxId = (await batchMintToken(candyMachineAccount, wallet.publicKey, count))[0];
        }

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(mintTxId, 30000, connection, 'singleGossip', true);
        }

        if (!status?.err) {
          toast.custom(<Notification message="Congratulations! Mint succeeded!" variant="success" />);
          console.log('Congratulations! Mint succeeded!');
        } else {
          toast.custom(<Notification message="Mint failed! Please try again!" variant="error" />);
          console.error('Mint failed! Please try again!', status.err);
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (error.message.indexOf('0x138')) {
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }
      toast.custom(<Notification message={message} variant="error" />);
      console.error(message, error);
    } finally {
      if (wallet) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / anchor.web3.LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / anchor.web3.LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, connection]);

  // useEffect(() => {
  //   (async () => {
  //     if (!wallet) return;

  //     const { candyMachine, itemsRemaining } = await getCandyMachineState(wallet as anchor.Wallet, candyMachineId, connection);
  //     setIsSoldOut(itemsRemaining === 0);
  //     setCandyMachine(candyMachine);
  //     // setStartDate(goLiveDate);
  //   })();
  // }, [wallet, candyMachineId, connection]);

  return (
    <>
      <div>
        <div style={{ color: 'white' }}>
          <p>Address: {wallet != null && shortenAddress(wallet.publicKey.toBase58())}</p>
          <p>Balance: {(balance || 0).toLocaleString()} SOL</p>
          <br />
          {wallet && (
            <button
              disabled={isMinting || !isActive}
              onClick={() => onMint(minionMachine, 1)}
              style={{ backgroundColor: '#4e44ce', padding: '0 20px', borderRadius: '6px', height: '50px' }}
            >
              Mint {minionMachine.name}
            </button>
          )}
          {wallet && (
            <>
              <button
                disabled={isMinting || !isActive}
                onClick={() => onMint(trashMachine, 1)}
                style={{ backgroundColor: '#4e44ce', padding: '0 20px', borderRadius: '6px', height: '50px' }}
              >
                Mint {trashMachine.name}
              </button>
              <button
                disabled={isMinting || !isActive}
                onClick={() => onMint(trashMachine, 10)}
                style={{ backgroundColor: '#4e44ce', padding: '0 20px', borderRadius: '6px', height: '50px' }}
              >
                Mint 10x {trashMachine.name}
              </button>
            </>
          )}
        </div>
      </div>
      <Toaster position="bottom-left" reverseOrder={false} />
    </>
  );
};
