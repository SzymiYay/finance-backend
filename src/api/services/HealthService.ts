/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SystemHealth } from '../models/SystemHealth';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * Sprawdza status działania aplikacji i jej zależności.
     *
     * Zwraca informacje o:
     * - statusie aplikacji
     * - statusie połączenia z bazą danych,
     * - znaczniku czasu.
     * @returns SystemHealth OK
     * @throws ApiError
     */
    public static getStatus(): CancelablePromise<SystemHealth> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
            errors: {
                500: `Internal server error`,
            },
        });
    }
}
