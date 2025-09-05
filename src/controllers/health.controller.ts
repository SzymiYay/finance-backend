import { Get, Route, Tags, Response, Example, SuccessResponse } from 'tsoa'
import { inject, injectable } from 'tsyringe'
import { HealthService } from '../services/health.service'
import { AppError } from '../errors/app.error'
import { ServiceStatus, SystemHealth } from '../types/health'

@Route('health')
@Tags('Health')
@injectable()
export class HealthController {
  constructor(@inject(HealthService) private healthService: HealthService) {}

  /**
   * Sprawdza status działania aplikacji i jej zależności.
   *
   * Zwraca informacje o:
   * - statusie aplikacji
   * - statusie połączenia z bazą danych,
   * - znaczniku czasu.
   */
  @Get('/')
  @SuccessResponse('200', 'OK')
  @Response<AppError>(500, 'Internal server error')
  @Example<SystemHealth>({
    server: ServiceStatus.HEALTHY,
    database: ServiceStatus.HEALTHY,
    timestamp: '2025-09-02T00:45:00.000Z'
  })
  public async getStatus(): Promise<SystemHealth> {
    return this.healthService.getStatus()
  }
}
