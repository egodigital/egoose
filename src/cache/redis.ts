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
import * as redis from 'redis';
import { toStringSafe } from '../index';
import { CacheBase, SetCacheValueOptions } from './index';

/**
 * Options for redis cache (client).
 */
export interface RedisCacheOptions {
    /**
     * The custom host.
     */
    host?: string;
    /**
     * The custom TCP port.
     */
    port?: number;
}

/**
 * A Redis cache (client).
 */
export class RedisCache extends CacheBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {RedisCacheOptions} options The options.
     */
    public constructor(
        public readonly options: RedisCacheOptions
    ) {
        super();
    }

    private createClient(): redis.RedisClient {
        let host = toStringSafe(this.options.host)
            .trim();
        if ('' === host) {
            host = '127.0.0.1';
        }

        let port = parseInt(
            toStringSafe(this.options.port)
                .trim()
        );
        if (isNaN(port)) {
            port = 6379;
        }

        return redis.createClient({
            host: host,
            port: port,
        });
    }

    /**
     * Creates a new instance from environment variable.
     *
     * @return {RedisCache} The new instance.
     */
    public static fromEnvironment(): RedisCache {
        return new RedisCache({
            host: process.env.REDIS_HOST,
            port: parseInt(
                toStringSafe(process.env.REDIS_HOST_PORT)
                    .trim()
            )
        });
    }

    /** @inheritdoc */
    protected async getInner(key: any, defaultValue: any): Promise<any> {
        return await this.withConnection(
            (client) => {
                return new Promise<any>((resolve, reject) => {
                    try {
                        client.get(key, (err, value) => {
                            try {
                                if (err) {
                                    reject(err);
                                } else {
                                    if (_.isNil(value)) {
                                        resolve(defaultValue);
                                    } else {
                                        resolve(
                                            JSON.parse(value)
                                        );
                                    }
                                }
                            } catch (e) {
                                reject(e);
                            }
                        });
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        );
    }

    /** @inheritdoc */
    protected async setInner(
        key: any, value: any,
        opts: SetCacheValueOptions
    ): Promise<void> {
        let ttl: false | number = parseInt(
            toStringSafe(this.getOptionValue(opts, 'ttl'))
                .trim()
        );
        if (isNaN(ttl)) {
            ttl = false;
        }

        await this.withConnection(
            (client) => {
                return new Promise<void>((resolve, reject) => {
                    try {
                        if (_.isNil(value)) {
                            // no data => delete

                            client.del(key, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        } else {
                            const VALUE_TO_SAVE = JSON.stringify(value);
                            const CALLBACK = (err: any) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            };

                            if (false === ttl) {
                                client.set(key, VALUE_TO_SAVE,
                                    CALLBACK);
                            } else {
                                client.set(key, VALUE_TO_SAVE,
                                    'EX', ttl,
                                    CALLBACK);
                            }
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        );
    }

    private async withConnection<TResult = any>(func: (client: redis.RedisClient) => TResult | PromiseLike<TResult>) {
        const CLIENT = this.createClient();
        try {
            return await Promise.resolve(
                func(CLIENT)
            );
        } finally {
            CLIENT.quit();
        }
    }
}
