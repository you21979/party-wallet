const rp = require('request-promise');

export const post = async<T>(uri: string, timeout: number, params: any): Promise<T> => {
  const result: T = await rp({ uri, method: 'POST', timeout, json: params });
  return result;
}


