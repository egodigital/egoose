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
    private _mongo: mongoose.Mongoose;

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

        this._mongo = await mongoose.connect(connStr, OPTS);

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

        // await this.mongo.disconnect();
        this._mongo = null;

        return true;
    }

    /**
     * Creates a new instance from the environment variables.
     *
     * @return {MongoDatabase} The new instance.
     */
    public static fromEnvironment(): MongoDatabase {
        return new MongoDatabase({
            database: process.env.MONGO_DB,
            host: process.env.MONGO_HOST,
            options: process.env.MONGO_OPTIONS,
            port: parseInt( process.env.MONGO_PORT ),
            password: process.env.MONGO_PASSWORD,
            user: process.env.MONGO_USER,
        });
    }

    /**
     * Gets if there is currently an open database connection or not.
     */
    public get isConnected() {
        return !_.isNil(this.mongo);
    }

    /**
     * Gets the underlying database connection.
     */
    public get mongo(): mongoose.Mongoose {
        return this._mongo;
    }
}
