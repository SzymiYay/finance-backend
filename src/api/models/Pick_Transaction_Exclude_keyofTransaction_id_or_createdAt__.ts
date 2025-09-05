/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionType } from './TransactionType';
/**
 * From T, pick a set of properties whose keys are in the union K
 */
export type Pick_Transaction_Exclude_keyofTransaction_id_or_createdAt__ = {
    symbol: string;
    xtbId: number;
    type: TransactionType;
    volume: number;
    openTime: string;
    openPrice: number;
    marketPrice: number;
    purchaseValue: number;
    commission: number;
    swap: number;
    rollover: number;
    grossPL: number;
    comment: string;
};

