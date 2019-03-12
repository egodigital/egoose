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
import { isDir, isDirSync } from '../fs';

describe('#isDir()', async function() {
    describe('async', async function() {
        it('script check', async function() {
            const THAT_FILE = await isDir(__filename);
            const THAT_DIR = await isDir(__dirname);

            assert.equal(THAT_DIR, true);
            assert.strictEqual(THAT_DIR, true);
            assert.equal(THAT_FILE, false);
            assert.strictEqual(THAT_FILE, false);
        });

        it('script check (LSTAT)', async function() {
            const THAT_FILE = await isDir(__filename, true);
            const THAT_DIR = await isDir(__dirname, true);

            assert.equal(THAT_DIR, true);
            assert.strictEqual(THAT_DIR, true);
            assert.equal(THAT_FILE, false);
            assert.strictEqual(THAT_FILE, false);
        });
    });

    describe('sync', async function() {
        it('script check', function() {
            const THAT_FILE = isDirSync(__filename);
            const THAT_DIR = isDirSync(__dirname);

            assert.equal(THAT_DIR, true);
            assert.strictEqual(THAT_DIR, true);
            assert.equal(THAT_FILE, false);
            assert.strictEqual(THAT_FILE, false);
        });

        it('script check (LSTAT)', function() {
            const THAT_FILE = isDirSync(__filename, true);
            const THAT_DIR = isDirSync(__dirname, true);

            assert.equal(THAT_DIR, true);
            assert.strictEqual(THAT_DIR, true);
            assert.equal(THAT_FILE, false);
            assert.strictEqual(THAT_FILE, false);
        });
    });
});
