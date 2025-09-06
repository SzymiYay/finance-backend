import 'reflect-metadata'
import { ImportController } from './import.controller'
import { ExcelParserService } from '../services/excel.parser.service'
import { TransactionService } from '../services/transaction.service'
import { AppError } from '../errors/app.error'
import { TransactionCreate, TransactionType } from '../types/transaction'
import { Transaction } from '../models/transaction.entity'
import { Readable } from 'stream'

jest.mock('../services/excel.parser.service')
jest.mock('../services/transaction.service')
jest.mock('../errors/app.error')

const createMockSavedTransaction = (id: number): Transaction => ({
  id,
  symbol: `SYM${id}`,
  type: TransactionType.BUY,
  volume: 10,
  openTime: new Date(),
  openPrice: 100,
  marketPrice: 110,
  purchaseValue: 1000,
  commission: 0,
  swap: 0,
  rollover: 0,
  grossPL: 100,
  comment: '',
  xtbId: 1000 + id,
  createdAt: new Date()
})

export const createMockTransactionCreate = (
  overrides: Partial<TransactionCreate> = {}
): TransactionCreate => ({
  xtbId: 999,
  symbol: 'DEFAULT.US',
  type: TransactionType.BUY,
  volume: 1,
  openTime: new Date(),
  openPrice: 100,
  marketPrice: 100,
  purchaseValue: 100,
  commission: 0,
  swap: 0,
  rollover: 0,
  grossPL: 0,
  comment: '',
  ...overrides
})

describe('ImportController', () => {
  let importController: ImportController
  let mockedExcelParserService: jest.Mocked<ExcelParserService>
  let mockedTransactionService: jest.Mocked<TransactionService>

  beforeEach(() => {
    jest.clearAllMocks()

    mockedExcelParserService =
      new ExcelParserService() as jest.Mocked<ExcelParserService>
    mockedTransactionService = {
      addTransactions: jest.fn()
    } as unknown as jest.Mocked<TransactionService>
    ;(AppError.notFound as jest.Mock).mockImplementation((message: string) => {
      return new Error(message)
    })

    importController = new ImportController(
      mockedExcelParserService,
      mockedTransactionService
    )
  })

  describe('importFile', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'transactions.xlsx',
      encoding: '7bit',
      mimetype:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('mock excel data'),
      size: 12345,
      stream: new Readable({ read() {} }),
      destination: '',
      filename: '',
      path: ''
    }

    it('should parse, save, and return import statistics for a valid file', async () => {
      const parsedTransactions: TransactionCreate[] = [
        createMockTransactionCreate({ symbol: 'AAA.L' })
      ]
      const savedTransactions: Transaction[] = [createMockSavedTransaction(1)]

      mockedExcelParserService.parse.mockReturnValue(parsedTransactions)
      mockedTransactionService.addTransactions.mockResolvedValue(
        savedTransactions
      )

      const result = await importController.importFile(mockFile)

      expect(mockedExcelParserService.parse).toHaveBeenCalledWith(
        mockFile.buffer
      )
      expect(mockedTransactionService.addTransactions).toHaveBeenCalledWith(
        parsedTransactions
      )
      expect(result).toEqual({
        imported: 1,
        preview: savedTransactions
      })
    })

    it('should throw a "File not found" error if no file is provided', async () => {
      await expect(
        importController.importFile(undefined as unknown as Express.Multer.File)
      ).rejects.toThrow('File')

      expect(mockedExcelParserService.parse).not.toHaveBeenCalled()
      expect(mockedTransactionService.addTransactions).not.toHaveBeenCalled()
    })

    it('should return a preview of only the first 5 transactions if more are imported', async () => {
      const parsedTransactions: TransactionCreate[] = new Array(7).fill({})
      const savedTransactions: Transaction[] = Array.from(
        { length: 7 },
        (_, i) => createMockSavedTransaction(i + 1)
      )

      mockedExcelParserService.parse.mockReturnValue(parsedTransactions)
      mockedTransactionService.addTransactions.mockResolvedValue(
        savedTransactions
      )

      const result = await importController.importFile(mockFile)

      expect(result.imported).toBe(7)
      expect(result.preview).toHaveLength(5)
      expect(result.preview[0].id).toBe(1)
      expect(result.preview[4].id).toBe(5)
    })

    it('should handle cases where the parser returns an empty array', async () => {
      mockedExcelParserService.parse.mockReturnValue([])
      mockedTransactionService.addTransactions.mockResolvedValue([])

      const result = await importController.importFile(mockFile)

      expect(result.imported).toBe(0)
      expect(result.preview).toEqual([])
      expect(mockedTransactionService.addTransactions).toHaveBeenCalledWith([])
    })

    it('should propagate errors from the parser service', async () => {
      const parserError = new Error('Invalid Excel format')
      mockedExcelParserService.parse.mockImplementation(() => {
        throw parserError
      })

      await expect(importController.importFile(mockFile)).rejects.toThrow(
        'Invalid Excel format'
      )
    })

    it('should propagate errors from the transaction service', async () => {
      const dbError = new Error('Database connection failed')
      mockedExcelParserService.parse.mockReturnValue([
        createMockTransactionCreate({ symbol: 'TSLA.US' })
      ])
      mockedTransactionService.addTransactions.mockRejectedValue(dbError)

      await expect(importController.importFile(mockFile)).rejects.toThrow(
        'Database connection failed'
      )
    })
  })
})
