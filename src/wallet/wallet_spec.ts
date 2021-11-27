import { BIP32Interface, Transaction, TransactionBuilder } from "bitcoinjs-lib";
import { CoinInfo } from "../coin/coin_spec";

export interface DerivedAddress {
  address: string;
  hdpath: string;
  redeemScript?: string;
};

export interface WatchOnlyWallet {
  coin: string;
  walletType: string;
  baseHDPath: string;
  masterFingerPrint: string;
  xpub: string;
};

export interface Wallet {
  getAddress: (index: number) => DerivedAddress;
  getCoin: () => CoinInfo;
  sign: (tx: Transaction, node: BIP32Interface, params: SignParam[]) => string;
};

export interface SignParam {
  vin: number;
  hdpath: string;
  witnessValue?: number;
  redeemScript?: string;
};
