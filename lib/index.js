"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/**
 * Returns an input value as array.
 *
 * @param {T|T[]} val The input value.
 * @param {boolean} [noEmpty] Remove values, which are (null) or (undefined).
 *
 * @return {T[]} The input value as array.
 */
function asArray(val, noEmpty = true) {
    if (!Array.isArray(val)) {
        val = [val];
    }
    return val.filter(x => {
        if (noEmpty) {
            return !_.isNil(x);
        }
        return true;
    });
}
exports.asArray = asArray;
/**
 * Compare to values for sorting.
 *
 * @param {any} x The "left" value.
 * @param {any} y The "right" value.
 *
 * @return {number} The sort value.
 */
function compareValues(x, y) {
    return compareValuesBy(x, y, i => i);
}
exports.compareValues = compareValues;
/**
 * Compare to values for sorting by using a selector.
 *
 * @param {any} x The "left" value.
 * @param {any} y The "right" value.
 * @param {Function} selector The selector.
 *
 * @return {number} The sort value.
 */
function compareValuesBy(x, y, selector) {
    const VAL_X = selector(x);
    const VAL_Y = selector(y);
    if (VAL_X !== VAL_Y) {
        if (VAL_X < VAL_Y) {
            return -1;
        }
        if (VAL_X > VAL_Y) {
            return 1;
        }
    }
    return 0;
}
exports.compareValuesBy = compareValuesBy;
/**
 * Checks if the string representation of a value is an empty string or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} If empty string or not.
 */
function isEmptyString(val) {
    return '' === toStringSafe(val)
        .trim();
}
exports.isEmptyString = isEmptyString;
/**
 * Normalizes a value to a string, which is comparable.
 *
 * @param {any} val The value to normalize.
 *
 * @return {string} The normalized string.
 */
function normalizeString(val) {
    return toStringSafe(val).toLowerCase()
        .trim();
}
exports.normalizeString = normalizeString;
/**
 * Converts a value to a string (if needed), which is not (null) and not (undefined).
 *
 * @param {any} val The value to convert.
 * @param {string} [defaultValue] The custom default value if 'val' is (null) or (undefined).
 *
 * @return {string} 'val' as string.
 */
function toStringSafe(val, defaultValue = '') {
    if (_.isString(val)) {
        return val;
    }
    if (_.isNil(val)) {
        return '' + defaultValue;
    }
    if (val instanceof Error) {
        return `[${val.name}] ${val.message}${_.isNil(val.stack) ? '' : ("\n\n" + val.stack)}`;
    }
    if (_.isFunction(val['toString'])) {
        return '' + val.toString();
    }
    return '' + val;
}
exports.toStringSafe = toStringSafe;
//# sourceMappingURL=index.js.map