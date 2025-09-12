/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrencyType } from './CurrencyType';
import type { TransactionType } from './TransactionType';
export type Transaction = {
    id: number;
    accountId: number;
    xtbId: number;
    currency: CurrencyType;
    symbol: string;
    type: TransactionType;
    volume: number;
    openTime: string;
    openPrice: number;
    marketPrice: number;
    purchaseValue: number;
    commission: number | null;
    swap: number | null;
    rollover: number | null;
    grossPL: number | null;
    comment: string | null;
    createdAt: string | null;
};

