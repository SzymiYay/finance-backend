export enum ErrorCode {
  // Client Errors (4xx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT = 'INVALID_INPUT',

  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: 'Validation failed',
  [ErrorCode.AUTHENTICATION_FAILED]: 'Authentication failed',
  [ErrorCode.AUTHORIZATION_FAILED]: 'Insufficient permissions',
  [ErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ErrorCode.DUPLICATE_RESOURCE]: 'Resource already exists',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests',
  [ErrorCode.INVALID_INPUT]: 'Invalid input provided',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCode.DATABASE_CONNECTION_ERROR]: 'Database connection failed',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'External service unavailable',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable'
} as const

export const HTTP_STATUS_CODES: Record<ErrorCode, number> = {
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.AUTHENTICATION_FAILED]: 401,
  [ErrorCode.AUTHORIZATION_FAILED]: 403,
  [ErrorCode.RESOURCE_NOT_FOUND]: 404,
  [ErrorCode.DUPLICATE_RESOURCE]: 409,
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
  [ErrorCode.INVALID_INPUT]: 400,
  [ErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [ErrorCode.DATABASE_CONNECTION_ERROR]: 503,
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 502,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503
} as const
