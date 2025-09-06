import { ERROR_MESSAGES, ErrorCode, HTTP_STATUS_CODES } from './codes.error'

describe('Error codes configuration', () => {
  it('should have error message for every error code', () => {
    const errorCodes = Object.values(ErrorCode)
    const messageKeys = Object.keys(ERROR_MESSAGES)

    expect(messageKeys).toHaveLength(errorCodes.length)

    errorCodes.forEach((code) => {
      expect(ERROR_MESSAGES[code]).toBeDefined()
      expect(ERROR_MESSAGES[code]).not.toBe('')
    })
  })

  it('should have HTTP status code for every error code', () => {
    const errorCodes = Object.values(ErrorCode)

    errorCodes.forEach((code) => {
      expect(HTTP_STATUS_CODES[code]).toBeDefined()
      expect(HTTP_STATUS_CODES[code]).toBeGreaterThan(0)
    })
  })

  it('should have valid HTTP status codes', () => {
    const statusCodes = Object.values(HTTP_STATUS_CODES)

    statusCodes.forEach((code) => {
      expect(code).toBeGreaterThanOrEqual(400)
      expect(code).toBeLessThan(600)
    })
  })
})
