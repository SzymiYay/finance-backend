import { StatisticsService } from '../services/statistics.service'
import { Get, Route, Tags, Response, Example, SuccessResponse } from 'tsoa'
import { inject, injectable } from 'tsyringe'
import type { Statistics, TimelinePoint } from '../types/statistics'
import { AppError } from '../errors/app.error'

@Route('statistics')
@Tags('Statistics')
@injectable()
export class StatisticsController {
  constructor(
    @inject(StatisticsService) private statisticsService: StatisticsService
  ) {}

  /**
   * Pobiera aktualne statystyki portfela.
   *
   * Zwraca listę pozycji w portfelu wraz z:
   * - symbolem,
   * - łącznym wolumenem,
   * - średnią ceną zakupu,
   * - bieżącą wartością,
   * - zyskiem/stratą brutto.
   */
  @Get('/')
  @SuccessResponse('200', 'OK')
  @Response<AppError>(500, 'Internal server error')
  @Example<Statistics[]>([
    {
      symbol: 'AAPL',
      totalVolume: 120,
      totalCost: 18000,
      currentValue: 20000,
      avgPrice: 150,
      grossPL: 2000
    },
    {
      symbol: 'CSPX.UK',
      totalVolume: 1.2,
      totalCost: 700,
      currentValue: 850,
      avgPrice: 583.3,
      grossPL: 150
    }
  ])
  public async getStats(): Promise<Statistics[]> {
    return this.statisticsService.getPortfolioStats()
  }

  /**
   * Pobiera historię wartości portfela w czasie.
   *
   * Zwraca tablicę punktów czasowych (data + wartość portfela).
   */
  @Get('/timeline')
  @SuccessResponse('200', 'OK')
  @Response<AppError>(500, 'Internal server error')
  @Example<TimelinePoint[]>([
    { date: '2025-01-01', value: 10000 },
    { date: '2025-02-01', value: 12000 },
    { date: '2025-03-01', value: 15000 }
  ])
  public async getTimeline(): Promise<TimelinePoint[]> {
    return this.statisticsService.getPortfolioTimeline()
  }
}
