/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceStatus } from './ServiceStatus';
export type SystemHealth = {
    server: ServiceStatus;
    database: ServiceStatus;
    message?: string;
    timestamp: string;
};

