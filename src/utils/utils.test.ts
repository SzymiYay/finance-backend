import { roundCurrency, roundVolume } from './utils'

describe('round helpers', () => {
  it('rounds currency to 2 decimals', () => {
    expect(roundCurrency(12.3456)).toBe(12.35)
  })

  it('rounds volume to 4 decimals', () => {
    expect(roundVolume(0.123456)).toBe(0.1235)
  })
})
