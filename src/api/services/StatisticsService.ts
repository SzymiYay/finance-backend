/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Statistics } from '../models/Statistics';
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
     * @returns Statistics OK
     * @throws ApiError
     */
    public static getStats(): CancelablePromise<Array<Statistics>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/statistics',
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
