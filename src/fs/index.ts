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
import * as fastGlob from 'fast-glob';
import * as fs from 'fs-extra';
import { Stats as FSStats } from 'fs';
import * as MergeDeep from 'merge-deep';
import * as tmp from 'tmp';
import { asArray, toBooleanSafe, toStringSafe } from '../index';

/**
 * A value, that can be used as file system path.
 */
export type FileSystemPath = string | Buffer;

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

async function checkExistingFSItemByStats(
    path: FileSystemPath, useLSTAT: boolean,
    flagProvider: (stats: FSStats) => boolean,
) {
    useLSTAT = toBooleanSafe(useLSTAT);

    if (await exists(path)) {
        return flagProvider(
            await (useLSTAT ? fs.lstat : fs.stat)(path)
        );
    }

    return false;
}

function checkExistingFSItemByStatsSync(
    path: FileSystemPath, useLSTAT: boolean,
    flagProvider: (stats: FSStats) => boolean,
) {
    useLSTAT = toBooleanSafe(useLSTAT);

    if (fs.existsSync(path)) {
        return flagProvider(
            (useLSTAT ? fs.lstatSync : fs.statSync)(path)
        );
    }

    return false;
}

/**
 * Promise version of 'fs.exists()'.
 *
 * @param {string} path The path.
 *
 * @return {Promise<boolean>} The promise that indicates if path exists or not.
 */
export function exists(path: fs.PathLike): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            fs.exists(path, (itemExists) => {
                resolve(itemExists);
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Scans for files.
 *
 * @param {string|string[]} patterns One or more glob patterns.
 * @param {FastGlob.Options} [opts] Custom options.
 *
 * @return {Promise<string[]>} The promise with the found items.
 */
export function glob(
    patterns: string | string[],
    opts?: fastGlob.Options,
): Promise<string[]> {
    return fastGlob(
        normalizeGlobPatterns(patterns),
        mergeGlobOptions(opts),
    );
}

/**
 * Scans for files (synchronious).
 *
 * @param {string|string[]} patterns One or more glob patterns.
 * @param {FastGlob.Options} [opts] Custom options.
 *
 * @return {string[]} The found items.
 */
export function globSync(
    patterns: string | string[],
    opts?: fastGlob.Options,
): string[] {
    return fastGlob.sync(
        normalizeGlobPatterns(patterns),
        mergeGlobOptions(opts),
    );
}

/**
 * Checks if a path represents an existing block device.
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstat()' function instead of 'fs.stat()'.
 *
 * @return {Promise<boolean>} The promise with the boolean that represents if path is a block device or not.
 */
export function isBlockDevice(path: FileSystemPath, useLSTAT?: boolean): Promise<boolean> {
    return checkExistingFSItemByStats(
        path, useLSTAT,
        (stats) => stats.isBlockDevice(),
    );
}

/**
 * Checks if a path represents an existing block device (synchronous).
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstatSync()' function instead of 'fs.statSync()'.
 *
 * @return {boolean} The boolean that represents if path is a block device or not.
 */
export function isBlockDeviceSync(path: FileSystemPath, useLSTAT?: boolean): boolean {
    return checkExistingFSItemByStatsSync(
        path, useLSTAT,
        (stats) => stats.isBlockDevice(),
    );
}

/**
 * Checks if a path represents an existing block device.
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstat()' function instead of 'fs.stat()'.
 *
 * @return {Promise<boolean>} The promise with the boolean that represents if path is a block device or not.
 */
export function isCharDevice(path: FileSystemPath, useLSTAT?: boolean): Promise<boolean> {
    return checkExistingFSItemByStats(
        path, useLSTAT,
        (stats) => stats.isCharacterDevice(),
    );
}

/**
 * Checks if a path represents an existing character device (synchronous).
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstatSync()' function instead of 'fs.statSync()'.
 *
 * @return {boolean} The boolean that represents if path is a character device or not.
 */
export function isCharDeviceSync(path: FileSystemPath, useLSTAT?: boolean): boolean {
    return checkExistingFSItemByStatsSync(
        path, useLSTAT,
        (stats) => stats.isCharacterDevice(),
    );
}

/**
 * Checks if a path represents an existing FIFO.
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstat()' function instead of 'fs.stat()'.
 *
 * @return {Promise<boolean>} The promise with the boolean that represents if path is a FIFO or not.
 */
export function isFIFO(path: FileSystemPath, useLSTAT?: boolean): Promise<boolean> {
    return checkExistingFSItemByStats(
        path, useLSTAT,
        (stats) => stats.isFIFO(),
    );
}

/**
 * Checks if a path represents an existing FIFO (synchronous).
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstatSync()' function instead of 'fs.statSync()'.
 *
 * @return {boolean} The boolean that represents if path is a FIFO or not.
 */
export function isFIFOSync(path: FileSystemPath, useLSTAT?: boolean): boolean {
    return checkExistingFSItemByStatsSync(
        path, useLSTAT,
        (stats) => stats.isFIFO(),
    );
}

/**
 * Checks if a path represents an existing directory.
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstat()' function instead of 'fs.stat()'.
 *
 * @return {Promise<boolean>} The promise with the boolean that represents if path is a directory or not.
 */
export function isDir(path: FileSystemPath, useLSTAT?: boolean): Promise<boolean> {
    return checkExistingFSItemByStats(
        path, useLSTAT,
        (stats) => stats.isDirectory(),
    );
}

/**
 * Checks if a path represents an existing directory (synchronous).
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstatSync()' function instead of 'fs.statSync()'.
 *
 * @return {boolean} The boolean that represents if path is a directory or not.
 */
export function isDirSync(path: FileSystemPath, useLSTAT?: boolean): boolean {
    return checkExistingFSItemByStatsSync(
        path, useLSTAT,
        (stats) => stats.isDirectory(),
    );
}

/**
 * Checks if a path represents an existing file.
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstat()' function instead of 'fs.stat()'.
 *
 * @return {Promise<boolean>} The promise with the boolean that represents if path is a file or not.
 */
export function isFile(path: FileSystemPath, useLSTAT?: boolean): Promise<boolean> {
    return checkExistingFSItemByStats(
        path, useLSTAT,
        (stats) => stats.isFile(),
    );
}

/**
 * Checks if a path represents an existing file (synchronous).
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstatSync()' function instead of 'fs.statSync()'.
 *
 * @return {boolean} The boolean that represents if path is a file or not.
 */
export function isFileSync(path: FileSystemPath, useLSTAT?: boolean): boolean {
    return checkExistingFSItemByStatsSync(
        path, useLSTAT,
        (stats) => stats.isFile(),
    );
}

/**
 * Checks if a path represents an existing socket.
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstat()' function instead of 'fs.stat()'.
 *
 * @return {Promise<boolean>} The promise with the boolean that represents if path is a socket or not.
 */
export function isSocket(path: FileSystemPath, useLSTAT?: boolean): Promise<boolean> {
    return checkExistingFSItemByStats(
        path, useLSTAT,
        (stats) => stats.isSocket(),
    );
}

/**
 * Checks if a path represents an existing socket (synchronous).
 *
 * @param {FileSystemPath} path The path to check.
 * @param {boolean} [useLSTAT] Use 'fs.lstatSync()' function instead of 'fs.statSync()'.
 *
 * @return {boolean} The boolean that represents if path is a socket or not.
 */
export function isSocketSync(path: FileSystemPath, useLSTAT?: boolean): boolean {
    return checkExistingFSItemByStatsSync(
        path, useLSTAT,
        (stats) => stats.isSocket(),
    );
}

/**
 * Checks if a path represents an existing symbolic link.
 *
 * @param {FileSystemPath} path The path to check.
 *
 * @return {Promise<boolean>} The promise with the boolean that represents if path is a symbolic link or not.
 */
export function isSymLink(path: FileSystemPath): Promise<boolean> {
    return checkExistingFSItemByStats(
        path, true,
        (stats) => stats.isSymbolicLink(),
    );
}

/**
 * Checks if a path represents an existing symbolic link (synchronous).
 *
 * @param {FileSystemPath} path The path to check.
 *
 * @return {boolean} The boolean that represents if path is a symbolic link or not.
 */
export function isSymLinkSync(path: FileSystemPath): boolean {
    return checkExistingFSItemByStatsSync(
        path, true,
        (stats) => stats.isSymbolicLink(),
    );
}

function mergeGlobOptions(opts: fastGlob.Options): fastGlob.Options {
    const DEFAULT_OPTS: fastGlob.Options = {
        absolute: true,
        dot: true,
        followSymbolicLinks: true,
        markDirectories: false,
        onlyDirectories: false,
        onlyFiles: true,
        stats: false,
        unique: true,
    };

    return MergeDeep(DEFAULT_OPTS, opts);
}

function normalizeGlobPatterns(patterns: string | string[]): string[] {
    return asArray(patterns).map(p => toStringSafe(p))
        .filter(p => '' !== p.trim());
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
            tmp.tmpName(toSimpleTempOptions(opts), (err, tmpFile) => {
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

    const TEMP_FILE = tmp.tmpNameSync(toSimpleTempOptions(opts));
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

function toSimpleTempOptions(opts: TempFileOptions): TempFileOptions {
    return {
        dir: _.isNil(opts.dir) ? undefined : toStringSafe(opts.dir),
        keep: true,
        prefix: toStringSafe(opts.prefix),
        suffix: toStringSafe(opts.suffix),
    };
}
