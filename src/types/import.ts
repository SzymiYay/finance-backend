import { Transaction } from '../models/transaction.model'

export interface ImportResponse {
  imported: number
  preview: Transaction[]
}
