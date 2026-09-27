
import crypto from "crypto";
import pool from "../config/db.js";

/* =========================================================
   SHOPIFY CONFIGURATION
========================================================= */

const SHOPIFY_CLIENT_ID =
    process.env.SHOPIFY_CLIENT_ID;

const SHOPIFY_CLIENT_SECRET =
    process.env.SHOPIFY_CLIENT_SECRET;

const SHOPIFY_REDIRECT_URI =
    process.env.SHOPIFY_REDIRECT_URI;

const SHOPIFY_FRONTEND_URL =
    process.env.SHOPIFY_FRONTEND_URL ||
    "https://www.nexzsoft.com";

const SHOPIFY_API_VERSION =
    process.env.SHOPIFY_API_VERSION ||
    "2026-07";

const REQUIRED_SCOPES = (
    process.env.SHOPIFY_SCOPES ||
    "read_products,read_orders,read_customers"
)
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean);

const OAUTH_STATE_TTL_MS =
    10 * 60 * 1000;

const SHOPIFY_REQUEST_TIMEOUT_MS =
    30 * 1000;


/* =========================================================
   VALIDATE SHOPIFY CONFIGURATION
========================================================= */

const validateShopifyConfiguration = () => {
    const missing = [];

    if (!SHOPIFY_CLIENT_ID) {
        missing.push("SHOPIFY_CLIENT_ID");
    }

    if (!SHOPIFY_CLIENT_SECRET) {
        missing.push("SHOPIFY_CLIENT_SECRET");
    }

    if (!SHOPIFY_REDIRECT_URI) {
        missing.push("SHOPIFY_REDIRECT_URI");
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing Shopify environment variables: ${missing.join(
                ", "
            )}`
        );
    }
};


/* =========================================================
   VALIDATE SHOP DOMAIN
========================================================= */

export const validateShopDomain = (shopDomain) => {
    if (
        typeof shopDomain !== "string" ||
        !shopDomain
    ) {
        return false;
    }

    return /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(
        shopDomain
    );
};


/* =========================================================
   NORMALIZE SHOP DOMAIN
========================================================= */

export const normalizeShopDomain = (
    shopDomain
) => {
    if (
        typeof shopDomain !== "string"
    ) {
        return "";
    }

    return shopDomain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/+$/, "");
};


/* =========================================================
   SHOPIFY FETCH
   Adds timeout to every Shopify request.
========================================================= */

const shopifyFetch = async (
    url,
    options = {}
) => {
    return fetch(url, {
        ...options,

        signal: AbortSignal.timeout(
            SHOPIFY_REQUEST_TIMEOUT_MS
        ),
    });
};


/* =========================================================
   CREATE OAUTH STATE
========================================================= */

/*
 * This is where:
 *
 * crypto.randomBytes(32).toString("hex")
 *
 * belongs.
 *
 * The state is:
 * - generated server-side
 * - associated with the Nexzsoft tenant
 * - associated with the Shopify store
 * - valid for only 10 minutes
 * - stored in PostgreSQL
 * - consumed exactly once during callback
 */

export const createShopifyOAuthState = async ({
    tenantId,
    shopDomain,
}) => {
    const state =
        crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
        Date.now() + OAUTH_STATE_TTL_MS
    );

    await pool.query(
        `
        INSERT INTO shopify_oauth_states
        (
            tenant_id,
            shop_domain,
            state,
            expires_at
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )
        `,
        [
            tenantId,
            shopDomain,
            state,
            expiresAt,
        ]
    );

    return state;
};


/* =========================================================
   CREATE SHOPIFY AUTHORIZATION URL
========================================================= */

export const createShopifyAuthorizationUrl =
    async ({
        tenantId,
        shopDomain,
    }) => {
        validateShopifyConfiguration();

        const normalizedShop =
            normalizeShopDomain(
                shopDomain
            );

        if (
            !validateShopDomain(
                normalizedShop
            )
        ) {
            throw new Error(
                "Invalid Shopify store domain"
            );
        }

        const state =
            await createShopifyOAuthState({
                tenantId,
                shopDomain:
                    normalizedShop,
            });

        const params =
            new URLSearchParams({
                client_id:
                    SHOPIFY_CLIENT_ID,

                scope:
                    REQUIRED_SCOPES.join(","),

                redirect_uri:
                    SHOPIFY_REDIRECT_URI,

                state,
            });

        return (
            `https://${normalizedShop}` +
            `/admin/oauth/authorize?` +
            params.toString()
        );
    };


/* =========================================================
   VALIDATE SHOPIFY HMAC
========================================================= */

/*
 * Shopify callback example:
 *
 * ?code=...
 * &hmac=...
 * &shop=...
 * &state=...
 * &timestamp=...
 *
 * Shopify requires:
 *
 * 1. Remove hmac
 * 2. Sort remaining parameters
 * 3. Build key=value&key=value
 * 4. HMAC-SHA256 using client secret
 * 5. Constant-time comparison
 */

export const validateShopifyHmac = (
    query
) => {
    validateShopifyConfiguration();

    if (
        !query ||
        typeof query !== "object"
    ) {
        return false;
    }

    const receivedHmac =
        query.hmac;

    if (
        typeof receivedHmac !==
        "string"
    ) {
        return false;
    }

    const params = Object.entries(
        query
    )
        .filter(
            ([key]) => key !== "hmac"
        )
        .sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
        );

    const message = params
        .map(([key, value]) => {
            let normalizedValue = value;

            if (Array.isArray(value)) {
                normalizedValue =
                    value.join(",");
            }

            return `${key}=${normalizedValue}`;
        })
        .join("&");

    const calculatedHmac =
        crypto
            .createHmac(
                "sha256",
                SHOPIFY_CLIENT_SECRET
            )
            .update(message)
            .digest("hex");

    const calculatedBuffer =
        Buffer.from(
            calculatedHmac,
            "utf8"
        );

    const receivedBuffer =
        Buffer.from(
            receivedHmac,
            "utf8"
        );

    if (
        calculatedBuffer.length !==
        receivedBuffer.length
    ) {
        return false;
    }

    return crypto.timingSafeEqual(
        calculatedBuffer,
        receivedBuffer
    );
};


/* =========================================================
   CONSUME OAUTH STATE
========================================================= */

/*
 * This is intentionally atomic.
 *
 * We do NOT:
 *
 * SELECT state
 * then
 * DELETE state
 *
 * because two simultaneous callbacks could potentially
 * both read the same state before either deletes it.
 *
 * DELETE ... RETURNING makes the state single-use.
 */

export const consumeShopifyOAuthState =
    async ({
        state,
        shopDomain,
    }) => {
        if (
            !state ||
            !shopDomain
        ) {
            throw new Error(
                "Shopify OAuth state and shop are required"
            );
        }

        const result =
            await pool.query(
                `
                DELETE FROM shopify_oauth_states
                WHERE state = $1
                  AND shop_domain = $2
                  AND expires_at > NOW()
                RETURNING
                    tenant_id,
                    shop_domain,
                    expires_at
                `,
                [
                    state,
                    shopDomain,
                ]
            );

        if (
            result.rows.length === 0
        ) {
            throw new Error(
                "Invalid, expired, or already-used Shopify OAuth state"
            );
        }

        return result.rows[0];
    };


/* =========================================================
   EXCHANGE AUTHORIZATION CODE
   FOR EXPIRING OFFLINE ACCESS TOKEN
========================================================= */

export const exchangeShopifyCode =
    async ({
        shopDomain,
        code,
    }) => {
        validateShopifyConfiguration();

        const response =
            await shopifyFetch(
                `https://${shopDomain}/admin/oauth/access_token`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",

                        Accept:
                            "application/json",
                    },

                    body:
                        new URLSearchParams({
                            client_id:
                                SHOPIFY_CLIENT_ID,

                            client_secret:
                                SHOPIFY_CLIENT_SECRET,

                            code,

                            /*
                             * Required for expiring
                             * offline access tokens.
                             */
                            expiring: "1",
                        }),
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            console.error(
                "Shopify token exchange failed:",
                {
                    status:
                        response.status,

                    data,
                }
            );

            throw new Error(
                "Shopify authorization code exchange failed"
            );
        }

        if (
            !data.access_token
        ) {
            throw new Error(
                "Shopify did not return an access token"
            );
        }

        return data;
    };


/* =========================================================
   VALIDATE GRANTED SCOPES
========================================================= */

/*
 * Shopify may return a write_* scope where the requested
 * permission was read_*.
 *
 * Example:
 *
 * requested:
 * read_orders
 *
 * granted:
 * write_orders
 *
 * write_orders also satisfies read_orders.
 */

export const validateGrantedScopes = (
    grantedScopes
) => {
    const granted =
        String(
            grantedScopes || ""
        )
            .split(",")
            .map((scope) =>
                scope.trim()
            )
            .filter(Boolean);

    const missing =
        REQUIRED_SCOPES.filter(
            (requiredScope) => {
                if (
                    granted.includes(
                        requiredScope
                    )
                ) {
                    return false;
                }

                if (
                    requiredScope.startsWith(
                        "read_"
                    )
                ) {
                    const equivalentWriteScope =
                        `write_${requiredScope.slice(
                            5
                        )}`;

                    if (
                        granted.includes(
                            equivalentWriteScope
                        )
                    ) {
                        return false;
                    }
                }

                return true;
            }
        );

    return {
        valid:
            missing.length === 0,

        granted,

        missing,
    };
};


/* =========================================================
   GET SHOP DETAILS FROM SHOPIFY
========================================================= */

export const getShopifyShopDetails =
    async ({
        shopDomain,
        accessToken,
    }) => {
        const response =
            await shopifyFetch(
                `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json",

                        "X-Shopify-Access-Token":
                            accessToken,
                    },

                    body: JSON.stringify({
                        query: `
                            query {
                                shop {
                                    id
                                    name
                                    email
                                    myshopifyDomain
                                }
                            }
                        `,
                    }),
                }
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            data.errors
        ) {
            console.error(
                "Shopify shop details failed:",
                {
                    status:
                        response.status,

                    data,
                }
            );

            throw new Error(
                "Unable to retrieve Shopify store details"
            );
        }

        if (
            !data?.data?.shop
        ) {
            throw new Error(
                "Shopify store details were not returned"
            );
        }

        return data.data.shop;
    };


/* =========================================================
   SAVE SHOPIFY INTEGRATION
========================================================= */

export const saveShopifyIntegration =
    async ({
        tenantId,
        shopDomain,
        shopDetails,
        tokenData,
    }) => {
        const accessTokenExpiresAt =
            Number(
                tokenData.expires_in
            ) > 0
                ? new Date(
                      Date.now() +
                          Number(
                              tokenData.expires_in
                          ) *
                              1000
                  )
                : null;

        const refreshTokenExpiresAt =
            Number(
                tokenData.refresh_token_expires_in
            ) > 0
                ? new Date(
                      Date.now() +
                          Number(
                              tokenData.refresh_token_expires_in
                          ) *
                              1000
                  )
                : null;

        await pool.query(
            `
            INSERT INTO shopify_integrations
            (
                tenant_id,
                shop_domain,
                shopify_shop_id,
                shop_name,
                shop_email,
                access_token,
                refresh_token,
                access_token_expires_at,
                refresh_token_expires_at,
                granted_scopes,
                api_version,
                connection_status,
                connected_at,
                updated_at
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                'active',
                NOW(),
                NOW()
            )
            ON CONFLICT
                (tenant_id, shop_domain)
            DO UPDATE SET
                shopify_shop_id =
                    EXCLUDED.shopify_shop_id,

                shop_name =
                    EXCLUDED.shop_name,

                shop_email =
                    EXCLUDED.shop_email,

                access_token =
                    EXCLUDED.access_token,

                refresh_token =
                    EXCLUDED.refresh_token,

                access_token_expires_at =
                    EXCLUDED.access_token_expires_at,

                refresh_token_expires_at =
                    EXCLUDED.refresh_token_expires_at,

                granted_scopes =
                    EXCLUDED.granted_scopes,

                api_version =
                    EXCLUDED.api_version,

                connection_status =
                    'active',

                connected_at =
                    NOW(),

                updated_at =
                    NOW()
            `,
            [
                tenantId,

                shopDomain,

                shopDetails.id || null,

                shopDetails.name || null,

                shopDetails.email || null,

                tokenData.access_token,

                tokenData.refresh_token ||
                    null,

                accessTokenExpiresAt,

                refreshTokenExpiresAt,

                tokenData.scope || "",

                SHOPIFY_API_VERSION,
            ]
        );
    };


/* =========================================================
   GET SHOPIFY TENANT ID FROM STATE
========================================================= */

/*
 * This helper is useful if your callback controller needs
 * to recover the Nexzsoft tenant before processing the
 * callback.
 *
 * IMPORTANT:
 * Do not consume/delete the state here.
 * consumeShopifyOAuthState() does that atomically later.
 */

export const getTenantIdFromShopifyState =
    async (state) => {
        if (!state) {
            return null;
        }

        const result =
            await pool.query(
                `
                SELECT
                    tenant_id
                FROM shopify_oauth_states
                WHERE state = $1
                  AND expires_at > NOW()
                LIMIT 1
                `,
                [state]
            );

        if (
            result.rows.length === 0
        ) {
            return null;
        }

        return result.rows[0]
            .tenant_id;
    };


/* =========================================================
   COMPLETE SHOPIFY CALLBACK FLOW
========================================================= */

export const handleShopifyCallback =
    async ({
        code,
        shop,
        state,
        hmac,
        callbackParams,
    }) => {
        if (
            !code ||
            !shop ||
            !state ||
            !hmac
        ) {
            throw new Error(
                "Incomplete Shopify OAuth callback"
            );
        }

        const normalizedShop =
            normalizeShopDomain(shop);

        /*
         * Validate the shop format before using it
         * as a hostname.
         */
        if (
            !validateShopDomain(
                normalizedShop
            )
        ) {
            throw new Error(
                "Invalid Shopify shop domain"
            );
        }

        /*
         * Validate HMAC before trusting the
         * callback parameters.
         */
        const validHmac =
            validateShopifyHmac(
                callbackParams
            );

        if (!validHmac) {
            throw new Error(
                "Invalid Shopify OAuth HMAC"
            );
        }

        /*
         * Atomically consume state.
         *
         * This gives us the Nexzsoft tenant that
         * originally initiated the OAuth flow.
         */
        const oauthState =
            await consumeShopifyOAuthState({
                state,
                shopDomain:
                    normalizedShop,
            });

        const tenantId =
            oauthState.tenant_id;

        /*
         * Exchange the Shopify authorization
         * code for an expiring offline token.
         */
        const tokenData =
            await exchangeShopifyCode({
                shopDomain:
                    normalizedShop,

                code,
            });

        /*
         * Verify that Shopify actually granted
         * everything Nexzsoft requested.
         */
        const scopeValidation =
            validateGrantedScopes(
                tokenData.scope
            );

        if (
            !scopeValidation.valid
        ) {
            throw new Error(
                `Shopify did not grant all required scopes. Missing: ${scopeValidation.missing.join(
                    ", "
                )}`
            );
        }

        /*
         * Retrieve safe store metadata.
         */
        const shopDetails =
            await getShopifyShopDetails({
                shopDomain:
                    normalizedShop,

                accessToken:
                    tokenData.access_token,
            });

        /*
         * Persist the Shopify connection.
         */
        await saveShopifyIntegration({
            tenantId,

            shopDomain:
                normalizedShop,

            shopDetails,

            tokenData,
        });

        return {
            success: true,

            tenantId,

            shopDomain:
                normalizedShop,

            shopName:
                shopDetails.name ||
                null,

            shopEmail:
                shopDetails.email ||
                null,

            grantedScopes:
                scopeValidation.granted,

            connectedAt:
                new Date(),
        };
    };


/* =========================================================
   GET SHOPIFY CONNECTION STATUS
========================================================= */

/*
 * Safe response for the Nexzsoft frontend.
 *
 * NEVER return access_token or refresh_token.
 */

export const getShopifyConnectionStatus =
    async (tenantId) => {
        const result =
            await pool.query(
                `
                SELECT
                    id,
                    shop_domain,
                    shopify_shop_id,
                    shop_name,
                    shop_email,
                    granted_scopes,
                    api_version,
                    connection_status,
                    connected_at,
                    updated_at,
                    access_token_expires_at,
                    refresh_token_expires_at
                FROM shopify_integrations
                WHERE tenant_id = $1
                ORDER BY connected_at DESC
                LIMIT 1
                `,
                [tenantId]
            );

        if (
            result.rows.length === 0
        ) {
            return {
                connected: false,
            };
        }

        const integration =
            result.rows[0];

        return {
            connected:
                integration.connection_status ===
                "active",

            id:
                integration.id,

            shopDomain:
                integration.shop_domain,

            shopName:
                integration.shop_name,

            shopEmail:
                integration.shop_email,

            scopes:
                integration.granted_scopes
                    ? integration.granted_scopes
                          .split(",")
                          .map((scope) =>
                              scope.trim()
                          )
                          .filter(Boolean)
                    : [],

            apiVersion:
                integration.api_version,

            connectionStatus:
                integration.connection_status,

            connectedAt:
                integration.connected_at,

            updatedAt:
                integration.updated_at,

            accessTokenExpiresAt:
                integration.access_token_expires_at,

            refreshTokenExpiresAt:
                integration.refresh_token_expires_at,
        };
    };


/* =========================================================
   REFRESH SHOPIFY OFFLINE ACCESS TOKEN
========================================================= */

/*
 * Shopify expiring offline tokens require refresh.
 *
 * The refresh response gives us a NEW access token and
 * a NEW refresh token.
 *
 * We must store BOTH new values.
 */

export const refreshShopifyAccessToken =
    async ({
        tenantId,
        shopDomain,
    }) => {
        const normalizedShop =
            normalizeShopDomain(
                shopDomain
            );

        if (
            !validateShopDomain(
                normalizedShop
            )
        ) {
            throw new Error(
                "Invalid Shopify shop domain"
            );
        }

        const result =
            await pool.query(
                `
                SELECT
                    id,
                    refresh_token,
                    access_token_expires_at
                FROM shopify_integrations
                WHERE tenant_id = $1
                  AND shop_domain = $2
                  AND connection_status = 'active'
                LIMIT 1
                `,
                [
                    tenantId,
                    normalizedShop,
                ]
            );

        if (
            result.rows.length === 0
        ) {
            throw new Error(
                "Shopify integration not found"
            );
        }

        const integration =
            result.rows[0];

        if (
            !integration.refresh_token
        ) {
            throw new Error(
                "Shopify refresh token is unavailable. Reauthorization required."
            );
        }

        const response =
            await shopifyFetch(
                `https://${normalizedShop}/admin/oauth/access_token`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",

                        Accept:
                            "application/json",
                    },

                    body:
                        new URLSearchParams({
                            client_id:
                                SHOPIFY_CLIENT_ID,

                            client_secret:
                                SHOPIFY_CLIENT_SECRET,

                            grant_type:
                                "refresh_token",

                            refresh_token:
                                integration.refresh_token,
                        }),
                }
            );

        const data =
            await response.json();

        /*
         * Shopify returns 401 when the refresh token
         * is no longer valid.
         *
         * Mark the integration inactive so the frontend
         * can ask the merchant to reconnect.
         */
        if (
            response.status === 401
        ) {
            await pool.query(
                `
                UPDATE shopify_integrations
                SET
                    connection_status =
                        'inactive',

                    updated_at =
                        NOW()
                WHERE id = $1
                `,
                [integration.id]
            );

            throw new Error(
                "Shopify refresh token expired or was revoked. Reauthorization required."
            );
        }

        if (!response.ok) {
            console.error(
                "Shopify token refresh failed:",
                {
                    status:
                        response.status,

                    data,
                }
            );

            throw new Error(
                "Shopify access token refresh failed"
            );
        }

        if (
            !data.access_token ||
            !data.refresh_token
        ) {
            throw new Error(
                "Shopify token refresh response is incomplete"
            );
        }

        const accessTokenExpiresAt =
            Number(
                data.expires_in
            ) > 0
                ? new Date(
                      Date.now() +
                          Number(
                              data.expires_in
                          ) *
                              1000
                  )
                : null;

        const refreshTokenExpiresAt =
            Number(
                data.refresh_token_expires_in
            ) > 0
                ? new Date(
                      Date.now() +
                          Number(
                              data.refresh_token_expires_in
                          ) *
                              1000
                  )
                : null;

        await pool.query(
            `
            UPDATE shopify_integrations
            SET
                access_token =
                    $1,

                refresh_token =
                    $2,

                access_token_expires_at =
                    $3,

                refresh_token_expires_at =
                    $4,

                granted_scopes =
                    COALESCE(
                        $5,
                        granted_scopes
                    ),

                connection_status =
                    'active',

                updated_at =
                    NOW()

            WHERE id = $6
            `,
            [
                data.access_token,

                data.refresh_token,

                accessTokenExpiresAt,

                refreshTokenExpiresAt,

                data.scope ||
                    null,

                integration.id,
            ]
        );

        return {
            accessToken:
                data.access_token,

            expiresAt:
                accessTokenExpiresAt,
        };
    };


/* =========================================================
   GET VALID ACCESS TOKEN
========================================================= */

/*
 * Other Shopify services can call this before making
 * an Admin API request.
 *
 * Example:
 *
 * const token = await getValidShopifyAccessToken({
 *     tenantId,
 *     shopDomain
 * });
 */

export const getValidShopifyAccessToken =
    async ({
        tenantId,
        shopDomain,
    }) => {
        const normalizedShop =
            normalizeShopDomain(
                shopDomain
            );

        const result =
            await pool.query(
                `
                SELECT
                    id,
                    access_token,
                    refresh_token,
                    access_token_expires_at
                FROM shopify_integrations
                WHERE tenant_id = $1
                  AND shop_domain = $2
                  AND connection_status = 'active'
                LIMIT 1
                `,
                [
                    tenantId,
                    normalizedShop,
                ]
            );

        if (
            result.rows.length === 0
        ) {
            throw new Error(
                "Shopify integration not found"
            );
        }

        const integration =
            result.rows[0];

        /*
         * Refresh approximately 60 seconds before
         * expiry so an API request doesn't start with
         * a token that expires during the request.
         */
        const expiresAt =
            integration.access_token_expires_at
                ? new Date(
                      integration.access_token_expires_at
                  ).getTime()
                : null;

        const refreshThreshold =
            60 * 1000;

        if (
            expiresAt &&
            Date.now() >=
                expiresAt -
                    refreshThreshold
        ) {
            const refreshed =
                await refreshShopifyAccessToken({
                    tenantId,

                    shopDomain:
                        normalizedShop,
                });

            return refreshed.accessToken;
        }

        return integration.access_token;
    };


/* =========================================================
   DISCONNECT SHOPIFY
========================================================= */

export const disconnectShopify =
    async ({
        tenantId,
        shopDomain,
    }) => {
        const normalizedShop =
            normalizeShopDomain(
                shopDomain
            );

        const result =
            await pool.query(
                `
                UPDATE shopify_integrations
                SET
                    connection_status =
                        'inactive',

                    updated_at =
                        NOW()
                WHERE tenant_id = $1
                  AND shop_domain = $2
                RETURNING
                    id,
                    shop_domain,
                    connection_status
                `,
                [
                    tenantId,
                    normalizedShop,
                ]
            );

        if (
            result.rows.length === 0
        ) {
            throw new Error(
                "Shopify integration not found"
            );
        }

        return {
            success: true,

            shopDomain:
                result.rows[0]
                    .shop_domain,

            connectionStatus:
                result.rows[0]
                    .connection_status,
        };
    };

