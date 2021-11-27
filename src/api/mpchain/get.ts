
const rp = require('request-promise');

const baseUri = 'https://mpchain.info/api';

export type StatusCode = 'StatusCodeError';
export interface BaseResult{
  error?: StatusCode;
}

export const get = async<T extends BaseResult>(endpoint: string): Promise<T> => {
  const uri = baseUri + endpoint;
  const result: T = await rp({ uri, json: true });
  if( result.error === 'StatusCodeError' ){
    console.log(`${uri} is error`);
    throw new Error(result.error);
  }
  return result;
}

export interface ResultCPBalance extends BaseResult{
  quantity?: string;
}
export const balance = async(address: string): Promise<ResultCPBalance> => {
  return get<ResultCPBalance>(`/balance/${address}/XMP`);
}




