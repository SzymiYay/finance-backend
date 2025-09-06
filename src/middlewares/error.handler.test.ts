import { NextFunction, Request, Response } from 'express'
import { SupabaseError } from '../errors/supabase.error'
import { log } from '../utils/logger'
import { AppError } from '../errors/app.error'
import { ErrorCode } from '../errors/codes.error'
import { errorHandler } from './error.handler'

jest.mock('../errors/supabase.error')
jest.mock('../utils/logger')

const mockSupabaseError = SupabaseError as jest.Mocked<typeof SupabaseError>
const mockLog = log as jest.Mocked<typeof log>

describe('errorHandler', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: jest.MockedFunction<NextFunction>
  let originalNodeEnv: string | undefined

  beforeEach(() => {
    mockReq = {
      requestId: 'test-request-id',
      method: 'POST',
      originalUrl: '/api/test',
      params: { id: '123' },
      query: { filter: 'active' },
      body: { name: 'test' },
      ip: '127.0.0.1',
      get: jest.fn().mockImplementation((header: string) => {
        const headers: Record<string, string> = {
          'User-Agent': 'test-agent',
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123'
        }
        return headers[header]
      })
    }

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    mockNext = jest.fn()

    jest.clearAllMocks()
    mockSupabaseError.handle.mockReturnValue(null)

    originalNodeEnv = process.env.NODE_ENV
  })

  afterEach(() => {
    if (originalNodeEnv !== undefined) {
      process.env.NODE_ENV = originalNodeEnv
    } else {
      delete process.env.NODE_ENVV
    }
  })

  describe('AppError handling', () => {
    it('should handle existing AppError without transformation', () => {
      const appError = new AppError(
        ErrorCode.VALIDATION_ERROR,
        'Test validation error'
      )
      process.env.NODE_ENV = 'production'

      errorHandler(appError, mockReq as Request, mockRes as Response, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(appError.statusCode)
      expect(mockRes.json).toHaveBeenCalledWith(appError)
      expect(mockSupabaseError.handle).not.toHaveBeenCalled()
    })

    it('should set requestId on AppError', () => {
      const appError = new AppError(
        ErrorCode.VALIDATION_ERROR,
        'Test validation error'
      )

      errorHandler(appError, mockReq as Request, mockRes as Response, mockNext)

      expect(appError.requestId).toBe('test-request-id')
    })
  })

  describe('Supabase error handling', () => {
    it('should convert Supabase error to AppError', () => {
      const supabaseError = new AppError(
        ErrorCode.DUPLICATE_RESOURCE,
        'Resource exists'
      )
      mockSupabaseError.handle.mockReturnValue(supabaseError)
      const originalError = { code: '23505', message: 'duplicate key' }

      errorHandler(
        originalError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockSupabaseError.handle).toHaveBeenCalledWith(originalError)
      expect(mockRes.status).toHaveBeenCalledWith(supabaseError.statusCode)
      expect(mockRes.json).toHaveBeenCalledWith(supabaseError)
    })
  })

  describe('Generic Error handling', () => {
    it('should handle generic errors in production', () => {
      const originalError = new Error('Database connection failed')
      process.env.NODE_ENV = 'production'

      errorHandler(
        originalError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Something went wrong'
      })
    })

    it('should set isOperational to false for generic errors', () => {
      const originalError = new Error('Unexpected error')
      process.env.NODE_ENV = 'development'

      errorHandler(
        originalError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      const responseCall = (mockRes.json as jest.Mock).mock.calls[0][0]
      expect(responseCall.isOperational).toBe(false)
    })
  })

  describe('Unknown error handling', () => {
    it('should handle non-Error unknown values', () => {
      const unknownError = 'string error'
      process.env.NODE_ENV = 'production'

      errorHandler(
        unknownError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Something went wrong'
      })
    })
  })

  describe('Environment-based response', () => {
    it('should send full error details in development', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('Test error')

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext)

      const responseCall = (mockRes.json as jest.Mock).mock.calls[0][0]
      expect(responseCall).toHaveProperty('message', 'Test error')
      expect(responseCall).toHaveProperty('errorCode')
      expect(responseCall).toHaveProperty('stack')
    })

    it('should hide non-operational errors in production', () => {
      process.env.NODE_ENV = 'production'
      const error = new Error('Internal system error')

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Something went wrong'
      })
    })

    it('should show operational errors in production', () => {
      process.env.NODE_ENV = 'production'
      const operationalError = new AppError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid input'
      )

      errorHandler(
        operationalError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockRes.status).toHaveBeenCalledWith(operationalError.statusCode)
      expect(mockRes.json).toHaveBeenCalledWith(operationalError)
    })
  })

  describe('Logging', () => {
    it('should log error with request context', () => {
      const error = new AppError(ErrorCode.VALIDATION_ERROR, 'Test error')

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext)

      expect(mockLog.error).toHaveBeenCalledWith(
        'Application error occurred',
        expect.objectContaining({
          context: 'errorHandler',
          requestId: 'test-request-id',
          request: expect.objectContaining({
            method: 'POST',
            originalUrl: '/api/test',
            params: { id: '123' },
            query: { filter: 'active' },
            body: { name: 'test' },
            ip: '127.0.0.1'
          }),
          error: expect.objectContaining({
            message: 'Test error',
            errorCode: ErrorCode.VALIDATION_ERROR
          })
        })
      )
    })

    it('should hide authorization header in logs', () => {
      const error = new AppError(ErrorCode.VALIDATION_ERROR, 'Test error')

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext)

      const logCall = (mockLog.error as jest.Mock).mock.calls[0][1]
      expect(logCall.request.headers.authorization).toBe('[HIDDEN]')
    })
  })

  describe('Critical error flow', () => {
    it('should handle complete error processing flow', () => {
      const originalError = new Error('Critical system error')
      process.env.NODE_ENV = 'production'

      errorHandler(
        originalError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockSupabaseError.handle).toHaveBeenCalledWith(originalError)
      expect(mockLog.error).toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Something went wrong'
      })
    })
  })
})
