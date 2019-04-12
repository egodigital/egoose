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
import * as Enumerable from 'node-enumerable';
import { normalizeString, toBooleanSafe, toStringSafe } from '../index';

/**
 * A string format provider function.
 *
 * @param {any} val The input value.
 * @param {string} match The original match value.
 *
 * @return {any} The output value.
 */
export type StringFormatProvider = (val: any, match: string) => any;

/**
 * A list of string format providers.
 */
export type StringFormatProviderList = { [name: string]: StringFormatProvider };

let knownFormatProviders: StringFormatProviderList;

/**
 * Formats a string.
 *
 * @param {any} formatStr The value that represents the format string.
 * @param {any[]} [args] The arguments for 'formatStr'.
 *
 * @return {string} The formated string.
 */
export function format(formatStr: any, ...args: any[]): string {
    return formatArray(formatStr, args);
}

/**
 * Formats a string.
 *
 * @param {any} formatStr The value that represents the format string.
 * @param {Enumerable.Sequence<any>} [args] The arguments for 'formatStr'.
 *
 * @return {string} The formated string.
 */
export function formatArray(formatStr: any, args: Enumerable.Sequence<any>): string {
    formatStr = toStringSafe(formatStr);

    if (!_.isArrayLike(args)) {
        args = Enumerable.from(args)
                         .toArray();
    }

    // apply arguments in
    // placeholders
    return formatStr.replace(/{(\d+)(\:)?([^}]*)}/g,
        (match: string, index: string | number, separator: string, providerName: string) => {
            index = parseInt(
                toStringSafe(index)
            );

            let resultValue = (<ArrayLike<any>>args)[index];

            if (':' === separator) {
                // collect "format providers"
                const FORMAT_PROVIDERS = toStringSafe(providerName).split(',')
                                                                   .map(x => normalizeString(x))
                                                                   .filter(x => '' !== x);

                // transform argument by
                // format providers
                FORMAT_PROVIDERS.forEach(fp => {
                    let provider = knownFormatProviders[fp];
                    if (_.isNil(provider)) {
                        // try default
                        provider = knownFormatProviders[''];
                    }

                    if (provider) {
                        resultValue = provider(
                            resultValue, match
                        );
                    }
                });
            }

            if (_.isUndefined(resultValue)) {
                return match;
            }

            return toStringSafe(resultValue);
        });
}

/**
 * Returns a (new) list of default string format providers, grouped by name.
 *
 * @return {StringFormatProviderList} The new list.
 */
export function getDefaultStringFormatProviders(): StringFormatProviderList {
    return {
        'ending_space': (val: any) => {
            val = toStringSafe(val);
            if ('' !== val) {
                val = val + ' ';
            }

            return val;
        },
        'leading_space': (val: any) => {
            val = toStringSafe(val);
            if ('' !== val) {
                val = ' ' + val;
            }

            return val;
        },
        'lower': (val: any) => {
            return toStringSafe(val).toLowerCase();
        },
        'surround': (val: any) => {
            val = toStringSafe(val);
            if ('' !== val) {
                val = "'" + toStringSafe(val) + "'";
            }

            return val;
        },
        'trim': (val: any) => {
            return toStringSafe(val).trim();
        },
        'upper': (val: any) => {
            return toStringSafe(val).toUpperCase();
        },
    };
}

/**
 * Registers a new list of global string format providers.
 *
 * @param {StringFormatProviderList} [providers] The new list.
 * @param {boolean} [withDefaults] Also register default providers first. Default: (true)
 */
export function registerStringFormatProviders(
    providers?: StringFormatProviderList,
    withDefaults?: boolean,
) {
    withDefaults = toBooleanSafe(withDefaults, true);

    const NEW_LIST: StringFormatProviderList = {};
    const APPEND_TO_LIST = (list: StringFormatProviderList) => {
        if (_.isNil(list)) {
            return;
        }

        for (const PROVIDER_NAME in list) {
            NEW_LIST[
                normalizeString(PROVIDER_NAME)
            ] = list[PROVIDER_NAME];
        }
    };

    if (withDefaults) {
        APPEND_TO_LIST(
            getDefaultStringFormatProviders()
        );
    }
    APPEND_TO_LIST(providers);

    knownFormatProviders = NEW_LIST;
}

// register defaults
registerStringFormatProviders();
