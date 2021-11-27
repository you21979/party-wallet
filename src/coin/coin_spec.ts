import { Network } from "bitcoinjs-lib";

export interface CoinInfo {
  network: Network;
  bip44: number;
  nativeAsset: string;
  nativeCurrency: string;
};
