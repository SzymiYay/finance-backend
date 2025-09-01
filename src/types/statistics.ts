export interface Statistics {
  symbol: string
  totalVolume: number
  totalCost: number
  currentValue: number
  avgPrice: number
  grossPL: number
}

export interface TimelinePoint {
  date: string
  value: number
}
