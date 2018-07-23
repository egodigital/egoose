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

import * as moment from 'moment';

/**
 * A log action.
 *
 * @param {LogContext} context The context.
 */
export type LogAction = (context: LogContext) => void;

/**
 * A log context.
 */
export interface LogContext {
    /**
     * The message.
     */
    readonly message: any;
    /**
     * The optional tag.
     */
    readonly tag?: string;
    /**
     * The timestamp.
     */
    readonly time: moment.Moment;
    /**
     * The type.
     */
    readonly type: LogType;
}

/**
 * List of log types.
 */
export enum LogType {
    /**
     * Emergency
     */
    Emerg = 0,
    /**
     * Alert
     */
    Alert = 1,
    /**
     * Critical
     */
    Crit = 2,
    /**
     * Error
     */
    Err = 3,
    /**
     * Warning
     */
    Warn = 4,
    /**
     * Notice
     */
    Notice = 5,
    /**
     * Informational
     */
    Info = 6,
    /**
     * Debug
     */
    Debug = 7,
    /**
     * Trace
     */
    Trace = 8,
}

/**
 * A logger.
 */
export class Logger {
    private readonly _ACTIONS: LogAction[] = [];

    /**
     * Adds a log action.
     *
     * @param {LogAction} action The action.
     *
     * @return this
     */
    public addAction(action: LogAction): this {
        this._ACTIONS.push(action);

        return this;
    }

    /**
     * Logs an alert message.
     *
     * @param {any} msg The message to log.
     * @param {string} [tag] Optional tag to log.
     *
     * @return this
     */
    public alert(msg: any, tag?: string): this {
        return this.log(LogType.Alert,
                        msg, tag);
    }

    /**
     * Logs a critical message.
     *
     * @param {any} msg The message to log.
     * @param {string} [tag] Optional tag to log.
     *
     * @return this
     */
    public crit(msg: any, tag?: string): this {
        return this.log(LogType.Crit,
                        msg, tag);
    }

    /**
     * Logs a debug message.
     *
     * @param {any} msg The message to log.
     * @param {string} [tag] Optional tag to log.
     *
     * @return this
     */
    public dbg(msg: any, tag?: string): this {
        return this.log(LogType.Debug,
                        msg, tag);
    }

    /**
     * Logs an emergency message.
     *
     * @param {any} msg The message to log.
     * @param {string} [tag] Optional tag to log.
     *
     * @return this
     */
    public emerg(msg: any, tag?: string): this {
        return this.log(LogType.Emerg,
                        msg, tag);
    }

    /**
     * Logs an error message.
     *
     * @param {any} msg The message to log.
     * @param {string} [tag] Optional tag to log.
     *
     * @return this
     */
    public err(msg: any, tag?: string): this {
        return this.log(LogType.Err,
                        msg, tag);
    }

    /**
     * Logs an info message.
     *
     * @param {any} msg The message to log.
     * @param {string} [tag] Optional tag to log.
     *
     * @return this
     */
    public info(msg: any, tag?: string): this {
        return this.log(LogType.Info,
                        msg, tag);
    }

    /**
     * Logs a message.
     *
     * @param {LogType} type The type.
     * @param {any} msg The message to log.
     * @param {string} tag The optional tag.
     *
     * @return this
     */
    public log(type: LogType, msg: any, tag?: string): this {
        const CONTEXT: LogContext = {
            message: msg,
            tag: tag,
            time: moment.utc(),
            type: type,
        };

        this._ACTIONS.forEach(action => {
            action(CONTEXT);
        });

        return this;
    }

    /**
     * Logs a notice.
     *
     * @param {any} msg The message to log.
     * @param {string} [tag] Optional tag to log.
     *
     * @return this
     */
    public note(msg: any, tag?: string): this {
        return this.log(LogType.Notice,
                        msg, tag);
    }

    /**
     * Logs a trace message.
     *
     * @param {any} msg The message to log.
     * @param {string} [tag] Optional tag to log.
     *
     * @return this
     */
    public trace(msg: any, tag?: string): this {
        return this.log(LogType.Trace,
                        msg, tag);
    }

    /**
     * Logs a warning message.
     *
     * @param {any} msg The message to log.
     * @param {string} [tag] Optional tag to log.
     *
     * @return this
     */
    public warn(msg: any, tag?: string): this {
        return this.log(LogType.Warn,
                        msg, tag);
    }
}

/**
 * Creates a new logger instance.
 *
 * @param {LogAction[]} [actions] One or more initial actions to add.
 *
 * @return {Logger} The new instance.
 */
export function createLogger(...actions: LogAction[]): Logger {
    const NEW_LOGGER = new Logger();
    actions.forEach(a => {
        NEW_LOGGER.addAction(a);
    });

    return NEW_LOGGER;
}
