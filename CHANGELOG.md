# Change Log (@egodigital/egoose)

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
