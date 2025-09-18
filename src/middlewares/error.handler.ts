import { Response, Request, NextFunction } from 'express'
import { AppError } from '../errors/app.error'
import { ErrorCode } from '../errors/codes.error'
import { SupabaseError } from '../errors/supabase.error'
import { log } from '../utils/logger'

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: AppError
  if (!(err instanceof AppError)) {
    const supabaseError = SupabaseError.handle(err)
    if (supabaseError) {
      error = supabaseError
    } else if (err instanceof Error) {
      error = new AppError(ErrorCode.INTERNAL_SERVER_ERROR, err.message, err)
      error.isOperational = false
    } else {
      error = new AppError(ErrorCode.INTERNAL_SERVER_ERROR, 'Unknown error')
      error.isOperational = false
    }
  } else {
    error = err
  }

  error.requestId = req.requestId

  log.error('Application error occurred', {
    context: 'errorHandler',
    requestId: req.requestId,
    request: {
      method: req.method,
      originalUrl: req.originalUrl,
      params: req.params,
      query: req.query,
      body: req.body,
      headers: {
        'user-agent': req.get('User-Agent'),
        'content-type': req.get('Content-Type'),
        authorization: req.get('Authorization') ? '[HIDDEN]' : undefined
      },
      ip: req.ip
    },
    error: {
      message: error.message,
      errorCode: error.errorCode,
      statusCode: error.statusCode,
      stack: error.stack,
      cause: error.cause
        ? {
            message: error.cause.message,
            name: error.cause.name,
            stack: error.cause.stack
          }
        : null
    }
  })

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res)
  } else {
    sendErrorProd(error, res)
  }
}

const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json(err)
}

const sendErrorProd = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json(err)
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
  }
}
