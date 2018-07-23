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

import * as _ from 'lodash';
import * as bodyParser from 'body-parser';
import { Logger } from '../diagnostics/logger';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as MergeDeep from 'merge-deep';
import { IS_LOCAL_DEV } from '../dev';
import { normalizeString, toStringSafe } from '../index';

/**
 * An API authorizer.
 *
 * @param {express.Request} req The current request context.
 *
 * @return {boolean|Promise<boolean>} The result, which indicates if authorization is valid or not.
 */
export type ApiAuthorizer = (req: express.Request) => boolean | Promise<boolean>;

/**
 * A Basic Auth authorizer.
 *
 * @param {string} user The username.
 * @param {string} password The password.
 *
 * @return {boolean|Promise<boolean>} The result, which indicates if authorization is valid or not.
 */
export type BasicAuthAuthorizer = (user: string, password: string) => boolean | Promise<boolean>;

/**
 * Body parser options.
 */
export type BodyParserOptions = bodyParser.OptionsJson & bodyParser.OptionsText & bodyParser.OptionsUrlencoded;

type HTTPServer = http.Server | https.Server;

/**
 * A token based authorizer.
 *
 * @param {string} token The token to check.
 *
 * @return {boolean|Promise<boolean>} The result, which indicates if authorization is valid or not.
 */
export type TokenAuthorizer = (token: string) => boolean | Promise<boolean>;

/**
 * Value for (or from) 'useBodyParser()' method of an ApiHost instance.
 */
export type UseBodyParserSetting = boolean | BodyParserOptions;

/**
 * An API host.
 */
export class ApiHost {
    private _app: express.Express;
    private _authorizer: ApiAuthorizer;
    private _logger: Logger;
    private _poweredBy = '@egodigital/egoose';
    private _root: express.Router;
    private _server: HTTPServer;
    private _useBodyParser: UseBodyParserSetting = true;

    /**
     * Initializes a new instance of that class.
     */
    public constructor() {
        this._app = express();
    }

    /**
     * Gets the underlying Express app instance.
     */
    public get app(): express.Express {
        return this._app;
    }

    /**
     * Gets or sets if an authorizer should be used or not.
     *
     * @param {ApiAuthorizer} [newValue] The new value.
     *
     * @return {ApiAuthorizer|this} The current value or that instance if new value has been set.
     */
    public authorizer(): ApiAuthorizer;
    public authorizer(newValue: ApiAuthorizer): this;
    public authorizer(newValue?: ApiAuthorizer): this | ApiAuthorizer {
        if (arguments.length > 0) {
            this._authorizer = newValue;

            return this;
        }

        return this._authorizer;
    }

    /**
     * (Re-)Initializes the host.
     */
    public initialize() {
        const OLD_SERVER = this._server;
        if (OLD_SERVER) {
            OLD_SERVER.close();

            this._server = null;
        }

        const NEW_APP = express();
        const NEW_LOGGER = new Logger();

        const NEW_API_ROOT = express.Router();

        NEW_APP.use('/api', NEW_API_ROOT);

        if (this._useBodyParser) {
            let ubpOpts: BodyParserOptions = {
                defaultCharset: 'utf8',
                inflate: true,
                strict: true,
            };
            if (true !== this._useBodyParser) {
                ubpOpts = MergeDeep(ubpOpts, this._useBodyParser);
            }

            NEW_APP.use(
                bodyParser(ubpOpts)
            );
        }

        const POWERED_BY = toStringSafe(this._poweredBy).trim();
        if ('' !== POWERED_BY) {
            NEW_APP.use((req, res, next) => {
                res.header('X-Powered-By', POWERED_BY);

                next();
            });
        }

        const AUTHORIZER = this._authorizer;
        if (!_.isNil(AUTHORIZER)) {
            NEW_APP.use(async (req, res, next) => {
                const IS_VALID = await Promise.resolve(
                    AUTHORIZER(req)
                );
                if (IS_VALID) {
                    next();

                    return;
                }

                return res.status(401)
                          .send();
            });
        }

        if (IS_LOCAL_DEV) {
            // trace request
            NEW_APP.use((req, res, next) => {
                try {
                    NEW_LOGGER.trace({
                        request: {
                            headers: req.headers,
                            method: req.method,
                            query: req.query,
                        }
                    }, 'request');
                } catch { }

                next();
            });

            // only for test use
            NEW_APP.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "*");
                res.header("Access-Control-Allow-Methods", "*");

                next();
            });
        }

        this.setupLogger(NEW_LOGGER);
        this._logger = NEW_LOGGER;

        this.setupApi(NEW_APP, NEW_API_ROOT);
        this._app = NEW_APP;
        this._root = NEW_API_ROOT;
    }

    /**
     * Gets if the host is currently running or not.
     */
    public get isRunning(): boolean {
        return !_.isNil(this._server);
    }

    /**
     * Gets the underlying logger.
     */
    public get logger(): Logger {
        return this._logger;
    }

    /**
     * Gets or sets the 'X-Powered-By' header.
     *
     * @param {string} [newValue] The new value.
     *
     * @return {string|this} The current value or that instance if new value has been set.
     */
    public poweredBy(): string;
    public poweredBy(newValue: string): this;
    public poweredBy(newValue?: string): this | string {
        if (arguments.length > 0) {
            this._poweredBy = toStringSafe(newValue).trim();
            return this;
        }

        return this._poweredBy;
    }

    /**
     * Gets the root endpoint.
     */
    public get root(): express.Router {
        return this._root;
    }

    public setBasicAuth(authorizer: BasicAuthAuthorizer): this {
        return this.setPrefixedAuthorizer(async (token) => {
            try {
                let username: string;
                let password: string;

                const USERNAME_AND_PASSWORD = toStringSafe(token).trim();
                if ('' !== USERNAME_AND_PASSWORD) {
                    const UNAME_PWD = (
                        new Buffer(USERNAME_AND_PASSWORD, 'base64')
                    ).toString('utf8');

                    const USER_PWD_SEP = UNAME_PWD.indexOf(':');
                    if (USER_PWD_SEP > -1) {
                        username = UNAME_PWD.substr(0, USER_PWD_SEP);
                        password = UNAME_PWD.substr(USER_PWD_SEP + 1);
                    } else {
                        username = UNAME_PWD;
                    }
                }

                username = normalizeString(username);
                password = toStringSafe(password);

                return await Promise.resolve(
                    authorizer(
                        username, password
                    )
                );
            } catch { }

            return false;
        }, 'basic');
    }

    /**
     * Sets a prefixed based authorizer.
     *
     * @param {TokenAuthorizer} authorizer The authorizer.
     * @param {string} [prefix] The prefix.
     *
     * @return this
     */
    public setPrefixedAuthorizer(authorizer: TokenAuthorizer, prefix = 'bearer'): this {
        prefix = normalizeString(prefix);

        return this.authorizer(async (req) => {
            const AUTH = toStringSafe(req.headers['authorization']).trim();
            if (AUTH.toLowerCase().startsWith(prefix + ' ')) {
                return await Promise.resolve(
                    authorizer(
                        AUTH.substr(prefix.length + 1)
                    )
                );
            }

            return false;
        });
    }

    /**
     * Sets up a new api / app instance.
     *
     * @param {express.Express} newApp The instance to setup.
     * @param {express.Router} newRoot The API root.
     */
    protected setupApi(newApp: express.Express, newRoot: express.Router) {
    }

    /**
     * Sets up a new logger instance.
     *
     * @param {Logger} newLogger The instance to setup.
     */
    protected setupLogger(newLogger: Logger) {
    }

    /**
     * Starts the host.
     *
     * @param {number} [port] The custom port to use.
     *
     * @return {Promise<boolean>} The promise, which indicates if operation successful or not.
     */
    public start(port?: number): Promise<boolean> {
        port = parseInt(
            toStringSafe(port).trim()
        );

        return new Promise<boolean>((resolve, reject) => {
            if (this.isRunning) {
                resolve(false);

                return;
            }

            try {
                let serverFactory: () => HTTPServer;

                // TODO: implement secure HTTP support
                serverFactory = () => {
                    if (isNaN(port)) {
                        port = 80;
                    }

                    return http.createServer(this.app);
                };

                const NEW_SERVER = serverFactory();

                NEW_SERVER.listen(
                    port, () => {
                        this._server = NEW_SERVER;

                        resolve(true);
                    },
                );
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Stops the host.
     *
     * @return {Promise<boolean>} The promise, which indicates if operation successful or not.
     */
    public stop(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const OLD_SERVER = this._server;
            if (_.isNil(OLD_SERVER)) {
                resolve(false);

                return;
            }

            try {
                OLD_SERVER.close(() => {
                    this._server = null;

                    resolve(true);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Gets or sets if 'body-parser' module should be used or not.
     *
     * @param {UseBodyParserSetting} [newValue] The new value.
     *
     * @return {UseBodyParserSetting|this} The current value or that instance if new value has been set.
     */
    public useBodyParser(): UseBodyParserSetting;
    public useBodyParser(newValue: UseBodyParserSetting): this;
    public useBodyParser(newValue?: UseBodyParserSetting): this | UseBodyParserSetting {
        if (arguments.length > 0) {
            this._useBodyParser = newValue;

            return this;
        }

        return this._useBodyParser;
    }
}
