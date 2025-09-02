import { NextFunction, Request, Response, RequestHandler } from 'express'

export const asyncHandler = <T = unknown>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
