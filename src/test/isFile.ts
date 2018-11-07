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
import { isFile, isFileSync } from '../fs';

describe('#isFile()', async function() {
    describe('async', async function() {
        it('script check', async function() {
            const THAT_FILE = await isFile(__filename);
            const THAT_DIR = await isFile(__dirname);

            assert.equal(THAT_FILE, true);
            assert.strictEqual(THAT_FILE, true);
            assert.equal(THAT_DIR, false);
            assert.strictEqual(THAT_DIR, false);
        });

        it('script check (LSTAT)', async function() {
            const THAT_FILE = await isFile(__filename, true);
            const THAT_DIR = await isFile(__dirname, true);

            assert.equal(THAT_FILE, true);
            assert.strictEqual(THAT_FILE, true);
            assert.equal(THAT_DIR, false);
            assert.strictEqual(THAT_DIR, false);
        });
    });

    describe('sync', async function() {
        it('script check', function() {
            const THAT_FILE = isFileSync(__filename);
            const THAT_DIR = isFileSync(__dirname);

            assert.equal(THAT_FILE, true);
            assert.strictEqual(THAT_FILE, true);
            assert.equal(THAT_DIR, false);
            assert.strictEqual(THAT_DIR, false);
        });

        it('script check (LSTAT)', function() {
            const THAT_FILE = isFileSync(__filename, true);
            const THAT_DIR = isFileSync(__dirname, true);

            assert.equal(THAT_FILE, true);
            assert.strictEqual(THAT_FILE, true);
            assert.equal(THAT_DIR, false);
            assert.strictEqual(THAT_DIR, false);
        });
    });
});
