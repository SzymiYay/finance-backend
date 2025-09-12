import * as XLSX from 'xlsx'
import { excelDateToJSDate } from '../utils/utils'
import { injectable } from 'tsyringe'
import {
  CurrencyType,
  TransactionCreate,
  TransactionType
} from '../types/transaction'

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

    const accountId = data[1]['__EMPTY_7']
    const currency = data[1]['__EMPTY_10']

    for (const row of data) {
      if (row['__EMPTY'] === 'Position' && row['__EMPTY_1'] === 'Symbol') {
        inTransaction = true
        continue
      }

      if (inTransaction) {
        if (row['__EMPTY_1'] === 'Total') break

        if (!row['__EMPTY_1'] || !row['__EMPTY_2']) continue

        transactions.push({
          accountId: Number(accountId),
          xtbId: Number(row['__EMPTY']),
          currency: CurrencyType[String(currency) as keyof typeof CurrencyType],
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

    // const ts = Date.now()

    // const rawPath = path.join(process.cwd(), 'public', `xtb-raw-${ts}.json`)
    // const cleanPath = path.join(process.cwd(), 'public', `xtb-${ts}.json`)

    // try {
    //   fs.writeFileSync(rawPath, JSON.stringify(data, null, 2), 'utf-8')
    //   log.info('Raw Excel data saved', {
    //     context: 'ExcelParserService - parse',
    //     path: rawPath
    //   })
    // } catch (err) {
    //   log.error('Failed to save raw Excel JSON', {
    //     context: 'ExcelParserService - parse',
    //     error: err
    //   })
    // }

    // try {
    //   fs.writeFileSync(
    //     cleanPath,
    //     JSON.stringify(transactions, null, 2),
    //     'utf-8'
    //   )
    //   log.info('Parsed transactions saved', {
    //     context: 'ExcelParserService - parse',
    //     path: cleanPath,
    //     at: new Date().toISOString(),
    //     count: transactions.length,
    //     caller: new Error().stack
    //   })
    // } catch (err) {
    //   log.error('Failed to save parsed transactions', {
    //     context: 'ExcelParserService - parse',
    //     error: err
    //   })
    // }

    return transactions
  }
}
