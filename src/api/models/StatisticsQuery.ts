/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatisticsSortableFields } from './StatisticsSortableFields';
export type StatisticsQuery = {
    sortBy?: StatisticsSortableFields;
    order?: StatisticsQuery.order;
    limit?: number;
    offset?: number;
};
export namespace StatisticsQuery {
    export enum order {
        ASC = 'ASC',
        DESC = 'DESC',
    }
}

