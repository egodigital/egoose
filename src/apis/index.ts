/**
 * This file is part of the @egodigital/egoose distribution.
 * Copyright (c) e.GO Digital GmbH, Aachen, Germany (http://www.e-go-digital.com/)
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

import { asArray, cloneObj, normalizeString, toStringSafe } from '../index';
import * as _ from 'lodash';
import { Response } from 'express';
import { readFile, readFileSync } from 'fs-extra';
import * as Path from 'path';

/**
 * An entry for an API error.
 */
export interface ApiError {
    /**
     * German (de)
     */
    de?: string;
    /**
     * English (en)
     */
    en: string;
}

/**
 * A possible value for 'importApiErrors()' and 'importApiErrorsSync()' functions.
 *
 * If STRING: The path to the JSON file to import.
 * If BUFFER: The binary content as UTF-8 JSON data.
 * If OBJECT or ARRAY: One or more items to import.
 */
export type ImportApiErrorsArgument = string | Buffer | ApiErrorWithKey | ApiErrorWithKey[];

/**
 * An entry for an API error with a key.
 */
export interface ApiErrorWithKey extends ApiError {
    key: string;
}

interface ApiResponse {
    data: any;
    errors: ApiError[];
    success: boolean;
}

/**
 * An api result.
 */
export interface ApiResult {
    /**
     * The (optional) data.
     */
    data?: any;
    /**
     * A list of one or more error keys.
     */
    errors?: string | string[];
    /**
     * A value, which indicates if the operation was successfull or not.
     */
    success: boolean;
}

/**
 * Additional options for 'sendResponse()' function.
 */
export interface SendResponseOptions {
    /**
     * A custom status code.
     */
    code?: number;
}

/**
 * Global list of API errors.
 */
export const API_ERRORS: { [name: string]: ApiError } = {};

function applyApiErrors(errors: ApiErrorWithKey[]) {
    errors = asArray(errors);

    for (const ERR of errors) {
        const KEY = normalizeString(ERR.key);

        const CLONED_ERR = cloneObj(ERR);
        delete CLONED_ERR['key'];

        API_ERRORS[KEY] = cloneObj(CLONED_ERR);
    }
}

/**
 * Imports the data for 'API_ERRORS' constant.
 *
 * @param {ImportApiErrorsArgument} errors The items to import.
 */
export async function importApiErrors(errors: ImportApiErrorsArgument) {
    let importedErrorList: ApiErrorWithKey[];
    if (_.isString(errors)) {
        if (!Path.isAbsolute(errors)) {
            errors = Path.join(
                process.cwd(), errors
            );
        }

        importedErrorList = JSON.parse(
            (await readFile(errors)).toString('utf8')
        );
    } else if (Buffer.isBuffer(errors)) {
        importedErrorList = JSON.parse(
            errors.toString('utf8')
        );
    } else {
        importedErrorList = <any>errors;
    }

    applyApiErrors(importedErrorList);
}

/**
 * Imports the data for 'API_ERRORS' constant (sync).
 *
 * @param {ImportApiErrorsArgument} errors The items to import.
 */
export function importApiErrorsSync(errors: ImportApiErrorsArgument) {
    let importedErrorList: ApiErrorWithKey[];
    if (_.isString(errors)) {
        if (!Path.isAbsolute(errors)) {
            errors = Path.join(
                process.cwd(), errors
            );
        }

        importedErrorList = JSON.parse(
            readFileSync(errors).toString('utf8')
        );
    } else if (Buffer.isBuffer(errors)) {
        importedErrorList = JSON.parse(
            errors.toString('utf8')
        );
    } else {
        importedErrorList = <any>errors;
    }

    applyApiErrors(importedErrorList);
}

/**
 * Sends an API response.
 *
 * @param {Response} res The response context.
 * @param {ApiResult} result The result context.
 * @param {SendResponseOptions} [opts] Custom options.
 *
 * @return {Response} The current response context.
 */
export function sendResponse(res: Response, result: ApiResult, opts?: SendResponseOptions): Response {
    if (_.isNil(opts)) {
        opts = <any>{};
    }

    const API_RESP: ApiResponse = {
        data: result.data,
        errors: asArray(result.errors).map(key => {
            return API_ERRORS[key];
        }),
        success: !!result.success,
    };

    let code = parseInt(toStringSafe(opts.code).trim());
    if (isNaN(code)) {
        code = 200;
    }

    return res.status(code)
        .header('Content-type', 'application/json; charset=utf-8')
        .send(new Buffer(JSON.stringify(API_RESP), 'utf8'));
}
