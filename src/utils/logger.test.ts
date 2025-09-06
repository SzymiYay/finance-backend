const mockLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
}

jest.mock('winston', () => ({
  createLogger: jest.fn(() => mockLogger),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    colorize: jest.fn(),
    printf: jest.fn()
  },
  transports: {
    Console: jest.fn()
  }
}))

import { log } from './logger'

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('log', () => {
    it('should call error with message and meta', () => {
      const message = 'Something went wrong'
      const meta = { context: 'Test', foo: 'bar' }

      log.error(message, meta)

      expect(mockLogger.error).toHaveBeenCalledWith(message, meta)
      expect(mockLogger.error).toHaveBeenCalledTimes(1)
    })

    it('should call error with message and empty object', () => {
      const message = 'Something went wrong'

      log.error(message)

      expect(mockLogger.error).toHaveBeenCalledWith(message, {})
      expect(mockLogger.error).toHaveBeenCalledTimes(1)
    })

    it('should call warn with message and meta', () => {
      const message = 'Something went wrong'
      const meta = { context: 'Test', foo: 'bar' }

      log.warn(message, meta)

      expect(mockLogger.warn).toHaveBeenCalledWith(message, meta)
      expect(mockLogger.warn).toHaveBeenCalledTimes(1)
    })

    it('should call warn with message and empty object', () => {
      const message = 'Something went wrong'

      log.warn(message)

      expect(mockLogger.warn).toHaveBeenCalledWith(message, {})
      expect(mockLogger.warn).toHaveBeenCalledTimes(1)
    })

    it('should call info with message and meta', () => {
      const message = 'Something went wrong'
      const meta = { context: 'Test', foo: 'bar' }

      log.info(message, meta)

      expect(mockLogger.info).toHaveBeenCalledWith(message, meta)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
    })

    it('should call info with message and empty object', () => {
      const message = 'Something went wrong'

      log.info(message)

      expect(mockLogger.info).toHaveBeenCalledWith(message, {})
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
    })

    it('should call debug with message and meta', () => {
      const message = 'Something went wrong'
      const meta = { context: 'Test', foo: 'bar' }

      log.debug(message, meta)

      expect(mockLogger.debug).toHaveBeenCalledWith(message, meta)
      expect(mockLogger.debug).toHaveBeenCalledTimes(1)
    })

    it('should call debug with message and empty object', () => {
      const message = 'Something went wrong'

      log.debug(message)

      expect(mockLogger.debug).toHaveBeenCalledWith(message, {})
      expect(mockLogger.debug).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('should handle undefined meta gracefully', () => {
      const message = 'Something went wrong'

      log.error(message, undefined)

      expect(mockLogger.error).toHaveBeenCalledWith(message, {})
      expect(mockLogger.error).toHaveBeenCalledTimes(1)
    })

    it('should handle null meta gracefully', () => {
      const message = 'Something went wrong'

      log.info(message, null as never)

      expect(mockLogger.info).toHaveBeenCalledWith(message, {})
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
    })

    it('should handle empty string message', () => {
      log.warn('')

      expect(mockLogger.warn).toHaveBeenCalledWith('', {})
      expect(mockLogger.warn).toHaveBeenCalledTimes(1)
    })

    it('should handle complex meta objects', () => {
      const complexMeta = {
        context: 'test',
        user: { id: 1, name: 'John' },
        array: [1, 2, 3],
        nested: { deep: { value: 'test' } }
      }

      log.debug('Complex meta test', complexMeta)

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Complex meta test',
        complexMeta
      )
      expect(mockLogger.debug).toHaveBeenCalledTimes(1)
    })
  })
})
