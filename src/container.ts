import { container } from 'tsyringe'
import { TransactionRepository } from './repositories/transaction.repository'
import { TransactionService } from './services/transaction.service'
import { TransactionController } from './controllers/transaction.controller'
import { StatisticsService } from './services/statistics.service'
import { StatisticsController } from './controllers/statistics.controller'

container.registerSingleton(TransactionRepository, TransactionRepository)
container.registerSingleton(TransactionService, TransactionService)
container.registerSingleton(TransactionController, TransactionController)

container.registerSingleton(StatisticsService)
container.registerSingleton(StatisticsController)

export { container }
