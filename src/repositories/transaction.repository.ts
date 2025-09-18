import { injectable } from 'tsyringe'
import { AppError } from '../errors/app.error'
import { Transaction } from '../models/transaction.entity'
import { AppDataSource } from '../data-source'
import {
  TransactionCreate,
  TransactionQuery,
  TransactionUpdate
} from '../types/transaction'
import { PaginatedResult } from '../types/pagination'

export interface ITransactionRepository {
  create(transaction: TransactionCreate): Promise<Transaction>
  findAll(query: TransactionQuery): Promise<PaginatedResult<Transaction>>
  findById(id: number): Promise<Transaction | null>
  update(id: number, data: TransactionUpdate): Promise<Transaction>
  delete(id: number): Promise<void>
}

@injectable()
export class TransactionRepository implements ITransactionRepository {
  private repo = AppDataSource.getRepository(Transaction)

  async create(transaction: TransactionCreate): Promise<Transaction> {
    const tx = this.repo.create(transaction)
    const saved = await this.repo.save(tx)
    return saved
  }

  async findAll(
    query: TransactionQuery
  ): Promise<PaginatedResult<Transaction>> {
    const {
      sortBy = 'openTime',
      order = 'DESC',
      limit = 10,
      offset = 0,
      symbol,
      getAll = false
    } = query || {}

    if (getAll) {
      const [transactions, total] = await this.repo.findAndCount({
        order: { [sortBy]: order }
      })

      return { data: transactions, total, limit: total, offset: 0 }
    }

    const [transactions, total] = await this.repo.findAndCount({
      where: symbol ? { symbol } : {},
      order: { [sortBy]: order },
      take: limit,
      skip: offset
    })

    return { data: transactions, total, limit, offset }
  }

  async findById(id: number): Promise<Transaction | null> {
    const transaction = await this.repo.findOneBy({ id })

    if (!transaction) throw AppError.notFound(`Transaction (id: ${id})`)

    return transaction
  }

  async update(id: number, data: TransactionUpdate): Promise<Transaction> {
    const transaction = await this.repo.findOneBy({ id })

    if (!transaction) throw AppError.notFound(`Transaction (id: ${id})`)

    this.repo.merge(transaction, data)

    const saved = await this.repo.save(transaction)
    return saved
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete(id)

    if (result.affected === 0)
      throw AppError.notFound(`Transaction (id: ${id})`)
  }
}
