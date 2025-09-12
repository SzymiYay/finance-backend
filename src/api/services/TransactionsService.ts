/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResult_Transaction_ } from '../models/PaginatedResult_Transaction_';
import type { Partial_Omit_TransactionCreate_id_or_createdAt__ } from '../models/Partial_Omit_TransactionCreate_id_or_createdAt__';
import type { Transaction } from '../models/Transaction';
import type { TransactionCreate } from '../models/TransactionCreate';
import type { TransactionSortableFields } from '../models/TransactionSortableFields';
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
        requestBody: TransactionCreate,
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
     * @param sortBy
     * @param order
     * @param limit
     * @param offset
     * @returns PaginatedResult_Transaction_ Tablica transakcji
     * @throws ApiError
     */
    public static getAll(
        sortBy?: TransactionSortableFields,
        order?: 'ASC' | 'DESC',
        limit?: number,
        offset?: number,
    ): CancelablePromise<PaginatedResult_Transaction_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/transactions',
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
     * Aktualizuje istniejącą transakcję na podstawie jej ID.
     * @param id Identyfikator transakcji
     * @param requestBody Dane transakcji do zaktualizowania (tylko pola, które chcesz zmienić)
     * @returns Transaction Zaktualizowany biekt transakcji
     * @throws ApiError
     */
    public static update(
        id: number,
        requestBody: Partial_Omit_TransactionCreate_id_or_createdAt__,
    ): CancelablePromise<Transaction> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/transactions/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
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
