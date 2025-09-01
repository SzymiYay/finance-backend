import { ExcelParserService } from '../services/excel.parser.service'
import { TransactionService } from '../services/transaction.service'
import { AppError } from '../errors/app.error'
import {
  Post,
  Route,
  Tags,
  UploadedFile,
  Response,
  SuccessResponse,
  Example
} from 'tsoa'
import { inject, injectable } from 'tsyringe'
import { ImportResponse } from '../types/import'

@Route('import')
@Tags('Import')
@injectable()
export class ImportController {
  constructor(
    @inject(ExcelParserService) private excelParserService: ExcelParserService,
    @inject(TransactionService) private transactionService: TransactionService
  ) {}

  /**
   * Importuje transakcje z pliku Excel.
   *
   * Endpoint przyjmuje plik w formacie `multipart/form-data` (pole `file`).
   * Zwraca liczbę zaimportowanych transakcji oraz podgląd pierwszych 5.
   *
   * @param file Plik Excel przesłany w formularzu
   * @returns Obiekt z liczbą zaimportowanych transakcji i podglądem
   */
  @Post('/')
  @SuccessResponse('200', 'Import successful')
  @Response<AppError>(400, 'No file provided')
  @Response<AppError>(500, 'Internal server error')
  @Example<ImportResponse>({
    imported: 42,
    preview: [
      {
        id: 1,
        symbol: 'AAPL',
        type: 'BUY',
        volume: 10,
        openTime: '2025-01-01T10:00:00Z',
        openPrice: 150.5,
        marketPrice: 155.0,
        purchaseValue: 1505,
        commission: 0,
        swap: 0,
        rollover: 0,
        grossPL: 45,
        comment: 'Initial buy',
        createdAt: '2025-01-01T10:00:00Z',
        xtbId: 123456
      }
    ]
  })
  public async importFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImportResponse> {
    if (!file) {
      throw AppError.notFound('File')
    }
    const transactions = this.excelParserService.parse(file.buffer)
    const savedTransactions = await this.transactionService.addTransactions(
      transactions
    )

    return {
      imported: savedTransactions.length,
      preview: savedTransactions.slice(0, 5)
    }
  }
}
