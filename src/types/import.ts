import { TransactionCreate } from "./transaction"

export interface ImportResponse {
  imported: number
  preview: TransactionCreate[]
}
