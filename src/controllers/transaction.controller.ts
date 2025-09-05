import { inject, injectable } from 'tsyringe'
import { AppError } from '../errors/app.error'
import { Transaction, TransactionType } from '../models/transaction.entity'
import { TransactionService } from '../services/transaction.service'
import {
  Controller,
  Get,
  Post,
  Route,
  Tags,
  Body,
  Path,
  Delete,
  Example,
  Response,
  SuccessResponse,
  Put
} from 'tsoa'
import { TransactionUpdate } from '../types/transaction'

@Route('transactions')
@Tags('Transactions') // grupuje endpointy w Swagger UI
@injectable()
export class TransactionController extends Controller {
  constructor(
    @inject(TransactionService) private transactionService: TransactionService
  ) {
    super()
  }

  /**
   * Tworzy nową transakcję w systemie.
   *
   * @param body Obiekt transakcji do utworzenia
   * @returns Zwraca utworzoną transakcję
   */
  @Post('/')
  @SuccessResponse('201', 'Created')
  @Response<AppError>(400, 'Invalid input')
  @Response<AppError>(500, 'Internal server error')
  @Example<Transaction>({
    id: 1,
    symbol: 'AAPL',
    type: TransactionType.BUY,
    volume: 10,
    openTime: new Date('2025-01-01T10:00:00Z'),
    openPrice: 150.5,
    marketPrice: 155.0,
    purchaseValue: 1505,
    commission: 0,
    swap: 0,
    rollover: 0,
    grossPL: 45,
    comment: 'Initial buy',
    createdAt: new Date('2025-01-01T10:00:00Z'),
    xtbId: 123456
  })
  public async create(@Body() body: Transaction): Promise<Transaction> {
    this.setStatus(201)
    return this.transactionService.addTransaction(body)
  }

  /**
   * Pobiera listę wszystkich transakcji.
   *
   * @returns Tablica transakcji
   */
  @Get('/')
  @Response<AppError>(500, 'Internal server error')
  public async getAll(): Promise<Transaction[]> {
    return this.transactionService.getTransactions()
  }

  /**
   * Pobiera szczegóły transakcji na podstawie jej ID.
   *
   * @param id Identyfikator transakcji
   * @returns Obiekt transakcji
   */
  @Get('{id}')
  @Response<AppError>(404, 'Transaction not found')
  @Response<AppError>(500, 'Internal server error')
  public async getById(@Path() id: number): Promise<Transaction> {
    const transaction = await this.transactionService.getTransaction(id)

    if (!transaction) {
      this.setStatus(404)
      throw AppError.notFound(`Transaction (id: ${id})`)
    }

    return transaction
  }

  /**
   * Aktualizuje istniejącą transakcję na podstawie jej ID.
   *
   * @param id Identyfikator transakcji
   * @param data Dane transakcji do zaktualizowania (tylko pola, które chcesz zmienić)
   * @returns Zaktualizowany biekt transakcji
   */
  @Put('{id}')
  @Response<AppError>(400, 'Invalid request body')
  @Response<AppError>(404, 'Transaction not found')
  @Response<AppError>(500, 'Internal server error')
  public async update(
    @Path() id: number,
    @Body() data: TransactionUpdate
  ): Promise<Transaction> {
    const transaction = await this.transactionService.updateTransaction(
      id,
      data
    )
    return transaction
  }

  /**
   * Usuwa transakcję na podstawie jej ID.
   *
   * @param id Identyfikator transakcji
   */
  @Delete('{id}')
  @SuccessResponse('204', 'No Content')
  @Response<AppError>(404, 'Transaction not found')
  @Response<AppError>(500, 'Internal server error')
  public async delete(@Path() id: number): Promise<void> {
    await this.transactionService.deleteTransaction(id)
    this.setStatus(204)
  }
}
