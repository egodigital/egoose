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

import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as tmp from 'tmp';
import { toBooleanSafe, toStringSafe } from '../index';

/**
 * Options for temp file execution.
 */
export interface TempFileOptions {
    /**
     * The custom directory for the file.
     */
    dir?: string;
    /**
     * Keep file or delete it after execution.
     */
    keep?: boolean;
    /**
     * Prefix for the filename.
     */
    prefix?: string;
    /**
     * Suffix for the filename.
     */
    suffix?: string;
}

/**
 * Executes an action for a temp file.
 *
 * @param {Function} action The action to invoke.
 * @param {TempFileOptions} [opts] Custom options.
 *
 * @return {Promise<TResult>} The promise with the result of the action.
 */
export function tempFile<TResult = any>(
    action: (tmpFile: string) => Promise<TResult> | TResult,
    opts?: TempFileOptions,
): Promise<TResult> {
    if (_.isNil(opts)) {
        opts = <any>{};
    }

    return new Promise<TResult>((resolve, reject) => {
        try {
            tmp.tmpName(toSimpleOptions(opts), (err, tmpFile) => {
                if (err) {
                    reject(err);
                } else {
                    const TRY_DELETE_TEMP_FILE = () => {
                        if (!toBooleanSafe(opts.keep)) {
                            try {
                                fs.unlinkSync(tmpFile);
                            } catch { }
                        }
                    };

                    try {
                        Promise.resolve(action(tmpFile)).then((res) => {
                            TRY_DELETE_TEMP_FILE();

                            resolve(res);
                        }).catch((err) => {
                            TRY_DELETE_TEMP_FILE();

                            reject(err);
                        });
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Executes an action for a temp file (sync).
 *
 * @param {Function} action The action to invoke.
 * @param {TempFileOptions} [opts] Custom options.
 *
 * @return {TResult} The result of the action.
 */
export function tempFileSync<TResult = any>(
    action: (tmpFile: string) => TResult,
    opts?: TempFileOptions,
): TResult {
    if (_.isNil(opts)) {
        opts = <any>{};
    }

    const TEMP_FILE = tmp.tmpNameSync(toSimpleOptions(opts));
    try {
        return action(TEMP_FILE);
    } finally {
        if (!toBooleanSafe(opts.keep)) {
            try {
                fs.unlinkSync(TEMP_FILE);
            } catch { }
        }
    }
}

function toSimpleOptions(opts: TempFileOptions): tmp.SimpleOptions {
    return {
        dir: _.isNil(opts.dir) ? undefined : toStringSafe(opts.dir),
        keep: true,
        postfix: toStringSafe(opts.suffix),
        prefix: toStringSafe(opts.prefix),
    };
}
