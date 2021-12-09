import { Filter, Operator } from "./counter_block_api";

export class CreateFilter {
    filters: Filter[];
    nextBlock: number;
    constructor(){
      this.filters = [];
      this.nextBlock = -1;
    }
    add(field: string, op: Operator, value: number | string): CreateFilter{
      this.filters.push({
        field,
        op,
        value,
      });
      return this;
    }
    addEq(field: string, value: number | string): CreateFilter{
      this.filters.push({
        field,
        op: '==',
        value,
      });
      return this;
    }
    addRange(currentBlock: number, beginBlock: number, limitBlock: number): CreateFilter {
      const endBlock = limitBlock + beginBlock - 1;
      const maxBlock = currentBlock < endBlock ? currentBlock : endBlock;
      const nextBlock = maxBlock + 1;
      this.filters.push({
        field: 'block_index',
        op: '>=',
        value: beginBlock,
      });
      this.filters.push({
        field: 'block_index',
        op: '<=',
        value: maxBlock,
      });
/*
      console.log({
        beginBlock,
        endBlock,
        maxBlock,
        nextBlock,
      });
*/
      this.nextBlock = nextBlock;
      return this;
    }
  }