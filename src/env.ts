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

import { asArray, normalizeString } from './index';

/**
 * Checks if 'APP_ENV' has at least one specific value.
 *
 * @param {string[]} [envs] One or more possible values for 'APP_ENV'.
 *
 * @return {boolean} Is one value of 'envs' or not.
 */
export function isAppEnv(...envs: string[]): boolean {
    const APP_ENV = ('' + process.env.APP_ENV).toLowerCase().trim();

    return asArray(envs)
        .map(e => normalizeString(e))
        .indexOf(APP_ENV) > -1;
}
