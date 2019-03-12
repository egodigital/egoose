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
import * as moment from 'moment';
import { asMoment } from '../index';

describe('#asMoment()', async function() {
    describe('Date', function() {
        it('utc', async function() {
            const MOMENT_VAL = asMoment(
                Date.UTC(1979, 9, 5, 23, 9, 19, 79)
            );

            assert.ok( moment.isMoment(MOMENT_VAL) );
            assert.ok( MOMENT_VAL.isValid() );
        });

        it('local', async function() {
            const MOMENT_VAL = asMoment(
                new Date(1979, 9, 5, 23, 9, 19, 79)
            );

            assert.ok( moment.isMoment(MOMENT_VAL) );
            assert.ok( MOMENT_VAL.isValid() );
        });
    });

    describe('moment', function() {
        it('utc', async function() {
            const MOMENT_VAL = asMoment(
                moment.utc()
            );

            assert.ok( moment.isMoment(MOMENT_VAL) );
            assert.ok( MOMENT_VAL.isValid() );
        });

        it('local', async function() {
            const MOMENT_VAL = asMoment(
                moment()
            );

            assert.ok( moment.isMoment(MOMENT_VAL) );
            assert.ok( MOMENT_VAL.isValid() );
        });
    });

    describe('String', function() {
        it('local', async function() {
            const MOMENT_VAL = asMoment(
                '1979-09-05 23:09:19.079'
            );

            assert.ok( moment.isMoment(MOMENT_VAL) );
            assert.ok( MOMENT_VAL.isValid() );
        });
    });
});
