import { decode } from 'electrum-oldmnemonic';
import { BIP32Interface, fromSeed } from 'bip32';
import { Network } from 'bitcoinjs-lib';

export const createBip32Node = (mnemonic: string, network: Network): BIP32Interface => {
  const seed = Buffer.from(decode(mnemonic), 'hex');
  const node = fromSeed(seed, network);
  return node;
}
