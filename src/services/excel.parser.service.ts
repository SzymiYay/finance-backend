import { Transaction } from '../models/transaction.model'
import * as XLSX from 'xlsx'
import { excelDateToJSDate } from '../utils/utils'
import { injectable } from 'tsyringe'

export interface IExcelParser {
  parse(buffer: Buffer): Transaction[]
}

@injectable()
export class ExcelParserService implements IExcelParser {
  parse(buffer: Buffer): Transaction[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[1]
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: ''
    })

    const transactions: Transaction[] = []
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
          type: row['__EMPTY_2'] === 'BUY' ? 'BUY' : 'SELL',
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
