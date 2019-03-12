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

/**
 * Describes a generic event listener.
 *
 * @param {any[]} [args] One or more argument.
 */
export type EventListener = (...args: any[]) => void;

/**
 * Tries to remove a listener from an event emitter.
 *
 * @param {NodeJS.EventEmitter} obj The emitter.
 * @param {string|symbol} ev The event.
 * @param {EventListener} listener The listener.
 *
 * @return {boolean} Operation was successfull or not.
 */
export function tryRemoveListener(
    obj: NodeJS.EventEmitter,
    ev: string | symbol, listener: EventListener,
) {
    try {
        if (obj && obj.removeListener) {
            obj.removeListener(ev, listener);
        }

        return true;
    } catch {
        return false;
    }
}
