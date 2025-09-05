import 'reflect-metadata'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { errorHandler } from './middlewares/error.handler'
import { requestIdMiddleware } from './middlewares/request.id'
import { loggerHandler } from './middlewares/logger.handler'
import { log } from './utils/logger'
import { RegisterRoutes } from './routes/routes'
import * as swaggerDocument from '../docs/swagger.json'
import * as dotenv from 'dotenv'
import multer from 'multer'
import cors from 'cors'
import { AppDataSource } from './data-source'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(requestIdMiddleware)
app.use(loggerHandler)

RegisterRoutes(app)

app.use(upload.single('file'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerDocument)
})

app.use(errorHandler)

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      if (process.env.NODE_ENV === 'development') {
        log.info(`✅ Backend running on http://localhost:${PORT}`)
        log.info(`✅ Docs available on http://localhost:${PORT}/api-docs`)
      }
    })
  })
  .catch((err) => {
    log.error('❌ Error during Data Source initialization', { error: err })
    process.exit(1)
  })

process.on('unhandledRejection', (reason: unknown) => {
  log.error('Unhandled Rejection:', { reason })
  process.exit(1)
})

process.on('uncaughtException', (error: Error) => {
  log.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack
  })
  process.exit(1)
})

process.on('SIGTERM', () => {
  log.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})
