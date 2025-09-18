import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Transaction } from './models/transaction.entity'
import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.SUPABASE_DB_URL) {
  throw new Error('❌ SUPABASE_DB_URL is not defined in .env')
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  logging: process.env.NODE_ENV === 'debug',
  entities: [Transaction],
  migrations: [__dirname + '/../migrations/*{.ts,.js}']
})
