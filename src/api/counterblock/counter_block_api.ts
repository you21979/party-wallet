// https://counterparty.io/docs/API/

import { ParamBase, ResultBase, jsonRpcProxy } from './jsonrpc_proxy';

export class CounterBlockApi {
  private id: number;
  private timeout: number;
  constructor(private readonly uri: string){
    this.id = 0;
    this.timeout = 30 * 1000;
  }
  private callId(): number{
    return this.id++;
  }
  async jsonrpc<T extends ResultBase>(method: string, params: ParamBase): Promise<T> {
    return jsonRpcProxy<T>(this.uri, this.timeout, this.callId(), method, params);
  }
  async createCommonRequest<T extends ResultCreateCommon>(method: string, params: ParamCreateCommon): Promise<T> {
    params.allow_unconfirmed_inputs = true;
    params.encoding = "auto";
    return this.jsonrpc<T>(method, params);
  }
  // -------------------------------------------
  // getXXX
  // -------------------------------------------
  async getSends(params: ParamGetSends): Promise<ResultGetSends> {
    const method = `get_sends`;
    return this.jsonrpc(method, params);
  }
  async getDispenser(params: ParamGetDispensers): Promise<ResultGetDispensers> {
    const method = `get_dispensers`;
    return this.jsonrpc(method, params);
  }
  async getNormalizedBalances(params: ParamGetNormalizedBalances): Promise<ResultGetNormalizedBalances> {
    const method = `get_normalized_balances`;
    return this.jsonrpc(method, params);
  }
  async getAssetsInfo(params: ParamGetAssetsInfo): Promise<ResultGetAssetsInfo> {
    const method = `get_assets_info`;
    return this.jsonrpc(method, params);
  }
  async getHolders(params: ParamGetHolders): Promise<ResultGetHolders> {
    const method = `get_holders`;
    return this.jsonrpc(method, params);
  }
  // -------------------------------------------
  // createXXX
  // -------------------------------------------
  async createSend(params: ParamCreateSend): Promise<ResultCreateSend> {
    const method = 'create_send';
    params.use_enhanced_send = true;
    return this.createCommonRequest(method, params);
  }
  async createDispenser(params: ParamCreateDispenser): Promise<ResultCreateDispenser> {
    const method = `create_dispenser`;
    return this.createCommonRequest(method, params);
  }
  async createIssuance(params: ParamCreateIssuance): Promise<ResultCreateIssuance> {
    const method = 'create_issuance';
    return this.createCommonRequest(method, params);
  }
  async createBroadcast(params: ParamCreateBroadcast): Promise<ResultCreateBroadcast> {
    const method = 'create_broadcast';
    return this.createCommonRequest(method, params);
  }
}

export interface CustomInput {
  txid: string;
  vout: number;
};

export enum DISPENSER_STATUS {
  OPEN = 0,
  USING_OPEN_ADDRESS = 1, // dont use
  CLOSE = 10,
};

export type OrderDir = 'ASC' | 'DESC';
export type Operator = '==' | '!=' | '>=' | '<=' | '>' | '<' | 'IN' | 'LIKE' | 'NOT IN' | 'NOT LIKE';

export interface DispenserAsset {
  asset: string;
  block_index: number;
  escrow_quantity: number;
  give_quantity: number;
  give_remaining: number;
  satoshirate: number;
  source: string; // source address
  status: DISPENSER_STATUS;
  tx_hash: string;
  tx_index: number;
};

export interface Filter {
  field: string;
  op: Operator;
  value: number | string;
};

export interface AssetBalance {
  normalized_quantity: number;
  asset_longname: string;
  address: string;
  owner: boolean;
  quantity: number;
  asset: string;
};

export interface AssetInfo {
  locked: boolean;
  asset: string;
  asset_longname: string;
  description: string;
  owner: string;
  issuer: string;
  divisible: boolean;
  supply: number;
  total_issued: number;
};

export interface AssetSend {
  tx_hash: string;
  asset: string,
  tx_index: number;
  quantity: number;
  source: string;
  memo_hex: string | null; 
  status: string; // valid, invalid: {problem(s)}
  block_index: number;
  memo: string | null;
  msg_index: number;
  destination: string;
};

export interface ParamCreateCommon extends ParamBase {
  fee_per_kb?: number; // fee rate
  fee_provided?: number; // max fee
  fee?: number; // static fee
  allow_unconfirmed_inputs?: boolean;
  custom_inputs?: CustomInput[];
  unspent_tx_hash?: string;
  disable_utxo_locks?: boolean;
  encoding?: string; // fix "auto"
  extended_tx_info?: boolean;
  pubkey?: String; // hex string. first transaction address, must be use.
  source: string; // source address.
};

export interface ResultCreateCommon extends ResultBase {
  result: string; // The unsigned transaction, as an hex-encoded string. Must be signed before being broadcast.
};

export type ParamCreateSend = ParamCreateSendSingleAsset | ParamCreateSendMultiAsset;
export interface ParamCreateSendSingleAsset extends ParamCreateCommon {
  destination: string;
  asset: string;
  quantity: number;
  memo: string;
  memo_is_hex?: boolean;
  use_enhanced_send?: boolean;
};
export interface ParamCreateSendMultiAsset extends ParamCreateCommon {
  destination: string[];
  asset: string[];
  quantity: number[];
  memo: string;
  memo_is_hex?: boolean;
  use_enhanced_send?: boolean;
};
export interface ResultCreateSend extends ResultCreateCommon {};


export interface ParamCreateDispenser extends ParamCreateCommon {
  asset: string;
  give_quantity: number;
  escrow_quantity: number;
  mainchainrate: number; // satoshi
  status: DISPENSER_STATUS;
  open_address?: string; // dont use
};
export interface ResultCreateDispenser extends ResultCreateCommon {};


export interface ParamCreateIssuance extends ParamCreateCommon {
  asset: string;
  quantity: number;
  description: string;
  divisible: boolean;
  transfer_destination?: string;
};
export interface ResultCreateIssuance extends ResultCreateCommon {};

export interface ParamCreateBroadcast extends ParamCreateCommon {
  fee_fraction: number; // How much of every bet on this feed should go to its operator; a fraction of 1, (i.e. 0.05 is five percent).
  text: string; // The textual part of the broadcast.
  timestamp: number; // The timestamp of the broadcast, in Unix time.
  value: number; // Numerical value of the broadcast.
};
export interface ResultCreateBroadcast extends ResultCreateCommon {};

export interface ParamGetCommon extends ParamBase {
  filters?: Filter[];
  filterop?: string;
  limit?: number; // default 1000
  offset?: number;
  order_by?: string;
  order_dir?: OrderDir;
  start_block?: number;
  end_block?: number;
  status?: string[];
};

export interface ParamGetDispensers extends ParamGetCommon {
};
export interface ResultGetDispensers extends ResultBase {
  result: DispenserAsset[];
};

export interface ParamGetNormalizedBalances extends ResultBase {
  addresses: string[];
};
export interface ResultGetNormalizedBalances extends ResultBase {
  result: AssetBalance[];
};

export interface ParamGetAssetsInfo extends ResultBase {
  assetsList: string[];
};
export interface ResultGetAssetsInfo extends ResultBase {
  result: AssetInfo[];
};

export interface ParamGetSends extends ParamGetCommon {
};
export interface ResultGetSends extends ResultBase {
  result: AssetSend[];
};

export interface ParamGetHolders extends ParamGetCommon {
  asset: string;
};
export interface ResultGetHolders extends ResultBase {
  result: {
    escrow: null | number;
    address: string;
    address_quantity: number;
  }[];
};
