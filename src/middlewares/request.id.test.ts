import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { requestIdMiddleware } from './request.id'

jest.mock('uuid')

const mockUUIDv4 = uuidv4 as jest.Mock

describe('requestIdMiddleware', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: jest.MockedFunction<NextFunction>

  beforeEach(() => {
    mockUUIDv4.mockClear()
    mockNext = jest.fn()

    mockReq = {}
    mockRes = {
      set: jest.fn()
    }
  })

  it('should add a requestId to the request object', () => {
    const fakeUUID = 'test-uuid-1234'
    mockUUIDv4.mockReturnValue(fakeUUID)

    requestIdMiddleware(mockReq as Request, mockRes as Response, mockNext)

    expect(mockReq.requestId).toBe(fakeUUID)
  })

  it('should set the X-Request-ID header on the response', () => {
    const fakeUuid = 'test-uuid-12345'
    mockUUIDv4.mockReturnValue(fakeUuid)

    requestIdMiddleware(mockReq as Request, mockRes as Response, mockNext)

    expect(mockRes.set).toHaveBeenCalledWith('X-Request-ID', fakeUuid)
  })

  it('should call the next function once', () => {
    requestIdMiddleware(mockReq as Request, mockRes as Response, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockNext).toHaveBeenCalledWith()
  })

  it('should use the same UUID for both request and response', () => {
    const fakeUuid = 'another-test-uuid-67890'
    mockUUIDv4.mockReturnValue(fakeUuid)

    requestIdMiddleware(mockReq as Request, mockRes as Response, mockNext)

    expect(mockReq.requestId).toBe(fakeUuid)
    expect(mockRes.set).toHaveBeenCalledWith('X-Request-ID', fakeUuid)
  })
})
