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
import * as joi from 'joi';
import { describe, it } from 'mocha';
import { isJoi } from '../schemas';

describe('#isJoi()', async function () {
    describe('joi values', async function () {
        it('alternatives schema should be detected as joi object', function () {
            const SCHEMA = joi.alternatives();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('array schema should be detected as joi object', function () {
            const SCHEMA = joi.array();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('binary schema should be detected as joi object', function () {
            const SCHEMA = joi.binary();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('bool schema should be detected as joi object', function () {
            const SCHEMA = joi.bool();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('boolean schema should be detected as joi object', function () {
            const SCHEMA = joi.boolean();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('date schema should be detected as joi object', function () {
            const SCHEMA = joi.date();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('func schema should be detected as joi object', function () {
            const SCHEMA = joi.func();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('lazy schema should be detected as joi object', function () {
            const SCHEMA = joi.lazy(() => joi.object());

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('number schema should be detected as joi object', function () {
            const SCHEMA = joi.number();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('object schema should be detected as joi object', function () {
            const SCHEMA = joi.object();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('string schema should be detected as joi object', function () {
            const SCHEMA = joi.string();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });

        it('symbol schema should be detected as joi object', function () {
            const SCHEMA = joi.symbol();

            const IS_JOI = isJoi(SCHEMA);

            assert.equal(IS_JOI, true);
            assert.strictEqual(IS_JOI, true);
        });
    });

    describe('non-joi values', async function () {
        it('array should NOT be detected as joi object', function () {
            const VALUE = [];

            const IS_JOI = isJoi(VALUE);

            assert.equal(IS_JOI, false);
            assert.strictEqual(IS_JOI, false);
        });

        it('binary should NOT be detected as joi object', function () {
            const VALUE = Buffer.alloc(5979);

            const IS_JOI = isJoi(VALUE);

            assert.equal(IS_JOI, false);
            assert.strictEqual(IS_JOI, false);
        });

        it('booleans should NOT be detected as joi object', function () {
            const VALUE_1 = false;
            const VALUE_2 = true;

            const IS_JOI_1 = isJoi(VALUE_1);
            const IS_JOI_2 = isJoi(VALUE_2);

            assert.equal(IS_JOI_1, false);
            assert.strictEqual(IS_JOI_1, false);
            assert.equal(IS_JOI_2, false);
            assert.strictEqual(IS_JOI_2, false);
        });

        it('date should NOT be detected as joi object', function () {
            const VALUE = new Date();

            const IS_JOI = isJoi(VALUE);

            assert.equal(IS_JOI, false);
            assert.strictEqual(IS_JOI, false);
        });

        it('functions should NOT be detected as joi object', function () {
            const VALUE_1 = () => "TM";
            const VALUE_2 = function () { return "1979-09-05"; };

            const IS_JOI_1 = isJoi(VALUE_1);
            const IS_JOI_2 = isJoi(VALUE_2);

            assert.equal(IS_JOI_1, false);
            assert.strictEqual(IS_JOI_1, false);
            assert.equal(IS_JOI_2, false);
            assert.strictEqual(IS_JOI_2, false);
        });

        it('numbers should NOT be detected as joi object', function () {
            for (let i = 5979; i <= 23979; i++) {
                const IS_JOI = isJoi(i);

                assert.equal(IS_JOI, false);
                assert.strictEqual(IS_JOI, false);
            }
        });

        it('object should NOT be detected as joi object', function () {
            const VALUE = {
                'TM': '1979-09-05',
                'MK': 23979,
            };

            const IS_JOI = isJoi(VALUE);

            assert.equal(IS_JOI, false);
            assert.strictEqual(IS_JOI, false);
        });

        it('string should NOT be detected as joi object', function () {
            const VALUE = "TM+MK";

            const IS_JOI = isJoi(VALUE);

            assert.equal(IS_JOI, false);
            assert.strictEqual(IS_JOI, false);
        });

        it('symbol should NOT be detected as joi object', function () {
            const VALUE = Symbol("TM+MK");

            const IS_JOI = isJoi(VALUE);

            assert.equal(IS_JOI, false);
            assert.strictEqual(IS_JOI, false);
        });
    });
});
