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

import * as _ from 'lodash';
import { normalizeString } from '../index';
import { tryRemoveListener } from '../events';
import * as Stream from 'stream';

/**
 * Reads the content of a stream.
 *
 * @param {Stream.Readable} stream The stream.
 * @param {string} [enc] The custom (string) encoding to use.
 *
 * @returns {Promise<Buffer>} The promise with the content.
 */
export function readAll(stream: Stream.Readable, enc?: string): Promise<Buffer> {
    enc = normalizeString(enc);
    if ('' === enc) {
        enc = undefined;
    }

    return new Promise<Buffer>((resolve, reject) => {
        let buff: Buffer;

        let dataListener: (chunk: Buffer | string) => void;
        let endListener: () => void;
        let errorListener: (err: any) => void;

        let completedInvoked = false;
        const COMPLETED = (err: any) => {
            if (completedInvoked) {
                return;
            }
            completedInvoked = true;

            tryRemoveListener(stream, 'data', dataListener);
            tryRemoveListener(stream, 'end', endListener);
            tryRemoveListener(stream, 'error', errorListener);

            if (err) {
                reject(err);
            } else {
                resolve(buff);
            }
        };

        errorListener = (err: any) => {
            if (err) {
                COMPLETED(err);
            }
        };

        dataListener = (chunk: Buffer | string) => {
            try {
                if (!chunk || chunk.length < 1) {
                    return;
                }

                if (_.isString(chunk)) {
                    chunk = new Buffer(chunk, enc);
                }

                buff = Buffer.concat([ buff, chunk ]);
            } catch (e) {
                COMPLETED(e);
            }
        };

        endListener = () => {
            COMPLETED(null);
        };

        try {
            stream.on('error', errorListener);

            buff = Buffer.alloc(0);

            stream.once('end', endListener);
            stream.on('data', dataListener);
        } catch (e) {
            COMPLETED(e);
        }
    });
}
