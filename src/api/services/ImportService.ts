/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportResponse } from '../models/ImportResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ImportService {
    /**
     * Importuje transakcje z pliku Excel.
     *
     * Endpoint przyjmuje plik w formacie `multipart/form-data` (pole `file`).
     * Zwraca liczbę zaimportowanych transakcji oraz podgląd pierwszych 5.
     * @param formData
     * @returns ImportResponse Import successful
     * @throws ApiError
     */
    public static importFile(
        formData: {
            /**
             * Plik Excel przesłany w formularzu
             */
            file: Blob;
        },
    ): CancelablePromise<ImportResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/import',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `No file provided`,
                500: `Internal server error`,
            },
        });
    }
}
