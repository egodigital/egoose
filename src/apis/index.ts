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

import { asArray, cloneObj, getAppVersionSync, normalizeString, toBooleanSafe, toStringSafe } from '../index';
import { getCpuUsage, getDiskSpace } from '../system';
import * as _ from 'lodash';
import { Response } from 'express';
import { readFile, readFileSync } from 'fs-extra';
import * as moment from 'moment';
import * as os from 'os';
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
 * An entry for an API error with a key.
 */
export interface ApiErrorWithKey extends ApiError {
    key: string;
}

interface ApiResponse {
    data: any;
    errors: string[] | ApiError[];
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
 * Options for 'createMonitoringApiResult()' function.
 */
export interface CreateMonitoringApiResultOptions {
    /**
     * The custom working directory.
     */
    cwd?: string;
    /**
     * An optional function, which checks a database connection.
     */
    databaseConnectionChecker?: () => boolean | PromiseLike<boolean>;
    /**
     * Also return version information about the app.
     */
    withAppVersion?: boolean;
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
 * A result of a 'createMonitoringApiResult()' function call.
 */
export interface MonitoringApiResult {
    /**
     * The CPU usage in percentage.
     */
    cpu_load: number;
    /**
     * Indicates if a database connection is established or available.
     */
    database_connected?: boolean;
    /**
     * The total disk space, in bytes.
     */
    disk_space: number;
    /**
     * The total disk space in use, in bytes.
     */
    disk_space_used: number;
    /**
     * The total ram, in bytes.
     */
    ram: number;
    /**
     * The ram in use, in bytes.
     */
    ram_used: number;
    /**
     * Information about the version of the app.
     */
    version?: MonitoringApiAppVersion;
}

/**
 * Stores version information about the app for a monitoring API result.
 */
export interface MonitoringApiAppVersion {
    /**
     * The last commit date. Contains (false), if failed.
     */
    date?: string | false;
    /**
     * The last commit hash. Contains (false), if failed.
     */
    hash?: string | false;
}

/**
 * Additional options for 'sendResponse()' function.
 */
export interface SendResponseOptions {
    /**
     * A custom status code.
     */
    code?: number;
    /**
     * Returns error keys only or ApiError objects.
     */
    errorKeysOnly?: boolean;
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
 * Creates an object for an result of a monitoring API endpoint.
 *
 * @param {CreateMonitoringApiResultOptions} [opts] Custom options.
 *
 * @return {Promise<MonitoringApiResult>} The promise with the result (object).
 */
export async function createMonitoringApiResult(
    opts?: CreateMonitoringApiResultOptions
): Promise<MonitoringApiResult> {
    if (_.isNil(opts)) {
        opts = <any>{};
    }

    let cpu_load: number;
    try {
        cpu_load = await getCpuUsage();
    } catch { } finally {
        if (isNaN(cpu_load)) {
            cpu_load = -1;
        }
    }

    let database_connected: boolean;
    try {
        const CONNECTION_CHECKER = opts.databaseConnectionChecker;
        if (!_.isNil(CONNECTION_CHECKER)) {
            database_connected = toBooleanSafe(
                await Promise.resolve(
                    CONNECTION_CHECKER()
                )
            );
        }
    } catch {
        database_connected = false;
    }

    let disk_space: number;
    let disk_space_used: number;
    try {
        const DS = await getDiskSpace();

        disk_space = DS.total;
        disk_space_used = DS.used;
    } catch { } finally {
        if (isNaN(disk_space)) {
            disk_space = -1;
        }

        if (isNaN(disk_space_used)) {
            disk_space_used = -1;
        }
    }

    let ram: number;
    let ram_used: number;
    try {
        ram = parseInt(
            toStringSafe(
                os.totalmem()
            ).trim()
        );

        ram_used = ram - parseInt(
            toStringSafe(
                os.freemem()
            ).trim()
        );
    } catch { } finally {
        if (isNaN(ram)) {
            ram = -1;
        }

        if (isNaN(ram_used)) {
            ram_used = -1;
        }
    }

    let version: MonitoringApiAppVersion;
    if (toBooleanSafe(opts.withAppVersion, true)) {
        const APP_VERSION = getAppVersionSync({
            cwd: opts.cwd,
        });

        version = {
            date: !APP_VERSION.date ? <any>APP_VERSION.date
                : (<moment.Moment>APP_VERSION.date).toISOString(),
            hash: APP_VERSION.hash,
        };
    }

    return {
        cpu_load: cpu_load,
        database_connected: database_connected,
        disk_space: disk_space,
        disk_space_used: disk_space_used,
        ram: ram,
        ram_used: ram_used,
        version: version,
    };
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
        errors: undefined,
        success: !!result.success,
    };

    let code = parseInt(toStringSafe(opts.code).trim());
    if (isNaN(code)) {
        code = 200;
    }

    if (toBooleanSafe(opts.errorKeysOnly)) {
        API_RESP.errors = asArray(result.errors).map(key => {
            return toStringSafe(key);
        });
    } else {
        API_RESP.errors = asArray(result.errors).map(key => {
            return API_ERRORS[key];
        });
    }

    return res.status(code)
        .header('Content-type', 'application/json; charset=utf-8')
        .send(new Buffer(JSON.stringify(API_RESP), 'utf8'));
}
