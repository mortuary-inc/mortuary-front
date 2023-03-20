import { SOLANA_NETWORK } from "config";

export function getRpcUrl() {
  if (SOLANA_NETWORK === "devnet") {
    return "https://api.devnet.solana.com";
  } else {
    return process.env.REACT_APP_SOLANA_RPC_HOST || "https://api.metaplex.solana.com/";
  }
}