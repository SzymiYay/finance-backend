import { NextFunction, Request, Response } from 'express'
import { asyncHandler } from './async.handler'

describe('asyncHandler', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: jest.MockedFunction<NextFunction>

  beforeEach(() => {
    mockReq = {}
    mockRes = {}
    mockNext = jest.fn()
  })

  it('should catch async errors and call next', async () => {
    const error = new Error('Test error')
    const mockAsyncFn = jest.fn().mockRejectedValue(error)
    const wrappedHandler = asyncHandler(mockAsyncFn)

    await wrappedHandler(mockReq as Request, mockRes as Response, mockNext)

    expect(mockNext).toHaveBeenCalledWith(error)
  })

  it('should not call next when function succeeds', async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue('success')
    const wrappedHandler = asyncHandler(mockAsyncFn)

    await wrappedHandler(mockReq as Request, mockRes as Response, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should pass all parameters to wrapped function', async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue('success')
    const wrappedHandler = asyncHandler(mockAsyncFn)

    await wrappedHandler(mockReq as Request, mockRes as Response, mockNext)

    expect(mockAsyncFn).toHaveBeenLastCalledWith(mockReq, mockRes, mockNext)
  })
})
