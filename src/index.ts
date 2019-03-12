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

import { exec as execChildProcess, execSync } from 'child_process';
import * as _ from 'lodash';
import * as crypto from 'crypto';
import * as Enumerable from 'node-enumerable';
import * as path from 'path';
import * as moment from 'moment-timezone';
import * as util from 'util';
import * as UUID from 'uuid';
import * as UUID_v5 from 'uuid/v5';

/**
 * Stores version information about the app.
 */
export interface AppVersion {
    /**
     * The last commit date. Contains (false), if failed.
     */
    date?: moment.Moment | false;
    /**
     * The last commit hash. Contains (false), if failed.
     */
    hash?: string | false;
}

/**
 * Describes a simple 'completed' action.
 *
 * @param {any} err The occurred error.
 * @param {TResult} [result] The result.
 */
export type CompletedAction<TResult> = (err: any, result?: TResult) => void;

/**
 * Result of 'exec()' function.
 */
export interface ExecResult {
    /**
     * The error stream.
     */
    stderr: string;
    /**
     * The standard stream.
     */
    stdout: string;
}

/**
 * An action for an async 'forEach'.
 *
 * @param {T} item The current item.
 * @param {number} index The zero-based index.
 */
export type ForEachAsyncAction<T> = (item: T, index: number) => void | Promise<void>;

/**
 * Options for 'getAppVersion()' function(s).
 */
export interface GetAppVersionOptions {
    /**
     * The custom working directory.
     */
    cwd?: string;
}

/**
 * Applies an object or value to a function.
 *
 * @param {TFunc} func The function to apply 'thisArg' to.
 * @param {any} thisArg The object or value to apply to 'func'.
 *
 * @return {TFunc} The new function.
 */
export function applyFuncFor<TFunc extends Function = Function>(
    func: TFunc, thisArg: any
): TFunc {
    return <any>function() {
        return func.apply(thisArg, arguments);
    };
}

/**
 * Returns an input value as array.
 *
 * @param {T|T[]} val The input value.
 * @param {boolean} [noEmpty] Remove values, which are (null) or (undefined).
 *
 * @return {T[]} The input value as array.
 */
export function asArray<T>(val: T | T[], noEmpty = true): T[] {
    if (!Array.isArray(val)) {
        val = [val];
    }

    return val.filter(x => {
        if (noEmpty) {
            return !_.isNil(x);
        }

        return true;
    });
}

/**
 * Keeps sure that a value is a Moment instance (local timezone).
 *
 * @param {any} time The input value.
 *
 * @return {moment.Moment} The Moment instance.
 */
export function asLocal(time: any): moment.Moment {
    let result = asMoment(time);

    if (!_.isNil(result)) {
        if (result.isValid()) {
            if (!result.isLocal()) {
                result = result.local();
            }
        }
    }

    return result;
}

/**
 * Keeps sure that a value is a Moment instance.
 *
 * @param {any} val The input value.
 *
 * @return {moment.Moment} The Moment instance.
 */
export function asMoment(val: any): moment.Moment {
    if (_.isNil(val)) {
        return <any>val;
    }

    let result: moment.Moment;

    if (moment.isMoment(val)) {
        result = val;
    } else if (moment.isDate(val)) {
        result = moment(val);
    } else {
        let unix = parseInt(
            toStringSafe(val).trim()
        );
        if (isNaN(unix)) {
            result = moment(
                toStringSafe(val)
            );
        } else {
            result = moment(unix);
        }
    }

    return result;
}

/**
 * Keeps sure that a value is a Moment instance (UTC timezone).
 *
 * @param {any} time The input value.
 *
 * @return {moment.Moment} The Moment instance.
 */
export function asUTC(time: any): moment.Moment {
    let result = asMoment(time);

    if (!_.isNil(result)) {
        if (result.isValid()) {
            if (!result.isUTC()) {
                result = result.utc();
            }
        }
    }

    return result;
}

/**
 * Clones an object / value.
 *
 * @param {T} obj The value to clone.
 *
 * @return {T} The cloned value.
 */
export function cloneObj<T>(obj: T): T {
    if (!obj) {
        return obj;
    }

    return JSON.parse(
        JSON.stringify(obj)
    );
}

/**
 * Compare to values for sorting.
 *
 * @param {any} x The "left" value.
 * @param {any} y The "right" value.
 *
 * @return {number} The sort value.
 */
export function compareValues<T = any>(x: T, y: T): number {
    return compareValuesBy(x, y,
                           i => i);
}

/**
 * Compare to values for sorting by using a selector.
 *
 * @param {any} x The "left" value.
 * @param {any} y The "right" value.
 * @param {Function} selector The selector.
 *
 * @return {number} The sort value.
 */
export function compareValuesBy<T = any, U = T>(x: T, y: T, selector: (val: T) => U): number {
    const VAL_X = selector(x);
    const VAL_Y = selector(y);

    if (VAL_X !== VAL_Y) {
        if (VAL_X < VAL_Y) {
            return -1;
        }

        if (VAL_X > VAL_Y) {
            return 1;
        }
    }

    return 0;
}

/**
 * Creates a simple 'completed' callback for a promise.
 *
 * @param {Function} resolve The 'succeeded' callback.
 * @param {Function} reject The 'error' callback.
 *
 * @return {CompletedAction<TResult>} The created action.
 */
export function createCompletedAction<TResult = any>(resolve: (value?: TResult | PromiseLike<TResult>) => void,
                                                     reject?: (reason: any) => void): CompletedAction<TResult> {
    let completedInvoked = false;

    return (err, result?) => {
        if (completedInvoked) {
            return;
        }
        completedInvoked = true;

        if (err) {
            if (reject) {
                reject(err);
            }
        } else {
            if (resolve) {
                resolve(result);
            }
        }
    };
}

/**
 * Promise version of `child_process.exec()` function.
 *
 * @param {string} command The command to execute.
 *
 * @return {Promise<ExecResult>} The promise with the result.
 */
export async function exec(command: string): Promise<ExecResult> {
    command = toStringSafe(command);

    return new Promise<ExecResult>((resolve, reject) => {
        try {
            execChildProcess(command, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        stderr: stderr,
                        stdout: stdout,
                    });
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * An async 'forEach'.
 *
 * @param {Enumerable.Sequence<T>} seq The sequence or array to iterate.
 * @param {ForEachAsyncAction<T>} action The action to invoke.
 */
export async function forEachAsync<T>(
    seq: Enumerable.Sequence<T>,
    action: ForEachAsyncAction<T>,
) {
    let i = -1;
    for (const ITEM of <any>seq) {
        ++i;

        await Promise.resolve(
            action(ITEM, i)
        );
    }
}

/**
 * Detects version information about the current app via Git (synchronous).
 *
 * @param {GetAppVersionOptions} [opts] Custom options.
 *
 * @return {AppVersion} Version information.
 */
export function getAppVersionSync(opts?: GetAppVersionOptions): AppVersion {
    if (!opts) {
        opts = <any>{};
    }

    // working directory
    let cwd = toStringSafe(opts.cwd);
    if (isEmptyString(cwd)) {
        cwd = process.cwd();
    }
    if (!path.isAbsolute(cwd)) {
        cwd = path.join(
            process.cwd(), cwd
        );
    }
    cwd = path.resolve(cwd);

    const VERSION: AppVersion = {};

    try {
        VERSION.date = asUTC(
            moment(
                execSync('git log -n1 --pretty=%cI HEAD', {
                    cwd: cwd,
                }).toString('utf8')
                  .trim()
            )
        );
    } catch {
        VERSION.date = false;
    }

    try {
        VERSION.hash = normalizeString(
            execSync('git log --pretty="%H" -n1 HEAD', {
                cwd: cwd,
            }).toString('utf8')
        );
    } catch {
        VERSION.hash = false;
    }

    return VERSION;
}

/**
 * Alias of 'uuid()' function.
 */
export function guid(version?: string): string {
    return uuid.apply(null, arguments);
}

/**
 * Checks if the string representation of a value is an empty string or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} If empty string or not.
 */
export function isEmptyString(val: any): boolean {
    return '' === toStringSafe(val)
        .trim();
}

/**
 * Normalizes a value to a string, which is comparable.
 *
 * @param {any} val The value to normalize.
 *
 * @return {string} The normalized string.
 */
export function normalizeString(val: any): string {
    return toStringSafe(val).toLowerCase()
        .trim();
}

/**
 * Returns the current time.
 *
 * @param {string} [timezone] The custom timezone to use.
 *
 * @return {Moment.Moment} The current time.
 */
export function now(timezone?: string): moment.Moment {
    timezone = toStringSafe(timezone).trim();

    const NOW = moment();
    return '' === timezone ? NOW
                           : NOW.tz(timezone);
}

/**
 * Generates a random string.
 *
 * @param {number} size The size of the result string.
 * @param {string} [chars] The custom list of characters.
 *
 * @return {Promise<string>} The promise with the random string.
 */
export async function randChars(size: number, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): Promise<string> {
    return randCharsInner(
        await util.promisify(crypto.randomBytes)(size),
        chars,
    );
}

function randCharsInner(randBlob: Buffer, chars: string) {
    chars = toStringSafe(chars);

    let str = '';
    for (let i = 0; i < randBlob.length; i++) {
        str += chars.substr(
            randBlob.readInt8(i) % chars.length, 1
        );
    }

    return str;
}

/**
 * Generates a random string.
 *
 * @param {number} size The size of the result string.
 * @param {string} [chars] The custom list of characters.
 *
 * @return {string} The random string.
 */
export function randCharsSync(size: number, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    return randCharsInner(
        crypto.randomBytes(size),
        chars,
    );
}

/**
 * Returns a value as "real" boolean.
 *
 * @param {any} val The input value.
 * @param {boolean} [defaultValue] The value to return if 'val' is (null) or (undefined).
 *
 * @return {boolean} The output value.
 */
export function toBooleanSafe(val: any, defaultValue = false): boolean {
    if (_.isBoolean(val)) {
        return val;
    }

    if (_.isNil(val)) {
        return !!defaultValue;
    }

    return !!val;
}

/**
 * Converts a value to a string (if needed), which is not (null) and not (undefined).
 *
 * @param {any} val The value to convert.
 * @param {string} [defaultValue] The custom default value if 'val' is (null) or (undefined).
 *
 * @return {string} 'val' as string.
 */
export function toStringSafe(val: any, defaultValue = ''): string {
    if (_.isString(val)) {
        return val;
    }

    if (_.isNil(val)) {
        return '' + defaultValue;
    }

    if (val instanceof Error) {
        return `[${val.name}] ${val.message}${_.isNil(val.stack) ? '' : ("\n\n" + val.stack)}`;
    }

    if (_.isFunction(val['toString'])) {
        return '' + val.toString();
    }

    if (Array.isArray(val) || _.isObjectLike(val)) {
        return JSON.stringify(val);
    }

    return '' + val;
}

/**
 * Returns the current time in UTC.
 *
 * @return {moment.Moment} The current UTC time.
 */
export function utc(): moment.Moment {
    return moment.utc();
}

/**
 * Generates an unique ID.
 *
 * @param {string} [version] The custom version to use. Default: 4
 * @param {any[]} []
 *
 * @return {string} The new GUID / unique ID.
 */
export function uuid(version?: string, ...args: any[]): string {
    version = normalizeString(version);

    switch (version) {
        case '':
        case '4':
        case 'v4':
            return UUID.v4
                       .apply(null, args);

        case '1':
        case 'v1':
            return UUID.v1
                       .apply(null, args);

        case '5':
        case 'v5':
            return UUID_v5.apply(null, args);
    }

    throw new Error(`Version '${ version }' is not supported`);
}

export * from './apis/host';
export * from './apis/index';
export * from './azure/storage';
export * from './dev';
export * from './diagnostics/logger';
export * from './diagnostics/stopwatch';
export * from './events';
export * from './fs';
export * from './geo';
export * from './http';
export * from './mail';
export * from './mongo';
export * from './oauth/microsoft';
export * from './streams';
export * from './system';

export { asEnumerable, from, isEnumerable, isSequence, popFrom, random, range, repeat, shiftFrom } from 'node-enumerable';
