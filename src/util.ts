import { Transaction } from "bitcoinjs-lib";
import { Utxo } from "./api/blockbook/blockbook_api";

export interface InputBase {
  txid: string;
  vout: number;
};

export interface InputDetail extends InputBase {
  satoshis: number;
};

export const getInputFromTx = (tx: Transaction): InputBase[] => {
  return tx.ins.reduce((r: InputBase[], input) => {
    const txid = Buffer.from(Buffer.from(input.hash).reverse()).toString('hex');
    const vout = input.index;
    r.push({ txid, vout });
    return r;
  }, []);
}

export const createUtxoTableFromUtxo = ( utxos: Utxo[] ): {[name: string]: Utxo} => {
  const table = utxos.reduce(
    (r, v) => {
      r[`${v.txid}:${v.vout}`] = v;
      return r;
    }, {} as {[name: string]: Utxo});
  return table;
}

export const getInputDetailFromTx = ( utxos: Utxo[], tx: Transaction ): InputDetail[] => {
  const tbl = createUtxoTableFromUtxo( utxos );
  const inputs = getInputFromTx(tx) as InputDetail[];
  for(const input of inputs){
    const utxo = tbl[`${input.txid}:${input.vout}`];
    if( utxo ) {
      input.satoshis = utxo.satoshis;
    }else{
      throw new Error('unknown input');
    }
  }
  return inputs;
}





