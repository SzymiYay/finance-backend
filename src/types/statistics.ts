import { CurrencyType } from './transaction'

export interface Statistics {
  currency: CurrencyType
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

export interface StatisticsQuery {
  sortBy?: StatisticsSortableFields
  order?: 'ASC' | 'DESC'
  limit?: number
  offset?: number
}

export type StatisticsSortableFields =
  | 'currency'
  | 'symbol'
  | 'totalVolume'
  | 'totalCost'
  | 'currentValue'
  | 'avgPrice'
  | 'grossPL'
