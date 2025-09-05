export enum ServiceStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy'
}

export interface DatabaseHealth {
  status: ServiceStatus
  message?: string
}

export interface SystemHealth {
  server: ServiceStatus
  database: ServiceStatus
  message?: string
  timestamp: string
}
