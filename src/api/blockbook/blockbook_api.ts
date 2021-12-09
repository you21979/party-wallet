import { get } from './get';

export interface Utxo {
  txid: string;
  vout: number;
  satoshis: number;
  height: number;
  confirmations: number;
};

export interface ResultSendTx {
  result: string;
}

export interface ResultGetStatus {
  blockbook: {
    coin: string;
    host: string;
    version: string;
    gitCommit: string;
    buildTime: string;
    syncMode: boolean;
    initialSync: boolean;
    inSync: boolean;
    bestHeight: number;
    lastBlockTime: string;
    inSyncMempool: boolean;
    lastMempoolTime: string;
    mempoolSize: number;
    decimals: number
    dbSize: number;
    about: string;
  },
  backend: {
    chain: string;
    blocks: number;
    headers: number;
    bestBlockHash: string;
    difficulty: string;
    sizeOnDisk: number;
    version: string;
    subversion: string;
    protocolVersion: string;
  }
};

export interface TransactionInput {
  txid: string;
  vout: number;
  sequence: number;
  n: number;
  addresses: string[],
  isAddress: boolean;
  value: string;
  hex: string;
};
export interface TransactionOutput {
  value: string;
  n: number;
  hex: string;
  addresses: string[];
  isAddress: boolean;
};

export interface ResultGetTx {
  txid: string;
  version: number;
  vin: TransactionInput[];
  vout: TransactionOutput[];
  blockHash: string,
  blockHeight: number;
  confirmations: number;
  blockTime: number;
  value: string;
  valueIn: string;
  fees: string;
  hex: string;
};

export const utxo = async(uri: string, address: string, params: { confirmed?: boolean } = {}): Promise<Utxo[]> => {
  const endpoint = `/utxo/${address}`;
  const utxos = await get<Utxo[]>(uri + endpoint, params);
  return utxos;
}

export const sendtx = async(uri: string, rawtx: string): Promise<ResultSendTx> => {
  const endpoint = `/v2/sendtx/${rawtx}`;
  try {
    const res = await get<ResultSendTx>(uri + endpoint, {});
    return res;
  } catch(e) {
    throw new Error( (e as Error).message );
  }
}

export const gettx = async(uri: string, txid: string): Promise<ResultGetTx> => {
  const endpoint = `/v2/tx/${txid}`;
  try {
    const res = await get<ResultGetTx>(uri + endpoint, {});
    return res;
  } catch(e) {
    throw new Error( (e as Error).message );
  }
}

export const getstatus = async(uri: string): Promise<ResultGetStatus> => {
  const endpoint = `/`;
  try {
    const res = await get<ResultGetStatus>(uri + endpoint, {});
    return res;
  } catch(e) {
    throw new Error( (e as Error).message );
  }
}



