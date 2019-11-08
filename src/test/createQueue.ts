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
import { createQueue } from '../queues';

describe('#createQueue()', function () {
    it('should create and execute a queue', async function () {
        const QUEUE = createQueue();

        const ACTUAL_VALUES: number[] = [];

        for (let i = 0; i < 5; i++) {
            await QUEUE.add(() => {
                const EXPECTED_I = i;
                ACTUAL_VALUES.push(EXPECTED_I * 5979);

                return new Promise((resolve, reject) => {
                    try {
                        setTimeout(() => {
                            try {
                                assert.equal(i, EXPECTED_I);
                                assert.strictEqual(i, EXPECTED_I);
                                assert.equal(i + '', EXPECTED_I);
                                assert.equal(i, EXPECTED_I + '');
                                assert.equal(i + '', EXPECTED_I + '');
                                assert.equal(i + '', EXPECTED_I + '');
                                assert.strictEqual(i + '', EXPECTED_I + '');

                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        }, 100);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }

        for (let i = 0; i < ACTUAL_VALUES.length; i++) {
            const EXPECTED_I = i * 5979;

            assert.equal(ACTUAL_VALUES[i], EXPECTED_I);
            assert.strictEqual(ACTUAL_VALUES[i], EXPECTED_I);
            assert.equal(ACTUAL_VALUES[i] + '', EXPECTED_I);
            assert.equal(ACTUAL_VALUES[i], EXPECTED_I + '');
            assert.equal(ACTUAL_VALUES[i] + '', EXPECTED_I + '');
            assert.equal(ACTUAL_VALUES[i] + '', EXPECTED_I + '');
            assert.strictEqual(ACTUAL_VALUES[i] + '', EXPECTED_I + '');
        }
    });
});
