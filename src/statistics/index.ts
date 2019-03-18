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

import { cloneObj, toStringSafe } from '../index';

/**
 * Parameters for loading statistic data.
 */
export interface StatisticOptions {
    /**
     * The limit or (false) if no limit.
     */
    limit?: number | false;
    /**
     * The zero based offset.
     */
    offset?: number;
    /**
     * Parameters for the query.
     */
    parameters?: StatisticParameters;
}

/**
 * Describes an object with statistic parameters.
 */
export type StatisticParameters = { [name: string]: any };

/**
 * A statistic provider.
 */
export interface StatisticProvider {
    /**
     * Closes the provider.
     */
    readonly close: () => void | PromiseLike<void>;
    /**
     * Loads data via the provider.
     *
     * @param {StatisticOptions} [opts] The custom options.
     *
     * @return {StatisticResult|PromiseLike<StatisticResult>} The result.
     */
    readonly load: (opts?: StatisticOptions) => StatisticResult | PromiseLike<StatisticResult>;
}

/**
 * A statistic result.
 */
export interface StatisticResult {
    /**
     * Indicates if there are possible more data, if increasing offset.
     */
    hasMore?: boolean;
    /**
     * The offset.
     */
    offset?: number;
    /**
     * The rows.
     */
    rows: StatisticResultRow[];
    /**
     * The total number of rows.
     */
    totalCount: number;
}

/**
 * A row of a statistic result.
 */
export type StatisticResultRow = { [name: string]: any };

/**
 * A basic statistic provider.
 */
export abstract class StatisticProviderBase implements StatisticProvider {
    /** @inheritdoc */
    public async close(): Promise<void> {
    }

    /** @inheritdoc */
    public async load(opts?: StatisticOptions): Promise<StatisticResult> {
        opts = cloneObj(
            opts || <any>{}
        );

        // offset
        opts.offset = parseInt(
            toStringSafe(opts.offset)
                .trim()
        );
        if (isNaN(opts.offset)) {
            opts.offset = 0;
        }
        opts.offset = Math.max(0, opts.offset);

        // limit
        opts.limit = parseInt(
            toStringSafe(opts.limit)
                .trim()
        );
        if (isNaN(opts.limit)) {
            opts.limit = 25;
        }

        if (opts.limit < 1) {
            opts.limit = false;
        }

        const RESULT = await this.loadInner(opts);
        RESULT.offset = opts.offset;

        if (false === opts.limit) {
            RESULT.hasMore = false;
        } else {
            RESULT.hasMore = RESULT.rows.length >= opts.limit;
        }

        return RESULT;
    }

    /**
     * The logic for the 'load()' method.
     *
     * @param {contracts.StatisticOptions} opts The custom options.
     *
     * @return {Promise<StatisticResult>} The promise with the result.
     */
    protected abstract loadInner(opts: StatisticOptions): Promise<StatisticResult>;
}
