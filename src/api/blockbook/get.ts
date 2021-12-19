import { parse } from 'json-bigint';
import axios from 'axios';

export const get = async<T>(uri: string, params: any): Promise<T> => {
  const timeout = 5000;
  const result: T = await axios({
    method: 'get',
    url: uri,
    params,
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
