import { TransactionType } from "../models/transaction.model"

export interface DbTransaction {
  id?: number
  xtb_id: number
  symbol: string
  type: TransactionType
  volume: number
  open_time: Date
  open_price: number
  market_price: number
  purchase_value: number
  commission?: number
  swap?: number
  rollover?: number
  gross_pl?: number
  comment?: string
  created_at?: Date
}
