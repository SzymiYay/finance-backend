import { injectable } from 'tsyringe'
import { AppError } from '../errors/app.error'
import { Transaction } from '../models/transaction.model'
import { supabase } from '../services/supabase'
import { mapTransactionToDb } from '../utils/utils'

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>
  findAll(): Promise<Transaction[]>
  findById(id: number): Promise<Transaction | null>
  delete(id: number): Promise<void>
}

@injectable()
export class TransactionRepository implements ITransactionRepository {
  async create(transaction: Transaction): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .upsert([mapTransactionToDb(transaction)], { onConflict: 'xtb_id' })
      .select()
      .single()

    if (error) throw error

    return data as Transaction
  }

  async findAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('open_time', { ascending: false })

    if (error) throw error
    if (!data) throw AppError.notFound('Transactions')

    return data as Transaction[]
  }

  async findById(id: number): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    if (!data) throw AppError.notFound('Transaction (id: ' + id + ')')

    return data as Transaction | null
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from('transactions').delete().eq('id', id)

    if (error) throw error
  }
}
