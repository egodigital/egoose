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

import { POST } from '../http';
import { normalizeString } from '../index';
const geodist = require('geodist');
const polyline = require('@mapbox/polyline');

/**
 * Geo coordinates.
 */
export interface GeoCoordinates {
    /**
     * The latitude.
     */
    lat: number;
    /**
     * The longitude.
     */
    lng: number;
}

interface MapBoxRouteResult {
    code: string;
    routes: {
        geometry: string;
    }[];
}

/**
 * Calculates the distance between 2 geo points.
 *
 * @param {number} lat1 The latitude of the first point.
 * @param {number} lon1 The longitude of the first point.
 * @param {number} lat2 The latitude of the second point.
 * @param {number} lon2 The longitude of the second point.
 * @param {string} [unit] The custom unit to use.
 *
 * @return {number} The distance in meters.
 */
export function calcDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number,
    unit = 'meters',
): number {
    return geodist({
        lat: lat1, lon: lon1
    }, {
        lat: lat2, lon: lon2
    }, {
        exact: true,
        unit: unit,
    });
}

/**
 * Calculates a route via a service, like MapBox.
 *
 * @param {GeoCoordinates} from The start location.
 * @param {GeoCoordinates} to The end location.
 *
 * @return {Promise<contracts.GeoCoordinates[]>} The promise with the route.
 */
export async function calcRoute(
    from: GeoCoordinates,
    to: GeoCoordinates,
): Promise<GeoCoordinates[]> {
    const RESPONSE = await POST(
        'https://api.mapbox.com/directions/v5/mapbox/driving?access_token=' + encodeURIComponent(
            process.env.MAPBOX_API_TOKEN
        ),
        {
            body: Buffer.from(
                `coordinates=${ from.lng },${ from.lat };${ to.lng },${ from.lat }&steps=true&waypoints=0;1&waypoint_names=Home;Work&banner_instructions=true`,
                'utf8'
            ),
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            }
        }
    );

    if (200 !== RESPONSE.code) {
        throw new Error(`Unexpected response: [${ RESPONSE.code }] '${ RESPONSE.status }'`);
    }

    const RESULT: MapBoxRouteResult = JSON.parse(
        (await RESPONSE.readBody())
            .toString('utf8')
    );

    if ('ok' !== normalizeString(RESULT.code)) {
        throw new Error(`Routing failed!`);
    }

    const ROUTE: GeoCoordinates[] = [];

    const WAYPOINTS: [number, number][] = polyline.decode(
        RESULT.routes[0].geometry
    );
    for (const WP of WAYPOINTS) {
        ROUTE.push({
            lat: WP[0],
            lng: WP[1],
        });
    }

    // prepend 'from'
    ROUTE.unshift(from);
    // append 'to'
    ROUTE.push(to);

    return ROUTE;
}
