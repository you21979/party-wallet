import { Network } from "bitcoinjs-lib";
import { BasicWallet } from "./basic_wallet";
import { CounterWallet } from "./counter_wallet";
import { SegwitCompatibleWallet } from "./segwit_compatible_wallet";
import { SegwitWallet } from "./segwit_wallet";
import { WatchOnlyWallet } from "./wallet_spec";


export const loadWallet = (wow: WatchOnlyWallet) => {
  switch(wow.walletType){
    case 'BasicWallet': return new BasicWallet(wow);
    case 'CounterWallet': return new CounterWallet(wow);
    case 'SegwitCompatibleWallet': return new SegwitCompatibleWallet(wow);
    case 'SegwitWallet': return new SegwitWallet(wow);
  }
  throw new Error('unknown wallet');
}



