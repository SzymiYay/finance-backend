/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrencyType } from './CurrencyType';
import type { TransactionType } from './TransactionType';
export type TransactionCreate = {
    comment?: string;
    grossPL?: number;
    rollover?: number;
    swap?: number;
    commission?: number;
    purchaseValue: number;
    marketPrice: number;
    openPrice: number;
    openTime: string;
    volume: number;
    type: TransactionType;
    symbol: string;
    currency: CurrencyType;
    xtbId: number;
    accountId: number;
};

