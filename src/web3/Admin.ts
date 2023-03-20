import { web3 } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { ASH_MINT, loadMortuaryProgram, MASTER_ACCOUNT } from "./Accounts";
import * as anchor from '@project-serum/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function withdraw(connection: web3.Connection, amount: number, wallet: AnchorWallet) {

  let ashMint = ASH_MINT;
  let master =MASTER_ACCOUNT;

  const program = await loadMortuaryProgram(connection, wallet);
  const ashTokenAccount = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, ashMint, wallet.publicKey);
  let masterAccountInfo = await program.account.mortuaryMasterAccount.fetch(master);
  let bank = masterAccountInfo.bank;

  console.log("master account: " + master.toBase58());
  console.log("master account initializer: " + masterAccountInfo.initializer);
  console.log("bank account: " + masterAccountInfo.bank);
  console.log("master account goLiveDate: " + masterAccountInfo.goLiveDate);
  console.log("master account burnFrequency: " + masterAccountInfo.burnFrequency);
  console.log("master account ashByBurn: " + masterAccountInfo.ashByBurn);

  const [pda,] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("mortuary"))],
    program.programId
  );

  await program.rpc.withdrawMaster(new anchor.BN(amount),
    {
      accounts: {
        masterAccount: master,
        initializer: masterAccountInfo.initializer,
        ownerTokenAccount: ashTokenAccount,
        bank: bank,
        pdaAccount: pda,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  );

}