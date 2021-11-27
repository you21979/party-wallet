import { post } from './post';

export const jsonRpc = async<T>(uri: string, timeout: number, id: number, method: string, params: any): Promise<T> => {
  const data = {
    "jsonrpc": "2.0",
    id,
    method,
    params,
  }
  return post<T>(uri, timeout, data);
}

