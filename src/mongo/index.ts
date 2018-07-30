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
import { isEmptyString, toStringSafe } from '../index';
import * as mongoose from 'mongoose';

/**
 * Options for connecting to a database.
 */
export interface MongoDatabaseOptions {
    /**
     * The name of the database.
     */
    readonly database: string;
    /**
     * The host address.
     */
    readonly host: string;
    /**
     * Additional options for the connection string.
     */
    readonly options?: string;
    /**
     * The password for the authentification.
     */
    readonly password?: string;
    /**
     * The TCP port.
     */
    readonly port: number;
    /**
     * The user name.
     */
    readonly user?: string;
}

/**
 * Global repository for MongoDB models.
 */
export const MONGO_MODELS: { [name: string]: mongoose.Model<mongoose.Document> } = {};
/**
 * Global repository for MongoDB schemas.
 */
export const MONGO_SCHEMAS: { [name: string]: mongoose.Schema } = {};

/**
 * A MongoDB connection.
 */
export class MongoDatabase {
    private _mongo: mongoose.Connection;

    /**
     * Initializes a new instance of that class.
     *
     * @param {MongoDatabaseOptions} options Connection options.
     */
    public constructor(public readonly options: MongoDatabaseOptions) { }

    /**
     * Starts a connection to the server.
     *
     * @return {Promise<boolean>} The promise, which indicates if operation was successful or not.
     */
    public async connect() {
        if (this.isConnected) {
            return false;
        }

        let connStr = 'mongodb://' + toStringSafe(this.options.host) + ':' + toStringSafe(this.options.port) + '/' + toStringSafe(this.options.database);
        const OPTS: mongoose.ConnectionOptions = {
            useNewUrlParser: true,
        };

        if (!isEmptyString(this.options.user) && '' !== toStringSafe(this.options.password)) {
            OPTS.auth = {
                user: toStringSafe(this.options.user),
                password: toStringSafe(this.options.password),
            };

            connStr += toStringSafe(this.options.options);
        }

        this._mongo = await mongoose.createConnection(connStr, OPTS);

        return true;
    }

    /**
     * Closes the current connection.
     *
     * @return {Promise<boolean>} The promise, which indicates if operation was successful or not.
     */
    public async disconnect() {
        if (!this.isConnected) {
            return false;
        }

        await this.mongo.close();
        this._mongo = null;

        return true;
    }

    /**
     * Gets if there is currently an open database connection or not.
     */
    public get isConnected() {
        return !_.isNil(this._mongo);
    }

    /**
     * Returns a model by name.
     *
     * @param {string} name The name of the model.
     *
     * @return {mongoose.Model<mongoose.Document>} The model.
     */
    public model(name: string): mongoose.Model<mongoose.Document> {
        return this.mongo
                   .model(name, this.schema(name), name.toLowerCase());
    }

    /**
     * Gets the underlying database connection.
     */
    public get mongo(): mongoose.Connection {
        return this._mongo;
    }

    /**
     * Starts a query for a schema and a list of results.
     *
     * @param {string} schema The name of the schema.
     * @param {string} func The name of the initial function.
     * @param {any[]} [args] One or more argument for the function, like a condition.
     *
     * @return {mongoose.DocumentQuery<mongoose.Document[], mongoose.Document>} The query.
     */
    public query(schema: string, func: string, ...args: any[]): mongoose.DocumentQuery<mongoose.Document[], mongoose.Document> {
        const M = this.model(schema);

        return M[func].apply(M, args);
    }

    /**
     * Starts a query for a schema and a single result.
     *
     * @param {string} schema The name of the schema.
     * @param {string} func The name of the initial function.
     * @param {any[]} [args] One or more argument for the function, like a condition.
     *
     * @return {mongoose.DocumentQuery<mongoose.Document, mongoose.Document>} The query.
     */
    public queryOne(schema: string, func: string, ...args: any[]): mongoose.DocumentQuery<mongoose.Document, mongoose.Document> {
        const M = this.model(schema);

        return M[func].apply(M, args);
    }

    /**
     * Returns a schema by name.
     *
     * @param {string} name The name of the schema.
     *
     * @return {mongoose.Schema} The schema.
     */
    public schema(name: string): mongoose.Schema {
        return MONGO_SCHEMAS[name];
    }
}
