/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Transaction } from '../models/Transaction';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransactionsService {
    /**
     * Tworzy nową transakcję w systemie.
     * @param requestBody Obiekt transakcji do utworzenia
     * @returns Transaction Created
     * @throws ApiError
     */
    public static create(
        requestBody: Transaction,
    ): CancelablePromise<Transaction> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/transactions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Pobiera listę wszystkich transakcji.
     * @returns Transaction Tablica transakcji
     * @throws ApiError
     */
    public static getAll(): CancelablePromise<Array<Transaction>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transactions',
            errors: {
                500: `Internal server error`,
            },
        });
    }
    /**
     * Pobiera szczegóły transakcji na podstawie jej ID.
     * @param id Identyfikator transakcji
     * @returns Transaction Obiekt transakcji
     * @throws ApiError
     */
    public static getById(
        id: number,
    ): CancelablePromise<Transaction> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transactions/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Transaction not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Usuwa transakcję na podstawie jej ID.
     * @param id Identyfikator transakcji
     * @returns void
     * @throws ApiError
     */
    public static delete(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/transactions/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Transaction not found`,
                500: `Internal server error`,
            },
        });
    }
}
