import { excelDateToJSDate, roundCurrency, roundVolume } from './utils'

describe('utils', () => {
  describe('roundCurrency', () => {
    it('should round to 2 decimal places', () => {
      expect(roundCurrency(123.456)).toBe(123.46)
      expect(roundCurrency(123.454)).toBe(123.45)
    })

    it('should return 0 for Nan', () => {
      expect(roundCurrency(NaN)).toBe(0)
    })
  })

  describe('roundVolume', () => {
    it('should round to 4 decimal places', () => {
      expect(roundVolume(1.234567)).toBe(1.2346)
      expect(roundVolume(1.23454)).toBe(1.2345)
    })

    it('should return 0 for NaN', () => {
      expect(roundVolume(NaN)).toBe(0)
    })
  })

  describe('excelDateToJSDate', () => {
    it('should convert Excel serial date to JS Date', () => {
      const result = excelDateToJSDate(3)
      expect(result.toISOString().slice(0, 10)).toBe('1900-01-02')
    })

    it('should handle larger serial numbers', () => {
      const result = excelDateToJSDate(44928)
      expect(result.toISOString().slice(0, 10)).toBe('2023-01-02')
    })
  })
})
