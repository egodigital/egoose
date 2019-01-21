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
import { readAll } from '../streams';
const NormalizeHeaderCase = require("header-case-normalizer");
import * as HTTP from 'http';
import * as HTTPs from 'https';
import { isEmptyString, normalizeString, toStringSafe } from '../index';
import * as IsStream from 'is-stream';
import { Readable, Writable } from 'stream';
import * as url from 'url';

/**
 * Possible input values for a request body.
 */
export type HttpRequestBody = string | Buffer | HttpRequestBodyProvider | Readable;

/**
 * Possible values for a request body.
 */
export type HttpRequestBodyValue = string | Buffer | Readable;

/**
 * A function, which provides a request body value.
 *
 * @return {HttpRequestBodyValue|Promise<HttpRequestBodyValue>} The result with the body to send.
 */
export type HttpRequestBodyProvider = () => HttpRequestBodyValue | Promise<HttpRequestBodyValue>;

/**
 * Options for a HTTP request.
 */
export interface HttpRequestOptions {
    /**
     * The custom headers to send.
     */
    headers?: any;
    /**
     * The path to the (UNIX) socket.
     */
    socket?: string;
    /**
     * Custom request timeout.
     */
    timeout?: number;
}

/**
 * Options for a HTTP request with a body.
 */
export interface HttpRequestOptionsWithBody extends HttpRequestOptions {
    /**
     * The body to send.
     */
    body?: HttpRequestBody;
    /**
     * The custom string encoding for the input body to use.
     */
    encoding?: string;
}

/**
 * A possible value for a request URI.
 */
export type HttpRequestUrl = string | url.Url;

/**
 * A response of a HTTP request.
 */
export interface HttpResponse {
    /**
     * The status code.
     */
    code: number;
    /**
     * The response headers.
     */
    headers: HTTP.IncomingHttpHeaders;
    /**
     * Pipes the response body to a target.
     *
     * @param {Writable} target The target stream.
     *
     * @return this
     */
    pipe(target: Writable): Writable;
    /**
     * Reads the response body.
     *
     * @return {Promise<Buffer>} The promise with the data.
     */
    readBody(): Promise<Buffer>;
    /**
     * Reads the body and handles it as JSON object.
     *
     * @param {string} [enc] The custom string encoding to use.
     *
     * @return {Promise<T>} The promise with the parsed JSON object.
     */
    readJSON<T = any>(enc?: string): Promise<T>;
    /**
     * Reads the body and handles it as string.
     *
     * @param {string} [enc] The custom string encoding to use.
     *
     * @return {Promise<string>} The promise with response body as string.
     */
    readString(enc?: string): Promise<string>;
    /**
     * The request context.
     */
    request: HTTP.ClientRequest;
    /**
     * The response context.
     */
    response: any;
    /**
     * The status message.
     */
    status: string;
}

/**
 * Does a HTTP 'CONNECT' request.
 *
 * @param {HttpRequestUrl} u The URL to call.
 * @param {HttpRequestOptionsWithBody} [opts] Options for the request.
 *
 * @return {Promise<HttpResponse>} The promise with the response.
 */
export function CONNECT(u: HttpRequestUrl, opts?: HttpRequestOptionsWithBody): Promise<HttpResponse> {
    return request('CONNECT',
                   u, opts);
}

/**
 * Does a HTTP 'DELETE' request.
 *
 * @param {HttpRequestUrl} u The URL to call.
 * @param {HttpRequestOptionsWithBody} [opts] Options for the request.
 *
 * @return {Promise<HttpResponse>} The promise with the response.
 */
export function DELETE(u: HttpRequestUrl, opts?: HttpRequestOptionsWithBody): Promise<HttpResponse> {
    return request('DELETE',
                   u, opts);
}

/**
 * Does a HTTP 'GET' request.
 *
 * @param {HttpRequestUrl} u The URL to call.
 * @param {HttpRequestOptions} [opts] Options for the request.
 *
 * @return {Promise<HttpResponse>} The promise with the response.
 */
export function GET(u: HttpRequestUrl, opts?: HttpRequestOptions): Promise<HttpResponse> {
    return request('GET',
                   u, opts);
}

/**
 * Does a HTTP 'HEAD' request.
 *
 * @param {HttpRequestUrl} u The URL to call.
 * @param {HttpRequestOptionsWithBody} [opts] Options for the request.
 *
 * @return {Promise<HttpResponse>} The promise with the response.
 */
export function HEAD(u: HttpRequestUrl, opts?: HttpRequestOptionsWithBody): Promise<HttpResponse> {
    return request('HEAD',
                   u, opts);
}

/**
 * Does a HTTP 'OPTIONS' request.
 *
 * @param {HttpRequestUrl} u The URL to call.
 * @param {HttpRequestOptionsWithBody} [opts] Options for the request.
 *
 * @return {Promise<HttpResponse>} The promise with the response.
 */
export function OPTIONS(u: HttpRequestUrl, opts?: HttpRequestOptionsWithBody): Promise<HttpResponse> {
    return request('OPTIONS',
                   u, opts);
}

/**
 * Does a HTTP 'PATCH' request.
 *
 * @param {HttpRequestUrl} u The URL to call.
 * @param {HttpRequestOptionsWithBody} [opts] Options for the request.
 *
 * @return {Promise<HttpResponse>} The promise with the response.
 */
export function PATCH(u: HttpRequestUrl, opts?: HttpRequestOptionsWithBody): Promise<HttpResponse> {
    return request('PATCH',
                   u, opts);
}

/**
 * Does a HTTP 'POST' request.
 *
 * @param {HttpRequestUrl} u The URL to call.
 * @param {HttpRequestOptionsWithBody} [opts] Options for the request.
 *
 * @return {Promise<HttpResponse>} The promise with the response.
 */
export function POST(u: HttpRequestUrl, opts?: HttpRequestOptionsWithBody): Promise<HttpResponse> {
    return request('POST',
                   u, opts);
}

/**
 * Does a HTTP 'PUT' request.
 *
 * @param {HttpRequestUrl} u The URL to call.
 * @param {HttpRequestOptionsWithBody} [opts] Options for the request.
 *
 * @return {Promise<HttpResponse>} The promise with the response.
 */
export function PUT(u: HttpRequestUrl, opts?: HttpRequestOptionsWithBody): Promise<HttpResponse> {
    return request('PUT',
                   u, opts);
}

/**
 * Does a HTTP 'GET' request.
 *
 * @param {string} method The method.
 * @param {HttpRequestUrl} u The URL to call.
 * @param {HttpRequestOptionsWithBody} [opts] Options for the request.
 *
 * @return {Promise<HttpResponse>} The promise with the response.
 */
export function request(method: string, u: HttpRequestUrl, opts?: HttpRequestOptionsWithBody): Promise<HttpResponse> {
    method = toStringSafe(method).toUpperCase().trim();
    if ('' === method) {
        method = 'GET';
    }

    if (!_.isObject(u)) {
        u = url.parse( toStringSafe(u) );
    }

    if (_.isNil(opts)) {
        opts = <any>{};
    }

    let enc = normalizeString(opts.encoding);
    if ('' === enc) {
        enc = 'utf8';
    }

    return new Promise<HttpResponse>(async (resolve, reject) => {
        try {
            const REQUEST_URL = <url.Url>u;

            const REQUEST_OPTS: HTTP.RequestOptions | HTTPs.RequestOptions = {
                auth: REQUEST_URL.auth,
                headers: {},
                hostname: toStringSafe(REQUEST_URL.hostname).trim(),
                port: parseInt(
                    toStringSafe(REQUEST_URL.port).trim()
                ),
                method: method,
                path: REQUEST_URL.path,
            };

            let request: HTTP.ClientRequest;
            const CALLBACK = (response: HTTP.ClientResponse) => {
                let respBody: false | Buffer = false;

                const RESPONSE: HttpResponse = {
                    code: response.statusCode,
                    headers: response.headers || {},
                    pipe: function (target) {
                        return response.pipe(target);
                    },
                    readBody: async function() {
                        if (false === respBody) {
                            respBody = await readAll(response);
                        }

                        return respBody;
                    },
                    readJSON: async function(enc?) {
                        return JSON.parse(
                            await this.readString(enc)
                        );
                    },
                    readString: async function(enc?) {
                        enc = normalizeString(enc);
                        if ('' === enc) {
                            enc = 'utf8';
                        }

                        return (await this.readBody()).toString(enc);
                    },
                    request: request,
                    response: response,
                    status: response.statusMessage,
                };

                resolve(RESPONSE);
            };

            let requestFactory: (() => HTTP.ClientRequest) | false = false;

            if ('' === REQUEST_OPTS.hostname) {
                REQUEST_OPTS.hostname = 'localhost';
            }

            if (!_.isNil(opts.headers)) {
                for (const H in opts.headers) {
                    REQUEST_OPTS.headers[
                        NormalizeHeaderCase(
                            toStringSafe(H).trim()
                        )
                    ] = toStringSafe(opts.headers[H]);
                }
            }

            let timeout = parseInt(
                toStringSafe(opts.timeout).trim()
            );
            if (!isNaN(timeout)) {
                REQUEST_OPTS.timeout = timeout;
            }

            let socket: string = toStringSafe(opts.socket);
            if (isEmptyString(socket)) {
                socket = undefined;
            }
            REQUEST_OPTS.socketPath = socket;

            const PROTOCOL = normalizeString(REQUEST_URL.protocol);
            switch (PROTOCOL) {
                case '':
                case ':':
                case 'http:':
                    requestFactory = () => {
                        const HTTP_OPTS = <HTTP.RequestOptions>REQUEST_OPTS;
                        HTTP_OPTS.protocol = 'http:';

                        if (isNaN(<number>HTTP_OPTS.port)) {
                            HTTP_OPTS.port = 80;
                        }

                        return HTTP.request(HTTP_OPTS, CALLBACK);
                    };
                    break;

                case 'https:':
                    requestFactory = () => {
                        const HTTPs_OPTS = <HTTPs.RequestOptions>REQUEST_OPTS;
                        HTTPs_OPTS.protocol = 'https:';
                        HTTPs_OPTS.rejectUnauthorized = false;

                        if (isNaN(<number>HTTPs_OPTS.port)) {
                            HTTPs_OPTS.port = 443;
                        }

                        return HTTPs.request(HTTPs_OPTS, CALLBACK);
                    };
                    break;
            }

            if (false === requestFactory) {
                throw new Error(`HTTP protocol '${ PROTOCOL }' not supported`);
            }

            request = requestFactory();

            let body: any = opts.body;
            if (_.isFunction(body)) {
                body = await Promise.resolve(
                    body()
                );
            }

            if (!_.isNil(body)) {
                if (IsStream.readable(body)) {
                    body.pipe(request);
                } else if (Buffer.isBuffer(body)) {
                    request.write(body);
                } else {
                    request.write(new Buffer(toStringSafe(body), enc));
                }
            }

            request.end();
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Does a HTTP 'TRACE' request.
 *
 * @param {HttpRequestUrl} u The URL to call.
 * @param {HttpRequestOptionsWithBody} [opts] Options for the request.
 *
 * @return {Promise<HttpResponse>} The promise with the response.
 */
export function TRACE(u: HttpRequestUrl, opts?: HttpRequestOptionsWithBody): Promise<HttpResponse> {
    return request('TRACE',
                   u, opts);
}
