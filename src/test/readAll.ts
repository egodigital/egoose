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

import * as assert from 'assert';
import { describe, it } from 'mocha';
import { readAll } from '../index';
import * as stream from 'stream';

describe('#readAll()', async function() {
    describe('Buffer', async function() {
        it('should return same data as input', async function() {
            for (let i = 0; i < 1000; i++) {
                const IN_STR = (new Array(i)).map(x => 'TMäöüMK')
                    .join('');
                const IN_BUFF = new Buffer(IN_STR, 'utf8');

                const IN_STREAM = new stream.PassThrough();
                IN_STREAM.end(IN_BUFF);

                const OUT_BUFF = await readAll(IN_STREAM);
                const OUT_STR = OUT_BUFF.toString('utf8');

                assert.ok(Buffer.isBuffer(OUT_BUFF));
                assert.equal(OUT_BUFF.length, IN_BUFF.length);
                assert.strictEqual(OUT_BUFF.length, IN_BUFF.length);
                assert.equal(OUT_STR, IN_STR);
                assert.strictEqual(OUT_STR, IN_STR);
            }
        });
    });
});
