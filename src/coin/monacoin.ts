import { Network } from 'bitcoinjs-lib';

export const network: Network = {
  bip32: {
    private: 0x0488ade4,
    public: 0x0488b21e
  },
  wif: 0xb0,
  pubKeyHash: 0x32,
  scriptHash: 0x37,
  bech32: 'mona',
  messagePrefix: ''
};

export const bip44 = 22;
export const nativeAsset = 'XMP';
export const nativeCurrency = 'MONA';
export const haveSegwit = true;
export const beginBlock = 1166002;
