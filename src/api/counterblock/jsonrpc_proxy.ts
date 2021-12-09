import { jsonRpc } from './jsonrpc';

export interface JsonRpcError {
  message: string;
  data?: {
    message: string;
    type: 'Exception';
  };
  code: number;
}

export interface ResultBase {
  id: number;
  jsonrpc: '2.0';
  error?: JsonRpcError;
};

export interface ParamBase {};

export const jsonRpcProxy = async<T extends ResultBase>(uri: string, timeout: number, id: number, method: string, params: ParamBase): Promise<T> => {
  const data = {
    method,
    params,
  }
  const res = await jsonRpc<T>(uri, timeout, id, 'proxy_to_counterpartyd', data);
  if( res.error ){
    if( res.error.data ){
      try{
        const data = JSON.parse(res.error.data.message);
        throw new Error(data.message);
      }catch(e){
        throw new Error(res.error.data.message);
      }
    }
    throw new Error(res.error.message);
  }
  return res;
}