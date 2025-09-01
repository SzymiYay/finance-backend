import { NextFunction, Request, Response } from 'express'
import { log } from '../utils/logger'

export const loggerHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start

    if (res.statusCode >= 400) {
      return
    }

    log.info('Request completed', {
      context: 'HTTP',
      requestId: req.requestId,
      method: req.method,
      originalUrl: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    })
  })

  next()
}
