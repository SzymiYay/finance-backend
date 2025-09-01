import { AppError } from './app.error'

export class SupabaseError {
  static handle(error: any): AppError | null {
    console.log(error)
    if (error.code === '23505') {
      return AppError.badRequest('Resource already exists')
    }

    if (error.code === '23502') {
      return AppError.badRequest('Required field is missing')
    }

    if (error.message?.includes('row-level security')) {
      return AppError.forbidden('Access denied')
    }

    if (error.message?.includes('JWT')) {
      return AppError.unauthorized('Invalid or expired token')
    }

    return null
  }
}
