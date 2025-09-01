export type TransactionType = 'BUY' | 'SELL'

export interface Transaction {
  id?: number
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
  created_at?: Date
}
