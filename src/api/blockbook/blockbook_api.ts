import { get } from './get';

export interface Utxo {
  txid: string;
  vout: number;
  satoshis: number;
  height: number;
  confirmations: number;
};

export const utxo = async(uri: string, address: string): Promise<Utxo[]> => {
  const endpoint = `/utxo/${address}`;
  const utxos = await get<Utxo[]>(uri + endpoint, {});
  return utxos;
}

export interface ResultSendTx {
  result: string;
}

export const sendtx = async(uri: string, rawtx: string): Promise<string> => {
  const endpoint = `/v2/sendtx/${rawtx}`;
  try {
    const res = await get<ResultSendTx>(uri + endpoint, {});
    return res.result;
  } catch(e) {
    throw new Error( (e as Error).message );
  }
}