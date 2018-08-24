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
import { forEachAsync } from '../index';

describe('#forEachAsync()', function() {
    describe('Array', function() {
        it('should work fill output array by sync action', async function() {
            const IN_ARR = [ 1, 2, 3, 4, 5 ];

            const OUT_ARR = [];
            await forEachAsync(IN_ARR, (item, i) => {
                OUT_ARR.push(
                    `${ item * 10 }::${ i }`
                );
            });

            assert.equal(OUT_ARR.length, IN_ARR.length);
            assert.strictEqual(OUT_ARR.length, IN_ARR.length);

            for (let i = 0; i < OUT_ARR.length; i++) {
                const ITEM = OUT_ARR[i];
                const EXPECTED = `${ IN_ARR[i] * 10 }::${ i }`;

                assert.equal(ITEM, EXPECTED);
            }
        });

        it('should work fill output array by async action', async function() {
            const IN_ARR = [ 1, 2, 3, 4, 5 ];

            const OUT_ARR = [];
            await forEachAsync(IN_ARR, async (item, i) => {
                OUT_ARR.push(
                    `${ item * 10 }::${ i }`
                );
            });

            assert.equal(OUT_ARR.length, IN_ARR.length);
            assert.strictEqual(OUT_ARR.length, IN_ARR.length);

            for (let i = 0; i < OUT_ARR.length; i++) {
                const ITEM = OUT_ARR[i];
                const EXPECTED = `${ IN_ARR[i] * 10 }::${ i }`;

                assert.equal(ITEM, EXPECTED);
            }
        });
    });

    describe('Generators', function() {
        const TO_ITERATOR = function*(arr: any[]) {
            for (const ITEM of arr) {
                yield ITEM;
            }
        };

        it('should work fill output array by sync action', async function() {
            const IN_ARR = [ 1, 2, 3, 4, 5 ];

            const OUT_ARR = [];
            await forEachAsync(TO_ITERATOR(IN_ARR), (item, i) => {
                OUT_ARR.push(
                    `${ item * 10 }::${ i }`
                );
            });

            assert.equal(OUT_ARR.length, IN_ARR.length);
            assert.strictEqual(OUT_ARR.length, IN_ARR.length);

            for (let i = 0; i < OUT_ARR.length; i++) {
                const ITEM = OUT_ARR[i];
                const EXPECTED = `${ IN_ARR[i] * 10 }::${ i }`;

                assert.equal(ITEM, EXPECTED);
            }
        });

        it('should work fill output array by async action', async function() {
            const IN_ARR = [ 1, 2, 3, 4, 5 ];

            const OUT_ARR = [];
            await forEachAsync(TO_ITERATOR(IN_ARR), async (item, i) => {
                OUT_ARR.push(
                    `${ item * 10 }::${ i }`
                );
            });

            assert.equal(OUT_ARR.length, IN_ARR.length);
            assert.strictEqual(OUT_ARR.length, IN_ARR.length);

            for (let i = 0; i < OUT_ARR.length; i++) {
                const ITEM = OUT_ARR[i];
                const EXPECTED = `${ IN_ARR[i] * 10 }::${ i }`;

                assert.equal(ITEM, EXPECTED);
            }
        });
    });

    describe('Strings', function() {
        it('should work fill output array by sync action', async function() {
            const IN_STR = '12345';

            const OUT_ARR = [];
            await forEachAsync(IN_STR, (item, i) => {
                OUT_ARR.push(
                    `${ parseInt(item) * 10 }::${ i }`
                );
            });

            assert.equal(OUT_ARR.length, IN_STR.length);
            assert.strictEqual(OUT_ARR.length, IN_STR.length);

            for (let i = 0; i < OUT_ARR.length; i++) {
                const ITEM = OUT_ARR[i];
                const EXPECTED = `${ parseInt(IN_STR[i]) * 10 }::${ i }`;

                assert.equal(ITEM, EXPECTED);
            }
        });

        it('should work fill output array by async action', async function() {
            const IN_STR = '12345';

            const OUT_ARR = [];
            await forEachAsync(IN_STR, (item, i) => {
                OUT_ARR.push(
                    `${ parseInt(item) * 10 }::${ i }`
                );
            });

            assert.equal(OUT_ARR.length, IN_STR.length);
            assert.strictEqual(OUT_ARR.length, IN_STR.length);

            for (let i = 0; i < OUT_ARR.length; i++) {
                const ITEM = OUT_ARR[i];
                const EXPECTED = `${ parseInt(IN_STR[i]) * 10 }::${ i }`;

                assert.equal(ITEM, EXPECTED);
            }
        });
    });
});
