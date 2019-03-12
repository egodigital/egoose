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
import { asLocal } from '../index';

describe('#asLocal()', async function() {
    describe('Date', function() {
        it('utc => local', async function() {
            const NOW = Date.UTC(1979, 9, 5, 23, 9, 19, 79);
            const AS_LOCAL = asLocal(NOW);

            assert.ok(AS_LOCAL.isLocal());
        });

        it('local => local', async function() {
            const NOW = new Date(1979, 9, 5, 23, 9, 19, 79);
            const AS_LOCAL = asLocal(NOW);

            assert.ok(AS_LOCAL.isLocal());
        });
    });

    describe('moment', function() {
        it('utc => local', async function() {
            const NOW = moment.utc();
            const AS_LOCAL = asLocal(NOW);

            assert.ok(AS_LOCAL.isLocal());
        });

        it('local => local', async function() {
            const NOW = moment();
            const AS_LOCAL = asLocal(NOW);

            assert.ok(AS_LOCAL.isLocal());
        });
    });

    describe('String', function() {
        it('utc => local', async function() {
            const NOW = '1979-09-05 23:09:19.079';
            const AS_LOCAL = asLocal(NOW);

            assert.ok(AS_LOCAL.isLocal());
        });

        it('local => local', async function() {
            const NOW = '1979-09-05 23:09:19.079';
            const AS_LOCAL = asLocal(NOW);

            assert.ok(AS_LOCAL.isLocal());
        });
    });
});
