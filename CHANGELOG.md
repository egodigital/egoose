# Change Log (@egodigital/egoose)

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
