import { inject, injectable } from 'tsyringe'
import { Transaction } from '../models/transaction.model'
import {
  ITransactionRepository,
  TransactionRepository
} from '../repositories/transaction.repository'

export interface ITransactionService {
  addTransaction(transaction: Transaction): Promise<Transaction>
  addTransactions(transactions: Transaction[]): Promise<Transaction[]>
  getTransactions(): Promise<Transaction[]>
  getTransaction(id: number): Promise<Transaction | null>
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

  async addTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    const savedTransactions: Transaction[] = []
    for (const transaction of transactions) {
      const createdTransaction = await this.transactionRepo.create(transaction)
      savedTransactions.push(createdTransaction)
    }
    return savedTransactions
  }
  async getTransactions(): Promise<Transaction[]> {
    return this.transactionRepo.findAll()
  }

  async getTransaction(id: number): Promise<Transaction | null> {
    return this.transactionRepo.findById(id)
  }

  async deleteTransaction(id: number): Promise<void> {
    return this.transactionRepo.delete(id)
  }
}
