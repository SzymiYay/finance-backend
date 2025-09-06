import 'reflect-metadata'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from '../services/statistics.service'
import { Statistics, TimelinePoint } from '../types/statistics'

jest.mock('../services/statistics.service')

describe('StatisticsController', () => {
  let statisticsController: StatisticsController
  let mockedStatisticsService: jest.Mocked<StatisticsService>

  beforeEach(() => {
    mockedStatisticsService = {
      getPortfolioStats: jest.fn(),
      getPortfolioTimeline: jest.fn()
    } as unknown as jest.Mocked<StatisticsService>
    statisticsController = new StatisticsController(mockedStatisticsService)
  })

  describe('getStats', () => {
    it('should call getPortfolioStats on the service and return the result', async () => {
      const mockStats: Statistics[] = [
        {
          symbol: 'AAPL',
          totalVolume: 10,
          totalCost: 1500,
          currentValue: 1700,
          avgPrice: 150,
          grossPL: 200
        }
      ]
      mockedStatisticsService.getPortfolioStats.mockResolvedValue(mockStats)

      const result = await statisticsController.getStats()

      expect(mockedStatisticsService.getPortfolioStats).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockStats)
    })

    it('should propagate errors if the service throws an exception', async () => {
      const serviceError = new Error('Failed to calculate stats')
      mockedStatisticsService.getPortfolioStats.mockRejectedValue(serviceError)

      await expect(statisticsController.getStats()).rejects.toThrow(
        'Failed to calculate stats'
      )
    })
  })

  describe('getTimeline', () => {
    it('should call getPortfolioTimeline on the service and return the result', async () => {
      const mockTimeline: TimelinePoint[] = [
        { date: '2025-01-01', value: 1000 },
        { date: '2025-01-02', value: 1200 }
      ]
      mockedStatisticsService.getPortfolioTimeline.mockResolvedValue(
        mockTimeline
      )

      const result = await statisticsController.getTimeline()

      expect(
        mockedStatisticsService.getPortfolioTimeline
      ).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockTimeline)
    })

    it('should propagate errors if the service throws an exception', async () => {
      const serviceError = new Error('Failed to generate timeline')
      mockedStatisticsService.getPortfolioTimeline.mockRejectedValue(
        serviceError
      )

      await expect(statisticsController.getTimeline()).rejects.toThrow(
        'Failed to generate timeline'
      )
    })
  })
})
