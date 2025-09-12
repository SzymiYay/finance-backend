import 'reflect-metadata'
import { Transaction } from '../models/transaction.entity'
import { ITransactionRepository } from '../repositories/transaction.repository'
import {
  CurrencyType,
  TransactionCreate,
  TransactionType,
  TransactionUpdate
} from '../types/transaction'
import { TransactionService } from './transaction.service'

const createMockTransaction = (
  overrides: Partial<Transaction> = {}
): Transaction => ({
  id: 1,
  accountId: 1,
  xtbId: 100,
  currency: CurrencyType.PLN,
  symbol: 'AAPL.US',
  type: TransactionType.BUY,
  volume: 10,
  openTime: new Date(),
  openPrice: 150,
  marketPrice: 160,
  purchaseValue: 1500,
  commission: -5,
  swap: 0,
  rollover: 0,
  grossPL: 95,
  comment: 'Test transaction',
  createdAt: new Date(),
  ...overrides
})

describe('TransactionSercie', () => {
  let transactionService: TransactionService
  let mockTransactionRepo: jest.Mocked<ITransactionRepository>

  beforeEach(() => {
    mockTransactionRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    transactionService = new TransactionService(mockTransactionRepo)
  })

  describe('getTransactions', () => {
    it('should call repository.findAll and return the result', async () => {
      const mockResult = {
        data: [
          createMockTransaction({ id: 1 }),
          createMockTransaction({ id: 2, symbol: 'MSFT.US' })
        ],
        total: 2,
        limit: 10,
        offset: 0
      }
      mockTransactionRepo.findAll.mockResolvedValue(mockResult)

      const result = await transactionService.getTransactions()

      expect(result).toEqual(mockResult)
      expect(mockTransactionRepo.findAll).toHaveBeenCalledTimes(1)
    })

    it('should return default pagination when no params are passed', async () => {
      const mockResult = {
        data: [
          createMockTransaction({ id: 1 }),
          createMockTransaction({ id: 2, symbol: 'MSFT.US' })
        ],
        total: 2,
        limit: 10,
        offset: 0
      }
      mockTransactionRepo.findAll.mockResolvedValue(mockResult)

      const result = await transactionService.getTransactions()

      expect(result).toEqual(mockResult)
      expect(mockTransactionRepo.findAll).toHaveBeenCalledWith({})
    })

    it('should pass pagination and sorting options to repository', async () => {
      const mockResult = {
        data: [
          createMockTransaction({ id: 1 }),
          createMockTransaction({ id: 2, symbol: 'MSFT.US' })
        ],
        total: 2,
        limit: 10,
        offset: 0
      }
      const query = {
        sortBy: 'symbol',
        order: 'ASC',
        limit: 5,
        offset: 10
      } as const
      mockTransactionRepo.findAll.mockResolvedValue(mockResult)

      const result = await transactionService.getTransactions(query)

      expect(result).toEqual(mockResult)
      expect(mockTransactionRepo.findAll).toHaveBeenCalledWith(query)
    })
  })

  describe('getTransaction', () => {
    it('should call repository.findAll and return the result', async () => {
      const mockTransaction = createMockTransaction({ id: 1 })

      mockTransactionRepo.findById.mockResolvedValue(mockTransaction)

      const result = await transactionService.getTransaction(1)

      expect(result).toEqual(mockTransaction)
      expect(mockTransactionRepo.findById).toHaveBeenCalledWith(1)
    })
  })

  describe('addTransaction', () => {
    it('should call repository.findAll and return the result', async () => {
      const transactionData: TransactionCreate = {
        accountId: 1,
        currency: CurrencyType.PLN,
        symbol: 'GOOGL.US',
        type: TransactionType.BUY,
        volume: 10,
        openPrice: 200,
        openTime: new Date(),
        marketPrice: 200,
        purchaseValue: 2000,
        xtbId: 123
      }
      const savedTransaction = createMockTransaction({
        id: 1,
        ...transactionData
      })
      mockTransactionRepo.create.mockResolvedValue(savedTransaction)

      const result = await transactionService.addTransaction(transactionData)

      expect(result).toEqual(savedTransaction)
      expect(mockTransactionRepo.create).toHaveBeenCalledWith(transactionData)
    })
  })

  describe('addTransactions', () => {
    it('should call repository.findAll and return the result', async () => {
      const transactionsData: TransactionCreate[] = [
        {
          accountId: 1,
          xtbId: 1,
          currency: CurrencyType.PLN,
          symbol: 'A',
          type: TransactionType.BUY,
          volume: 1,
          openTime: new Date(),
          openPrice: 100,
          marketPrice: 100,
          purchaseValue: 100
        },
        {
          accountId: 2,
          xtbId: 2,
          currency: CurrencyType.PLN,
          symbol: 'B',
          type: TransactionType.SELL,
          volume: 2,
          openTime: new Date(),
          openPrice: 200,
          marketPrice: 200,
          purchaseValue: 400
        }
      ]
      const savedTx1 = createMockTransaction({ id: 1, symbol: 'A' })
      const savedTx2 = createMockTransaction({ id: 2, symbol: 'B' })

      mockTransactionRepo.create
        .mockResolvedValueOnce(savedTx1)
        .mockResolvedValueOnce(savedTx2)

      const result = await transactionService.addTransactions(transactionsData)

      expect(mockTransactionRepo.create).toHaveBeenCalledTimes(2)
      expect(mockTransactionRepo.create).toHaveBeenCalledWith(
        transactionsData[0]
      )
      expect(mockTransactionRepo.create).toHaveBeenCalledWith(
        transactionsData[1]
      )
      expect(result).toEqual([savedTx1, savedTx2])
    })
  })

  describe('updateTransaction', () => {
    it('should call repository.update with correct id and data, and return the updated transaction', async () => {
      const updateData: TransactionUpdate = { marketPrice: 170, grossPL: 150 }
      const updatedTransaction = createMockTransaction({
        id: 7,
        ...updateData
      })
      mockTransactionRepo.update.mockResolvedValue(updatedTransaction)

      const result = await transactionService.updateTransaction(7, updateData)

      expect(mockTransactionRepo.update).toHaveBeenCalledWith(7, updateData)
      expect(result).toEqual(updatedTransaction)
    })
  })

  describe('deleteTransaction', () => {
    it('should call repository.delete with the correct id', async () => {
      mockTransactionRepo.delete.mockResolvedValue(undefined)

      await transactionService.deleteTransaction(9)

      expect(mockTransactionRepo.delete).toHaveBeenCalledWith(9)
      expect(mockTransactionRepo.delete).toHaveBeenCalledTimes(1)
    })
  })
})
