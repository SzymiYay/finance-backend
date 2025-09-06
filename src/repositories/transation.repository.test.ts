import 'reflect-metadata'
import { AppDataSource } from '../data-source'
import { AppError } from '../errors/app.error'
import { Transaction } from '../models/transaction.entity'
import {
  TransactionCreate,
  TransactionType,
  TransactionUpdate
} from '../types/transaction'
import { TransactionRepository } from './transaction.repository'

jest.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}))
jest.mock('../errors/app.error')

const createMockTransaction = (
  overrides: Partial<Transaction> = {}
): Transaction => ({
  id: 1,
  xtbId: 12345678,
  symbol: 'TSLA.US',
  type: TransactionType.BUY,
  volume: 10,
  openTime: new Date('2025-01-15T10:00:00Z'),
  openPrice: 200.0,
  marketPrice: 210.0,
  purchaseValue: 2000.0,
  commission: -5.0,
  swap: 0,
  rollover: 0,
  grossPL: 100.0,
  comment: 'Test buy',
  createdAt: new Date('2025-01-15T10:00:05Z'),
  ...overrides
})

describe('TransactionRepository', () => {
  let transactionRepository: TransactionRepository
  let mockRepository: Record<string, jest.Mock>

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn()
    }
    ;(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository)
    ;(AppError.notFound as jest.Mock).mockImplementation((message: string) => {
      const error = new Error(message)
      error.name = 'AppError.NotFound'
      return error
    })
    transactionRepository = new TransactionRepository()
  })

  describe('create', () => {
    it('should create and save a new transaction using provided data', async () => {
      const transactionData: TransactionCreate = {
        xtbId: 98765,
        symbol: 'GOOGL.US',
        type: TransactionType.BUY,
        volume: 5,
        openTime: new Date(),
        openPrice: 150,
        marketPrice: 150,
        purchaseValue: 750
      }
      const newTransactionEntity = { ...transactionData } as Transaction
      const savedTransaction = createMockTransaction({
        ...transactionData,
        id: 2
      })
      mockRepository.create.mockReturnValue(newTransactionEntity)
      mockRepository.save.mockResolvedValue(savedTransaction)

      const result = await transactionRepository.create(transactionData)

      expect(mockRepository.create).toHaveBeenCalledWith(transactionData)
      expect(mockRepository.save).toHaveBeenCalledWith(newTransactionEntity)
      expect(result).toEqual(savedTransaction)
      expect(result.id).toBe(2)
      expect(result.symbol).toBe('GOOGL.US')
    })
  })

  describe('findAll', () => {
    it('should return an array of transactions ordered by openTime DESC', async () => {
      const transactions = [
        createMockTransaction({
          id: 2,
          openTime: new Date('2025-02-01T12:00:00Z')
        }),
        createMockTransaction({
          id: 1,
          openTime: new Date('2025-01-01T12:00:00Z')
        })
      ]
      mockRepository.find.mockResolvedValue(transactions)

      const result = await transactionRepository.findAll()

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { openTime: 'DESC' }
      })
      expect(result).toEqual(transactions)
      expect(result.length).toBe(2)
    })

    it('should throw AppError.notFound if no transactions are found', async () => {
      mockRepository.find.mockResolvedValue([])

      await expect(transactionRepository.findAll()).rejects.toThrow()

      expect(AppError.notFound).toHaveBeenCalledWith('Transactions')
    })
  })

  describe('findById', () => {
    it('should return a single transaction if found', async () => {
      const transaction = createMockTransaction({ id: 5 })
      mockRepository.findOneBy.mockResolvedValue(transaction)

      const result = await transactionRepository.findById(5)

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 5 })
      expect(result).toEqual(transaction)
    })

    it('should throw AppError.notFound if transaction is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null)

      await expect(transactionRepository.findById(99)).rejects.toThrow()

      expect(AppError.notFound).toHaveBeenCalledWith('Transaction (id: 99)')
    })
  })

  describe('update', () => {
    it('should update and return the transaction', async () => {
      const existingTransaction = createMockTransaction({
        id: 10,
        grossPL: 100
      })
      const updateData: TransactionUpdate = {
        marketPrice: 220.0,
        grossPL: 200.0
      }
      const updatedTransaction = { ...existingTransaction, ...updateData }

      mockRepository.findOneBy.mockResolvedValue(existingTransaction)
      mockRepository.save.mockResolvedValue(updatedTransaction)

      const result = await transactionRepository.update(10, updateData)

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 10 })
      expect(mockRepository.merge).toHaveBeenCalledWith(
        existingTransaction,
        updateData
      )
      expect(mockRepository.save).toHaveBeenCalledWith(existingTransaction)
      expect(result).toEqual(updatedTransaction)
      expect(result.grossPL).toBe(200.0)
    })

    it('should throw AppError.notFound if transaction to update is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null)
      const updateData: TransactionUpdate = { marketPrice: 300 }

      await expect(
        transactionRepository.update(99, updateData)
      ).rejects.toThrow()
      expect(AppError.notFound).toHaveBeenCalledWith('Transaction (id: 99)')
    })
  })

  describe('delete', () => {
    it('should delete a transaction successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 })

      await expect(transactionRepository.delete(1)).resolves.toBeUndefined()

      expect(mockRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should throw AppError.notFound if transaction to delete is not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 })

      await expect(transactionRepository.delete(99)).rejects.toThrow()

      expect(AppError.notFound).toHaveBeenCalledWith('Transaction (id: 99)')
    })
  })
})
