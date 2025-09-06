import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'
import { TransactionType } from '../types/transaction'

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'xtb_id' })
  xtbId!: number

  @Column()
  symbol!: string

  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType

  @Column('float')
  volume!: number

  @Column({ name: 'open_time', type: 'timestamp' })
  openTime!: Date

  @Column({ name: 'open_price', type: 'float' })
  openPrice!: number

  @Column({ name: 'market_price', type: 'float' })
  marketPrice!: number

  @Column({ name: 'purchase_value', type: 'float' })
  purchaseValue!: number

  @Column('float', { nullable: true })
  commission!: number | null

  @Column('float', { nullable: true })
  swap!: number | null

  @Column('float', { nullable: true })
  rollover!: number | null

  @Column({ name: 'gross_pl', nullable: true, type: 'float' })
  grossPL!: number | null

  @Column('text', { nullable: true })
  comment!: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt!: Date | null
}
