import { Transaction } from '../models/transaction.entity'

export type TransactionCreate = Omit<Transaction, 'id' | 'createdAt'>
export type TransactionUpdate = Partial<TransactionCreate>
