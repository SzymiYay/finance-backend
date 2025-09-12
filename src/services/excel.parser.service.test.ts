import 'reflect-metadata'
import * as XLSX from 'xlsx'
import { excelDateToJSDate } from '../utils/utils'
import { ExcelParserService } from './excel.parser.service'
import { CurrencyType, TransactionType } from '../types/transaction'

jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}))
jest.mock('../utils/utils')

const mockedXLSX = XLSX as jest.Mocked<typeof XLSX>
const mockedExcelDateToJSDate = excelDateToJSDate as jest.Mock

describe('ExcelParserService', () => {
  let parser: ExcelParserService

  beforeEach(() => {
    jest.clearAllMocks()
    parser = new ExcelParserService()
  })

  it('should correctly parse valid transaction data from an Excel buffer', () => {
    const mockSheetData = [
      { __EMPTY: 'Some irrelevant header' },
      { __EMPTY_7: 1234, __EMPTY_10: 'PLN' },
      { __EMPTY: 'Position', __EMPTY_1: 'Symbol' },
      {
        __EMPTY: 12345,
        __EMPTY_1: 'TSLA.US',
        __EMPTY_2: 'BUY',
        __EMPTY_3: 10,
        __EMPTY_4: 45678.9,
        __EMPTY_5: 250.5,
        __EMPTY_6: 260.0,
        __EMPTY_7: 2505.0,
        __EMPTY_11: -5.0,
        __EMPTY_12: -1.2,
        __EMPTY_13: 0,
        __EMPTY_14: 93.8,
        __EMPTY_15: 'Test comment'
      },
      {
        __EMPTY: 67890,
        __EMPTY_1: 'GOOGL.US',
        __EMPTY_2: 'SELL',
        __EMPTY_3: 5,
        __EMPTY_4: 45679.0,
        __EMPTY_5: 150.0,
        __EMPTY_6: 140.0,
        __EMPTY_7: 750.0,
        __EMPTY_11: -4.0,
        __EMPTY_12: 0,
        __EMPTY_13: 0,
        __EMPTY_14: 46.0,
        __EMPTY_15: ''
      },
      { __EMPTY_1: 'Total' },
      { __EMPTY: 'Some irrelevant footer' }
    ]

    mockedXLSX.read.mockReturnValue({
      SheetNames: ['FirstSheet', 'TransactionsSheet'],
      Sheets: { TransactionsSheet: {} }
    })
    ;(mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(
      mockSheetData
    )
    const mockDate = new Date('2025-01-01T12:00:00Z')
    mockedExcelDateToJSDate.mockReturnValue(mockDate)

    const result = parser.parse(Buffer.from(''))

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      accountId: 1234,
      xtbId: 12345,
      currency: CurrencyType.PLN,
      symbol: 'TSLA.US',
      type: TransactionType.BUY,
      volume: 10,
      openTime: mockDate,
      openPrice: 250.5,
      marketPrice: 260.0,
      purchaseValue: 2505.0,
      commission: -5.0,
      swap: -1.2,
      rollover: 0,
      grossPL: 93.8,
      comment: 'Test comment'
    })
    expect(mockedExcelDateToJSDate).toHaveBeenCalledWith(45678.9)
    expect(mockedExcelDateToJSDate).toHaveBeenCalledWith(45679.0)
  })

  it('should return an empty array if no transaction rows are found', () => {
    const mockSheetData = [
      { __EMPTY: 'Position', __EMPTY_1: 'Symbol' },
      { __EMPTY_1: 'Total' }
    ]
    mockedXLSX.read.mockReturnValue({
      SheetNames: ['s1', 's2'],
      Sheets: { s2: {} }
    })
    ;(mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(
      mockSheetData
    )

    const result = parser.parse(Buffer.from(''))

    expect(result).toEqual([])
  })

  it('should ignore rows that are missing essential data (symbol or type)', () => {
    const mockSheetData = [
      { __EMPTY: 'Position', __EMPTY_1: 'Symbol' },
      { __EMPTY: 1, __EMPTY_1: 'VALID.ROW', __EMPTY_2: 'BUY' },
      { __EMPTY: 2, __EMPTY_1: '', __EMPTY_2: 'BUY' },
      { __EMPTY: 3, __EMPTY_1: 'ANOTHER.ROW', __EMPTY_2: '' },
      { __EMPTY_1: 'Total' }
    ]
    mockedXLSX.read.mockReturnValue({
      SheetNames: ['s1', 's2'],
      Sheets: { s2: {} }
    })
    ;(mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(
      mockSheetData
    )

    const result = parser.parse(Buffer.from(''))

    expect(result).toHaveLength(1)
    expect(result[0].symbol).toBe('VALID.ROW')
  })
})
