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

/**
 * Stores if 'APP_ENV' environment variable is set to 'dev' or not.
 */
export const IS_DEV = 'dev' === ('' + process.env.APP_ENV).toLowerCase().trim();
/**
 * Stores if 'LOCAL_DEVELOPMENT' environment variable is set to 'true' or not.
 */
export const IS_LOCAL_DEV = 'true' === ('' + process.env.LOCAL_DEVELOPMENT).toLowerCase().trim();
