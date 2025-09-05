/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionType } from './TransactionType';
/**
 * Make all properties in T optional
 */
export type Partial_TransactionCreate_ = {
    symbol?: string;
    xtbId?: number;
    type?: TransactionType;
    volume?: number;
    openTime?: string;
    openPrice?: number;
    marketPrice?: number;
    purchaseValue?: number;
    commission?: number;
    swap?: number;
    rollover?: number;
    grossPL?: number;
    comment?: string;
};

