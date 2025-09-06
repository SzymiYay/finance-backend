import 'reflect-metadata'
import { HealthService } from '../services/health.service'
import { ServiceStatus, SystemHealth } from '../types/health'
import { HealthController } from './health.controller'

jest.mock('../services/health.service')

describe('HealthController', () => {
  let healthController: HealthController
  let mockHealthService: jest.Mocked<HealthService>

  beforeEach(() => {
    mockHealthService = new HealthService() as jest.Mocked<HealthService>
    healthController = new HealthController(mockHealthService)
  })

  describe('getStatus', () => {
    it('should return the system health status from the HealtService', async () => {
      const healthyStatus: SystemHealth = {
        server: ServiceStatus.HEALTHY,
        database: ServiceStatus.HEALTHY,
        timestamp: '2025-09-06T18:00:00.000Z'
      }
      mockHealthService.getStatus.mockResolvedValue(healthyStatus)

      const result = await healthController.getStatus()

      expect(mockHealthService.getStatus).toHaveBeenCalledTimes(1)
      expect(result).toEqual(healthyStatus)
    })

    it('should return an unhealthy status if the service reports it', async () => {
      const unhealthyStatus: SystemHealth = {
        server: ServiceStatus.HEALTHY,
        database: ServiceStatus.UNHEALTHY,
        message: 'Database connection failed',
        timestamp: '2025-09-06T18:01:00.000Z'
      }
      mockHealthService.getStatus.mockResolvedValue(unhealthyStatus)

      const result = await healthController.getStatus()

      expect(mockHealthService.getStatus).toHaveBeenCalledTimes(1)
      expect(result).toEqual(unhealthyStatus)
    })

    it('should propagate errors if the HealthService throws an exception', async () => {
      const serviceError = new Error('Internal service failure')
      mockHealthService.getStatus.mockRejectedValue(serviceError)

      await expect(healthController.getStatus()).rejects.toThrow(
        'Internal service failure'
      )

      expect(mockHealthService.getStatus).toHaveBeenCalledTimes(1)
    })
  })
})
