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
import * as joi from 'joi';

/**
 * Checks if a value is a joi object or not.
 *
 * @param {any} val The value to check.
 *
 * @return {boolean} Is joi object or not.
 */
export function isJoi<TObj extends joi.JoiObject = joi.AnySchema>(val: any): val is TObj {
    if (!_.isNil(val)) {
        return true === val['isJoi'];
    }

    return false;
}
