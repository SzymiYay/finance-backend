import { NextFunction, Request, Response } from 'express'
import { log } from '../utils/logger'
import { loggerHandler } from './logger.handler'

jest.mock('../utils/logger', () => ({
  log: {
    info: jest.fn()
  }
}))

const mockLog = log as jest.Mocked<typeof log>

describe('loggerHandler', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: jest.MockedFunction<NextFunction>
  let finishCallback: () => void

  beforeEach(() => {
    mockReq = {
      requestId: 'test-request-id',
      method: 'GET',
      originalUrl: '/api/users'
    }

    mockRes = {
      statusCode: 200,
      on: jest
        .fn()
        .mockImplementation((event: string, callback: () => void) => {
          if (event === 'finish') {
            finishCallback = callback
          }
        })
    }

    mockNext = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Core functionality', () => {
    it('should call next method immediately', () => {
      loggerHandler(mockReq as Request, mockRes as Response, mockNext)

      expect(mockNext).toHaveBeenCalledTimes(1)
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('should register finish event listener', () => {
      loggerHandler(mockReq as Request, mockRes as Response, mockNext)

      expect(mockRes.on).toHaveBeenCalledWith('finish', expect.any(Function))
      expect(mockRes.on).toHaveBeenCalledTimes(1)
    })
  })

  describe('Successful request logging', () => {
    it('should log successful requests (2xx status codes)', () => {
      mockRes.statusCode = 200
      jest
        .spyOn(Date, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1250)

      loggerHandler(mockReq as Request, mockRes as Response, mockNext)
      finishCallback()

      expect(mockLog.info).toHaveBeenCalledWith('Request completed', {
        context: 'HTTP',
        requestId: 'test-request-id',
        method: 'GET',
        originalUrl: '/api/users',
        statusCode: 200,
        duration: '250ms'
      })
      expect(mockLog.info).toHaveBeenCalledTimes(1)
    })

    it('should log 3xx status codes', () => {
      mockRes.statusCode = 301

      loggerHandler(mockReq as Request, mockRes as Response, mockNext)
      finishCallback()

      expect(mockLog.info).toHaveBeenCalledWith(
        'Request completed',
        expect.objectContaining({
          statusCode: 301
        })
      )
    })
  })

  describe('Error request handling', () => {
    it('should NOT log 4xx client errors', () => {
      mockRes.statusCode = 404

      loggerHandler(mockReq as Request, mockRes as Response, mockNext)
      finishCallback()

      expect(mockLog.info).not.toHaveBeenCalled()
    })

    it('should NOT log 5xx server errors', () => {
      mockRes.statusCode = 500

      loggerHandler(mockReq as Request, mockRes as Response, mockNext)
      finishCallback()

      expect(mockLog.info).not.toHaveBeenCalled()
    })

    it('should NOT log exactly 400 status code', () => {
      mockRes.statusCode = 400

      loggerHandler(mockReq as Request, mockRes as Response, mockNext)
      finishCallback()

      expect(mockLog.info).not.toHaveBeenCalled()
    })
  })

  describe('Duration calculation', () => {
    it('should calculate correct duration', () => {
      jest
        .spyOn(Date, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1500)

      loggerHandler(mockReq as Request, mockRes as Response, mockNext)
      finishCallback()

      expect(mockLog.info).toHaveBeenCalledWith(
        'Request completed',
        expect.objectContaining({
          duration: '500ms'
        })
      )
    })

    it('should handle zero duration', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1000)

      loggerHandler(mockReq as Request, mockRes as Response, mockNext)
      finishCallback()

      expect(mockLog.info).toHaveBeenCalledWith(
        'Request completed',
        expect.objectContaining({
          duration: '0ms'
        })
      )
    })
  })

  describe('Request data logging', () => {
    it('should log all required request fields', () => {
      mockReq = {
        requestId: 'custom-id',
        method: 'POST',
        originalUrl: '/api/posts/123?filter=active'
      }
      mockRes.statusCode = 201
      jest
        .spyOn(Date, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1250)

      loggerHandler(mockReq as Request, mockRes as Response, mockNext)
      finishCallback()

      expect(mockLog.info).toHaveBeenCalledWith('Request completed', {
        context: 'HTTP',
        requestId: 'custom-id',
        method: 'POST',
        originalUrl: '/api/posts/123?filter=active',
        statusCode: 201,
        duration: '250ms'
      })
    })

    it('should handle missing requestId', () => {
      mockReq.requestId = undefined

      loggerHandler(mockReq as Request, mockRes as Response, mockNext)
      finishCallback()

      expect(mockLog.info).toHaveBeenCalledWith(
        'Request completed',
        expect.objectContaining({
          requestId: undefined
        })
      )
    })
  })

  describe('Edge cases', () => {
    it('should handle finish event called multiple times', () => {
      loggerHandler(mockReq as Request, mockRes as Response, mockNext)
      finishCallback()
      finishCallback()

      expect(mockLog.info).toHaveBeenCalledTimes(2)
    })

    it('should work when finish event is never called', () => {
      loggerHandler(mockReq as Request, mockRes as Response, mockNext)

      expect(mockNext).toHaveBeenCalledTimes(1)
      expect(mockLog.info).not.toHaveBeenCalled()
    })
  })
})
