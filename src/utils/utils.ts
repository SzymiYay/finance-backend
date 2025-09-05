export function roundCurrency(value: number): number {
  if (isNaN(value)) return 0
  return Math.round(value * 100) / 100
}

export function roundVolume(value: number): number {
  if (isNaN(value)) return 0
  return Math.round(value * 10000) / 10000
}

export function excelDateToJSDate(serial: number): Date {
  const excelEpoch = new Date(1899, 11, 30)
  return new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000)
}
