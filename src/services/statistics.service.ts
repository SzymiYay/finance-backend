import { inject, injectable } from 'tsyringe'
import { Statistics, TimelinePoint } from '../types/statistics'
import { roundCurrency, roundVolume } from '../utils/utils'
import { TransactionService } from './transaction.service'

@injectable()
export class StatisticsService {
  constructor(
    @inject(TransactionService) private transactionService: TransactionService
  ) {}

  async getPortfolioStats(): Promise<Statistics[]> {
    const { data: transactions } =
      await this.transactionService.getTransactions()
    const groupedBySymbol: Record<string, Statistics> = {}

    for (const transaction of transactions) {
      if (!groupedBySymbol[transaction.symbol]) {
        groupedBySymbol[transaction.symbol] = {
          currency: transaction.currency,
          symbol: transaction.symbol,
          totalVolume: 0,
          totalCost: 0,
          currentValue: 0,
          avgPrice: 0,
          grossPL: 0
        }
      }

      if (transaction.type === 'BUY') {
        groupedBySymbol[transaction.symbol].totalVolume += Number(
          transaction.volume
        )
        groupedBySymbol[transaction.symbol].totalCost +=
          Number(transaction.volume) * Number(transaction.openPrice)
      } else if (transaction.type === 'SELL') {
        groupedBySymbol[transaction.symbol].totalVolume -= Number(
          transaction.volume
        )
        groupedBySymbol[transaction.symbol].totalCost -=
          Number(transaction.volume) * Number(transaction.openPrice)
      }

      groupedBySymbol[transaction.symbol].currentValue +=
        Number(transaction.volume) * Number(transaction.marketPrice)
      groupedBySymbol[transaction.symbol].grossPL += Number(transaction.grossPL)
    }

    for (const symbol in groupedBySymbol) {
      const g = groupedBySymbol[symbol]
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

  async getPortfolioTimeline(): Promise<TimelinePoint[]> {
    const { data: transactions } =
      await this.transactionService.getTransactions()
    const transactionsSortedByDate = [...transactions].sort(
      (a, b) => new Date(a.openTime).getTime() - new Date(b.openTime).getTime()
    )
    const timeline: TimelinePoint[] = []
    let cumulativeValue = 0

    for (const transaction of transactionsSortedByDate) {
      const date = new Date(transaction.openTime).toISOString().split('T')[0]

      if (transaction.type === 'BUY') {
        cumulativeValue +=
          Number(transaction.volume) * Number(transaction.openPrice)
      } else if (transaction.type === 'SELL') {
        cumulativeValue -=
          Number(transaction.volume) * Number(transaction.openPrice)
      }

      timeline.push({
        date,
        value: roundCurrency(cumulativeValue)
      })
    }

    return timeline
  }
}
