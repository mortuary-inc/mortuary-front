import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useWriteConnection } from 'hooks/useWriteConnection';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { withdraw } from 'web3/Admin';

const css_button =
  ' burn-btn inline-block font-sans bg-third px-3 py-2 text-primary rounded-xl hover:bg-third-h active:bg-third-h transition-colors duration-500 ease-in-out';

const AdminEdit = () => {
  const { search } = useLocation();
  const wallet = useAnchorWallet();
  const { connection } = useWriteConnection();

  async function doWithdraw(amount: number) {
    if (!wallet) return;
    if (!connection) return;
    await withdraw(connection, amount, wallet);
  }

  let searchParams = useMemo(() => new URLSearchParams(search), [search]);
  let withdrawAmount = 0;
  try {
    withdrawAmount = parseInt(searchParams.get('withdraw') || '0');
  } catch (e) {}

  return (
    <div className="mt-10">
      <div className="text-center font-extralight mt-14 mb-10">
        <div className="text-secondary font-sansLight text-l">The Admin</div>
      </div>
      <div className="lg:w-2/4 mx-auto">
        {withdrawAmount <= 0 ? (
          <></>
        ) : (
          <div>
            <button
              onClick={() => doWithdraw(withdrawAmount)}
              className={`mortuary-wallet-btn ${css_button}`}
            >
              Withdraw {withdrawAmount}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEdit;
