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
import { cloneObj } from '../index';

describe('#cloneObj()', function() {
    it('should be cloned version of OBJ', function() {
        for (let i = 0; i < 1000; i++) {
            const OBJ = {
                'a': i,
                'b': i * 10,
                'c': i * 5979,
                'd': i * 23979,
            };

            const CLONE_OBJ = cloneObj(OBJ);

            assert.ok('object' === typeof CLONE_OBJ);
            assert.notEqual(CLONE_OBJ, OBJ);
            assert.notStrictEqual(CLONE_OBJ, OBJ);
            assert.ok(Object.keys(CLONE_OBJ).length === Object.keys(OBJ).length);

            for (const KEY in OBJ) {
                assert.equal(CLONE_OBJ[KEY], OBJ[KEY]);
                assert.strictEqual(CLONE_OBJ[KEY], OBJ[KEY]);
            }
        }
    });
});
