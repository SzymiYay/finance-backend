/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionSortableFields } from './TransactionSortableFields';
export type TransactionQuery = {
    sortBy?: TransactionSortableFields;
    order?: TransactionQuery.order;
    limit?: number;
    offset?: number;
};
export namespace TransactionQuery {
    export enum order {
        ASC = 'ASC',
        DESC = 'DESC',
    }
}

