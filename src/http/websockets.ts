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

import { normalizeString, Predicate, toBooleanSafe, toStringSafe } from '../index';
import * as _ from 'lodash';
import * as events from 'events';
import * as http from 'http';
import * as ws from 'ws';

/**
 * Context of a client verifier.
 */
export interface WebSocketHostClientVerifierContext {
    /**
     * Indicates if connection is secure or not.
     */
    isSecure: boolean;
    /**
     * The request context.
     */
    request: http.IncomingMessage;
}

/**
 * Verifies a remote client.
 *
 * @param {WebSocketHostClientVerifierContext} context The context.
 *
 * @return {boolean|PromiseLike<boolean>} The result, that indicates, if client is valid or not.
 */
export type WebSocketHostClientVerifier = (
    context: WebSocketHostClientVerifierContext,
) => boolean | PromiseLike<boolean>;

/**
 * Options for a 'WebSocketHost'.
 */
export interface WebSocketHostOptions {
    /**
     * The custom TCP port. Default: 5979
     */
    port?: number;
    /**
     * A factory function, that creates a custom server instance.
     */
    serverFactory?: WebSocketHostServerFactory;
    /**
     * An optional function to verify a client.
     */
    verifyClient?: WebSocketHostClientVerifier;
}

/**
 * Describes a factory function, that creates a custom server instance.
 *
 * @return {http.Server|PromiseLike<http.Server>} The result with the new server instance.
 */
export type WebSocketHostServerFactory = () => http.Server | PromiseLike<http.Server>;

/**
 * A web socket message.
 */
export interface WebSocketMessage<TData = any> {
    /**
     * The data.
     */
    data?: TData;
    /**
     * The type.
     */
    type: string;
}

/**
 * Possible values for 'onType' first argument.
 */
export type WebSocketOnTypeCheckArgument = RegExp | string | Predicate<string>;

/**
 * An event for an 'onType' event.
 *
 * @param {TData} data The data.
 * @param {string} type The type.
 */
export type WebSocketOnTypeEventListener<TData = any> = (data: TData, type: string) => void;

/**
 * A web socket host.
 */
export class WebSocketHost extends events.EventEmitter {
    private _server: http.Server;

    /**
     * Initializes a new instance of that class.
     *
     * @param {WebSocketHostOptions} [options] Custom options for the host.
     */
    public constructor(
        public readonly options?: WebSocketHostOptions,
    ) {
        super();

        if (!this.options) {
            this.options = <any>{};
        }
    }

    /**
     * Gets if the server is currently running or not.
     */
    public get isRunning(): boolean {
        return !!this._server;
    }

    /**
     * Starts the host.
     *
     * @return {Promise<boolean>} The promise that indicates if operation was succesfull or not.
     */
    public start(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                if (this.isRunning) {
                    resolve(false);
                    return;
                }

                let serverFactory = this.options.serverFactory;
                if (!serverFactory) {
                    serverFactory = () => {
                        return http.createServer();
                    };
                }

                let port = parseInt(
                    toStringSafe(this.options.port)
                        .trim()
                );
                if (isNaN(port)) {
                    port = 5979;
                }

                const NEW_SERVER = await Promise.resolve(
                    serverFactory()
                );

                if (!NEW_SERVER) {
                    resolve(false);
                    return;
                }

                NEW_SERVER.once('error', (err) => {
                    reject(err);
                });

                const VERIFY_CLIENT: ws.VerifyClientCallbackAsync = async (info, callback) => {
                    let isValid = true;

                    try {
                        if (this.options.verifyClient) {
                            isValid = toBooleanSafe(
                                await Promise.resolve(
                                    this.options.verifyClient({
                                        isSecure: info.secure,
                                        request: info.req,
                                    }),
                                )
                            );
                        }
                    } catch {
                        isValid = false;
                    }

                    if (isValid) {
                        callback(true);
                    } else {
                        callback(false, 401);
                    }
                };

                const WSS = new ws.Server({
                    server: NEW_SERVER,
                    verifyClient: VERIFY_CLIENT,
                });

                WSS.on('error', (err) => {
                    /* ignore errors */
                });

                WSS.on('connection', (ws) => {
                    try {
                        const CONN = new WebSocketClient(this, ws);
                        CONN.init();

                        this.emit('connection',
                                  CONN);
                    } catch {
                        try {
                            ws.close();
                        } catch { }
                    }
                });

                NEW_SERVER.listen(port, () => {
                    this._server = NEW_SERVER;

                    resolve(true);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Stops the host.
     *
     * @return {Promise<boolean>} The promise that indicates if operation was succesfull or not.
     */
    public stop(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const SERVER = this._server;
                if (!SERVER) {
                    resolve(false);
                    return;
                }

                SERVER.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        this._server = null;
                        resolve(true);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}

/**
 * A web socket client.
 */
export class WebSocketClient extends events.EventEmitter {
    /**
     * Initializes a new instance of that class.
     *
     * @param {WebSocketHost} host The underlying host.
     * @param {ws} socket The underlying socket.
     */
    public constructor(
        public readonly host: WebSocketHost,
        public readonly socket: ws,
    ) {
        super();
    }

    /**
     * Initializes the instance.
     */
    public init() {
        this.socket.on('error', (err) => {
            /* ignore errors */
        });

        this.socket.on('message', (data) => {
            try {
                const MSG: WebSocketMessage = JSON.parse(
                    toStringSafe(data)
                );

                if (MSG) {
                    this.emit('message',
                              MSG);

                    const TYPE = normalizeString(MSG.type);
                    this.emit('message.' + TYPE,
                              MSG, TYPE);
                }
            } catch { }
        });

        this.socket.once('close', () => {
            this.emit('close');
        });
    }

    /**
     * Registers an event listener for a message type.
     *
     * @param {RegExp} pattern The Regex pattern, that checks the type.
     * @param {WebSocketOnTypeEventListener<TData>} listener The listener.
     *
     * @return {Function} The "real" event listener.
     */
    public onType<TData = any>(
        pattern: RegExp,
        listener: WebSocketOnTypeEventListener<TData>,
    ): Function;
    /**
     * Registers an event listener for a message type.
     *
     * @param {string} type The type.
     * @param {WebSocketOnTypeEventListener<TData>} listener The listener.
     *
     * @return {Function} The "real" event listener.
     */
    public onType<TData = any>(
        type: string,
        listener: WebSocketOnTypeEventListener<TData>,
    ): Function;
    /**
     * Registers an event listener for a message type.
     *
     * @param {Predicate<string>} predicate The predicate, that checks the type.
     * @param {WebSocketOnTypeEventListener<TData>} listener The listener.
     *
     * @return {Function} The "real" event listener.
     */
    public onType<TData = any>(
        predicate: Predicate<string>,
        listener: WebSocketOnTypeEventListener<TData>,
    ): Function;
    public onType<TData = any>(
        checker: WebSocketOnTypeCheckArgument,
        listener: WebSocketOnTypeEventListener<TData>,
    ): Function {
        let predicate: Predicate<string> = checker as any;
        if (!_.isFunction(predicate)) {
            if (_.isRegExp(checker)) {
                predicate = (t: string) => checker.test(t);
            } else {
                predicate = (t: string) => t === normalizeString(checker);
            }
        }

        const MSG_LISTENER = (msg: WebSocketMessage<TData>) => {
            const TYPE = normalizeString(msg.type);

            if (toBooleanSafe( predicate(TYPE) )) {
                listener(msg.data, TYPE);
            }
        };

        this.on('message', MSG_LISTENER);

        return MSG_LISTENER;
    }

    /**
     * Sends a message to the remote client.
     *
     * @param {string} type The type.
     * @param {any} [data] The data to send.
     */
    public send(type: string, data?: any) {
        return new Promise<void>((resolve, reject) => {
            try {
                const MSG: WebSocketMessage = {
                    data: data,
                    type: normalizeString(type),
                };

                this.socket.send(JSON.stringify(MSG), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}
