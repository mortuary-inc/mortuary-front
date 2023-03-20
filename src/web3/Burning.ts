import * as anchor from '@project-serum/anchor';
import { IdlAccounts } from '@project-serum/anchor';
import { ExpiringCache } from 'lib/cache';
import { MASTER_ACCOUNT } from './Accounts';
import { Mortuary } from './idl/mortuary';

export type MortuaryMasterAccount = IdlAccounts<Mortuary>['mortuaryMasterAccount'];

// expire after 5 min
export const accountCache = new ExpiringCache<string, any>(5 * 60 * 1000);

export async function getMasterAccountData(program: anchor.Program<Mortuary>, forceReload = false) {
  let key = MASTER_ACCOUNT.toString();
  if (forceReload) {
    accountCache.delete(key);
  }

  let data = accountCache.get(key) as MortuaryMasterAccount;
  if (data != null) return data;

  let account = await program.account.mortuaryMasterAccount.fetch(MASTER_ACCOUNT);
  if (account != null) accountCache.set(key, account);
  return account;
}
