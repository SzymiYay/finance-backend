import { AppError } from './app.error'
import type { PostgrestError } from '@supabase/supabase-js'

export class SupabaseError {
  static handle(error: PostgrestError | Error | unknown): AppError | null {
    if (!error) return null

    if (typeof error === 'object' && 'code' in error) {
      const pgError = error as PostgrestError

      if (pgError.code === '23505') {
        return AppError.badRequest('Resource already exists')
      }

      if (pgError.code === '23502') {
        return AppError.badRequest('Required field is missing')
      }
    }

    if (error instanceof Error) {
      if (error.message.includes('row-level security')) {
        return AppError.forbidden('Access denied')
      }

      if (error.message.includes('JWT')) {
        return AppError.unauthorized('Invalid or expired token')
      }
    }

    return null
  }
}
