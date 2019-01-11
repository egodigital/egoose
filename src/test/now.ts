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
import  * as moment from 'moment';

describe('#now(tz)', function() {
    describe('with timezone', function() {
        it('should return a moment js object', async function() {
            const VALUE = egoose.now('CET');
            assert.ok(typeof VALUE === 'object' && moment.isMoment(VALUE));
        });
    });

    describe('without timezone', function() {
        it('should return a moment js object', async function() {
            const VALUE = egoose.now();
            assert.ok(typeof VALUE === 'object' && moment.isMoment(VALUE));
        });
    });

});
