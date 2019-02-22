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
import  * as egoose from '../index';

describe('#randChars', function() {
    describe('async', function() {
        it('should return a random string', async function() {
            for (let i = 1; i <= 1000; i++) {
                const CHARS = await egoose.randChars(i);

                assert.ok(typeof CHARS === 'string');
                assert.equal(CHARS.length, i);
                assert.strictEqual(CHARS.length, i);
            }
        });
    });

    describe('sync', function() {
        it('should return a random string', function() {
            for (let i = 1; i <= 1000; i++) {
                const CHARS = egoose.randCharsSync(i);

                assert.ok(typeof CHARS === 'string');
                assert.equal(CHARS.length, i);
                assert.strictEqual(CHARS.length, i);
            }
        });
    });
});
