import * as api from './api/blockbook/blockbook_api'

export class BlockBook {
  constructor(private readonly uri: string) {}
  async sendTx(rawtx: string): Promise<string> {
    return api.sendtx(this.uri, rawtx);
  }
  async utxo(address: string): Promise<api.Utxo[]> {
    return api.utxo(this.uri, address);
  }
}

