/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Error } from './Error';
import type { ErrorCode } from './ErrorCode';
export type AppError = {
    name: string;
    message: string;
    stack?: string;
    errorCode: ErrorCode;
    statusCode: number;
    status: AppError.status;
    cause?: Error;
    timestamp: string;
    isOperational?: boolean;
    requestId?: string;
};
export namespace AppError {
    export enum status {
        FAIL = 'fail',
        ERROR = 'error',
    }
}

