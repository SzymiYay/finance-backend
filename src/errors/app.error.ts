import { DateService } from '../services/date.service'
import { AppErrorResponse, ErrorDetails } from '../types/errors'
import { ERROR_MESSAGES, ErrorCode, HTTP_STATUS_CODES } from './codes.error'

export class AppError extends Error {
  public readonly errorCode: ErrorCode
  public readonly statusCode: number
  public readonly status: 'fail' | 'error'
  public readonly details?: ErrorDetails
  public readonly cause?: Error
  public readonly timestamp: string
  public isOperational: boolean = true
  public requestId?: string

  constructor(
    errorCode: ErrorCode,
    message?: string,
    details?: ErrorDetails,
    cause?: Error
  ) {
    const errorMessage = message || ERROR_MESSAGES[errorCode] || 'Unknown error'
    super(errorMessage)

    this.name = this.constructor.name
    this.errorCode = errorCode
    this.statusCode = HTTP_STATUS_CODES[errorCode] || 500
    this.status = this.statusCode < 500 ? 'fail' : 'error'
    this.cause = cause
    this.details = details
    this.timestamp = DateService.formatCustom()

    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(
    message: string = ERROR_MESSAGES.VALIDATION_ERROR
  ): AppError {
    return new AppError(ErrorCode.VALIDATION_ERROR, message)
  }

  static notFound(resource: string = 'Resource'): AppError {
    return new AppError(ErrorCode.RESOURCE_NOT_FOUND, `${resource} not found`)
  }

  static unauthorized(
    message: string = ERROR_MESSAGES.AUTHENTICATION_FAILED
  ): AppError {
    return new AppError(ErrorCode.AUTHENTICATION_FAILED, message)
  }

  static forbidden(
    message: string = ERROR_MESSAGES.AUTHORIZATION_FAILED
  ): AppError {
    return new AppError(ErrorCode.AUTHORIZATION_FAILED, message)
  }

  static conflict(
    message: string = ERROR_MESSAGES.DUPLICATE_RESOURCE
  ): AppError {
    return new AppError(ErrorCode.DUPLICATE_RESOURCE, message)
  }

  static internal(message?: string, cause?: Error): AppError {
    return new AppError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      undefined,
      cause
    )
  }

  static invalidInput(message: string, details?: ErrorDetails): AppError {
    return new AppError(ErrorCode.INVALID_INPUT, message, details)
  }

  toJSON(): AppErrorResponse {
    return {
      name: this.name,
      errorCode: this.errorCode,
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp,
      requestId: this.requestId,
      stack: this.stack,
      cause: this.cause?.message
    }
  }

  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500
  }

  isServerError(): boolean {
    return this.statusCode >= 500
  }
}
