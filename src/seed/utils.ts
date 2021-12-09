import BIP32Factory, { BIP32Interface } from 'bip32';
import { Network } from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

export const fromBase58 = (key: string, network: Network): BIP32Interface => bip32.fromBase58(key, network);
export const fromSeed = (seed: Buffer, network: Network): BIP32Interface => bip32.fromSeed(seed, network);

