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

import * as _ from 'lodash';
import * as express from 'express';
import * as joi from 'joi';
import { toBooleanSafe } from '../index';
import { OptionsJson } from 'body-parser';

/**
 * Options for 'jsonObject()' function.
 */
export interface JsonObjectOptions {
    /**
     * Indicates if input body can be (null) or not.
     */
    canBeNull?: boolean;
    /**
     * Indicates if input body can be (undefined) or not.
     */
    canBeUndefined?: boolean;
    /**
     * A custom function, that handles a failed validation.
     */
    failedHandler?: JsonObjectValidationFailedHandler;
    /**
     * Custom options for the Express json() middleware.
     */
    options?: OptionsJson;
    /**
     * The optional schema to use.
     */
    schema?: joi.ObjectSchema;
}

/**
 * A function that returns the response for a failed JSON validation.
 *
 * @param {JsonObjectValidationFailedHandlerContext} context The context.
 *
 * @return {express.Response|PromiseLike<express.Response>} The result with the (new) response context.
 */
export type JsonObjectValidationFailedHandler =
    (context: JsonObjectValidationFailedHandlerContext) => (express.Response | PromiseLike<express.Response>);

/**
 * Context of a 'JsonValidationFailedHandler'.
 */
export interface JsonObjectValidationFailedHandlerContext {
    /**
     * The original value of the request body.
     */
    body: any;
    /**
     * An object or value, whichs contains the validation error details.
     */
    details: any;
    /**
     * An object or value, which represents an ID, that describes the reason.
     */
    reason: any;
    /**
     * The current HTTP request context.
     */
    request: express.Request;
     /**
      * The current HTTP response context.
      */
    response: express.Response;
}

/**
 * Creates Express middlewares for validating JSON input.
 *
 * @param {JsonObjectOptions|joi.ObjectSchema} [optsOrSchema] Custom options or schema.
 *
 * @return {express.RequestHandler[]} The created handler(s).
 */
export function jsonObject(
    optsOrSchema?: JsonObjectOptions | joi.ObjectSchema
): express.RequestHandler[] {
    let opts: JsonObjectOptions;

    if (optsOrSchema) {
        if (optsOrSchema['isJoi']) {
            opts = <any>{
                schema: optsOrSchema as joi.ObjectSchema,
            };
        } else {
            opts = optsOrSchema as JsonObjectOptions;
        }
    }

    if (!opts) {
        opts = <any>{};
    }

    let failedHandler = opts.failedHandler;
    if (!failedHandler) {
        // default

        failedHandler = (ctx) => {
            const RESULT = {
                success: false,
                data: {
                    details: ctx.details,
                    reason: ctx.reason,
                },
            };

            return ctx.response
                .status(400)
                .header('content-type', 'application/json; charset=utf-8')
                .send(Buffer.from(JSON.stringify(RESULT), 'utf8'));
        };
    }

    const HANDLERS: express.RequestHandler[] = [];

    HANDLERS.push(
        express.json(opts.options)
    );

    if (opts.schema) {
        HANDLERS.push(async function (req, res, next) {
            let reason: any = 'no_object';
            let details: any;

            const BODY = req.body;

            if (_.isNull(BODY) && toBooleanSafe(opts.canBeNull)) {
                return next();  // can be (null)
            }
            if (_.isUndefined(BODY) && toBooleanSafe(opts.canBeUndefined)) {
                return next();  // can be (undefined)
            }

            if (_.isObjectLike(BODY)) {
                reason = 'invalid_structure';

                const JSON_VALIDATION = opts.schema.validate(BODY);
                if (_.isNil(JSON_VALIDATION.error)) {
                    return next();
                } else {
                    details = JSON_VALIDATION.error.message;
                }
            }

            return await Promise.resolve(
                failedHandler({
                    body: BODY,
                    details: details,
                    reason: reason,
                    request: req,
                    response: res,
                })
            );
        });
    } else {
        // check if JSON only

        HANDLERS.push(async function (req, res, next) {
            let reason: any = 'no_object';
            let details: any;

            const BODY = req.body;

            if (_.isNull(BODY) && toBooleanSafe(opts.canBeNull)) {
                return next();  // can be (null)
            }
            if (_.isUndefined(BODY) && toBooleanSafe(opts.canBeUndefined)) {
                return next();  // can be (undefined)
            }

            if (_.isObjectLike(BODY)) {
                return next();
            }

            details = `Request body is of type '${ _.isNull(BODY) ? 'null' : (typeof BODY) }'`;

            return await Promise.resolve(
                failedHandler({
                    body: BODY,
                    details: details,
                    reason: reason,
                    request: req,
                    response: res,
                })
            );
        });
    }

    return HANDLERS;
}
