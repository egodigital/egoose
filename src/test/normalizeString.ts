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
import { normalizeString } from '../index';

const WHITESPACES = " \t\r\n";

describe('#normalizeString()', function() {
    describe('null', function() {
        it('should return empty string if input is (null)', function() {
            const RES: any = normalizeString(null);

            assert.ok('string' === typeof RES);
            assert.equal(RES, '');
            assert.strictEqual(RES, '');
        });
    });

    describe('undefined', function() {
        it('should return empty string if input is (undefined)', function() {
            const RES: any = normalizeString(undefined);

            assert.ok('string' === typeof RES);
            assert.equal(RES, '');
            assert.strictEqual(RES, '');
        });
    });

    describe('String', function() {
        it('should return empty string if input is an empty string', function() {
            const RES: any = normalizeString('');

            assert.ok('string' === typeof RES);
            assert.equal(RES, '');
            assert.strictEqual(RES, '');
        });

        it('should return empty string if input contains whitespaces only', function() {
            for (let i = 1; i <= 1000; i++) {
                let str = '';
                for (let j = 0; j < i; j++) {
                    str += WHITESPACES[ j % WHITESPACES.length ];
                }

                const RES: any = normalizeString(str);

                assert.ok('string' === typeof RES);
                assert.equal(RES, '');
                assert.strictEqual(RES, '');
            }
        });

        it('should return lower case, trimmed version of an input string', function() {
            const RES: any = normalizeString(' Mk + tM  ');

            assert.ok('string' === typeof RES);
            assert.equal(RES, 'mk + tm');
            assert.strictEqual(RES, 'mk + tm');
        });
    });

    describe('Number', function() {
        it('should return "0" if input is 0', function() {
            const RES: any = normalizeString(0);

            assert.ok('string' === typeof RES);
            assert.equal(RES, '0');
            assert.strictEqual(RES, '0');
        });
    });

    describe('Object', function() {
        it('should return empty string if #toString() of input returns empty string', function() {
            const RES: any = normalizeString({
                toString: () => '',
            });

            assert.ok('string' === typeof RES);
            assert.equal(RES, '');
            assert.strictEqual(RES, '');
        });

        it('should return empty string if #toString() of input contains whitespaces only', function() {
            for (let i = 1; i <= 1000; i++) {
                let str = '';
                for (let j = 0; j < i; j++) {
                    str += WHITESPACES[ j % WHITESPACES.length ];
                }

                const RES: any = normalizeString({
                    toString: () => str,
                });

                assert.ok('string' === typeof RES);
                assert.equal(RES, '');
                assert.strictEqual(RES, '');
            }
        });
    });
});
