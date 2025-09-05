import { inject, injectable } from 'tsyringe'
import { Transaction } from '../models/transaction.entity'
import {
  ITransactionRepository,
  TransactionRepository
} from '../repositories/transaction.repository'
import { TransactionCreate, TransactionUpdate } from '../types/transaction'

export interface ITransactionService {
  addTransaction(transaction: Transaction): Promise<Transaction>
  addTransactions(transactions: Transaction[]): Promise<Transaction[]>
  getTransaction(id: number): Promise<Transaction | null>
  getTransactions(): Promise<Transaction[]>
  updateTransaction(id: number, data: TransactionUpdate): Promise<Transaction>
  deleteTransaction(id: number): Promise<void>
}

@injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @inject(TransactionRepository)
    private transactionRepo: ITransactionRepository
  ) {}

  async addTransaction(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepo.create(transaction)
  }

  async addTransactions(transactions: TransactionCreate[]): Promise<Transaction[]> {
    const savedTransactions: Transaction[] = []
    for (const transaction of transactions) {
      const createdTransaction = await this.transactionRepo.create(transaction)
      savedTransactions.push(createdTransaction)
    }
    return savedTransactions
  }

  async getTransaction(id: number): Promise<Transaction | null> {
    return this.transactionRepo.findById(id)
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.transactionRepo.findAll()
  }

  async updateTransaction(
    id: number,
    data: TransactionUpdate
  ): Promise<Transaction> {
    return this.transactionRepo.update(id, data)
  }

  async deleteTransaction(id: number): Promise<void> {
    return this.transactionRepo.delete(id)
  }
}
