/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseError } from './supabase.error'
import { AppError } from './app.error'
import type { PostgrestError } from '@supabase/supabase-js'

jest.mock('./app.error', () => ({
  AppError: {
    conflict: jest.fn(),
    badRequest: jest.fn(),
    forbidden: jest.fn(),
    unauthorized: jest.fn()
  }
}))

const mockAppError = AppError as jest.Mocked<typeof AppError>

describe('SupabaseError', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockAppError.conflict.mockReturnValue(
      new Error('Duplicate Resource') as any
    )
    mockAppError.badRequest.mockReturnValue(new Error('Bad Request') as any)
    mockAppError.forbidden.mockReturnValue(new Error('Forbidden') as any)
    mockAppError.unauthorized.mockReturnValue(new Error('Unauthorized') as any)
  })

  describe('handle method', () => {
    describe('when error is null or undefined', () => {
      it('should return null for null error', () => {
        const result = SupabaseError.handle(null)

        expect(result).toBeNull()
      })

      it('should return null for undefined error', () => {
        const result = SupabaseError.handle(undefined)

        expect(result).toBeNull()
      })
    })

    describe('PostgreSQL error codes', () => {
      it('should handle duplicate key violation (23505)', () => {
        const pgError: PostgrestError = {
          name: 'pgError',
          message: 'duplicate key value violates unique constraint',
          details: 'Key (email)=(test@test.com) already exists.',
          hint: '',
          code: '23505'
        }

        const result = SupabaseError.handle(pgError)

        expect(mockAppError.conflict).toHaveBeenCalledWith(
          'Resource already exists'
        )
        expect(mockAppError.conflict).toHaveBeenCalledTimes(1)
        expect(result).toBe(mockAppError.conflict.mock.results[0].value)
      })

      it('should handle not null violation (23502)', () => {
        const pgError: PostgrestError = {
          name: 'pgError',
          message: 'null value in column "name" violates not-null constraint',
          details: 'Failing row contains (1, null, test@test.com).',
          hint: '',
          code: '23502'
        }

        const result = SupabaseError.handle(pgError)

        expect(mockAppError.badRequest).toHaveBeenCalledWith(
          'Required field is missing'
        )
        expect(mockAppError.badRequest).toHaveBeenCalledTimes(1)
        expect(result).toBe(mockAppError.badRequest.mock.results[0].value)
      })

      it('should return null for unhandled PostgreSQL error codes', () => {
        const pgError: PostgrestError = {
          name: 'pgError',
          message: 'some other postgres error',
          details: '',
          hint: '',
          code: '42P01'
        }

        const result = SupabaseError.handle(pgError)

        expect(result).toBeNull()
        expect(mockAppError.badRequest).not.toHaveBeenCalled()
        expect(mockAppError.forbidden).not.toHaveBeenCalled()
        expect(mockAppError.unauthorized).not.toHaveBeenCalled()
      })

      it('should handle object with code property but no other PostgrestError properties', () => {
        const errorLikeObject = {
          code: '23505',
          someOtherProperty: 'value'
        }

        const result = SupabaseError.handle(errorLikeObject)

        expect(mockAppError.conflict).toHaveBeenCalledWith(
          'Resource already exists'
        )
        expect(result).toBe(mockAppError.conflict.mock.results[0].value)
      })
    })

    describe('Error instance message patterns', () => {
      it('should handle row-level security errors', () => {
        const error = new Error('row-level security policy violation')

        const result = SupabaseError.handle(error)

        expect(mockAppError.forbidden).toHaveBeenCalledWith('Access denied')
        expect(mockAppError.forbidden).toHaveBeenCalledTimes(1)
        expect(result).toBe(mockAppError.forbidden.mock.results[0].value)
      })

      it('should handle row-level security errors with different casing', () => {
        const error = new Error('Row-Level Security policy failed')

        SupabaseError.handle(error)

        expect(mockAppError.forbidden).toHaveBeenCalledWith('Access denied')
      })

      it('should handle JWT errors', () => {
        const error = new Error('JWT token is invalid')

        const result = SupabaseError.handle(error)

        expect(mockAppError.unauthorized).toHaveBeenCalledWith(
          'Invalid or expired token'
        )
        expect(mockAppError.unauthorized).toHaveBeenCalledTimes(1)
        expect(result).toBe(mockAppError.unauthorized.mock.results[0].value)
      })

      it('should handle JWT errors with different message patterns', () => {
        const jwtErrors = [
          new Error('JWT expired'),
          new Error('Invalid JWT signature'),
          new Error('JWT malformed'),
          new Error('Something about JWT went wrong')
        ]

        jwtErrors.forEach((error, index) => {
          const result = SupabaseError.handle(error)

          expect(mockAppError.unauthorized).toHaveBeenCalledWith(
            'Invalid or expired token'
          )
          expect(result).toBe(
            mockAppError.unauthorized.mock.results[index].value
          )
        })

        expect(mockAppError.unauthorized).toHaveBeenCalledTimes(
          jwtErrors.length
        )
      })

      it('should return null for Error instances with unhandled messages', () => {
        const error = new Error('Some random error message')

        const result = SupabaseError.handle(error)

        expect(result).toBeNull()
        expect(mockAppError.badRequest).not.toHaveBeenCalled()
        expect(mockAppError.forbidden).not.toHaveBeenCalled()
        expect(mockAppError.unauthorized).not.toHaveBeenCalled()
      })
    })

    describe('edge cases and complex scenarios', () => {
      it('should prioritize PostgreSQL code over Error message when both conditions match', () => {
        const complexError = Object.assign(new Error('JWT token invalid'), {
          code: '23505'
        })

        const result = SupabaseError.handle(complexError)

        expect(mockAppError.conflict).toHaveBeenCalledWith(
          'Resource already exists'
        )
        expect(mockAppError.unauthorized).not.toHaveBeenCalled()
        expect(result).toBe(mockAppError.conflict.mock.results[0].value)
      })

      it('should handle non-Error objects without code property', () => {
        const randomObject = {
          message: 'some message',
          data: 'some data'
        }

        const result = SupabaseError.handle(randomObject)

        expect(result).toBeNull()
      })

      it('should handle primitive values', () => {
        expect(SupabaseError.handle('string error')).toBeNull()
        expect(SupabaseError.handle(123)).toBeNull()
        expect(SupabaseError.handle(true)).toBeNull()
      })

      it('should handle empty object', () => {
        const emptyObject = {}

        const result = SupabaseError.handle(emptyObject)

        expect(result).toBeNull()
      })

      it('should handle object with code property but non-string code', () => {
        const objectWithNumericCode = {
          code: 23505
        }

        const result = SupabaseError.handle(objectWithNumericCode)

        expect(result).toBeNull()
      })
    })

    describe('case sensitivity', () => {
      it('should be case sensitive for row-level security detection', () => {
        const error = new Error('ROW-LEVEL SECURITY violation')

        SupabaseError.handle(error)

        expect(AppError.forbidden).toHaveBeenCalledWith('Access denied')
      })

      it('should be case sensitive for JWT detection', () => {
        const error = new Error('jwt token invalid')

        SupabaseError.handle(error)

        expect(AppError.unauthorized).toHaveBeenCalledWith(
          'Invalid or expired token'
        )
      })
    })
  })

  describe('static method properties', () => {
    it('should be a static method', () => {
      expect(typeof SupabaseError.handle).toBe('function')
      expect(SupabaseError.handle).toBe(SupabaseError.handle)
    })

    it('should not require instance creation', () => {
      expect(() => SupabaseError.handle(null)).not.toThrow()
    })
  })
})
