/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrencyType } from './CurrencyType';
import type { TransactionType } from './TransactionType';
/**
 * Make all properties in T optional
 */
export type Partial_Omit_TransactionCreate_id_or_createdAt__ = {
    symbol?: string;
    accountId?: number;
    currency?: CurrencyType;
    volume?: number;
    openTime?: string;
    openPrice?: number;
    marketPrice?: number;
    purchaseValue?: number;
    grossPL?: number;
    xtbId?: number;
    type?: TransactionType;
    commission?: number;
    swap?: number;
    rollover?: number;
    comment?: string;
};

