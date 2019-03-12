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
import { execSync } from 'child_process';
import { describe, it } from 'mocha';
import * as moment from 'moment';
import { getAppVersionSync } from '../index';

describe('#getAppVersion()', async function() {
    describe('sync', function() {
        it('should detect app version information', async function() {
            const DATE = moment(
                execSync('git log -n1 --pretty=%cI HEAD')
                    .toString('utf8')
                    .trim()
            );

            const HASH = execSync('git log --pretty="%H" -n1 HEAD')
                .toString('utf8')
                .toLowerCase()
                .trim();

            const VERSION = getAppVersionSync();

            assert.ok('object' === typeof VERSION);

            // VERSION.date
            assert.ok( moment.isMoment(VERSION.date) );
            assert.ok( (<moment.Moment>VERSION.date).isValid() );
            assert.ok( (<moment.Moment>VERSION.date).isUTC() );
            assert.ok( (<moment.Moment>VERSION.date).isUtc() );
            assert.equal((<moment.Moment>VERSION.date).unix(), DATE.unix());
            assert.strictEqual((<moment.Moment>VERSION.date).unix(), DATE.unix());

            // VERSION.hash
            assert.ok('string' === typeof VERSION.hash);
            assert.equal(VERSION.hash, HASH);
            assert.strictEqual(VERSION.hash, HASH);
        });
    });
});
