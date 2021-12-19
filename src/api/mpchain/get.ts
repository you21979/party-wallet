import { parse } from 'json-bigint';
import axios from 'axios';

const baseUri = 'https://mpchain.info/api';

export type StatusCode = 'StatusCodeError';
export interface BaseResult{
  error?: StatusCode;
}

export const get = async<T extends BaseResult>(endpoint: string): Promise<T> => {
  const uri = baseUri + endpoint;
  const timeout = 5000;
  const result: T = await axios({
    method: 'get',
    url: uri,
    timeout,
    responseType: 'text',
    transitional: {
      silentJSONParsing: false,
      forcedJSONParsing: false,
    }
  }).then( res => {
    switch(res.status){
      case 200: return parse(res.data);
      default: return parse(res.data);
    }
  }).then( res => {
    if( res.error === 'StatusCodeError' ){
      console.log(`${uri} is error`);
      throw new Error(result.error);
    }
    return res;
  });
  return result;
}

export interface ResultCPBalance extends BaseResult{
  quantity?: string;
}
export const balance = async(address: string): Promise<ResultCPBalance> => {
  return get<ResultCPBalance>(`/balance/${address}/XMP`);
}
