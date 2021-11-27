import * as monacoin from './monacoin';
import * as bitcoin from './bitcoin';
import * as dogecoin from './dogecoin';
import { CoinInfo } from './coin_spec';

export const loadCoin = (coin: string): CoinInfo => {
  switch(coin){
    case 'MONA': return monacoin;
    case 'BTC': return bitcoin;
    case 'DOGE': return dogecoin;
  }
  throw new Error('unknown coin');
}