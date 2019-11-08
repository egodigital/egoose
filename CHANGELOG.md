# Change Log (@egodigital/egoose)

## 7.0.0

* egoose is build for [Node.js 12](https://nodejs.org/dist/latest-v12.x/docs/api/) now
* changed to [ES2019](https://en.wikipedia.org/wiki/ECMAScript#10th_Edition_-_ECMAScript_2019) options for [TypeScript](https://www.typescriptlang.org/) compiler
* added `sendAppFeedback()` function
* updated to `moment-timezone@^0.5.27`
* updated to `mongoose@^5.7.8`
* updated to `node-geocoder@^3.25.0`
* updated to `p-queue@^6.2.0`

## 6.13.0

* updated to `@types/mongoose@^5.5.22`
* updated to `mongoose@^5.7.6`

## 6.12.0

* added `createBlobReadStream()` method to [AzureStorageClient](https://egodigital.github.io/egoose/classes/_azure_storage_.azurestorageclient.html)
* updated to `node-geocoder^3.24.0`
* updated to `sanitize-filename^1.6.3`
* updated to `uuid^3.3.3`

## 6.11.0

* added `listBlobs()` to [AzureStorageClient](https://egodigital.github.io/egoose/classes/_azure_storage_.azurestorageclient.html)

## 6.10.1

* added `code` and `name` properties to [AppVersion interface](https://egodigital.github.io/egoose/interfaces/_index_.appversion.html)
* updated to `lodash^4.17.15`
* updated to `sanitize-filename^1.6.2`
* removed no needed npm modules
* code cleanups and improvements

## 6.9.1

* updated to `node-enumerable^5.0.1`

## 6.8.0

* now using forked `swagger-jsdoc-express@^2.4.0`

## 6.7.1

* now using forked `@egodigital/node-ews@^4.0.2`

## 6.6.2

* updated to `lodash@^4.17.13`

## 6.6.1

* updated to `express@^4.17.1`
* updated to `node-geocoder@^3.23.0`
* updated to `swagger-jsdoc-express@2.2.0`
* updated to `yargs-parser@^13.1.1`

## 6.4.0

* updated to `swagger-jsdoc-express@2.0.0`

## 6.3.0

* set [TypeScript](https://www.typescriptlang.org) compiler target and lib to `es2017`

## 6.2.0

* updated to `swagger-jsdoc-express@1.5.0`

## 6.1.0

* added `createQueue()` function
* updated to `errorhandler@1.5.1`

## 6.0.0

* changed to [Node.js 10](https://nodejs.org/en/blog/release/v10.0.0/) support

## 5.22.0

* updated to `@mapbox/polyline@1.1.0`
* updated to `swagger-jsdoc-express@1.4.0`

## 5.21.0

* added `addFiles()` to `ZipBuilder` class
* leading `/` chars are now supported as zip file paths
* added additional `opts` argument for [Cache.set()](https://egodigital.github.io/egoose/interfaces/_cache_index_.cache.html#set) method
* updated to `yargs-parser@13.1.0`

## 5.20.0

* added zip bilder classes and functions

## 5.19.0

* added `isJoi()` function
* updated to `body-parser@1.19.0`

## 5.18.0

* added `connector` property to [MongoDatabaseOptions](https://egodigital.github.io/egoose/interfaces/_mongo_index_.mongodatabaseoptions.html)

## 5.17.0

* updated to `azure-storage@2.10.3`
* updated to `moment-timezone@0.5.25`
* updated to `mime-types@2.1.24`

## 5.16.0

* added [format()](https://egodigital.github.io/egoose/modules/_strings_index_.html#format) and [formatArray()](https://egodigital.github.io/egoose/modules/_strings_index_.html#formatarray) functions
* updated to `swagger-jsdoc-express@1.3.1`

## 5.15.0

* added `doNotNormalizeHeaders` property to [HttpRequestOptions](https://egodigital.github.io/egoose/interfaces/_http_index_.httprequestoptions.html) interface

## 5.14.0

* updated to `swagger-jsdoc-express@1.2.0`

## 5.13.1

* updated to `swagger-jsdoc-express@1.1.0`

## 5.12.1

* added `setupSwaggerUIFromSourceFiles()` function from [swagger-jsdoc-express](https://www.npmjs.com/package/swagger-jsdoc-express)
* bug fixes

## 5.11.0

* added `isAppEnv()` function

## 5.10.0

* [WebSocketHostServerFactory](https://egodigital.github.io/egoose/modules/_http_websockets_.html#websockethostserverfactory) now supports secure HTTP servers

## 5.9.0

* web socket servers can now verify remote clients

## 5.8.0

* added `glob()` and `globSync()` functions

## 5.7.0

* added `parseCommandLine()` function

## 5.6.1

* added WebSocket types
* fixes

## 5.5.0

* added `addressToGeoCoordinates()` function

## 5.4.0

* optimized `jsonObject()` function

## 5.3.0

* added `jsonObject()` function

## 5.2.1

* added cache framework with [Redis](https://redis.io/) support
* fixes

## 5.1.0

* added `asBuffer()` function

## 5.0.2

* refactored concept of handling and providing statistic data
* fixes

## 4.9.4

* added classes and interface for handling statistic data
* fixes

## 4.8.3

* added `Stopwatch` class

## 4.6.0

* added `registerForMicrosoftOAuth()` function, which registers an [Express](https://expressjs.com/) middleware to handle Microsoft OAuth requests
* added `getMicrosoftMe()` function, which returns information about the currently logged in user
* added `getMicrosoftOAuthLoginUrl()` function, which returns the login URL for the underlying tenant

## 4.4.0

* added `calcRoute()` function
* added `randChars()` and `randCharsSync()` functions
* added `sendMail()` function

## 4.3.1

* `blobContainerProvider` property of [AzureStorageClientOptions interface](https://egodigital.github.io/egoose/interfaces/_azure_storage_.azurestorageclientoptions.html) can also handle strings now
* updated to `mime-types@2.1.22`

## 4.2.0

* added `log()` method to [MongoApiHost](https://egodigital.github.io/egoose/classes/_apis_host_.mongoapihost.html) class
* added `initLogsSchema()` for mongo databases

## 4.1.0

* `new Buffer` => `Buffer.from`

## 4.0.1

* updated to `moment@2.24.0`
* updated to `node-enumerable@4.0.2`
* updated to `typescript@3.3.1`

## 3.8.0

* added `socket` property to `HttpRequestOptions` interface

## 3.7.1

* added `exec()` function
* added `useMemAvailable` property to [CreateMonitoringApiResultOptions interface](https://egodigital.github.io/egoose/interfaces/_apis_index_.createmonitoringapiresultoptions.html)

## 3.6.0

* added `asLocal()`, `asMoment()`, `asUTC()`, `getAppVersionSync()` functions
* `createMonitoringApiResult()` now also returns the app version information from `getAppVersionSync()` now
* updated to `fast-glob@2.2.6`
* updated to `moment@2.23.0`

## 3.5.1

* added `timeout` property to `HttpRequestOptions` interface
* added `readBody`, `readJSON` and `readString` method to `HttpResponse` interface
* updated to `fast-glob@2.2.4`

## 3.4.1

* corrected now(tz) bug
* added test

## 3.4.0

* added `exists()` function
* added `isBlockDevice()` and `isBlockDeviceSync()` functions
* added `isCharDevice()` and `isCharDeviceSync()` functions
* added `isDir()` and `isDirSync()` functions
* added `isFile()` and `isFileSync()` functions
* added `isSymLink()` and `isSymLinkSync()` functions
* updated to `fs-extra@7.0.1`

## 3.3.4

* fixed `saveUniqueBlob()` method of `AzureStorageClient` class
* updated to `moment-timezone@0.5.23`

## 3.3.0

* changed `mongooseOptions` datatype to `any`

## 3.2.0

* added `mongooseOptions` property to `MongoDatabaseOptions` interface
* updated to `azure-storage@2.10.2`
* updated to `mime-types@2.1.21`

## 3.1.0

* fixed `loadBlob()` method of `AzureStorageClient` class
* updated to `express@4.16.4`

## 3.0.1

* default path prefix for Azure blob now using `APP_ENV` value with `prod` as default
* set to `mongoose@5.2.17`
* updated to `chai@4.2.0`
* updated to `fast-glob@2.2.3`

## 2.11.0

* added `createMonitoringApiResult()` function
* added `getCpuUsage()` function
* added `getDiskSpace()` function
* updated to `mongoose@5.2.17`

## 2.10.0

* added `isMongoId()` function
* updated to `mongoose@5.2.15`

## 2.9.0

* added optional `errorKeysOnly` property to `SendResponseOptions` interface
* added `AzureStorageClient` class
* updated to `lodash@4.17.11`
* updated to `mongoose@5.2.14`

## 2.8.0

* added `tempFile()` and `tempFileSync()` functions
* fixed `guid` / `uuid` functions when using version 5
* updated to `mongoose@5.2.12`

## 2.7.3

* update scripts

## 2.7.2

* updated to `@types/mongoose@5.2.7`

## 2.7.1

* updated to `mongoose@5.2.10`

## 2.7.0

* added `forEachAsync()` function
* updated to `mongoose@5.2.9`

## 2.6.0

* using `APP_PORT` environment variable as default value for `start()` method of `ApiHost` class now

## 2.5.1

* `sendResponse()` uses `utf-8` instead of `utf8` now

## 2.5.0

* added `calcDistance()` function

## 2.4.1

* fixed bodyParser warnings thrown by express

## 2.4.0

* added additional parameter for custom options in `sendResponse()` function

## 2.3.1

* added `useErrorHandler()` to `ApiHost` class
* added `applyFuncFor` and `toBooleanSafe()` functions

## 2.2.0

* added [node-enumerable](https://www.npmjs.com/package/node-enumerable)

## 2.1.1

* generic types for `query()` and `queryOne()` methods in `MongoDatabase` class

## 2.0.0

* improved use of `MongoApiHost` and `MongoDatabase` classes
* remove static `fromEnvironment()` method from `MongoDatabase`

## 1.15.0

* added `guid()` and `uuid()` functions

## 1.14.0

* added custom options for an `initialize()` method of an `ApiHost` object

## 1.13.0

* `toStringSafe()` can also handle arrays and plain objects now

## 1.11.0

* added `model()`, `query()` and `queryOne()` methods for `MongoDatabase` class

## 1.10.0

* added special API host class with MongoDB helper methods

## 1.9.0

* added `cloneObj()`, `importApiErrors()` and `importApiErrorsSync()` functions

## 1.8.0

* Mongo database

## 1.6.0

* added `createCompletedAction()`, `now()` and `utc()` functions
* added logger types and functions
* added API host types
* added `IS_DEV` and `IS_LOCAL_DEV` constants

## 1.5.0

* added unit tests
* added `encoding` property to `HttpRequestOptions` interface
* added `pipe()` method to `HttpResponse` interface
* fixed typos
* fixed handling options (`HttpRequestOptions`) of HTTP request functions
