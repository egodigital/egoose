/**
 * This file is part of the @egodigital/egoose distribution.
 * Copyright (c) e.GO Digital GmbH, Aachen, Germany (http://www.e-go-digital.com/)
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

import { asArray } from '../index';
import { Response } from 'express';

/**
 * An entry for an API error.
 */
export interface ApiError {
    /**
     * German (de)
     */
    de?: string;
    /**
     * English (en)
     */
    en: string;
}

interface ApiResponse {
    data: any;
    errors: ApiError[];
    success: boolean;
}

/**
 * An api result.
 */
export interface ApiResult {
    /**
     * The (optional) data.
     */
    data?: any;
    /**
     * A list of one or more error keys.
     */
    errors?: string | string[];
    /**
     * A value, which indicates if the operation was successfull or not.
     */
    success: boolean;
}

/**
 * Global list of API errors.
 */
export const API_ERRORS: { [name: string]: ApiError } = {};

/**
 * Sends an API response.
 *
 * @param {Response} res The response context.
 * @param {ApiResult} result The result context.
 *
 * @return {Response} The current response context.
 */
export function sendResponse(res: Response, result: ApiResult): Response {
    const API_RESP: ApiResponse = {
        data: result.data,
        errors: asArray(result.errors).map(key => {
            return API_ERRORS[key];
        }),
        success: !!result.success,
    };

    return res.status(200)
        .header('Content-type', 'application/json; charset=utf8')
        .send(new Buffer(JSON.stringify(API_RESP), 'utf8'));
}
