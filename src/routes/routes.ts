/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TransactionController } from './../controllers/transaction.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StatisticsController } from './../controllers/statistics.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ImportController } from './../controllers/import.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HealthController } from './../controllers/health.controller';
import { iocContainer } from './../ioc';
import type { IocContainer, IocContainerFactory } from '@tsoa/runtime';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
const multer = require('multer');




// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "TransactionType": {
        "dataType": "refEnum",
        "enums": ["BUY","SELL"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Transaction": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "xtbId": {"dataType":"double","required":true},
            "symbol": {"dataType":"string","required":true},
            "type": {"ref":"TransactionType","required":true},
            "volume": {"dataType":"double","required":true},
            "openTime": {"dataType":"datetime","required":true},
            "openPrice": {"dataType":"double","required":true},
            "marketPrice": {"dataType":"double","required":true},
            "purchaseValue": {"dataType":"double","required":true},
            "commission": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "swap": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "rollover": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "grossPL": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "comment": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "createdAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorCode": {
        "dataType": "refEnum",
        "enums": ["VALIDATION_ERROR","AUTHENTICATION_FAILED","AUTHORIZATION_FAILED","RESOURCE_NOT_FOUND","DUPLICATE_RESOURCE","RATE_LIMIT_EXCEEDED","INVALID_INPUT","INTERNAL_SERVER_ERROR","DATABASE_CONNECTION_ERROR","EXTERNAL_SERVICE_ERROR","SERVICE_UNAVAILABLE"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Error": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "stack": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AppError": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "stack": {"dataType":"string"},
            "errorCode": {"ref":"ErrorCode","required":true},
            "statusCode": {"dataType":"double","required":true},
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["fail"]},{"dataType":"enum","enums":["error"]}],"required":true},
            "cause": {"ref":"Error"},
            "timestamp": {"dataType":"string","required":true},
            "isOperational": {"dataType":"boolean","default":true},
            "requestId": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_TransactionCreate_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"symbol":{"dataType":"string"},"xtbId":{"dataType":"double"},"type":{"ref":"TransactionType"},"volume":{"dataType":"double"},"openTime":{"dataType":"datetime"},"openPrice":{"dataType":"double"},"marketPrice":{"dataType":"double"},"purchaseValue":{"dataType":"double"},"commission":{"dataType":"double"},"swap":{"dataType":"double"},"rollover":{"dataType":"double"},"grossPL":{"dataType":"double"},"comment":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionUpdate": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_TransactionCreate_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Statistics": {
        "dataType": "refObject",
        "properties": {
            "symbol": {"dataType":"string","required":true},
            "totalVolume": {"dataType":"double","required":true},
            "totalCost": {"dataType":"double","required":true},
            "currentValue": {"dataType":"double","required":true},
            "avgPrice": {"dataType":"double","required":true},
            "grossPL": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TimelinePoint": {
        "dataType": "refObject",
        "properties": {
            "date": {"dataType":"string","required":true},
            "value": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Transaction.Exclude_keyofTransaction.id-or-createdAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"symbol":{"dataType":"string","required":true},"xtbId":{"dataType":"double","required":true},"type":{"ref":"TransactionType","required":true},"volume":{"dataType":"double","required":true},"openTime":{"dataType":"datetime","required":true},"openPrice":{"dataType":"double","required":true},"marketPrice":{"dataType":"double","required":true},"purchaseValue":{"dataType":"double","required":true},"commission":{"dataType":"double","required":true},"swap":{"dataType":"double","required":true},"rollover":{"dataType":"double","required":true},"grossPL":{"dataType":"double","required":true},"comment":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Transaction.id-or-createdAt_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Transaction.Exclude_keyofTransaction.id-or-createdAt__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionCreate": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_Transaction.id-or-createdAt_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ImportResponse": {
        "dataType": "refObject",
        "properties": {
            "imported": {"dataType":"double","required":true},
            "preview": {"dataType":"array","array":{"dataType":"refAlias","ref":"TransactionCreate"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HealthStatus": {
        "dataType": "refObject",
        "properties": {
            "server": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["healthy"]},{"dataType":"enum","enums":["unhealthy"]}],"required":true},
            "database": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["healthy"]},{"dataType":"enum","enums":["unhealthy"]}],"required":true},
            "message": {"dataType":"string"},
            "timestamp": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
        const argsTransactionController_create: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"Transaction"},
        };
        app.post('/transactions',
            ...(fetchMiddlewares<RequestHandler>(TransactionController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionController.prototype.create)),

            async function TransactionController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransactionController_create, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TransactionController>(TransactionController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransactionController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/transactions',
            ...(fetchMiddlewares<RequestHandler>(TransactionController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionController.prototype.getAll)),

            async function TransactionController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransactionController_getAll, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TransactionController>(TransactionController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getAll',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransactionController_getById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/transactions/:id',
            ...(fetchMiddlewares<RequestHandler>(TransactionController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionController.prototype.getById)),

            async function TransactionController_getById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransactionController_getById, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TransactionController>(TransactionController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransactionController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                data: {"in":"body","name":"data","required":true,"ref":"TransactionUpdate"},
        };
        app.put('/transactions/:id',
            ...(fetchMiddlewares<RequestHandler>(TransactionController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionController.prototype.update)),

            async function TransactionController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransactionController_update, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TransactionController>(TransactionController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTransactionController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/transactions/:id',
            ...(fetchMiddlewares<RequestHandler>(TransactionController)),
            ...(fetchMiddlewares<RequestHandler>(TransactionController.prototype.delete)),

            async function TransactionController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTransactionController_delete, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<TransactionController>(TransactionController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'delete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStatisticsController_getStats: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/statistics',
            ...(fetchMiddlewares<RequestHandler>(StatisticsController)),
            ...(fetchMiddlewares<RequestHandler>(StatisticsController.prototype.getStats)),

            async function StatisticsController_getStats(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStatisticsController_getStats, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<StatisticsController>(StatisticsController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getStats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsStatisticsController_getTimeline: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/statistics/timeline',
            ...(fetchMiddlewares<RequestHandler>(StatisticsController)),
            ...(fetchMiddlewares<RequestHandler>(StatisticsController.prototype.getTimeline)),

            async function StatisticsController_getTimeline(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsStatisticsController_getTimeline, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<StatisticsController>(StatisticsController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getTimeline',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsImportController_importFile: Record<string, TsoaRoute.ParameterSchema> = {
                file: {"in":"formData","name":"file","required":true,"dataType":"file"},
        };
        app.post('/import',
            upload.fields([
                {
                    name: "file",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(ImportController)),
            ...(fetchMiddlewares<RequestHandler>(ImportController.prototype.importFile)),

            async function ImportController_importFile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsImportController_importFile, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<ImportController>(ImportController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'importFile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsHealthController_getStatus: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/health',
            ...(fetchMiddlewares<RequestHandler>(HealthController)),
            ...(fetchMiddlewares<RequestHandler>(HealthController.prototype.getStatus)),

            async function HealthController_getStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsHealthController_getStatus, request, response });

                const container: IocContainer = typeof iocContainer === 'function' ? (iocContainer as IocContainerFactory)(request) : iocContainer;

                const controller: any = await container.get<HealthController>(HealthController);
                if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
                }

              await templateService.apiHandler({
                methodName: 'getStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
