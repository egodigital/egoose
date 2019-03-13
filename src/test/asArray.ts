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

import * as assert from 'assert';
import { describe, it } from 'mocha';
import { asArray } from '../index';

describe('#asArray()', function() {
    describe('(null)', function() {
        it('should return empty array when all values are (null)', function() {
            for (let i = 0; i < 1000; i++) {
                const ARR: any[] = new Array(i);
                ARR.fill(null);

                const NEW_ARR = asArray(ARR);

                assert.ok(Array.isArray(NEW_ARR));
                assert.equal(NEW_ARR.length, 0);
                assert.strictEqual(NEW_ARR.length, 0);

                NEW_ARR.forEach(x => {
                    assert.equal(x, null);
                    assert.strictEqual(x, null);
                });
            }
        });

        it('should return array of same length when all values are (null)', function() {
            for (let i = 0; i < 1000; i++) {
                const ARR: any[] = new Array(i);
                ARR.fill(null);

                const NEW_ARR = asArray(ARR, false);

                assert.ok(Array.isArray(NEW_ARR));
                assert.equal(NEW_ARR.length, ARR.length);
                assert.strictEqual(NEW_ARR.length, ARR.length);
                assert.notStrictEqual(NEW_ARR, ARR);

                NEW_ARR.forEach(x => {
                    assert.equal(x, null);
                    assert.strictEqual(x, null);
                });
            }
        });

        it('should return an empty array', function() {
            const VAL = null;

            const ARR = asArray(VAL);

            assert.ok(Array.isArray(ARR));
            assert.equal(ARR.length, 0);
            assert.strictEqual(ARR.length, 0);
        });

        it('should return an array with a single element', function() {
            const VAL = null;

            const EXPECTED = [ VAL ];
            const ACTUAL = asArray(VAL, false);

            assert.ok(Array.isArray(ACTUAL));
            assert.equal(ACTUAL.length, 1);
            assert.strictEqual(ACTUAL.length, 1);

            assert.ok(null === ACTUAL[0]);
            assert.equal(ACTUAL[0], EXPECTED[0]);
            assert.strictEqual(ACTUAL[0], EXPECTED[0]);
        });
    });

    describe('(undefined)', function() {
        it('should return empty array when all values are (undefined)', function() {
            for (let i = 0; i < 1000; i++) {
                const ARR: any[] = new Array(i);
                ARR.fill(undefined);

                const NEW_ARR = asArray(ARR);

                assert.ok(Array.isArray(NEW_ARR));
                assert.equal(NEW_ARR.length, 0);
                assert.strictEqual(NEW_ARR.length, 0);

                NEW_ARR.forEach(x => {
                    assert.equal(x, undefined);
                    assert.strictEqual(x, undefined);
                });
            }
        });

        it('should return array of same length when all values are (undefined)', function() {
            for (let i = 0; i < 1000; i++) {
                const ARR: any[] = new Array(i);
                ARR.fill(undefined);

                const NEW_ARR = asArray(ARR, false);

                assert.ok(Array.isArray(NEW_ARR));
                assert.equal(NEW_ARR.length, ARR.length);
                assert.strictEqual(NEW_ARR.length, ARR.length);
                assert.notStrictEqual(NEW_ARR, ARR);

                NEW_ARR.forEach(x => {
                    assert.equal(x, undefined);
                    assert.strictEqual(x, undefined);
                });
            }
        });

        it('should return an empty array', function() {
            const VAL = undefined;

            const ARR = asArray(VAL);

            assert.ok(Array.isArray(ARR));
            assert.equal(ARR.length, 0);
            assert.strictEqual(ARR.length, 0);
        });

        it('should return an array with a single element', function() {
            const VAL = undefined;

            const EXPECTED = [ VAL ];
            const ACTUAL = asArray(VAL, false);

            assert.ok(Array.isArray(ACTUAL));
            assert.equal(ACTUAL.length, 1);
            assert.strictEqual(ACTUAL.length, 1);

            assert.ok('undefined' === typeof ACTUAL[0]);
            assert.equal(ACTUAL[0], EXPECTED[0]);
            assert.strictEqual(ACTUAL[0], EXPECTED[0]);
        });
    });

    describe('String', function() {
        it('should return array with same values a input', function() {
            for (let i = 0; i < 1000; i++) {
                const ARR: any[] = new Array(i);
                ARR.fill('' + i);

                const NEW_ARR = asArray(ARR);

                assert.ok(Array.isArray(NEW_ARR));
                assert.equal(NEW_ARR.length, ARR.length);
                assert.strictEqual(NEW_ARR.length, ARR.length);
                assert.notStrictEqual(NEW_ARR, ARR);

                for (let j = 0; j < NEW_ARR.length; j++) {
                    assert.equal(NEW_ARR[j], ARR[j]);
                    assert.strictEqual(NEW_ARR[j], ARR[j]);
                }
            }
        });

        it('should return array with same values a input', function() {
            for (let i = 0; i < 1000; i++) {
                const ARR: any[] = new Array(i);
                ARR.fill('' + i);

                const NEW_ARR = asArray(ARR, false);

                assert.ok(Array.isArray(NEW_ARR));
                assert.equal(NEW_ARR.length, ARR.length);
                assert.strictEqual(NEW_ARR.length, ARR.length);
                assert.notStrictEqual(NEW_ARR, ARR);

                for (let j = 0; j < NEW_ARR.length; j++) {
                    assert.equal(NEW_ARR[j], ARR[j]);
                    assert.strictEqual(NEW_ARR[j], ARR[j]);
                }
            }
        });

        it('should return array with a single item', function() {
            for (let i = 1; i <= 1000; i++) {
                const STR = 'TM'.repeat(i);

                const EXPECTED = [ STR ];
                const ACTUAL = asArray(STR);

                assert.ok(Array.isArray(ACTUAL));
                assert.equal(ACTUAL.length, 1);
                assert.strictEqual(ACTUAL.length, 1);

                assert.ok('string' === typeof ACTUAL[0]);
                assert.equal(ACTUAL[0], EXPECTED[0]);
                assert.strictEqual(ACTUAL[0], EXPECTED[0]);
            }
        });
    });

    describe('Number', function() {
        it('should return array with same values a input', function() {
            for (let i = 0; i < 1000; i++) {
                const ARR: any[] = new Array(i);
                ARR.fill(i);

                const NEW_ARR = asArray(ARR);

                assert.ok(Array.isArray(NEW_ARR));
                assert.equal(NEW_ARR.length, ARR.length);
                assert.strictEqual(NEW_ARR.length, ARR.length);
                assert.notStrictEqual(NEW_ARR, ARR);

                for (let j = 0; j < NEW_ARR.length; j++) {
                    assert.equal(NEW_ARR[j], ARR[j]);
                    assert.strictEqual(NEW_ARR[j], ARR[j]);
                }
            }
        });

        it('should return array with same values a input', function() {
            for (let i = 0; i < 1000; i++) {
                const ARR: any[] = new Array(i);
                ARR.fill(i);

                const NEW_ARR = asArray(ARR, false);

                assert.ok(Array.isArray(NEW_ARR));
                assert.equal(NEW_ARR.length, ARR.length);
                assert.strictEqual(NEW_ARR.length, ARR.length);
                assert.notStrictEqual(NEW_ARR, ARR);

                for (let j = 0; j < NEW_ARR.length; j++) {
                    assert.equal(NEW_ARR[j], ARR[j]);
                    assert.strictEqual(NEW_ARR[j], ARR[j]);
                }
            }
        });

        it('should return array with a single item', function() {
            for (let i = 1; i <= 1000; i++) {
                const VAL = i * 5979;

                const EXPECTED = [ VAL ];
                const ACTUAL = asArray(VAL);

                assert.ok(Array.isArray(ACTUAL));
                assert.equal(ACTUAL.length, 1);
                assert.strictEqual(ACTUAL.length, 1);

                assert.ok('number' === typeof ACTUAL[0]);
                assert.equal(ACTUAL[0], EXPECTED[0]);
                assert.strictEqual(ACTUAL[0], EXPECTED[0]);
            }
        });
    });
});
