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

const mergeDeep = require('merge-deep');
import * as pQueue from 'p-queue';

/**
 * Options for 'CreateQueueOptions' function.
 */
export type CreateQueueOptions = pQueue.Options<pQueue.QueueAddOptions>;

/**
 * Creates a new queue.
 *
 * @param {CreateQueueOptions} [opts] Custom options.
 *
 * @return {pQueue} The new queue.
 */
export function createQueue(opts?: CreateQueueOptions): pQueue {
    opts = mergeDeep(<CreateQueueOptions>{
        autoStart: true,
        concurrency: 1,
    }, opts || {});

    return new pQueue(opts);
}
