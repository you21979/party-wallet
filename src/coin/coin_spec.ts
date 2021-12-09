import { Network } from "bitcoinjs-lib";

export interface CoinInfo {
  network: Network;
  bip44: number;
  nativeAsset: string;
  nativeCurrency: string;
  haveSegwit: boolean;
  beginBlock: number; // counter party start block
};
