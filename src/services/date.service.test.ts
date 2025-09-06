import { DateService } from './date.service'

describe('DateService', () => {
  const MOCK_DATE_ISO = '2025-09-06T16:00:00.000Z'
  const MOCK_DATE = new Date(MOCK_DATE_ISO)

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(MOCK_DATE)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('formatISO', () => {
    it('should return the date in UTC ISO 8601 format', () => {
      const result = DateService.formatISO()

      expect(result).toBe(MOCK_DATE_ISO)
    })
  })

  describe('formatCustom', () => {
    it('should format date using "pl-PL" locale be default', () => {
      const result = DateService.formatCustom()

      expect(result).toBe('06.09.2025, 18:00:00')
    })

    it('should format date using "pl-PL" locale when "pl" is specified', () => {
      const result = DateService.formatCustom('pl')
      expect(result).toBe('06.09.2025, 18:00:00')
    })

    it('should format date using "en-GB" locale when "en" is specified', () => {
      const result = DateService.formatCustom('en')
      expect(result).toBe('06/09/2025, 18:00:00')
    })

    it('should return ISO format when "iso" is specified', () => {
      const result = DateService.formatCustom('iso')
      expect(result).toBe('2025-09-06T16:00:00.000Z')
    })
  })
})
