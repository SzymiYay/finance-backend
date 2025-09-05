import { DateService } from './date.service'
import { injectable } from 'tsyringe'
import { supabase } from '../clients/supabase.client'
import { DatabaseHealth, ServiceStatus, SystemHealth } from '../types/health'

@injectable()
export class HealthService {
  async checkDatabase(): Promise<DatabaseHealth> {
    try {
      const { error } = await supabase.from('health').select('count').limit(1)

      return error
        ? { status: ServiceStatus.UNHEALTHY, message: error.message }
        : { status: ServiceStatus.HEALTHY }
    } catch (e) {
      return {
        status: ServiceStatus.UNHEALTHY,
        message: e instanceof Error ? e.message : 'Database connection failed'
      }
    }
  }

  async getStatus(): Promise<SystemHealth> {
    const result = await this.checkDatabase()

    return {
      server: ServiceStatus.HEALTHY,
      database: result.status,
      message: result.message,
      timestamp: DateService.formatCustom()
    }
  }
}
