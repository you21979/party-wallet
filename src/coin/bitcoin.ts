import { Network } from 'bitcoinjs-lib';

export const network: Network = {
  bip32: {
    private: 0x0488ade4,
    public: 0x0488b21e
  },
  wif: 0x80,
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  bech32: 'bc',
  messagePrefix: '\x18Bitcoin Signed Message:\n'
};

export const bip44 = 0;
export const nativeAsset = 'XCP';
export const nativeCurrency = 'BTC';
export const haveSegwit = true;
export const beginBlock = 1;
