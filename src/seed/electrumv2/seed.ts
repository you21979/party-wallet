import { mnemonicToSeedSync } from 'electrum-mnemonic';
import { BIP32Interface } from 'bip32';
import { Network } from 'bitcoinjs-lib';
import { fromSeed } from '../utils';

export const createBip32Node = (mnemonic: string, network: Network): BIP32Interface => {
  const seed = mnemonicToSeedSync(mnemonic, { passphrase: '' })
  const node = fromSeed(seed, network);
  return node;
}

