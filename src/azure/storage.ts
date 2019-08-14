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
import * as azureStorage from 'azure-storage';
import * as crypto from 'crypto';
import * as Enumerable from 'node-enumerable';
import * as isStream from 'is-stream';
import * as mimeTypes from 'mime-types';
import * as sanitizeFilename from 'sanitize-filename';
import { readAll } from '../streams';
import { asArray, normalizeString, toStringSafe, uuid, toBooleanSafe } from '../index';
import { createWriteStream, readFileSync } from 'fs-extra';
import { dirname, extname, join as joinPaths, sep as pathSep } from 'path';
import { tempFile } from '../fs';

/**
 * Options for an 'AzureStorageClient'.
 */
export interface AzureStorageClientOptions {
    /**
     * A custom function or string that provides the name of the underlying container.
     * If not defined, 'AZURE_STORAGE_CONTAINER' environment variable is used.
     *
     * @return {string|Function} The result with the container name or the container name as string.
     */
    blobContainerProvider?: string | (() => string | Promise<string>);

    /**
     * A custom function, which detects a MIME type by a blob name / path,
     *
     * @param {string} path The blob path / name.
     *
     * @return {string|Promise<string>} The result with the detected MIME type.
     */
    blobContentTypeDetector?: (path: string) => string | Promise<string>;

    /**
     * A custom function that provides the 'BlobService' instance to use.
     * If not defined, default settings from environment are used.
     *
     * @return {azureStorage.BlobService|Promise<azureStorage.BlobService>} The result with the service instance.
     */
    blobServiceProvider?: () => azureStorage.BlobService | Promise<azureStorage.BlobService>;

    /**
     * A custom function that resolves a full blob path.
     *
     * @param {string} path The input path.
     *
     * @return {string|Promise<string>} The result with the full path.
     */
    toFullBlobPath?: (path: string) => string | Promise<string>;

    /**
     * A custom function that creates a unique blob name.
     *
     * @param {string} path The input path / name of the blob.
     *
     * @return {string|Promise<string>} The result with a unique blob name / path.
     */
    uniqueBlobNameCreator?: (path: string) => string | Promise<string>;
}

const NO_CONTINUE_TOKEN_YET = Symbol('NO_CONTINUE_TOKEN_YET');

/**
 * An async Azure Storage client.
 */
export class AzureStorageClient {
    /**
     * Initializes a new instance of that class.
     *
     * @param {AzureStorageClientOptions} [options] The custom options.
     */
    public constructor(public readonly options?: AzureStorageClientOptions) {
        if (_.isNil(this.options)) {
            this.options = <any>{};
        }
    }

    /**
     * Creates a new blob service instance, based on the underlying options.
     *
     * @return {Promise<azureStorage.BlobService>} The promise with the new instance.
     */
    public async createBlobService(): Promise<azureStorage.BlobService> {
        let provider = this.options.blobServiceProvider;
        if (_.isNil(provider)) {
            // use default
            provider = () => azureStorage.createBlobService();
        }

        return Promise.resolve(
            provider()
        );
    }

    /**
     * Creates a new instance from environment settings.
     *
     * @return {AzureStorageClient} The new instance.
     */
    public static fromEnvironment(): AzureStorageClient {
        return new AzureStorageClient();
    }

    /**
     * Tries to return information about a blob.
     *
     * @param {string} path The path / name of the blob to check.
     *
     * @return {Promise<false|azureStorage.BlobService.BlobResult>} The promise that contains the blob information or (false) if it does not exist.
     */
    public getBlobInfo(path: string) {
        return new Promise<false | azureStorage.BlobService.BlobResult>(async (resolve, reject) => {
            try {
                const BLOBS = await this.createBlobService();

                const CONTAINER = toStringSafe(
                    await this.getContainer()
                );

                const BLOB_NAME = toStringSafe(
                    await this.toFullPath(path)
                );

                BLOBS.doesBlobExist(
                    CONTAINER,
                    BLOB_NAME,
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (toBooleanSafe(result.exists)) {
                                resolve(result);
                            } else {
                                resolve(false);
                            }
                        }
                    }
                );
            } catch (e) {
                reject(e);
            }
        });
    }

    private getContainer() {
        let containerProvider = this.options.blobContainerProvider;
        if (_.isNil(containerProvider)) {
            // use default
            containerProvider = () => process.env
                .AZURE_STORAGE_CONTAINER
                .trim();
        } else {
            if (!_.isFunction(containerProvider)) {
                const CONTAINER_PROVIDER = toStringSafe(containerProvider);

                containerProvider = () => {
                    return CONTAINER_PROVIDER;
                };
            }
        }

        return Promise.resolve(
            containerProvider()
        );
    }

    /**
     * Lists a folder in a blob storage container.
     *
     * @param {string} path The path of the folder.
     * 
     * @return {Promise<azureStorage.BlobService.BlobResult[]>} The promise with the result.
     */
    public listBlobs(path: string) {
        path = toFullBlobPath(path) + '/';

        return new Promise<azureStorage.BlobService.BlobResult[]>(async (resolve, reject) => {
            try {
                const BLOB_RESULTS: azureStorage.BlobService.BlobResult[] = [];
                const COMPLETED = (err: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(Enumerable.from(BLOB_RESULTS).where(br => {
                            const KEY = normalizeString(br.name);

                            return '' !== KEY &&
                                '/' !== KEY;
                        }).orderBy(br => {
                            return normalizeString(br.name);
                        }).toArray());
                    }
                };

                const BLOBS = await this.createBlobService();

                const CONTAINER = toStringSafe(
                    await this.getContainer()
                );

                let currentContinuationToken: azureStorage.common.ContinuationToken | symbol = NO_CONTINUE_TOKEN_YET;
                const HANDLE_RESULT = (result: azureStorage.BlobService.ListBlobsResult) => {
                    currentContinuationToken = undefined;
                    if (!result) {
                        return;
                    }

                    currentContinuationToken = result.continuationToken;
                    asArray(result.entries).forEach(e => {
                        BLOB_RESULTS.push(e);
                    });
                };

                const NEXT_SEGMENT = () => {
                    try {
                        if (NO_CONTINUE_TOKEN_YET !== currentContinuationToken) {
                            if (!currentContinuationToken) {
                                COMPLETED(null);
                                return;
                            }
                        } else {
                            currentContinuationToken = undefined;
                        }

                        BLOBS.listBlobsSegmentedWithPrefix(
                            CONTAINER,
                            path,
                            currentContinuationToken as azureStorage.common.ContinuationToken,
                            {},
                            (err, result) => {
                                if (err) {
                                    COMPLETED(err);
                                } else {
                                    HANDLE_RESULT(result);
                                    NEXT_SEGMENT();
                                }
                            }
                        );
                    } catch (e) {
                        COMPLETED(e);
                    }
                };

                NEXT_SEGMENT();
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Loads a blob.
     *
     * @param {string} path The path / blob name.
     *
     * @return {Promise<Buffer>} The promises with the loaded data.
     */
    public loadBlob(path: string): Promise<Buffer> {
        return new Promise<Buffer>(async (resolve, reject) => {
            try {
                const BLOBS = await this.createBlobService();

                const DATA = await tempFile((tmpFile) => {
                    return new Promise<Buffer>(async (res, rej) => {
                        try {
                            const STREAM = createWriteStream(tmpFile);

                            const CONTAINER = toStringSafe(
                                await this.getContainer()
                            );

                            const BLOB_NAME = toStringSafe(
                                await this.toFullPath(path)
                            );

                            BLOBS.getBlobToStream(
                                CONTAINER,
                                BLOB_NAME,
                                STREAM,
                                (err) => {
                                    if (err) {
                                        rej(err);
                                    } else {
                                        try {
                                            res(
                                                readFileSync(tmpFile)
                                            );
                                        } catch (e) {
                                            rej(e);
                                        }
                                    }
                                }
                            );
                        } catch (e) {
                            rej(e);
                        }
                    });
                });

                resolve(DATA);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Saves / uploads a blob.
     *
     * @param {string} path The path / name of the blob.
     * @param {any} data The data to upload / store.
     */
    public saveBlob(path: string, data: any): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const BLOBS = await this.createBlobService();

                let mimeDetector = this.options.blobContentTypeDetector;
                if (_.isNil(mimeDetector)) {
                    // use default
                    mimeDetector = (p) => {
                        let mime = mimeTypes.lookup(p);
                        if (false === mime) {
                            mime = 'application/octet-stream';
                        }

                        return mime;
                    };
                }

                const BLOB_NAME = toStringSafe(
                    await this.toFullPath(path)
                );

                const CONTENT_TYPE = toStringSafe(
                    await Promise.resolve(
                        mimeDetector(BLOB_NAME)
                    )
                );

                const CONTAINER = toStringSafe(
                    await this.getContainer()
                );

                let dataToStore: Buffer;
                if (_.isNil(data)) {
                    dataToStore = Buffer.alloc(0);
                } else {
                    if (Buffer.isBuffer(data)) {
                        dataToStore = data;
                    } else if (isStream.readable(data)) {
                        dataToStore = await readAll(data);
                    } else {
                        dataToStore = Buffer.from(
                            toStringSafe(data), 'utf8'
                        );
                    }
                }

                BLOBS.createBlockBlobFromText(
                    CONTAINER,
                    BLOB_NAME,
                    dataToStore,
                    {
                        contentSettings: {
                            contentMD5: crypto.createHash('md5')
                                .update(data).digest('base64'),
                            contentType: CONTENT_TYPE,
                        },
                    },
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Saves a blob with a unique name / path.
     *
     * @param {string} path The original path / name of the blob.
     * @param {any} data The data to store / save.
     *
     * @return {Promise<string>} The promise with the path / name of the stored blob.
     */
    public async saveUniqueBlob(path: string, data: any): Promise<string> {
        let blobNameCreator = this.options.uniqueBlobNameCreator;
        if (_.isNil(blobNameCreator)) {
            // use default

            blobNameCreator = (orgName) => {
                const BLOB_DIR = dirname(orgName);
                const BLOB_EXT = extname(orgName);
                const BLOB_NAME = `${uuid().split('-').join('')}_${Math.round(
                    Math.random() * 597923979
                )}_tmmk`;

                return joinPaths(
                    BLOB_DIR,
                    BLOB_NAME + BLOB_EXT,
                );
            };
        }

        const BLOB_NAME_NEW = toStringSafe(
            await Promise.resolve(
                blobNameCreator(
                    toStringSafe(path)
                )
            )
        );

        await this.saveBlob(BLOB_NAME_NEW, data);

        return await this.toFullPath(
            BLOB_NAME_NEW
        );
    }

    private toFullPath(p: string) {
        let tfp = this.options.toFullBlobPath;
        if (_.isNil(tfp)) {
            // use default
            tfp = toFullBlobPath;
        }

        return Promise.resolve(
            tfp(p)
        );
    }
}

/**
 * Normalizes an Azure blob path.
 *
 * @param {string} p The input path.
 *
 * @return {string} The normalized path.
 */
export function normalizeAzureBlobPath(p: string): string {
    return toStringSafe(p).trim();
}

function toFullBlobPath(p: string) {
    let prefix = sanitizeFilename(
        normalizeString(
            process.env.APP_ENV
        )
    );
    if ('' === prefix) {
        prefix = 'prod';
    }

    let fullPath = prefix + '/' +
        normalizeAzureBlobPath(p);
    fullPath = fullPath.split(pathSep).join('/');

    return fullPath;
}
