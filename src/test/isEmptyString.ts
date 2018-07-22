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
import { isEmptyString } from '../index';

const WHITESPACES = " \t\r\n";

describe('#isEmptyString()', function() {
    describe('null', function() {
        it('should return (true) if input is (null)', function() {
            const RES: any = isEmptyString(null);

            assert.ok('boolean' === typeof RES);
            assert.ok(RES);
            assert.equal(RES, true);
            assert.strictEqual(RES, true);
        });
    });

    describe('undefined', function() {
        it('should return (true) if input is (undefined)', function() {
            const RES: any = isEmptyString(undefined);

            assert.ok('boolean' === typeof RES);
            assert.ok(RES);
            assert.equal(RES, true);
            assert.strictEqual(RES, true);
        });
    });

    describe('String', function() {
        it('should return (true) if input is an empty string', function() {
            const RES: any = isEmptyString('');

            assert.ok('boolean' === typeof RES);
            assert.ok(RES);
            assert.equal(RES, true);
            assert.strictEqual(RES, true);
        });

        it('should return (true) if input contains whitespaces only', function() {
            for (let i = 1; i <= 1000; i++) {
                let str = '';
                for (let j = 0; j < i; j++) {
                    str += WHITESPACES[ j % WHITESPACES.length ];
                }

                const RES: any = isEmptyString(str);

                assert.ok('boolean' === typeof RES);
                assert.ok(RES);
                assert.equal(RES, true);
                assert.strictEqual(RES, true);
            }
        });
    });

    describe('Number', function() {
        it('should return (false) if input is 0', function() {
            const RES: any = isEmptyString(0);

            assert.ok('boolean' === typeof RES);
            assert.ok(!RES);
            assert.equal(RES, false);
            assert.strictEqual(RES, false);
        });
    });

    describe('Object', function() {
        it('should return (true) if #toString() of input returns empty string', function() {
            const RES: any = isEmptyString({
                toString: () => '',
            });

            assert.ok('boolean' === typeof RES);
            assert.ok(RES);
            assert.equal(RES, true);
            assert.strictEqual(RES, true);
        });

        it('should return (true) if #toString() of input returns whitespaces only', function() {
            for (let i = 1; i <= 1000; i++) {
                let str = '';
                for (let j = 0; j < i; j++) {
                    str += WHITESPACES[ j % WHITESPACES.length ];
                }

                const RES: any = isEmptyString({
                    toString: () => str,
                });

                assert.ok('boolean' === typeof RES);
                assert.ok(RES);
                assert.equal(RES, true);
                assert.strictEqual(RES, true);
            }
        });
    });
});
