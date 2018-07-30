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
import { toBooleanSafe } from '../index';

describe('#toBooleanSafe()', function() {
    describe('(null)', function() {
        it('should return (false) when the value is (null)', function() {
            const RES: any = toBooleanSafe(null);

            assert.ok('boolean' === typeof RES);
            assert.equal(RES, false);
            assert.strictEqual(RES, false);
        });

        it('should return (true) when the value is (null)', function() {
            const RES: any = toBooleanSafe(null, true);

            assert.ok('boolean' === typeof RES);
            assert.equal(RES, true);
            assert.strictEqual(RES, true);
        });
    });

    describe('(undefined)', function() {
        it('should return (false) when the value is (null)', function() {
            const RES: any = toBooleanSafe(undefined);

            assert.ok('boolean' === typeof RES);
            assert.equal(RES, false);
            assert.strictEqual(RES, false);
        });

        it('should return (true) when the value is (null)', function() {
            const RES: any = toBooleanSafe(undefined, true);

            assert.ok('boolean' === typeof RES);
            assert.equal(RES, true);
            assert.strictEqual(RES, true);
        });
    });

    describe('(true)', function() {
        it('should return (true)', function() {
            const RES: any = toBooleanSafe(true);

            assert.ok('boolean' === typeof RES);
            assert.equal(RES, true);
            assert.strictEqual(RES, true);
        });

        it('should return (true)', function() {
            const RES: any = toBooleanSafe(true, false);

            assert.ok('boolean' === typeof RES);
            assert.equal(RES, true);
            assert.strictEqual(RES, true);
        });
    });

    describe('(true)', function() {
        it('should return (false)', function() {
            const RES: any = toBooleanSafe(false);

            assert.ok('boolean' === typeof RES);
            assert.equal(RES, false);
            assert.strictEqual(RES, false);
        });

        it('should return (false)', function() {
            const RES: any = toBooleanSafe(false, true);

            assert.ok('boolean' === typeof RES);
            assert.equal(RES, false);
            assert.strictEqual(RES, false);
        });
    });
});
