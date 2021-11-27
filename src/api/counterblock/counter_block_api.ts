import { BaseParam, BaseResult, jsonRpcProxy } from './jsonrpc_proxy';

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
  async jsonrpc<T extends BaseResult>(method: string, params: BaseParam): Promise<T> {
    return jsonRpcProxy<T>(this.uri, this.timeout, this.callId(), method, params);
  }
  async createRequest<T extends CreateResult>(method: string, params: CreateParam): Promise<T> {
    params.allow_unconfirmed_inputs = true;
    return this.jsonrpc<T>(method, params);
  }
  async createSend(params: AssetSend): Promise<CreateResult> {
    const method = 'create_send';
    params.use_enhanced_send = true;
    return this.createRequest(method, params);
  }
  async createDispenser(params: AssetDispense): Promise<CreateResult> {
    const method = `create_dispenser`;
    return this.createRequest(method, params);
  }
}

export interface CustomInput {
  txid: string;
  vout: number;
};

export interface CreateParam extends BaseParam {
  fee_per_kb?: number; // fee rate
  fee_provided?: number; // max fee
  fee?: number; // static fee
  allow_unconfirmed_inputs?: boolean;
  custom_inputs?: CustomInput[];
  unspent_tx_hash?: string;
};

export interface CreateResult extends BaseResult {
  result: string; // hex transaction
};

export interface AssetSend extends CreateParam {
  source: string;
  destination: string;
  asset: string;
  quantity: number;
  memo: string;
  memo_is_hex?: boolean;
  use_enhanced_send?: boolean;
};

export enum DISPENSER_STATUS {
  OPEN = 0,
  USING_OPEN_ADDRESS = 1, // dont use
  CLOSE = 10,
};

export interface AssetDispense extends CreateParam {
  source: string;
  asset: string;
  give_quantity: number;
  escrow_quantity: number;
  mainchainrate: number; // satoshi
  status: DISPENSER_STATUS;
  open_address?: string; // dont use
};



