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
import { toStringSafe } from '../index';

describe('#toStringSafe()', function() {
    describe('(null)', function() {
        it('should return empty string when the value is (null)', function() {
            const RES: any = toStringSafe(null);

            assert.ok('string' === typeof RES);
            assert.equal(RES, '');
            assert.strictEqual(RES, '');
        });

        it('should return custom default value when the value is (null)', function() {
            const RES: any = toStringSafe(null, 'MK');

            assert.ok('string' === typeof RES);
            assert.equal(RES, 'MK');
            assert.strictEqual(RES, 'MK');
        });
    });

    describe('(undefined)', function() {
        it('should return empty string when the value is (undefined)', function() {
            const RES: any = toStringSafe(undefined);

            assert.ok('string' === typeof RES);
            assert.equal(RES, '');
            assert.strictEqual(RES, '');
        });

        it('should return custom default value when the value is (undefined)', function() {
            const RES: any = toStringSafe(null, 'TM');

            assert.ok('string' === typeof RES);
            assert.equal(RES, 'TM');
            assert.strictEqual(RES, 'TM');
        });
    });

    describe('String', function() {
        it('should return same value when the value is of type String', function() {
            const RES: any = toStringSafe('JS');

            assert.ok('string' === typeof RES);
            assert.equal(RES, 'JS');
            assert.strictEqual(RES, 'JS');
        });
    });

    describe('Number', function() {
        it('should return string representation when the value is of type integer', function() {
            for (let i = 0; i < 1000; i++) {
                const RES: any = toStringSafe(i);

                assert.ok('string' === typeof RES);
                assert.equal(RES, '' + i);
                assert.strictEqual(RES, '' + i);
            }
        });

        it('should return string representation when the value is of type float', function() {
            for (let i = 0; i < 1000; i++) {
                const NR = i / 10.0;

                const RES: any = toStringSafe(NR);

                assert.ok('string' === typeof RES);
                assert.equal(RES, '' + NR);
                assert.strictEqual(RES, '' + NR);
            }
        });
    });

    describe('Object', function() {
        it('should return result of #toString() method when the value is an object', function() {
            const RES: any = toStringSafe({
                toString: () => {
                    return 'MK+TM';
                },
            });

            assert.ok('string' === typeof RES);
            assert.equal(RES, 'MK+TM');
            assert.strictEqual(RES, 'MK+TM');
        });
    });
});
