import { DateService } from './date.service'
import { supabase } from './supabase'
import { HealthStatus, DatabaseCheckResult } from '../types/health'
import { injectable } from 'tsyringe'

@injectable()
export class HealthService {
  async checkDatabase(): Promise<DatabaseCheckResult> {
    try {
      const { error } = await supabase.from('health').select('count').limit(1)

      return error
        ? { status: 'unhealthy', message: error.message }
        : { status: 'healthy' }
    } catch (e) {
      return {
        status: 'unhealthy',
        message: e instanceof Error ? e.message : 'Database connection failed'
      }
    }
  }

  async getStatus(): Promise<HealthStatus> {
    const result = await this.checkDatabase()

    return {
      server: 'healthy',
      database: result.status,
      message: result.message,
      timestamp: DateService.formatCustom()
    }
  }
}
