import { Network } from 'bitcoinjs-lib';

export const network: Network = {
  bip32: {
    private: 0x02fac398,
    public: 0x02facafd
  },
  wif: 0x9e,
  pubKeyHash: 0x1e,
  scriptHash: 0x16,
  bech32: '',
  messagePrefix: ''
};

export const bip44 = 3;
export const nativeAsset = 'XDP';
export const nativeCurrency = 'DOGE';
export const haveSegwit = false;
export const beginBlock = 1;
