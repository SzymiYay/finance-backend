export class DateService {
  static formatISO(): string {
    return new Date().toISOString()
  }

  static formatCustom(format: 'pl' | 'en' | 'iso' = 'pl'): string {
    switch (format) {
      case 'en':
        return new Date().toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Europe/Warsaw'
        })
      case 'iso':
        return this.formatISO()
      default:
        return new Date().toLocaleString('pl-PL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Europe/Warsaw'
        })
    }
  }
}
