import { jsonRpc } from './jsonrpc';

export interface JsonRpcError {
  message: string;
  data?: {
    message: string;
    type: 'Exception';
  };
  code: number;
}

export interface BaseResult {
  id: number;
  jsonrpc: '2.0';
  error?: JsonRpcError;
};

export interface BaseParam {};

export const jsonRpcProxy = async<T extends BaseResult>(uri: string, timeout: number, id: number, method: string, params: BaseParam): Promise<T> => {
  const data = {
    method,
    params,
  }
  const res = await jsonRpc<T>(uri, timeout, id, 'proxy_to_counterpartyd', data);
  if( res.error ){
    if( res.error.data ){
      const data = JSON.parse(res.error.data.message);
      console.log(data);
      throw new Error(data.message);
    }
    throw new Error(res.error.message);
  }
  return res;
}