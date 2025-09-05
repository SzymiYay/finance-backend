import { Transaction, TransactionType } from '../models/transaction.entity'
import * as XLSX from 'xlsx'
import { excelDateToJSDate } from '../utils/utils'
import { injectable } from 'tsyringe'
import { TransactionCreate } from '../types/transaction'

export interface IExcelParser {
  parse(buffer: Buffer): TransactionCreate[]
}

@injectable()
export class ExcelParserService implements IExcelParser {
  parse(buffer: Buffer): TransactionCreate[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[1]
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: ''
    })

    const transactions: TransactionCreate[] = []
    let inTransaction = false

    for (const row of data) {
      if (row['__EMPTY'] === 'Position' && row['__EMPTY_1'] === 'Symbol') {
        inTransaction = true
        continue
      }

      if (inTransaction) {
        if (row['__EMPTY_1'] === 'Total') break

        if (!row['__EMPTY_1'] || !row['__EMPTY_2']) continue

        transactions.push({
          xtbId: Number(row['__EMPTY']),
          symbol: String(row['__EMPTY_1']),
          type:
            row['__EMPTY_2'] === 'BUY'
              ? TransactionType.BUY
              : TransactionType.SELL,
          volume: Number(row['__EMPTY_3']),
          openTime: excelDateToJSDate(Number(row['__EMPTY_4'])),
          openPrice: Number(row['__EMPTY_5']),
          marketPrice: Number(row['__EMPTY_6']),
          purchaseValue: Number(row['__EMPTY_7']),
          commission: Number(row['__EMPTY_11']) || 0,
          swap: Number(row['__EMPTY_12']) || 0,
          rollover: Number(row['__EMPTY_13']) || 0,
          grossPL: Number(row['__EMPTY_14']) || 0,
          comment: String(row['__EMPTY_15']) || ''
        })
      }
    }

    return transactions
  }
}
