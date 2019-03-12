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
import { normalizeString, toStringSafe } from '../index';
const ews = require('node-ews');

/**
 * List of mail formats.
 */
export enum MailFormat {
    /**
     * Plain text.
     */
    PlainText = 0,
    /**
     * Rich text HTML
     */
    HTML = 1,
}

/**
 * Options for 'sendMail()' function.
 */
export interface SendMailOptions {
    /**
     * The body.
     */
    body: any;
    /**
     * The format.
     */
    format?: MailFormat;
    /**
     * The subject.
     */
    subject?: string;
    /**
     * The address, where to send the mail to.
     */
    to: string;
}

/**
 * Sends an email.
 *
 * @param {SendMailOptions} opts Options.
 */
export async function sendMail(
    opts: SendMailOptions
) {
    if (!opts) {
        opts = <any>{};
    }

    const EWS_CONFIG = {
        username: process.env.EWS_USERNAME,
        password: process.env.EWS_PASSWORD,
        host: 'https://outlook.office.de',
        auth: 'basic'
    };

    let format = opts.format;
    if (_.isNil(format)) {
        format = MailFormat.PlainText;
    }

    let bodyType = 'Text';
    switch (format) {
        case MailFormat.HTML:
            bodyType = 'HTML';
            break;
    }

    const EWS_ARGS = {
        "attributes" : {
          "MessageDisposition" : "SendAndSaveCopy"
        },
        "SavedItemFolderId": {
          "DistinguishedFolderId": {
            "attributes": {
              "Id": "sentitems"
            }
          }
        },
        "Items" : {
          "Message" : {
            "ItemClass": "IPM.Note",
            "Subject" : toStringSafe(opts.subject)
                .trim(),
            "Body" : {
              "attributes": {
                "BodyType" : bodyType
              },
              "$value": toStringSafe(opts.body),
            },
            "ToRecipients" : {
              "Mailbox" : {
                "EmailAddress" : normalizeString(opts.to),
              }
            },
            "IsRead": "false",
          }
        }
    };

    await (new ews(EWS_CONFIG))
        .run('CreateItem', EWS_ARGS);
}
