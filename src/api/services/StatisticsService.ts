/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResult_Statistics_ } from '../models/PaginatedResult_Statistics_';
import type { StatisticsSortableFields } from '../models/StatisticsSortableFields';
import type { TimelinePoint } from '../models/TimelinePoint';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatisticsService {
    /**
     * Pobiera aktualne statystyki portfela.
     *
     * Zwraca listę pozycji w portfelu wraz z:
     * - symbolem,
     * - łącznym wolumenem,
     * - średnią ceną zakupu,
     * - bieżącą wartością,
     * - zyskiem/stratą brutto.
     * @param sortBy
     * @param order
     * @param limit
     * @param offset
     * @returns PaginatedResult_Statistics_ OK
     * @throws ApiError
     */
    public static getStats(
        sortBy?: StatisticsSortableFields,
        order?: 'ASC' | 'DESC',
        limit?: number,
        offset?: number,
    ): CancelablePromise<PaginatedResult_Statistics_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics',
            query: {
                'sortBy': sortBy,
                'order': order,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                500: `Internal server error`,
            },
        });
    }
    /**
     * Pobiera historię wartości portfela w czasie.
     *
     * Zwraca tablicę punktów czasowych (data + wartość portfela).
     * @returns TimelinePoint OK
     * @throws ApiError
     */
    public static getTimeline(): CancelablePromise<Array<TimelinePoint>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics/timeline',
            errors: {
                500: `Internal server error`,
            },
        });
    }
}
