import { AssetSend, CounterBlockApi, CreateFilter } from '../../api/counterblock';
import { getstatus } from '../../api/blockbook'
import util from 'util';

const _sleep = (time: number, callback: ()=> void): void => {
  setTimeout(callback, time);
}
const sleep = util.promisify(_sleep);

interface DepositList{
  deposits: AssetSend[],
  nextSince: number;
};

const getDepositList = async(currentBlock: number, sinceBlock: number, limitBlock: number): Promise<DepositList> => {
  const cb = new CounterBlockApi('https://monapa.electrum-mona.org/_api');
  const f = new CreateFilter().
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
  const limitBlock = 100;
  const res = await getstatus('https://blockbook.electrum-mona.org/api');
  let since = res.backend.blocks;
  do {
    const status = await getstatus('https://blockbook.electrum-mona.org/api');
    const currentBlock = status.backend.blocks;
    const res = await getDepositList(currentBlock, since, limitBlock);
    if(res.deposits.length){
      console.log(res);
    }
    since = res.nextSince;
    await sleep(30000);
  } while(1);
}

main(process.argv.slice(2));

