import { inject, injectable } from 'tsyringe'
import { Statistics, StatisticsQuery, TimelinePoint } from '../types/statistics'
import { roundCurrency, roundVolume } from '../utils/utils'
import { TransactionService } from './transaction.service'
import { PaginatedResult } from '../types/pagination'
import { Transaction } from '../models/transaction.entity'

@injectable()
export class StatisticsService {
  constructor(
    @inject(TransactionService) private transactionService: TransactionService
  ) {}

  async getPortfolioStats(
    query?: StatisticsQuery
  ): Promise<PaginatedResult<Statistics>> {
    const {
      sortBy = 'symbol',
      order = 'DESC',
      limit = 10,
      offset = 0
    } = query || {}
    const { data: transactions } =
      await this.transactionService.getTransactions({
        getAll: true,
        sortBy: 'openTime',
        order: 'ASC'
      })

    let stats = this.calculateStatistics(transactions)
    stats = this.sortStatistics(stats, sortBy, order)

    const paginated = this.paginate(stats, limit, offset)

    return {
      data: paginated,
      total: stats.length,
      limit,
      offset
    }
  }

  async getPortfolioTimeline(): Promise<TimelinePoint[]> {
    const { data: transactions } =
      await this.transactionService.getTransactions()
    return this.buildTimeline(transactions)
  }

  private calculateStatistics(transactions: Transaction[]): Statistics[] {
    const groupedBySymbol: Record<string, Statistics> = {}

    for (const t of transactions) {
      const g = (groupedBySymbol[t.symbol] ??= {
        symbol: t.symbol,
        currency: t.currency,
        totalVolume: 0,
        totalCost: 0,
        currentValue: 0,
        avgPrice: 0,
        grossPL: 0
      })

      const volumeDelta = t.type === 'BUY' ? +t.volume : -t.volume
      const costDelta =
        t.type === 'BUY' ? +t.volume * +t.openPrice : -t.volume * +t.openPrice

      g.totalVolume += volumeDelta
      g.totalCost += costDelta
      g.currentValue += +t.volume * +t.marketPrice
      g.grossPL += +(t.grossPL ?? 0)

      g.avgPrice =
        g.totalVolume > 0 ? roundCurrency(g.totalCost / g.totalVolume) : 0
      g.totalVolume = roundVolume(g.totalVolume)
      g.totalCost = roundCurrency(g.totalCost)
      g.currentValue = roundCurrency(g.currentValue)
      g.avgPrice = roundCurrency(g.avgPrice)
      g.grossPL = roundCurrency(g.grossPL)
    }

    return Object.values(groupedBySymbol)
  }

  private sortStatistics(
    data: Statistics[],
    sortBy: keyof Statistics,
    order: 'ASC' | 'DESC'
  ): Statistics[] {
    return data.sort((a, b) => {
      const valueA = a[sortBy]
      const valueB = b[sortBy]
      if (typeof valueA === 'number' && typeof valueB === 'number')
        return order === 'ASC' ? valueA - valueB : valueB - valueA
      if (typeof valueA === 'string' && typeof valueB === 'string')
        return order === 'ASC'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA)
      return 0
    })
  }

  private paginate<T>(items: T[], limit: number, offset: number): T[] {
    return items.slice(offset, offset + limit)
  }

  private buildTimeline(transactions: Transaction[]): TimelinePoint[] {
    const sortedTransactions = [...transactions].sort(
      (a, b) => +new Date(a.openTime) - +new Date(b.openTime)
    )
    let cumulativeValue = 0
    return sortedTransactions.map((t) => {
      cumulativeValue += (t.type === 'BUY' ? 1 : -1) * +t.volume * +t.openPrice
      return {
        date: new Date(t.openTime).toISOString().split('T')[0],
        value: roundCurrency(cumulativeValue)
      }
    })
  }
}
