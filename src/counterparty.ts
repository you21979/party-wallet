import { CounterBlockApi, DISPENSER_STATUS } from "./api/counterblock/counter_block_api";
import { DerivedAddress, Wallet } from "./wallet/wallet_spec";

export class CounterParty {
  constructor(private readonly uri: string, private readonly fee_per_kb: number, private readonly wallet: Wallet){}
  getWallet(): Wallet {
    return this.wallet;
  }
  async nativeSend(index: number, destination: string, value: string, memo: string = ''): Promise<ResultCreate> {
    const quantity = Math.round(parseFloat(value) * 1e8);
    const src = this.wallet.getAddress(index);
    const coin = this.wallet.getCoin();
    const cbapi = new CounterBlockApi(this.uri);
    const res = await cbapi.createSend({
      source: src.address,
      destination,
      asset: coin.nativeAsset,
      quantity,
      memo,
      fee_per_kb: this.fee_per_kb,
    });
    return {
      source: src,
      rawtx: res.result,
    }
  }
  async send(index: number, destination: string, asset: string, quantity: number, memo: string = ''): Promise<ResultCreate> {
    const src = this.wallet.getAddress(index);
    const cbapi = new CounterBlockApi(this.uri);
    const res = await cbapi.createSend({
      source: src.address,
      destination,
      asset,
      quantity,
      memo,
      fee_per_kb: this.fee_per_kb,
    });
    return {
      source: src,
      rawtx: res.result,
    }
  }
  async openDispenser(index: number, asset: string, give_quantity: number, escrow_quantity: number, mainchainrate: number): Promise<ResultCreate> {
    const src = this.wallet.getAddress(index);
    const cbapi = new CounterBlockApi(this.uri);
    const res = await cbapi.createDispenser({
      source: src.address,
      asset,
      give_quantity,
      escrow_quantity,
      mainchainrate,
      status: DISPENSER_STATUS.OPEN,
      fee_per_kb: this.fee_per_kb,
    });
    return {
      source: src,
      rawtx: res.result,
    }
  }
  async closeDispenser(index: number, asset: string): Promise<ResultCreate> {
    const src = this.wallet.getAddress(index);
    const cbapi = new CounterBlockApi(this.uri);
    const res = await cbapi.createDispenser({
      source: src.address,
      asset,
      give_quantity: 0,
      escrow_quantity: 0,
      mainchainrate: 0,
      status: DISPENSER_STATUS.CLOSE,
      fee_per_kb: this.fee_per_kb,
    });
    return {
      source: src,
      rawtx: res.result,
    }
  }
}

export interface ResultCreate {
  source: DerivedAddress;
  rawtx: string;
};
