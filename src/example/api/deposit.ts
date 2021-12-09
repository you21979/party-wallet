import { AssetSend, CounterBlockApi, CreateFilter } from '../../api/counterblock';
import { getstatus } from '../../api/blockbook'
import { loadCoin } from '../../coin';

interface DepositList{
  deposits: AssetSend[],
  nextSince: number;
};

const getDepositList = async(currentBlock: number, sinceBlock: number, limitBlock: number, address: string): Promise<DepositList> => {
  const coin = loadCoin('MONA');
  const cb = new CounterBlockApi('https://monapa.electrum-mona.org/_api');
  const f = new CreateFilter().
    addEq ('asset', coin.nativeAsset).
    addEq('destination', address).
    addEq('status', 'valid').
    addRange(currentBlock, sinceBlock, limitBlock);
  const res = await cb.getSends({
    filters: f.filters,
    order_by: 'block_index',
    order_dir: 'ASC',
    limit: 1000,
    offset: 0,
  });
  return {
    deposits: res.result,
    nextSince: f.nextBlock,
  };
}

const main = async(argv: string[]) => {
  const targetAddress = argv[0];
  const blockIndex = parseInt(argv[1]);
  const limitBlock = 1000;
  const status = await getstatus('https://blockbook.electrum-mona.org/api');
  const currentBlock = status.backend.blocks;
  const res = await getDepositList(currentBlock, blockIndex, limitBlock, targetAddress);
  console.log(res);
}

main(process.argv.slice(2));

