import 'reflect-metadata'
import { supabase } from '../clients/supabase.client'
import { ServiceStatus, SystemHealth } from '../types/health'
import { DateService } from './date.service'
import { HealthService } from './health.service'

jest.mock('../clients/supabase.client', () => ({
  supabase: {
    from: jest.fn()
  }
}))
jest.mock('./date.service')

const mockSupabase = supabase as jest.Mocked<typeof supabase>
const mockDateService = DateService as jest.Mocked<typeof DateService>

describe('HealthService', () => {
  let healthService: HealthService

  beforeEach(() => {
    jest.clearAllMocks()
    healthService = new HealthService()
  })

  describe('checkDatabase', () => {
    it('should return HEALTHY status when database query is successful', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ error: null })
      }
      ;(mockSupabase.from as jest.Mock).mockImplementation(
        () => mockQueryBuilder
      )

      const result = await healthService.checkDatabase()

      expect(result).toEqual({ status: ServiceStatus.HEALTHY })
    })

    it('should return HEALTHY status when database query is successful', async () => {
      const dbError = { message: 'Connection refused' }
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ error: dbError })
      }
      ;(mockSupabase.from as jest.Mock).mockImplementation(
        () => mockQueryBuilder
      )

      const result = await healthService.checkDatabase()

      expect(result).toEqual({
        status: ServiceStatus.UNHEALTHY,
        message: 'Connection refused'
      })
    })

    it('should return UNHEALTHY status when database query throws an exception', async () => {
      const networkError = new Error('Network error')
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(networkError)
      }
      ;(mockSupabase.from as jest.Mock).mockImplementation(
        () => mockQueryBuilder
      )

      const result = await healthService.checkDatabase()

      expect(result).toEqual({
        status: ServiceStatus.UNHEALTHY,
        message: 'Network error'
      })
    })
  })

  describe('getStatus', () => {
    it('should return full system health status with database HEALTHY', async () => {
      const mockTimestamp = '06.09.2025, 18:00:00'
      mockDateService.formatCustom.mockReturnValue(mockTimestamp)

      const checkDatabaseSpy = jest
        .spyOn(healthService, 'checkDatabase')
        .mockResolvedValue({ status: ServiceStatus.HEALTHY })

      const result = await healthService.getStatus()

      const expected: SystemHealth = {
        server: ServiceStatus.HEALTHY,
        database: ServiceStatus.HEALTHY,
        message: undefined,
        timestamp: mockTimestamp
      }
      expect(result).toEqual(expected)
      expect(checkDatabaseSpy).toHaveBeenCalledTimes(1)
    })

    it('should return full system health status with database UNHEALTHY', async () => {
      const mockTimestamp = '06.09.2025, 18:00:00'
      mockDateService.formatCustom.mockReturnValue(mockTimestamp)

      const checkDatabaseSpy = jest
        .spyOn(healthService, 'checkDatabase')
        .mockResolvedValue({
          status: ServiceStatus.UNHEALTHY,
          message: 'DB down'
        })

      const result = await healthService.getStatus()

      const expected: SystemHealth = {
        server: ServiceStatus.HEALTHY,
        database: ServiceStatus.UNHEALTHY,
        message: 'DB down',
        timestamp: mockTimestamp
      }
      expect(result).toEqual(expected)
      expect(checkDatabaseSpy).toHaveBeenCalledTimes(1)
    })
  })
})
