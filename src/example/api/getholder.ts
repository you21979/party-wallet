import { CounterBlockApi } from '../../api/counterblock';
import { loadCoin } from '../../coin'

const getDepositList = async() => {
  const coin = loadCoin('MONA');
  const cb = new CounterBlockApi('https://monapa.electrum-mona.org/_api');
  const res = await cb.getHolders({
    asset: coin.nativeAsset,
  });
  return res;
}

const main = async(argv: string[]) => {
  const res = await getDepositList();
  console.log(res);
}

main(process.argv.slice(2));

