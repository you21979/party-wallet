import { BIP32Interface } from 'bip32';
import { payments, Psbt, Transaction } from 'bitcoinjs-lib';
import { CoinInfo } from '../coin/coin_spec';
import { loadCoin } from '../coin/load';
import { fromBase58 } from '../seed/utils';
import { DerivedAddress, SignParam, Wallet, WatchOnlyWallet } from './wallet_spec';

export class SegwitCompatibleWallet implements Wallet {
  private node: BIP32Interface;
  private coin: CoinInfo;
  constructor(private readonly wowallet: WatchOnlyWallet) {
    this.coin = loadCoin(wowallet.coin);
    if(!this.coin.haveSegwit){
      throw new Error('have not segwit');
    }
    this.node = fromBase58(wowallet.xpub, this.coin.network);
  }
  static create(masternode: BIP32Interface, coin: CoinInfo, account: number = 0): WatchOnlyWallet {
    const walletType = 'SegwitCompatibleWallet';
    const baseHDPath = `m/49'/${coin.bip44}'/${account}'`;
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
    const p2wpkh = payments.p2wpkh({ pubkey: derivedNode.publicKey, network: this.coin.network });
    const p2sh = payments.p2sh({
      redeem: p2wpkh
    });
    if(!p2sh.address){
      throw new Error('address is undefined');
    }
    const address = p2sh.address;
    const hdpath = `${this.wowallet.baseHDPath}/${chunkHDPath}`;
    if(!p2wpkh.output){
      throw new Error('redeemscript is undefined');
    }
    const redeemScript = p2wpkh.output.toString('hex');
    return {
      address,
      hdpath,
      redeemScript,
    }
  }
  getCoin(): CoinInfo {
    return this.coin;
  }
  sign(tx: Transaction, node: BIP32Interface, params: SignParam[]): string {
    const psbt = Psbt.fromHex(tx.toHex());
    for( const param of params ) {
      psbt.signInput(param.vin, node.derivePath(param.hdpath));
    }
    return psbt.finalizeAllInputs().extractTransaction().toHex();
  }
  /*
  sign(tx: Transaction, node: BIP32Interface, params: SignParam[]): string {
    const txb = TransactionBuilder.fromTransaction(tx, this.coin.network);
    for( const param of params ) {
      if(!param.redeemScript || !param.witnessValue ) throw new Error('need redeemScript');
      txb.sign({
        prevOutScriptType: 'p2sh-p2wpkh',
        vin: param.vin,
        keyPair: node.derivePath(param.hdpath),
        redeemScript: Buffer.from(param.redeemScript, 'hex'),
        witnessValue: param.witnessValue,
      });
    }
    return txb.build().toHex();
  }
*/
}

