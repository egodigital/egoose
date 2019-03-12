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

import * as moment from 'moment';

/**
 * A stopwatch.
 */
export class StopWatch {
    private _startTime: moment.Moment | false = false;

    /**
     * Gets if the stop watch is running or not.
     */
    public get isRunning(): boolean {
        return moment.isMoment(this._startTime);
    }

    /**
     * (Re-)Starts the stop watch.
     *
     * @return this
     */
    public start(): this {
        this._startTime = moment.utc();

        return this;
    }

    /**
     * Stops the watch.
     *
     * @return {number} The number of milliseconds.
     */
    public stop(): number {
        const NOW = moment.utc();
        const START_TIME = this._startTime;

        this._startTime = false;

        if (moment.isMoment(START_TIME)) {
            return NOW.diff(START_TIME, 'ms', true);
        }
    }
}

/**
 * Creates and starts a new stop watch.
 *
 * @return {StopWatch} The new, started watch.
 */
export function startWatch(): StopWatch {
    return (new StopWatch()).start();
}
