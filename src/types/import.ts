import { Transaction } from "../models/transaction.entity"

export interface ImportResponse {
  imported: number
  preview: Transaction[]
}
