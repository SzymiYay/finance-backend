import { DateService } from '../services/date.service'
import { AppError } from './app.error'
import { ERROR_MESSAGES, ErrorCode, HTTP_STATUS_CODES } from './codes.error'

jest.mock('../services/date.service', () => ({
  DateService: {
    formatCustom: jest.fn()
  }
}))

const mockDateService = DateService as jest.Mocked<typeof DateService>

describe('AppError', () => {
  const mockTimestamp = '2024-01-15T10:30:00Z'

  beforeEach(() => {
    jest.clearAllMocks()
    mockDateService.formatCustom.mockReturnValue(mockTimestamp)
  })

  describe('constructor', () => {
    it('should create error with all properties when all parameter provided', () => {
      const errorCode = ErrorCode.VALIDATION_ERROR
      const message = 'Custom validation error'
      const cause = new Error('Original error')

      const error = new AppError(errorCode, message, cause)

      expect(error.message).toBe(message)
      expect(error.errorCode).toBe(errorCode)
      expect(error.statusCode).toBe(HTTP_STATUS_CODES.VALIDATION_ERROR)
      expect(error.status).toBe('fail')
      expect(error.cause).toBe(cause)
      expect(error.timestamp).toBe(mockTimestamp)
      expect(error.isOperational).toBe(true)
      expect(error.name).toBe('AppError')
      expect(error.message).toBe(message)
      expect(mockDateService.formatCustom).toHaveBeenCalledTimes(1)
    })

    it('should use default message from ERROR_MESSAGES when message not provided', () => {
      const errorCode = ErrorCode.AUTHENTICATION_FAILED

      const error = new AppError(errorCode)

      expect(error.message).toBe(ERROR_MESSAGES[errorCode])
      expect(error.errorCode).toBe(errorCode)
      expect(error.cause).toBe(undefined)
    })

    it('should use "Unknown error" when errorCode not found in ERROR_MESSAGES', () => {
      const invalidErrorCode = 'INVALID_CODE' as ErrorCode

      const error = new AppError(invalidErrorCode)

      expect(error.message).toBe('Unknown error')
      expect(error.errorCode).toBe(invalidErrorCode)
    })

    it('should set status to "fail" for client errors (4xx)', () => {
      const errorCode = ErrorCode.VALIDATION_ERROR

      const error = new AppError(errorCode)

      expect(error.status).toBe('fail')
      expect(error.statusCode).toBeLessThan(500)
    })

    it('should set status to "error" for server errors (5xx)', () => {
      const errorCode = ErrorCode.INTERNAL_SERVER_ERROR

      const error = new AppError(errorCode)

      expect(error.status).toBe('error')
      expect(error.statusCode).toBeGreaterThanOrEqual(500)
    })

    it('should use default status code 500 when errorCode not found in HTTP_STATUS_CODES', () => {
      const invalidErrorCode = 'INVALID_CODE' as ErrorCode

      const error = new AppError(invalidErrorCode)

      expect(error.statusCode).toBe(500)
      expect(error.status).toBe('error')
    })

    it('should call Error.captureStackTrace', () => {
      const captureStackTraceSpy = jest.spyOn(Error, 'captureStackTrace')

      const error = new AppError(ErrorCode.VALIDATION_ERROR)

      expect(captureStackTraceSpy).toHaveBeenCalledWith(error, AppError)

      captureStackTraceSpy.mockRestore()
    })
  })

  describe('static factory methods', () => {
    describe('badRequest', () => {
      it('should create validation error with default message', () => {
        const error = AppError.badRequest()

        expect(error.errorCode).toBe(ErrorCode.VALIDATION_ERROR)
        expect(error.message).toBe(ERROR_MESSAGES.VALIDATION_ERROR)
        expect(error).toBeInstanceOf(AppError)
      })

      it('should create validation error with custom message', () => {
        const customMessage = 'Custom validation error'

        const error = AppError.badRequest(customMessage)

        expect(error.errorCode).toBe(ErrorCode.VALIDATION_ERROR)
        expect(error.message).toBe(customMessage)
      })
    })

    describe('notFound', () => {
      it('should create not found error with default resource name', () => {
        const error = AppError.notFound()

        expect(error.errorCode).toBe(ErrorCode.RESOURCE_NOT_FOUND)
        expect(error.message).toBe('Resource not found')
      })

      it('should create not found error with custom resource name', () => {
        const resource = 'User'

        const error = AppError.notFound(resource)

        expect(error.errorCode).toBe(ErrorCode.RESOURCE_NOT_FOUND)
        expect(error.message).toBe('User not found')
      })
    })

    describe('unauthorized', () => {
      it('should create authentication error with default message', () => {
        const error = AppError.unauthorized()

        expect(error.errorCode).toBe(ErrorCode.AUTHENTICATION_FAILED)
        expect(error.message).toBe(ERROR_MESSAGES.AUTHENTICATION_FAILED)
      })

      it('should create authentication error with custom message', () => {
        const customMessage = 'Invalid token'

        const error = AppError.unauthorized(customMessage)

        expect(error.errorCode).toBe(ErrorCode.AUTHENTICATION_FAILED)
        expect(error.message).toBe(customMessage)
      })
    })

    describe('forbidden', () => {
      it('should create authorization error with default message', () => {
        const error = AppError.forbidden()

        expect(error.errorCode).toBe(ErrorCode.AUTHORIZATION_FAILED)
        expect(error.message).toBe(ERROR_MESSAGES.AUTHORIZATION_FAILED)
      })

      it('should create authorization error with custom message', () => {
        const customMessage = 'Insufficient permissions'

        const error = AppError.forbidden(customMessage)

        expect(error.errorCode).toBe(ErrorCode.AUTHORIZATION_FAILED)
        expect(error.message).toBe(customMessage)
      })
    })

    describe('conflict', () => {
      it('should create duplicate resource error with default message', () => {
        const error = AppError.conflict()

        expect(error.errorCode).toBe(ErrorCode.DUPLICATE_RESOURCE)
        expect(error.message).toBe(ERROR_MESSAGES.DUPLICATE_RESOURCE)
      })

      it('should create duplicate resource error with custom message', () => {
        const customMessage = 'Email already exists'

        const error = AppError.conflict(customMessage)

        expect(error.errorCode).toBe(ErrorCode.DUPLICATE_RESOURCE)
        expect(error.message).toBe(customMessage)
      })
    })

    describe('internal', () => {
      it('should create internal server error with default message', () => {
        const error = AppError.internal()

        expect(error.errorCode).toBe(ErrorCode.INTERNAL_SERVER_ERROR)
        expect(error.message).toBe(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
      })

      it('should create internal server error with custom message', () => {
        const customMessage = 'Database connection failed'

        const error = AppError.internal(customMessage)

        expect(error.errorCode).toBe(ErrorCode.INTERNAL_SERVER_ERROR)
        expect(error.message).toBe(customMessage)
      })
    })

    describe('invalidInput', () => {
      it('should create invalid input error with provided message', () => {
        const message = 'Invalid email format'

        const error = AppError.invalidInput(message)

        expect(error.errorCode).toBe(ErrorCode.INVALID_INPUT)
        expect(error.message).toBe(message)
      })
    })
  })

  describe('instance methods', () => {
    describe('isClientError', () => {
      it('should return true for 4xx status codes', () => {
        const error = new AppError(ErrorCode.VALIDATION_ERROR)

        expect(error.isClientError()).toBe(true)
      })

      it('should return false for 5xx status codes', () => {
        const error = new AppError(ErrorCode.INTERNAL_SERVER_ERROR)

        expect(error.isClientError()).toBe(false)
      })
    })

    describe('isServerError', () => {
      it('should return true for 5xx status codes', () => {
        const error = new AppError(ErrorCode.INTERNAL_SERVER_ERROR)

        expect(error.isServerError()).toBe(true)
      })

      it('should return false for 4xx status codes', () => {
        const error = new AppError(ErrorCode.VALIDATION_ERROR)

        expect(error.isServerError()).toBe(false)
      })
    })
  })

  describe('inheritance', () => {
    it('should be instance of Error', () => {
      const error = new AppError(ErrorCode.VALIDATION_ERROR)

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(AppError)
    })

    it('should be throwable', () => {
      expect(() => {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'Test error')
      }).toThrow('Test error')
    })
  })

  describe('properties', () => {
    it('should have all required properties set', () => {
      const errorCode = ErrorCode.VALIDATION_ERROR
      const message = 'Test message'
      const cause = new Error('Cause error')

      const error = new AppError(errorCode, message, cause)

      expect(error).toHaveProperty('message', message)
      expect(error).toHaveProperty('errorCode', errorCode)
      expect(error).toHaveProperty('statusCode')
      expect(error).toHaveProperty('status')
      expect(error).toHaveProperty('cause', cause)
      expect(error).toHaveProperty('timestamp', mockTimestamp)
      expect(error).toHaveProperty('isOperational', true)
      expect(error).toHaveProperty('name', 'AppError')
    })

    it('should allow setting requestId', () => {
      const error = new AppError(ErrorCode.VALIDATION_ERROR)
      const requestId = 'req-123-456'

      error.requestId = requestId

      expect(error.requestId).toBe(requestId)
    })
  })
})
