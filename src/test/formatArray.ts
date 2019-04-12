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
import { formatArray } from '../strings';

describe('#formatArray()', async function() {
    it('no format providers', async function() {
        for (let i = 0; i < 100; i++) {
            const FORMAT_STR_PARTS = [];
            const FORMAT_ARGS = [];
            const EXPECTED_STR_PARTS = [];
            for (let j = 0; j <= i; j++) {
                FORMAT_STR_PARTS.push(
                    `{${ j }}`
                );

                FORMAT_ARGS.push(j * 5979);
                EXPECTED_STR_PARTS.push(
                    `${ j * 5979 }`
                );
            }

            const FORMAT_STR = FORMAT_STR_PARTS.join(' --- ');

            const ACTUAL_STR: string = formatArray.apply(
                null, [ <any>FORMAT_STR ].concat([ FORMAT_ARGS ])
            );
            const EXPECTED_STR = EXPECTED_STR_PARTS.join(' --- ');

            assert.equal(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.strictEqual(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.equal(ACTUAL_STR, EXPECTED_STR);
            assert.strictEqual(ACTUAL_STR, EXPECTED_STR);
        }
    });

    it('lower', async function() {
        const EXPECTED_STR = 'tm MK TM mk';
        const ACTUAL_STR = formatArray('{0:lower} {1} {0} {1:lower}',
                                       ['TM', 'MK']);

        assert.equal(ACTUAL_STR.length, EXPECTED_STR.length);
        assert.strictEqual(ACTUAL_STR.length, EXPECTED_STR.length);
        assert.equal(ACTUAL_STR, EXPECTED_STR);
        assert.strictEqual(ACTUAL_STR, EXPECTED_STR);
    });

    it('upper', async function() {
        const EXPECTED_STR = 'TM mk Tm MK';
        const ACTUAL_STR = formatArray('{0:upper} {1} {0} {1:upper}',
                                  [    'Tm', 'mk']);

        assert.equal(ACTUAL_STR.length, EXPECTED_STR.length);
        assert.strictEqual(ACTUAL_STR.length, EXPECTED_STR.length);
        assert.equal(ACTUAL_STR, EXPECTED_STR);
        assert.strictEqual(ACTUAL_STR, EXPECTED_STR);
    });

    it('ending_space', async function() {
        for (let i = 0; i < 100; i++) {
            const FORMAT_STR_PARTS = [];
            const FORMAT_ARGS = [];
            const EXPECTED_STR_PARTS = [];
            for (let j = 0; j <= i; j++) {
                FORMAT_STR_PARTS.push(
                    `{${ j }:ending_space}`
                );

                FORMAT_ARGS.push(j * 5979);
                EXPECTED_STR_PARTS.push(
                    `${ j * 5979 } `
                );
            }

            const FORMAT_STR = FORMAT_STR_PARTS.join(' --- ');

            const ACTUAL_STR: string = formatArray.apply(
                null, [ <any>FORMAT_STR ].concat([ FORMAT_ARGS ])
            );
            const EXPECTED_STR = EXPECTED_STR_PARTS.join(' --- ');

            assert.equal(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.strictEqual(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.equal(ACTUAL_STR, EXPECTED_STR);
            assert.strictEqual(ACTUAL_STR, EXPECTED_STR);
        }
    });

    it('leading_space', async function() {
        for (let i = 0; i < 100; i++) {
            const FORMAT_STR_PARTS = [];
            const FORMAT_ARGS = [];
            const EXPECTED_STR_PARTS = [];
            for (let j = 0; j <= i; j++) {
                FORMAT_STR_PARTS.push(
                    `{${ j }:leading_space}`
                );

                FORMAT_ARGS.push(j * 5979);
                EXPECTED_STR_PARTS.push(
                    ` ${ j * 5979 }`
                );
            }

            const FORMAT_STR = FORMAT_STR_PARTS.join(' --- ');

            const ACTUAL_STR: string = formatArray.apply(
                null, [ <any>FORMAT_STR ].concat([ FORMAT_ARGS ])
            );
            const EXPECTED_STR = EXPECTED_STR_PARTS.join(' --- ');

            assert.equal(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.strictEqual(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.equal(ACTUAL_STR, EXPECTED_STR);
            assert.strictEqual(ACTUAL_STR, EXPECTED_STR);
        }
    });

    it('trim', async function() {
        for (let i = 0; i < 100; i++) {
            const FORMAT_STR_PARTS = [];
            const FORMAT_ARGS = [];
            const EXPECTED_STR_PARTS = [];
            for (let j = 0; j <= i; j++) {
                FORMAT_STR_PARTS.push(
                    `{${ j }:trim}`
                );

                FORMAT_ARGS.push(`${
                    j % 2 === 0 ? ' ' : ''
                }${ j * 5979 }${
                    j % 2 === 0 ? ' ' : ''
                }`);
                EXPECTED_STR_PARTS.push(
                    `${ j * 5979 }`
                );
            }

            const FORMAT_STR = FORMAT_STR_PARTS.join(' --- ');

            const ACTUAL_STR: string = formatArray.apply(
                null, [ <any>FORMAT_STR ].concat([ FORMAT_ARGS ])
            );
            const EXPECTED_STR = EXPECTED_STR_PARTS.join(' --- ');

            assert.equal(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.strictEqual(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.equal(ACTUAL_STR, EXPECTED_STR);
            assert.strictEqual(ACTUAL_STR, EXPECTED_STR);
        }
    });

    it('surround', async function() {
        for (let i = 0; i < 100; i++) {
            const FORMAT_STR_PARTS = [];
            const FORMAT_ARGS = [];
            const EXPECTED_STR_PARTS = [];
            for (let j = 0; j <= i; j++) {
                FORMAT_STR_PARTS.push(
                    `{${ j }:surround}`
                );

                FORMAT_ARGS.push(`${ j * 5979 }`);
                EXPECTED_STR_PARTS.push(
                    `'${ j * 5979 }'`
                );
            }

            const FORMAT_STR = FORMAT_STR_PARTS.join(' --- ');

            const ACTUAL_STR: string = formatArray.apply(
                null, [ <any>FORMAT_STR ].concat([ FORMAT_ARGS ])
            );
            const EXPECTED_STR = EXPECTED_STR_PARTS.join(' --- ');

            assert.equal(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.strictEqual(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.equal(ACTUAL_STR, EXPECTED_STR);
            assert.strictEqual(ACTUAL_STR, EXPECTED_STR);
        }
    });

    it('trim,surround', async function() {
        for (let i = 0; i < 100; i++) {
            const FORMAT_STR_PARTS = [];
            const FORMAT_ARGS = [];
            const EXPECTED_STR_PARTS = [];
            for (let j = 0; j <= i; j++) {
                FORMAT_STR_PARTS.push(
                    `{${ j }:trim,surround}`
                );

                FORMAT_ARGS.push(`${
                    j % 2 === 0 ? ' ' : ''
                }${ j * 5979 }${
                    j % 2 === 0 ? ' ' : ''
                }`);
                EXPECTED_STR_PARTS.push(
                    `'${ j * 5979 }'`
                );
            }

            const FORMAT_STR = FORMAT_STR_PARTS.join(' --- ');

            const ACTUAL_STR: string = formatArray.apply(
                null, [ <any>FORMAT_STR ].concat([ FORMAT_ARGS ])
            );
            const EXPECTED_STR = EXPECTED_STR_PARTS.join(' --- ');

            assert.equal(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.strictEqual(ACTUAL_STR.length, EXPECTED_STR.length);
            assert.equal(ACTUAL_STR, EXPECTED_STR);
            assert.strictEqual(ACTUAL_STR, EXPECTED_STR);
        }
    });
});
