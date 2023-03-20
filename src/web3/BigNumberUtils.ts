import * as beet from '@metaplex-foundation/beet';

export function convertOptionalBignum(v: beet.COption<beet.bignum>, defaultIfnull: number) : number {
  if(!v) return defaultIfnull;
  let val : beet.bignum = v;
  if(typeof val == "number") return val;
  return val.toNumber();
}