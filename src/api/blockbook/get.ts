const rp = require('request-promise');

export const get = async<T>(uri: string, params: any): Promise<T> => {
  const result: T = await rp({ uri, method: 'GET', json: true, qs: params });
  return result;
}


