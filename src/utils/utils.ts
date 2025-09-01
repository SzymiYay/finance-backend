import { Transaction } from '../models/transaction.model'

export const mapDbToTransaction = (row: any): Transaction => {
  return {
    id: row.id,
    xtbId: row.xtb_id,
    symbol: row.symbol,
    type: row.type,
    volume: row.volume,
    openTime: row.open_time,
    openPrice: row.open_price,
    marketPrice: row.market_price,
    purchaseValue: row.purchase_value,
    commission: row.commission,
    swap: row.swap,
    rollover: row.rollover,
    grossPL: row.gross_pl,
    comment: row.comment,
    created_at: row.created_at
  }
}

export const mapTransactionToDb = (transaction: Transaction): any => {
  return {
    xtb_id: transaction.xtbId,
    symbol: transaction.symbol,
    type: transaction.type,
    volume: transaction.volume,
    open_time: transaction.openTime,
    open_price: transaction.openPrice,
    market_price: transaction.marketPrice,
    purchase_value: transaction.purchaseValue,
    commission: transaction.commission,
    swap: transaction.swap,
    rollover: transaction.rollover,
    gross_pl: transaction.grossPL,
    comment: transaction.comment
  }
}

export function roundCurrency(value: number): number {
  if (isNaN(value)) return 0
  return Math.round(value * 100) / 100
}

export function roundVolume(value: number): number {
  if (isNaN(value)) return 0
  return Math.round(value * 10000) / 10000
}

export function excelDateToJSDate(serial: number): Date {
  const excelEpoch = new Date(1899, 11, 30) // Excel start
  return new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000)
}
