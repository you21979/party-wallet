import { CounterBlockApi, CreateFilter } from '../../api/counterblock';
import { getstatus } from '../../api/blockbook'
import util from 'util';

const _sleep = (time: number, callback: ()=> void): void => {
  setTimeout(callback, time);
}
const sleep = util.promisify(_sleep);

const getDispenserList = async(sinceBlock: number, limitBlock: number, currentBlock: number) => {
  if( currentBlock < sinceBlock ){
    return {
      dispensers: [],
      nextSince: sinceBlock,
    }
  }
  const f = new CreateFilter().
    //addEq('status', 0).
    addRange(currentBlock, sinceBlock, limitBlock);

  const cb = new CounterBlockApi('https://monapa.electrum-mona.org/_api');
  const res = await cb.getDispenser({
    filters: f.filters,
    order_by: 'block_index',
    order_dir: 'ASC',
    limit: 1000,
    offset: 0,
  })
  return {
    dispensers: res.result,
    nextSince: f.nextBlock,
  };
}

const timeFormatJst = (date: Date): string => (date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + '.' + date.getMilliseconds())


const log = (msg: string | Object): void => {
  if(msg instanceof Object){
    msg = '\n' + JSON.stringify(msg, null, 2);
  }
  put('\n' + timeFormatJst(new Date()) + ': ' + msg + '\n');
}

const put = (msg: string): void => {
  process.stdout.write(msg);
}

const getCurrentBlock = async(modifyBlock: number = 0): Promise<number> => {
  const res = await getstatus('https://blockbook.electrum-mona.org/api');
  return res.backend.blocks - modifyBlock;
}

const getStatus = (status: number): string => {
  switch(status){
    case 0: return `open (${status})`;
    case 10: return `close (${status})`;
  }
  return `? (${status})`;
}

const proc = async(currentBlock: number, sinceBlock: number, limitBlock: number = 100): Promise<number> => {
  const res = await getDispenserList(sinceBlock, limitBlock, currentBlock);
  if(res.dispensers.length){
    const items = res.dispensers.map(d => {
      return {
        address: d.source,
        status: getStatus(d.status),
        price: (d.satoshirate * 1e-8).toFixed(2),
        asset: d.asset,
        give_quantity: d.give_quantity,
        quantity: `${d.give_remaining} / ${d.escrow_quantity}`,
        hash: d.tx_hash,
        index: d.tx_index,
        block: d.block_index,
      }
    });
    log(items);
  }else{
    if(sinceBlock !== res.nextSince){
      log(`empty ${sinceBlock} - ${res.nextSince}`);
    }
  }
  return res.nextSince;
}

interface MyContext {
  currentBlock: number;
  upTime: number;
  since: number;
}

const main = async(argv: string[]) => {
  const modifyBlock = 0;
  const blockstart = await getCurrentBlock(modifyBlock);
  const ctx: MyContext = {
    currentBlock: blockstart,
    upTime: process.uptime(),
    since: blockstart,
  };
  do {
    put('.');
    try{
      ctx.upTime = process.uptime();
      const currentBlock = await getCurrentBlock(modifyBlock);
      if( ctx.currentBlock != currentBlock ){
        log('new block ' + currentBlock + ' -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        await sleep((3) * 1000);
      }
      ctx.currentBlock = currentBlock
    }catch(e){
      console.log('error 1');
      continue;
    }
    try{
      ctx.since = await proc(ctx.currentBlock, ctx.since, 100);
      const deltaTime = process.uptime() - ctx.upTime;
      await sleep((5 - deltaTime) * 1000);
    }catch(e){
      log('error 2');
      const deltaTime = process.uptime() - ctx.upTime;
      await sleep((1 - deltaTime) * 1000);
    }
  } while(1);
}

main(process.argv.slice(2));

