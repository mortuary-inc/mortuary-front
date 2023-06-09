import H2 from 'components/H2';
import { ThemeContext } from 'components/ThemeWrapper';
import useScrollTop from 'hooks/useScrollTop';
import { useContext } from 'react';

const TermCondition = () => {
  const darkMode = useContext(ThemeContext);
  useScrollTop();

  return (
    <div className={(darkMode ? 'text-secondary' : 'text-primary') + '  mt-14 md:w-3/4 lg:w-2/4 m-auto'}>
      <H2 className="text-left">Terms & Conditions</H2>
      <p className="font-sansLight text-base mt-4 text-left break-words">
      These are the Terms and Conditions governing the use of the public NFT burning mechanism made available to the Solana community by Mortuary Inc. They set out the rights and obligations of all users regarding the Service. Your access to and use of the tool are conditioned on your acceptance of and compliance with these Terms and Conditions.
      </p>
      <p className="font-sansLight text-base mt-4 text-left break-words">
      Mortuary Inc. Funerary Pyre is a public burning tool of non-fungible tokens running on the Solana network. This website is only an interface allowing users to willingly burn their own NFTs in exchange for a predefined number of $ASH tokens. $ASH is a utility/community token giving its holders access to different functionalities in the Mortuary Inc. ecosystem, including but not limited to access to exclusive NFT collections and participation in the DAO.
      </p>
      <p className="font-sansLight text-base mt-4 text-left break-words">
      As the Service runs on the Solana network, it is impossible to undo, reverse, or restore any transactions. Users are entirely responsible for the safety and management of their own private Solana wallets and validating all transactions and contracts generated by this website. Their decision to burn an NFT is irreversible and Mortuary Inc. cannot be made responsible for the unfortunate destruction of valuable NFTs by the user.
      </p>
      <p className="font-sansLight text-base mt-4 text-left break-words">
      When an NFT is destroyed with a Mortuary Inc. burning tool, the NFT associated token account is closed and the Solana fee associated with the account (the rent, i.e. 0.00203928 SOL) is released. The rent was paid by the user and locked in the account when it was created. The destruction of the NFT is the only way to retrieve the fee. All users of the Service agree that those funds be transferred to Mortuary Inc. DAO wallet: mortuary.sol (hHF5RWHYKsLKhaKtw4yRFcLZm2JiruUGCh6buQ6pCuh).
      </p>
      <p className="font-sansLight text-base mt-4 text-left break-words">
      The burning tool is a proof-of-concept provided for the Solana community by Mortuary Inc. and does not represent the final experience. Mortuary Inc. will continue to optimize the Service to improve performance. Please report any malfunctions, bugs or suggestions to the dev team. The present Terms and Conditions will be continuously updated with reported limitations until a fix has been deployed.
      </p>
      <p className="font-sansLight text-base mt-4 text-left break-words">
      The service is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and non infringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
      </p>
    </div>
  );
};

export default TermCondition;
