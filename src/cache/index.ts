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
import { normalizeString } from '../index';

/**
 * Describes a cache (client).
 */
export interface Cache {
    /**
     * Tries to return a value from the cache.
     *
     * @param {any} key The key.
     * @param {TDefault} [defaultValue] The custom default value.
     *
     * @return {Promise<TValue|TDefault>} The promise with the value or the default value.
     */
    get<TValue = any, TDefault = TValue>(key: any, defaultValue?: TValue): Promise<TValue | TDefault>;
    /**
     * Sets a value.
     *
     * @param {any} key The key.
     * @param {any} value The value.
     * @param {SetCacheValueOptions|null|undefined} [opts] Additional and custom options.
     *
     * @return {Promise<boolean>} The promise that indicates if operation was successful or not.
     */
    set(key: any, value: any, opts?: SetCacheValueOptions | null | undefined): Promise<boolean>;
}

/**
 * Options for 'Cache.set()' method.
 */
export type SetCacheValueOptions = { [key: string]: any };

/**
 * A basic cache (client).
 */
export abstract class CacheBase implements Cache {
    /** @inheritdoc */
    public async get<TValue = any, TDefault = TValue>(key: any, defaultValue?: TValue): Promise<TValue | TDefault> {
        try {
            return await this.getInner(normalizeCacheKey(key),
                defaultValue);
        } catch {
            return defaultValue;
        }
    }

    /** @inheritdoc */
    protected async abstract getInner(key: string, defaultValue: any): Promise<any>;

    /**
     * Tries to return a value from a key/value pair.
     *
     * @param {Object|undefined|null} opts The key/value pair.
     * @param {any} key The key.
     * @param {TDefault} [defaultValue] The custom default value.
     *
     * @return {TValue|TDefault} The value or the default value if not found.
     */
    protected getOptionValue<TValue = any, TDefault = TValue>(
        opts: { [key: string]: any } | undefined | null, key: any,
        defaultValue?: TDefault
    ): TValue | TDefault {
        key = normalizeString(key);

        if (opts) {
            for (const PROP in opts) {
                if (normalizeString(PROP) === key) {
                    return opts[PROP];
                }
            }
        }

        return defaultValue;
    }

    /** @inheritdoc */
    public async set(key: any, value: any, opts?: SetCacheValueOptions | null | undefined): Promise<boolean> {
        if (_.isNil(opts)) {
            opts = {} as any;
        }

        try {
            await this.setInner(normalizeCacheKey(key), value,
                opts);

            return true;
        } catch {
            return false;
        }
    }

    /**
     * The logic for 'set()' method.
     *
     * @param {string} key The key.
     * @param {string} defaultValue The default value.
     * @param {SetCacheValueOptions} opts Custom options.
     */
    protected async abstract setInner(
        key: string, defaultValue: any,
        opts: SetCacheValueOptions
    ): Promise<void>;
}

function normalizeCacheKey(key: any): string {
    return normalizeString(key);
}
