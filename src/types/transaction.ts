export type TransactionCreate = {
  xtbId: number
  symbol: string
  type: TransactionType
  volume: number
  openTime: Date
  openPrice: number
  marketPrice: number
  purchaseValue: number
  commission?: number
  swap?: number
  rollover?: number
  grossPL?: number
  comment?: string
}

export type TransactionUpdate = Partial<
  Omit<TransactionCreate, 'id' | 'createdAt'>
>

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL'
}
