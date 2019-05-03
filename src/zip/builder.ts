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

import * as fsExtra from 'fs-extra';
import * as yazl from 'yazl';
import { tempFile } from '../fs';
import { toStringSafe } from '../index';

type ZipBuilderStep = (zip: yazl.ZipFile) => any;

/**
 * Builds a ZIP file.
 */
export class ZipBuilder {
    private _buffer: Buffer | false = false;
    private readonly _STEPS: ZipBuilderStep[] = [];

    /**
     * Adds a buffer.
     *
     * @param {string} path The path in the zip file.
     * @param {Buffer} data The data to write.
     *
     * @return this
     */
    public addBuffer(path: string, data: Buffer): this {
        this._STEPS.push((zip) => {
            zip.addBuffer(data,
                toStringSafe(path));
        });

        return this;
    }

    /**
     * Adds an empty directory.
     *
     * @param {string} path The path in the zip file.
     *
     * @return this
     */
    public addDir(path: string): this {
        this._STEPS.push((zip) => {
            zip.addEmptyDirectory(toStringSafe(path));
        });

        return this;
    }

    private async createZipInstance(): Promise<yazl.ZipFile> {
        const NEW_FILE = new yazl.ZipFile();

        for (const S of this._STEPS) {
            await Promise.resolve(
                S(NEW_FILE)
            );
        }

        return NEW_FILE;
    }

    /**
     * Creates a new ZIP file as buffer.
     *
     * @return {Promise<Buffer>} The promise with the buffer.
     */
    public async toBuffer(): Promise<Buffer> {
        if (Buffer.isBuffer(this._buffer)) {
            return this._buffer;
        }

        const NEW_FILE = await this.createZipInstance();

        // first output to temp file ...
        return await tempFile(async (tf) => {
            return await (() => {
                return new Promise<Buffer>((resolve, reject) => {
                    try {
                        const PIPE = NEW_FILE.outputStream.pipe(
                            fsExtra.createWriteStream(tf)
                        );

                        PIPE.once('error', (err) => {
                            reject(err);
                        });

                        PIPE.once('close', () => {
                            // now read the data and return
                            (async () => {
                                return await fsExtra.readFile(tf);
                            })().then((data) => {
                                // and save data before
                                // delete temp

                                this._buffer = data;
                                resolve(data);
                            }).catch(e => {
                                reject(e);
                            });
                        });

                        NEW_FILE.end();
                    } catch (e) {
                        reject(e);
                    }
                });
            })();
        });
    }
}

/**
 * Starts building a ZIP file.
 *
 * @return {ZipBuilder} The new builder instance.
 */
export function buildZip(): ZipBuilder {
    return new ZipBuilder();
}
