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
import  * as egoose from '../index';

const EGO_DIGITAL = {
    lat: 50.782131,
    lng: 6.047182
};

const EGO_FACTORY_1 = {
    lat: 50.775635,
    lng: 6.132818,
};

describe('#calcDistance', function() {
    describe('route #1', function() {
        it('should return', async function() {
            const DISTANCE = egoose.calcDistance(
                EGO_DIGITAL.lat, EGO_DIGITAL.lng,
                EGO_FACTORY_1.lat, EGO_FACTORY_1.lng,
            );

            assert.ok(typeof DISTANCE === 'number');

            const ACTUAL = parseInt(
                '' + (Math.floor(DISTANCE / 1000.0) * 1000)
            );

            assert.equal(ACTUAL, 6000);
            assert.strictEqual(ACTUAL, 6000);
        });
    });

    describe('route #2', function() {
        it('should return a random string', function() {
            const DISTANCE = egoose.calcDistance(
                EGO_FACTORY_1.lat, EGO_FACTORY_1.lng,
                EGO_DIGITAL.lat, EGO_DIGITAL.lng,
            );

            assert.ok(typeof DISTANCE === 'number');

            const ACTUAL = parseInt(
                '' + (Math.floor(DISTANCE / 1000.0) * 1000)
            );

            assert.equal(ACTUAL, 6000);
            assert.strictEqual(ACTUAL, 6000);
        });
    });
});
