import { ErrorCode } from "../errors/codes.error"

export interface ErrorDetails {
  field?: string
  value?: any
  errors?: ValidationError[]
  [key: string]: any
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

export interface AppErrorResponse {
  name: string
  errorCode: ErrorCode
  message: string
  statusCode: number
  status: 'fail' | 'error'
  details?: ErrorDetails
  timestamp: string
  requestId?: string
  stack?: string
  cause?: string
}