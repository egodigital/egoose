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
import  * as egoose from '../index';

describe('#parseCommandLine', function() {
    describe('sync', function() {
        it("should be return 'format' as command and 'C:' as argument", function() {
            const ARGS = egoose.parseCommandLine('Format C:');

            assert.ok('object' === typeof ARGS);

            assert.ok('string' === typeof ARGS.command);
            assert.equal(ARGS.command, 'format');
            assert.strictEqual(ARGS.command, 'format');

            assert.ok('object' === typeof ARGS.arguments);
            assert.ok(Array.isArray(ARGS.arguments._));

            assert.equal(ARGS.arguments._.length, 1);
            assert.strictEqual(ARGS.arguments._.length, 1);

            assert.ok('string' === typeof ARGS.arguments._[0]);
            assert.equal(ARGS.arguments._[0], 'C:');
            assert.strictEqual(ARGS.arguments._[0], 'C:');
        });

        it("should be return 'format' as command and no argument", function() {
            const ARGS = egoose.parseCommandLine('Format');

            assert.ok('object' === typeof ARGS);

            assert.ok('string' === typeof ARGS.command);
            assert.equal(ARGS.command, 'format');
            assert.strictEqual(ARGS.command, 'format');

            assert.ok('object' === typeof ARGS.arguments);
            assert.ok(Array.isArray(ARGS.arguments._));

            assert.equal(ARGS.arguments._.length, 0);
            assert.strictEqual(ARGS.arguments._.length, 0);
        });

        it("should be return 'format' as command and 5 arguments", function() {
            const ARGS = egoose.parseCommandLine('FOO "file.txt" --bar1=1 --bar2="1" --bar3=tm --bar4');

            assert.ok('object' === typeof ARGS);

            assert.ok('string' === typeof ARGS.command);
            assert.equal(ARGS.command, 'foo');
            assert.strictEqual(ARGS.command, 'foo');

            assert.equal(ARGS.arguments._.length, 1);
            assert.strictEqual(ARGS.arguments._.length, 1);

            assert.ok('string' === typeof ARGS.arguments._[0]);
            assert.equal(ARGS.arguments._[0], 'file.txt');
            assert.strictEqual(ARGS.arguments._[0], 'file.txt');

            assert.ok('number' === typeof ARGS.arguments.bar1);
            assert.equal(ARGS.arguments.bar1, 1);
            assert.strictEqual(ARGS.arguments.bar1, 1);

            assert.ok('number' === typeof ARGS.arguments.bar2);
            assert.equal(ARGS.arguments.bar2, 1);
            assert.strictEqual(ARGS.arguments.bar2, 1);

            assert.ok('string' === typeof ARGS.arguments.bar3);
            assert.equal(ARGS.arguments.bar3, 'tm');
            assert.strictEqual(ARGS.arguments.bar3, 'tm');

            assert.ok('boolean' === typeof ARGS.arguments.bar4);
            assert.equal(ARGS.arguments.bar4, true);
            assert.strictEqual(ARGS.arguments.bar4, true);
        });
    });
});
