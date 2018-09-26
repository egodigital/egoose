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

const diskspace = require('diskspace');
const os = require('os-utils');
import { isEmptyString, toStringSafe } from '../index';

/**
 * Result of 'getDiskSpace()' function.
 */
export interface DiskSpaceResult {
    /**
     * The free space, in bytes.
     */
    free: number;
    /**
     * The total space, in bytes.
     */
    total: number;
    /**
     * The used space, in bytes.
     */
    used: number;
}

/**
 * Returns the CPU usage in percentage.
 *
 * @return {Promise<number>} The promise with the CPU usage.
 */
export function getCpuUsage() {
    return new Promise<number>((resolve, reject) => {
        try {
            os.cpuUsage(function(v) {
                resolve(v);
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Returns the diskspace of a mount point.
 *
 * @param {string} [mountPoint] The custom name / path of the endpoint to check.
 *
 * @return {Promise<DiskSpaceResult>} The promise with the result.
 */
export function getDiskSpace(mountPoint?: string) {
    mountPoint = toStringSafe(mountPoint);

    return new Promise<DiskSpaceResult>((resolve, reject) => {
        try {
            if (isEmptyString(mountPoint)) {
                if ('win32' === process.platform) {
                    mountPoint = 'C';  // drive C
                } else {
                    mountPoint = '/';  // system root
                }
            }

            diskspace.check(mountPoint, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        free: parseInt(
                            toStringSafe(result.free).trim()
                        ),
                        total: parseInt(
                            toStringSafe(result.total).trim()
                        ),
                        used: parseInt(
                            toStringSafe(result.used).trim()
                        ),
                    });
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}
