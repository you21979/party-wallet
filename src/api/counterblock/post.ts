import { parse } from 'json-bigint';
import axios from 'axios';

export const post = async<T>(uri: string, timeout: number, params: any): Promise<T> => {
  const result: T = await axios({
    method: 'post',
    url: uri,
    data: params,
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
  });
  return result;
}


