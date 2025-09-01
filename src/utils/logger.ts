import winston from 'winston'
import util from 'util'

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
      let log = `\n${timestamp} [${level}]`

      if (context) {
        log += ` [${context}]`
      }

      log += `: ${message}`

      const cleanMeta = Object.keys(meta)
        .filter((key) => typeof key === 'string')
        .reduce((obj, key) => {
          obj[key] = meta[key]
          return obj
        }, {} as any)

      if (Object.keys(cleanMeta).length > 0) {
        const formatted = util.inspect(cleanMeta, {
          colors: true,
          depth: 3,
          compact: false,
          breakLength: 80
        })
        log += `\n${formatted}`
      }

      return log
    })
  ),
  transports: [new winston.transports.Console()]
})

interface LogMeta {
  context?: string
  [key: string]: any
}

export const log = {
  error: (message: string, meta?: LogMeta) => logger.error(message, meta || {}),
  warn: (message: string, meta?: LogMeta) => logger.warn(message, meta || {}),
  info: (message: string, meta?: LogMeta) => logger.info(message, meta || {}),
  debug: (message: string, meta?: LogMeta) => logger.debug(message, meta || {})
}
