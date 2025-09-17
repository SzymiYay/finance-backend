import 'reflect-metadata'
import { TransactionService } from './transaction.service'
import { StatisticsService } from './statistics.service'
import { Transaction } from '../models/transaction.entity'
import { roundCurrency, roundVolume } from '../utils/utils'
import { CurrencyType, TransactionType } from '../types/transaction'

jest.mock('./transaction.service')

const createMockTransaction = (
  overrides: Partial<Transaction>
): Transaction => ({
  id: 1,
  accountId: 1,
  xtbId: 100,
  currency: CurrencyType.PLN,
  symbol: 'DEFAULT.US',
  type: TransactionType.BUY,
  volume: 10,
  openTime: new Date(),
  openPrice: 100,
  marketPrice: 110,
  purchaseValue: 1000,
  commission: 0,
  swap: 0,
  rollover: 0,
  grossPL: 100,
  comment: '',
  createdAt: new Date(),
  ...overrides
})

describe('StatisticsService', () => {
  let statisticsService: StatisticsService
  let mockedTransactionService: jest.Mocked<TransactionService>

  beforeEach(() => {
    jest.clearAllMocks()

    mockedTransactionService = {
      getTransactions: jest.fn()
    } as unknown as jest.Mocked<TransactionService>
    statisticsService = new StatisticsService(mockedTransactionService)
  })

  describe('getPortfolioStats', () => {
    it('should calculate statistics correctly for multiple transactions', async () => {
      const mockResult = {
        data: [
          createMockTransaction({
            symbol: 'AAPL.US',
            type: TransactionType.BUY,
            volume: 10,
            openPrice: 150,
            marketPrice: 170,
            grossPL: 200
          }),
          createMockTransaction({
            symbol: 'MSFT.US',
            type: TransactionType.BUY,
            volume: 5,
            openPrice: 300,
            marketPrice: 310,
            grossPL: 50
          }),
          createMockTransaction({
            symbol: 'AAPL.US',
            type: TransactionType.SELL,
            volume: 5,
            openPrice: 160,
            marketPrice: 170,
            grossPL: 50
          })
        ],
        total: 3,
        limit: 10,
        offset: 0
      }
      mockedTransactionService.getTransactions.mockResolvedValue(mockResult)

      const result = await statisticsService.getPortfolioStats()

      expect(result.data).toHaveLength(2)

      const aaplStats = result.data.find((s) => s.symbol === 'AAPL.US')
      const msftStats = result.data.find((s) => s.symbol === 'MSFT.US')

      expect(aaplStats).toBeDefined()
      expect(aaplStats).toEqual({
        currency: CurrencyType.PLN,
        symbol: 'AAPL.US',
        totalVolume: roundVolume(5),
        totalCost: roundCurrency(700),
        avgPrice: roundCurrency(140),
        currentValue: roundCurrency(2550),
        grossPL: roundCurrency(250)
      })

      expect(msftStats).toBeDefined()
      expect(msftStats).toEqual({
        currency: CurrencyType.PLN,
        symbol: 'MSFT.US',
        totalVolume: roundVolume(5),
        totalCost: roundCurrency(1500),
        avgPrice: roundCurrency(300),
        currentValue: roundCurrency(1550),
        grossPL: roundCurrency(50)
      })
    })

    it('should return an empty array if there are no transactions', async () => {
      mockedTransactionService.getTransactions.mockResolvedValue({
        data: [],
        total: 0,
        limit: 10,
        offset: 0
      })

      const result = await statisticsService.getPortfolioStats()

      expect(result.data).toEqual([])
    })

    it('should handle zero total volume correctly', async () => {
      const mockResult = {
        data: [
          createMockTransaction({
            symbol: 'ZERO.US',
            type: TransactionType.BUY,
            volume: 10,
            openPrice: 100
          }),
          createMockTransaction({
            symbol: 'ZERO.US',
            type: TransactionType.SELL,
            volume: 10,
            openPrice: 110
          })
        ],
        total: 2,
        limit: 10,
        offset: 0
      }
      mockedTransactionService.getTransactions.mockResolvedValue(mockResult)

      const result = await statisticsService.getPortfolioStats()
      const zeroStats = result.data.find((s) => s.symbol === 'ZERO.US')

      expect(zeroStats).toBeDefined()
      expect(zeroStats?.totalVolume).toBe(0)
      expect(zeroStats?.avgPrice).toBe(0)
    })
  })

  describe('getPortfolioTimeline', () => {
    it('should create a correctly sorted timeline with cumulative values', async () => {
      const mockResult = {
        data: [
          createMockTransaction({
            symbol: 'AAPL.US',
            type: TransactionType.BUY,
            volume: 10,
            openPrice: 150,
            openTime: new Date('2025-02-15T10:00:00Z')
          }),
          createMockTransaction({
            symbol: 'AAPL.US',
            type: TransactionType.SELL,
            volume: 5,
            openPrice: 160,
            openTime: new Date('2025-03-20T10:00:00Z')
          }),
          createMockTransaction({
            symbol: 'MSFT.US',
            type: TransactionType.BUY,
            volume: 10,
            openPrice: 300,
            openTime: new Date('2025-01-10T10:00:00Z')
          })
        ],
        total: 3,
        limit: 10,
        offset: 0
      }
      mockedTransactionService.getTransactions.mockResolvedValue(mockResult)

      const result = await statisticsService.getPortfolioTimeline()

      expect(result).toHaveLength(3)
      expect(result).toEqual([
        { date: '2025-01-10', value: roundCurrency(3000) },
        { date: '2025-02-15', value: roundCurrency(4500) },
        { date: '2025-03-20', value: roundCurrency(3700) }
      ])
    })

    it('should return an empty array if there are no transactions', async () => {
      const mockResult = {
        data: [],
        total: 0,
        limit: 10,
        offset: 0
      }

      mockedTransactionService.getTransactions.mockResolvedValue(mockResult)

      const result = await statisticsService.getPortfolioTimeline()

      expect(result).toEqual([])
    })
  })
})
