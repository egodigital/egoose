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
import { compareValues } from '../index';

describe('#compareValues()', function() {
    describe('Array', function() {
        it('should return a sorted array (ascending)', function() {
            const ARR = [ 1, 2, 3, 0, 4 ];

            const RES: any[] = ARR.sort((x, y) => {
                return compareValues(x, y);
            });

            for (let i = 0; i < ARR.length; i++) {
                const ITEM = RES[i];

                assert.ok('number' === typeof ITEM);
                assert.equal(ITEM, i);
                assert.strictEqual(ITEM, i);
            }
        });

        it('should return a sorted array (descending)', function() {
            const ARR = [ 1, 2, 3, 0, 4 ];

            const RES: any[] = ARR.sort((x, y) => {
                return compareValues(y, x);
            });

            for (let i = 0; i < ARR.length; i++) {
                const ITEM = RES[i];

                assert.ok('number' === typeof ITEM);
                assert.equal(ITEM, ARR.length - i - 1);
                assert.strictEqual(ITEM, ARR.length - i - 1);
            }
        });
    });
});
