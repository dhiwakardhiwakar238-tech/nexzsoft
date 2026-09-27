
import {
    createShopifyAuthorizationUrl,
    handleShopifyCallback,
    getShopifyConnectionStatus,
    disconnectShopify,
} from "../services/shopifyService.js";


/* =========================================================
   START SHOPIFY CONNECTION
========================================================= */

/*
 * GET /api/shopify/connect?shop=your-store.myshopify.com
 *
 * This route is called by the authenticated Nexzsoft
 * frontend.
 *
 * The backend:
 *
 * 1. Gets tenantId from the authenticated user
 * 2. Validates the store domain
 * 3. Generates OAuth state
 * 4. Stores the state against the tenant
 * 5. Builds Shopify authorization URL
 * 6. Redirects the browser to Shopify
 */

export const connectShopify = async (
    req,
    res
) => {
    try {
        const { shop } = req.query;

        if (!shop) {
            return res.status(400).json({
                success: false,
                message:
                    "Shopify store domain is required.",
            });
        }

        /*
         * Your existing authentication middleware
         * should attach the authenticated user to req.user.
         *
         * If your project uses a different property,
         * change ONLY this line.
         */
        const tenantId =
            req.user?.tenant_id;

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated tenant not found.",
            });
        }

        /*
         * The service performs normalization,
         * strict Shopify domain validation,
         * state generation, state persistence,
         * and OAuth URL creation.
         */
        const authorizationUrl =
            await createShopifyAuthorizationUrl({
                tenantId,
                shopDomain: shop,
            });

        /*
         * Redirect the browser directly to Shopify.
         */
        return res.status(200).json({
            success: true,
            authorizationUrl,
        });
    } catch (error) {
        console.error(
            "Shopify connect controller error:",
            error
        );

        /*
         * Do not expose internal errors,
         * database errors, secrets, etc.
         */
        return res.status(500).json({
            success: false,
            message:
                "Unable to start Shopify connection.",
        });
    }
};


/* =========================================================
   SHOPIFY OAUTH CALLBACK
========================================================= */

/*
 * GET /api/shopify/callback
 *
 * Shopify redirects the merchant here after approval.
 *
 * Example:
 *
 * /api/shopify/callback
 *     ?code=...
 *     &hmac=...
 *     &shop=...
 *     &state=...
 *     &timestamp=...
 *
 * IMPORTANT:
 *
 * This route does NOT use Nexzsoft's normal JWT
 * authentication middleware.
 *
 * Shopify is calling this endpoint directly.
 *
 * The tenant is recovered securely from the OAuth
 * state stored in PostgreSQL.
 */

export const shopifyCallback = async (
    req,
    res
) => {
    try {
        const {
            code,
            shop,
            state,
            hmac,
        } = req.query;

        /*
         * Basic callback validation.
         *
         * Full security validation is performed
         * inside the service.
         */
        if (
            !code ||
            !shop ||
            !state ||
            !hmac
        ) {
            console.error(
                "Invalid Shopify OAuth callback:",
                {
                    hasCode: Boolean(code),
                    hasShop: Boolean(shop),
                    hasState: Boolean(state),
                    hasHmac: Boolean(hmac),
                }
            );

            return res.status(400).send(
                "Invalid Shopify authorization callback."
            );
        }

        /*
         * Preserve the complete callback query.
         *
         * HMAC validation needs the Shopify callback
         * parameters, not just code/shop/state.
         */
        const callbackParams = {
            ...req.query,
        };

        /*
         * The service performs:
         *
         * - shop validation
         * - HMAC validation
         * - atomic OAuth state consumption
         * - tenant recovery from state
         * - authorization-code exchange
         * - granted-scope validation
         * - Shopify shop lookup
         * - database persistence
         */
        const result =
            await handleShopifyCallback({
                code,
                shop,
                state,
                hmac,
                callbackParams,
            });

        console.log(
            "Shopify connected successfully:",
            {
                tenantId:
                    result.tenantId,

                shopDomain:
                    result.shopDomain,

                shopName:
                    result.shopName,
            }
        );

        /*
         * Do NOT send the Shopify token to the
         * frontend.
         *
         * We only send the browser back to Nexzsoft.
         */
        const redirectUrl =
            new URL(
                process.env.SHOPIFY_FRONTEND_URL ||
                "https://www.nexzsoft.com"
            );

        redirectUrl.searchParams.set(
            "shopify",
            "connected"
        );

        return res.redirect(
            redirectUrl.toString()
        );
    } catch (error) {
        console.error(
            "Shopify OAuth callback controller error:",
            error
        );

        /*
         * Keep internal errors out of the browser.
         *
         * The frontend only needs to know that
         * the connection failed.
         */
        try {
            const redirectUrl =
                new URL(
                    process.env.SHOPIFY_FRONTEND_URL ||
                    "https://www.nexzsoft.com"
                );

            redirectUrl.searchParams.set(
                "shopify",
                "error"
            );

            return res.redirect(
                redirectUrl.toString()
            );
        } catch {
            /*
             * Fallback in case the configured
             * frontend URL itself is invalid.
             */
            return res.status(500).send(
                "Shopify connection failed."
            );
        }
    }
};


/* =========================================================
   GET SHOPIFY CONNECTION STATUS
========================================================= */

/*
 * GET /api/shopify/status
 *
 * Called by the Nexzsoft frontend after:
 *
 * ?shopify=connected
 *
 * or whenever the Integration page loads.
 *
 * The service intentionally returns only safe
 * connection information.
 */

export const getShopifyStatus = async (
    req,
    res
) => {

    console.log("🛍️ SHOPIFY STATUS CONTROLLER:", {
        method: req.method,
        url: req.originalUrl,
        user_id: req.user?.user_id,
        tenant_id: req.user?.tenant_id,
    });
    try {

        console.log("🛍️ STEP 1: Entered try block");
        
        const tenantId =
            req.user?.tenant_id;

        console.log("🛍️ STEP 2: tenantId =", tenantId);

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated tenant not found.",
            });
        }

        const status =
            await getShopifyConnectionStatus(
                tenantId
            );

        console.log("🛍️ STEP 3: Database query completed");

        return res.status(200).json({
            success: true,
            data: status,
        });
    } catch (error) {
        console.error(
            "Shopify status controller error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to retrieve Shopify connection status.",
        });
    }
};


/* =========================================================
   DISCONNECT SHOPIFY
========================================================= */

/*
 * POST /api/shopify/disconnect
 *
 * Expected body:
 *
 * {
 *     "shopDomain": "your-store.myshopify.com"
 * }
 *
 * This currently marks the Nexzsoft integration
 * inactive.
 *
 * Actual Shopify app/token revocation can be added
 * separately if required by the final disconnect
 * behavior.
 */

export const disconnectShopifyController =
    async (
        req,
        res
    ) => {
        try {
            const tenantId =
                req.user?.tenant_id;

            if (!tenantId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Authenticated tenant not found.",
                });
            }

            const {
                shopDomain,
            } = req.body || {};

            if (!shopDomain) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Shopify store domain is required.",
                });
            }

            const result =
                await disconnectShopify({
                    tenantId,
                    shopDomain,
                });

            return res.status(200).json({
                success: true,
                message:
                    "Shopify integration disconnected successfully.",
                data: result,
            });
        } catch (error) {
            console.error(
                "Shopify disconnect controller error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to disconnect Shopify.",
            });
        }
    };

