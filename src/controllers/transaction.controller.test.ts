import 'reflect-metadata'
import { TransactionController } from './transaction.controller'
import { TransactionService } from '../services/transaction.service'
import { AppError } from '../errors/app.error'
import {
  TransactionCreate,
  TransactionType,
  TransactionUpdate
} from '../types/transaction'
import { Transaction } from '../models/transaction.entity'

jest.mock('../services/transaction.service')
jest.mock('../errors/app.error')

const createMockTransaction = (id: number): Transaction => ({
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

describe('TransactionController', () => {
  let transactionController: TransactionController
  let mockedTransactionService: jest.Mocked<TransactionService>
  let setStatusSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    mockedTransactionService = new TransactionService(
      null as never
    ) as jest.Mocked<TransactionService>
    ;(AppError.notFound as jest.Mock).mockImplementation((message: string) => {
      return new Error(message)
    })

    transactionController = new TransactionController(mockedTransactionService)
    setStatusSpy = jest.spyOn(transactionController, 'setStatus')
  })

  describe('create', () => {
    it('should create a transaction, set status to 201, and return the created transaction', async () => {
      const transactionData: TransactionCreate = {
        symbol: 'NEW.US',
        type: TransactionType.BUY,
        volume: 50,
        openPrice: 20,
        openTime: new Date(),
        marketPrice: 20,
        purchaseValue: 1000,
        xtbId: 999
      }
      const savedTransaction = createMockTransaction(1)
      mockedTransactionService.addTransaction.mockResolvedValue(
        savedTransaction
      )

      const result = await transactionController.create(transactionData)

      expect(setStatusSpy).toHaveBeenCalledWith(201)
      expect(mockedTransactionService.addTransaction).toHaveBeenCalledWith(
        transactionData
      )
      expect(result).toEqual(savedTransaction)
    })
  })

  describe('getAll', () => {
    it('should return an array of all transactions', async () => {
      const transactions = [createMockTransaction(1), createMockTransaction(2)]
      mockedTransactionService.getTransactions.mockResolvedValue(transactions)

      const result = await transactionController.getAll()

      expect(mockedTransactionService.getTransactions).toHaveBeenCalledTimes(1)
      expect(result).toEqual(transactions)
    })
  })

  describe('getById', () => {
    it('should return a transaction when found', async () => {
      const transaction = createMockTransaction(5)
      mockedTransactionService.getTransaction.mockResolvedValue(transaction)

      const result = await transactionController.getById(5)

      expect(mockedTransactionService.getTransaction).toHaveBeenCalledWith(5)
      expect(result).toEqual(transaction)
      expect(setStatusSpy).not.toHaveBeenCalled()
    })

    it('should throw AppError and set status to 404 if transaction is not found', async () => {
      mockedTransactionService.getTransaction.mockResolvedValue(null)

      await expect(transactionController.getById(99)).rejects.toThrow(
        'Transaction (id: 99)'
      )

      expect(setStatusSpy).toHaveBeenCalledWith(404)
      expect(AppError.notFound).toHaveBeenCalledWith('Transaction (id: 99)')
    })
  })

  describe('update', () => {
    it('should update a transaction and return the updated entity', async () => {
      const updateData: TransactionUpdate = { marketPrice: 120, grossPL: 200 }
      const updatedTransaction = createMockTransaction(7)
      Object.assign(updatedTransaction, updateData)

      mockedTransactionService.updateTransaction.mockResolvedValue(
        updatedTransaction
      )

      const result = await transactionController.update(7, updateData)

      expect(mockedTransactionService.updateTransaction).toHaveBeenCalledWith(
        7,
        updateData
      )
      expect(result).toEqual(updatedTransaction)
    })
  })

  describe('delete', () => {
    it('should delete a transaction and set status to 204', async () => {
      mockedTransactionService.deleteTransaction.mockResolvedValue(undefined)

      await transactionController.delete(8)

      expect(mockedTransactionService.deleteTransaction).toHaveBeenCalledWith(8)
      expect(setStatusSpy).toHaveBeenCalledWith(204)
    })
  })
})
