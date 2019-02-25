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
import * as express from 'express';
import { toStringSafe } from '../index';
import { GET, POST } from '../http/index';

/**
 * Data from 'https://graph.microsoft.com/v1.0/me'.
 */
export interface MicrosoftMe {
    /**
     * The display name.
     */
    "displayName"?: string;
    /**
     * The given name.
     */
    "givenName"?: string;
    /**
     * The ID.
     */
    "id": string;
    /**
     * The mail address.
     */
    "mail"?: string;
    /**
     * The surname.
     */
    "surname"?: string;
    /**
     * The user's principal name.
     */
    "userPrincipalName"?: string;
}

/**
 * Data for a Microsoft Access token.
 */
export interface MicrosoftOAuthAccessToken {
    /**
     * The token.
     */
    "access_token": string;
    /**
     * The time, in seconds, the token expires in.
     */
    "expires_in": string;
    /**
     * The refresh token.
     */
    "refresh_token": string;
    /**
     * The scope.
     */
    "scope": string;
    /**
     * The type, like "Bearer".
     */
    "token_type": string;
}

/**
 * Options for 'registerForMicrosoftOAuth()' function.
 */
export interface RegisterForMicrosoftOAuthOptions {
    /**
     * Is invoked, when an access token has been received.
     */
    onAccessToken: (token: MicrosoftOAuthAccessToken) => void | PromiseLike<void>;
    /**
     * A custom error response function.
     *
     * @param {string} error The error (code).
     * @param {string} description The (error) description.
     * @param {express.Request} req The request context.
     * @param {express.Response} res The response context.
     */
    onError?: (
        error: string, description: string,
        req: express.Request, res: express.Response
    ) => any;
    /**
     * A custom server error response function.
     *
     * @param {any} err The error.
     * @param {express.Request} req The request context.
     * @param {express.Response} res The response context.
     */
    onServerError?: (
        err: any,
        req: express.Request, res: express.Response
    ) => any;
    /**
     * A custom success response function.
     *
     * @param {express.Request} req The request context.
     * @param {express.Response} res The response context.
     */
    onSuccess?: (req: express.Request, res: express.Response) => any;
    /**
     * The custom redirect (base) path. Default: '/oauth/microsoft'
     */
    redirectPath?: string;
}

/**
 * Returns the information from 'https://graph.microsoft.com/v1.0/me'.
 *
 * @param {string | MicrosoftOAuthAccessToken} token The token.
 *
 * @return {Promise<false|MicrosoftMe>} The promise with the data or (false) if failed.
 */
export async function getMicrosoftMe(
    token: string | MicrosoftOAuthAccessToken
): Promise<false | MicrosoftMe> {
    let accessToken: string;
    if (_.isObjectLike(token)) {
        accessToken = (<MicrosoftOAuthAccessToken>token).access_token
            .trim();
    } else {
        accessToken = toStringSafe(token)
            .trim();
    }

    try {
        const RESPONSE = await GET(
            'https://graph.microsoft.com/v1.0/me',
            {
                headers: {
                    'Authorization': `Bearer ${ accessToken }`
                }
            }
        );

        if (200 === RESPONSE.code) {
            return JSON.parse(
                (await RESPONSE.readBody())
                    .toString('utf8')
            );
        }
    } catch { }

    return false;
}

/**
 * Returns the login URL for Microsoft OAuth.
 *
 * @return {string} The login URL.
 */
export function getMicrosoftOAuthLoginUrl(): string {
    return `https://login.microsoftonline.com/${
        encodeURIComponent(
            process.env.MICROSOFT_OAUTH_TENANT_ID
                .trim()
        )
    }/oauth2/authorize?client_id=${
        encodeURIComponent(
            process.env.MICROSOFT_OAUTH_CLIENT_ID
                .trim()
        )
    }&response_type=code&redirect_uri=${
        encodeURIComponent(
            process.env.MICROSOFT_OAUTH_REDIRECT_URL
                .trim()
        )
    }&response_mode=query&resource=${
        encodeURIComponent(
            'https://graph.microsoft.com'
        )
    }`;
}

/**
 * Registers an Express instance for Microsoft OAuth.
 *
 * @param {express.Express | express.Router} hostOrRouter The host or router.
 * @param {RegisterForMicrosoftOAuthOptions} opts The options.
 */
export function registerForMicrosoftOAuth(
    hostOrRouter: express.Express | express.Router,
    opts: RegisterForMicrosoftOAuthOptions,
) {
    let redirectPath = toStringSafe(opts.redirectPath)
        .trim();
    if ('' === redirectPath) {
        redirectPath = '/oauth/microsoft';
    }

    hostOrRouter.get(redirectPath, async function(req, res, next) {
        try {
            const CODE = toStringSafe(req.query['code'])
                .trim();
            if ('' !== CODE) {
                const URL = `https://login.microsoftonline.com/${
                    encodeURIComponent(
                        process.env.MICROSOFT_OAUTH_TENANT_ID
                            .trim()
                    )
                }/oauth2/token`;

                const BODY =
                    `grant_type=authorization_code` +
                    `&client_id=${ encodeURIComponent(
                        process.env.MICROSOFT_OAUTH_CLIENT_ID
                            .trim()
                    ) }` +
                    `&code=${ encodeURIComponent(CODE) }` +
                    `&redirect_uri=${ encodeURIComponent(
                        process.env.MICROSOFT_OAUTH_REDIRECT_URL
                            .trim()
                    ) }` +
                    `&client_secret=${
                        encodeURIComponent(
                            process.env.MICROSOFT_OAUTH_CLIENT_SECRET
                                .trim()
                        )
                    }&scope=${
                        encodeURIComponent(
                            'https://graph.microsoft.com/user.read'
                        )
                    }`;

                const RESPONSE = await POST(
                    URL,
                    {
                        body: BODY,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );

                if (200 === RESPONSE.code) {
                    const TOKEN: MicrosoftOAuthAccessToken = JSON.parse(
                        (await RESPONSE.readBody())
                            .toString('utf8')
                    );
                    if (TOKEN) {
                        await Promise.resolve(
                            opts.onAccessToken(TOKEN)
                        );

                        let onSuccess = opts.onSuccess;
                        if (!onSuccess) {
                            onSuccess = (req2, res2) => {
                                return res2.status(200)
                                    .header('Content-type', 'text/plain; charset=utf-8')
                                    .send(new Buffer(
                                        'Authorization succeeded. You can close the browser now.',
                                        'utf8'
                                    ));
                            };
                        }

                        return await Promise.resolve(
                            onSuccess(req, res)
                        );
                    }
                }
            }

            const ERROR = toStringSafe(req.query['error'])
                .trim();
            if ('' !== ERROR) {
                const DESCRIPTION = toStringSafe(
                    req.query['error_description']
                ).trim();

                let onError = opts.onError;
                if (!onError) {
                    onError = (err, desc, req2, res2) => {
                        return res2.status(200)
                            .header('Content-type', 'text/plain; charset=utf-8')
                            .send(`Authorization error '${ err }': '${ desc }'`);
                    };
                }

                return await Promise.resolve(
                    onError(
                        ERROR, DESCRIPTION,
                        req, res
                    )
                );
            }

            return res.status(400)
                .send();
        } catch (e) {
            let onServerError = opts.onServerError;
            if (!onServerError) {
                onServerError = (err, req2, res2) => {
                    return res2.status(500)
                        .send();
                };
            }

            return await Promise.resolve(
                onServerError(
                    e,
                    req, res
                )
            );
        }
    });
}
