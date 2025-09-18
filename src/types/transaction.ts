export type TransactionCreate = {
  accountId: number
  xtbId: number
  currency: CurrencyType
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

export enum CurrencyType {
  USD = 'USD',
  EUR = 'EUR',
  PLN = 'PLN'
}

export interface TransactionQuery {
  sortBy?: TransactionSortableFields
  order?: 'ASC' | 'DESC'
  limit?: number
  offset?: number
  symbol?: string
  getAll?: boolean
}

export type TransactionSortableFields =
  | 'id'
  | 'accountId'
  | 'currency'
  | 'symbol'
  | 'volume'
  | 'openTime'
  | 'openPrice'
  | 'marketPrice'
  | 'purchaseValue'
  | 'grossPL'
  | 'createdAt'
