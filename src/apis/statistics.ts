/**
 * This file is part of the @egodigital/egoose distribution.
 * Copyright (c) e.GO Digital GmbH, Aachen, Germany (https://www.e-go-digital.com/)
 *
 * @egodigital/egoose is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * @egodigital/egoose is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { normalizeString, toBooleanSafe, toStringSafe } from '../index';
import { StatisticParameters, StatisticProvider, StatisticResultRow } from '../statistics/index';
import * as express from 'express';

/**
 * Options for 'registerStatisticsEndpoint()' function.
 */
export interface RegisterStatisticsEndpointOptions {
    /**
     * A custom function that is invoked AFTER a request.
     *
     * @param {any} err The error (if occurred).
     * @param {express.Request} request The request context.
     * @param {express.Response} response The response context.
     */
    afterRequest?: (err: any, request: express.Request, response: express.Response) => any;
    /**
     * A function that checks if a request is authorized to access the endpoint or not.
     *
     * @return {boolean|PromiseLike<boolean>} The result that indicates if request is authorized or not.
     */
    authorizer?: (request: express.Request) => boolean | PromiseLike<boolean>;
    /**
     * A custom function that is invoked BEFORE a request is handled.
     *
     * @param {express.Request} request The request context.
     * @param {express.Response} response The response context.
     */
    beforeRequest?: (request: express.Request, response: express.Response) => any;
    /**
     * A function that detects a statistic provider by name.
     */
    providerDetector: StatisticProviderDetector;
    /**
     * A custom response handler.
     *
     * @param {StatisticProviderApiResult} result The result to handle.
     * @param {express.Response} response The response context.
     * @param {express.Request} request The request context.
     *
     * @return {express.Response|PromiseLike<express.Response>} The (new) response context.
     */
    responseHandler?: (
        result: StatisticProviderApiResult,
        response: express.Response, request: express.Request
    ) => express.Response | PromiseLike<express.Response>;
}

/**
 * A result of statistic end point call.
 */
export interface StatisticProviderApiResult {
    /**
     * Indicates if there are more rows or not.
     */
    hasMore: boolean;
    /**
     * The zero based offset.
     */
    offset: number;
    /**
     * The list of rows.
     */
    rows: StatisticResultRow[];
    /**
     * The total number of rows.
     */
    totalCount: number;
}

/**
 * A function that detects a statistic provider by name.
 *
 * @param {string} name The name of the provider, in lower case letters.
 * @param {express.Request} request The request context.
 *
 * @return {StatisticProviderDetectorResult|PromiseLike<StatisticProviderDetectorResult>} The result.
 */
export type StatisticProviderDetector = (
    name: string,
    request: express.Request,
) => StatisticProviderDetectorResult | PromiseLike<StatisticProviderDetectorResult>;

/**
 * The result of a statistic provider detection function.
 */
export type StatisticProviderDetectorResult = StatisticProvider | false;

/**
 * Registers an API endpoint for providing statistics.
 *
 * @param {express.Express | express.Router} hostOrRouter The host or router.
 * @param {RegisterStatisticsEndpointOptions} opts The options for the registration.
 */
export function registerStatisticsEndpoint(
    hostOrRouter: express.Express | express.Router,
    opts: RegisterStatisticsEndpointOptions,
) {
    hostOrRouter.get('/stats/:name', async function(req, res) {
        let err: any;
        try {
            if (opts.beforeRequest) {
                await Promise.resolve(
                    opts.beforeRequest(req, res)
                );
            }

            let authorized = true;
            if (opts.authorizer) {
                authorized = toBooleanSafe(
                    await Promise.resolve(
                        opts.authorizer(req)
                    )
                );
            }

            if (!authorized) {
                // not authorized
                return res.status(401)
                    .send();
            }

            // offset
            let offset = parseInt(
                toStringSafe(
                    req.query['o']
                ).trim()
            );

            // limit
            let limit = parseInt(
                toStringSafe(
                    req.query['l']
                ).trim()
            );

            const NAME = normalizeString(req.params['name']);
            if ('' !== NAME) {
                const PROVIDER = await Promise.resolve(
                    opts.providerDetector(NAME, req)
                );

                if (PROVIDER) {
                    const RESULT = await PROVIDER.load({
                        limit: limit,
                        offset: offset,
                        parameters: toStatisticParameters(req.query),
                    });

                    let handler = opts.responseHandler;
                    if (!handler) {
                        // use default

                        handler = (result, response) => {
                            return response.status(200)
                                .header('Content-type', 'application/json; charset=utf-8')
                                .send(Buffer.from(JSON.stringify(result), 'utf8'));
                        };
                    }

                    return await Promise.resolve(
                        handler({
                            hasMore: RESULT.hasMore,
                            offset: RESULT.offset,
                            rows: RESULT.rows,
                            totalCount: RESULT.totalCount,
                        }, res, req)
                    );
                }
            }

            // not found
            return res.status(404)
                .send();
        } catch (e) {
            err = e;

            // server error
            return res.status(500)
                .send();
        } finally {
            if (opts.afterRequest) {
                await Promise.resolve(
                    opts.afterRequest(err, req, res)
                );
            }
        }
    });
}

function toStatisticParameters(query: any): StatisticParameters {
    const PARAMS: StatisticParameters = {};
    if (query) {
        for (const P in query) {
            PARAMS[
                normalizeString(P)
            ] = query[P];
        }
    }

    return PARAMS;
}
