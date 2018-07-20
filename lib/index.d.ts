/**
 * This file is part of the @egodigital/egoose distribution.
 * Copyright (c) Marcel Joachim Kloubert.
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
/**
 * Returns an input value as array.
 *
 * @param {T|T[]} val The input value.
 * @param {boolean} [noEmpty] Remove values, which are (null) or (undefined).
 *
 * @return {T[]} The input value as array.
 */
export declare function asArray<T>(val: T | T[], noEmpty?: boolean): T[];
/**
 * Compare to values for sorting.
 *
 * @param {any} x The "left" value.
 * @param {any} y The "right" value.
 *
 * @return {number} The sort value.
 */
export declare function compareValues<T = any>(x: T, y: T): number;
/**
 * Compare to values for sorting by using a selector.
 *
 * @param {any} x The "left" value.
 * @param {any} y The "right" value.
 * @param {Function} selector The selector.
 *
 * @return {number} The sort value.
 */
export declare function compareValuesBy<T = any, U = T>(x: T, y: T, selector: (val: T) => U): number;
/**
 * Checks if the string representation of a value is an empty string or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} If empty string or not.
 */
export declare function isEmptyString(val: any): boolean;
/**
 * Normalizes a value to a string, which is comparable.
 *
 * @param {any} val The value to normalize.
 *
 * @return {string} The normalized string.
 */
export declare function normalizeString(val: any): string;
/**
 * Converts a value to a string (if needed), which is not (null) and not (undefined).
 *
 * @param {any} val The value to convert.
 * @param {string} [defaultValue] The custom default value if 'val' is (null) or (undefined).
 *
 * @return {string} 'val' as string.
 */
export declare function toStringSafe(val: any, defaultValue?: string): string;
