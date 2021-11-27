import { BIP32Interface, fromBase58 } from 'bip32';
import { payments, Transaction, TransactionBuilder } from 'bitcoinjs-lib';
import { CoinInfo } from '../coin/coin_spec';
import { loadCoin } from '../coin/load';
import { DerivedAddress, SignParam, Wallet, WatchOnlyWallet } from './wallet_spec';

export class CounterWallet implements Wallet {
  private node: BIP32Interface;
  private coin: CoinInfo;
  constructor(private readonly wowallet: WatchOnlyWallet) {
    this.coin = loadCoin(wowallet.coin);
    this.node = fromBase58(wowallet.xpub, this.coin.network);
  }
  static create(masternode: BIP32Interface, coin: CoinInfo): WatchOnlyWallet {
    const walletType = 'CounterWallet';
    const baseHDPath = `m/0'`;
    const node = masternode.derivePath(baseHDPath).neutered();
    const masterFingerPrint = masternode.fingerprint.toString('hex');
    const xpub = node.toBase58();
    return {
      coin: coin.nativeCurrency,
      walletType,
      baseHDPath,
      masterFingerPrint,
      xpub,
    }
  }
  getAddress(index: number): DerivedAddress {
    const chunkHDPath = `0/${index}`;
    const derivedNode = this.node.derivePath(chunkHDPath);
    const p2pkh = payments.p2pkh({ pubkey: derivedNode.publicKey, network: this.coin.network });
    if(!p2pkh.address){
      throw new Error('address is undefined');
    }
    const address = p2pkh.address;
    const hdpath = `${this.wowallet.baseHDPath}/${chunkHDPath}`;
    return {
      address,
      hdpath,
    }
  }
  getCoin(): CoinInfo {
    return this.coin;
  }
  sign(tx: Transaction, node: BIP32Interface, params: SignParam[]): string {
    const txb = TransactionBuilder.fromTransaction(tx, this.coin.network);
    for( const param of params ) {
      txb.sign({
        prevOutScriptType: 'p2pkh',
        vin: param.vin,
        keyPair: node.derivePath(param.hdpath),
      });
    }
    return txb.build().toHex();
  }
}
