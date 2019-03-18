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

import { MongoDatabase } from '../mongo';
import { StatisticProviderBase } from '../statistics';
import * as mongoose from 'mongoose';

/**
 * A basic statistic provider that loads data from Mongo database.
 */
export abstract class MongoDatabaseStatisticProviderBase<
    TDatabase extends MongoDatabase = MongoDatabase
> extends StatisticProviderBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {TDatabase} database The underlying database connection.
     */
    public constructor(
        public readonly database: TDatabase,
    ) {
        super();
    }

    /** @inheritdoc */
    public async close(): Promise<void> {
        await this.database
            .disconnect();
    }

    /**
     * Counts all documents of a collection.
     *
     * @param {Function} modelSelector The function that returns the model to use.
     * @param {any} [filter] The optional filter.
     *
     * @return {Promise<number>} The promise that contains the number of documents.
     */
    protected async countDocuments<TDocument extends mongoose.Document>(
        modelSelector: (db: TDatabase) => mongoose.Model<TDocument>, filter?: any,
    ): Promise<number> {
        return await modelSelector(this.database)
            .find(filter)
            .countDocuments()
            .exec();
    }
}
