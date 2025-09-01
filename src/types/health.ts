export interface DatabaseCheckResult {
  status: 'healthy' | 'unhealthy'
  message?: string
}

export interface HealthStatus {
  server: 'healthy' | 'unhealthy'
  database: 'healthy' | 'unhealthy'
  message?: string
  timestamp: string
}