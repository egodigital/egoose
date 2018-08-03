const geodist = require('geodist');

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
