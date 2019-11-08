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
import { HttpResponse, POST } from '../http';
import { normalizeString, toStringSafe } from '../index';

/**
 * Options for 'sendAppFeedback()' function.
 */
export interface SendAppFeedbackOptions {
    /**
     * The name / ID of the app.
     */
    app: string;
    /**
     * The content type of message.
     */
    contentType?: string;
    /**
     * The email address of the underlying user.
     */
    email?: string;
    /**
     * The message (text).
     */
    message: string;
    /**
     * The custom email address of the recipient of feedback mails.
     */
    recipientMail?: string;
    /**
     * The name of the user.
     */
    username?: string;
    /**
     * User Slack or not.
     */
    useSlack?: boolean;
}

/**
 * Sends an app feedback to a service.
 *
 * @param {SendAppFeedbackOptions} opts The options for sending the feedback.
 * 
 * @return {Promise<HttpResponse>} The promise with the HTTP response.
 */
export function sendAppFeedback(opts: SendAppFeedbackOptions): Promise<HttpResponse> {
    const BODY: any = {
        "a": toStringSafe(opts.app).trim(),
        "ct": normalizeString(opts.contentType),
        "e": normalizeString(opts.email),
        "m": toStringSafe(opts.message),
        "r": normalizeString(opts.recipientMail),
        "u": toStringSafe(opts.username).trim(),
        "us": _.isNil(opts.useSlack) ?
            '' : (opts.useSlack ? '1' : '0'),
    };

    return POST(
        toStringSafe(process.env.FEEDBACK_SERVICE_URL).trim(),
        {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'x-ego': toStringSafe(process.env.FEEDBACK_SERVICE_KEY).trim(),
            },
            body: Buffer.from(JSON.stringify(BODY), 'utf8'),
            doNotNormalizeHeaders: false,
        }
    );
}
