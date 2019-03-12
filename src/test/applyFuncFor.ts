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
import { applyFuncFor } from '../index';

describe('#applyFuncFor()', function() {
    describe('(null)', function() {
        it('should use OBJ_2 as thisArg instead of OBJ_1 (sync)', function() {
            let objOfFunc: any;

            const OBJ_1: any = {
                test: function(a: number, b: number) {
                    objOfFunc = this;

                    return a + b;
                },
            };
            const OBJ_2: any = {};

            const FUNC = applyFuncFor(OBJ_1.test, OBJ_2);
            assert.ok('function' === typeof FUNC);
            assert.notEqual(FUNC, OBJ_1.test);
            assert.notStrictEqual(FUNC, OBJ_1.test);

            for (let a = 0; a < 100; a++) {
                for (let b = 0; b < 100; b++) {
                    objOfFunc = false;

                    const EXPECTED_SUM = a + b;
                    const ACTUAL_SUM = FUNC(a, b);

                    assert.ok('number' === typeof ACTUAL_SUM);
                    assert.equal(ACTUAL_SUM, EXPECTED_SUM);
                    assert.strictEqual(ACTUAL_SUM, EXPECTED_SUM);

                    assert.ok('object' === typeof objOfFunc);
                    assert.equal(objOfFunc, OBJ_2);
                    assert.strictEqual(objOfFunc, OBJ_2);
                }
            }
        });

        it('should use OBJ_2 as thisArg instead of OBJ_1 (async)', async function() {
            let objOfFunc: any;

            const OBJ_1: any = {
                test: async function(a: number, b: number) {
                    objOfFunc = this;

                    return a + b;
                },
            };
            const OBJ_2: any = {};

            const FUNC = applyFuncFor(OBJ_1.test, OBJ_2);
            assert.ok('function' === typeof FUNC);
            assert.notEqual(FUNC, OBJ_1.test);
            assert.notStrictEqual(FUNC, OBJ_1.test);

            for (let a = 0; a < 100; a++) {
                for (let b = 0; b < 100; b++) {
                    objOfFunc = false;

                    const EXPECTED_SUM = a + b;
                    const ACTUAL_SUM = await FUNC(a, b);

                    assert.ok('number' === typeof ACTUAL_SUM);
                    assert.equal(ACTUAL_SUM, EXPECTED_SUM);
                    assert.strictEqual(ACTUAL_SUM, EXPECTED_SUM);

                    assert.ok('object' === typeof objOfFunc);
                    assert.equal(objOfFunc, OBJ_2);
                    assert.strictEqual(objOfFunc, OBJ_2);
                }
            }
        });
    });
});
