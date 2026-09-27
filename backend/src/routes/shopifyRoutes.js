import express from "express";

import {
    connectShopify,
    shopifyCallback,
    getShopifyStatus,
    disconnectShopifyController,
} from "../controllers/shopifyController.js";

import {
    authenticateToken,
} from "../middleware/requestAuthorizer.js";


const router = express.Router();


/*
==================================================
SHOPIFY OAUTH
==================================================
*/


/*
==================================================
START SHOPIFY CONNECTION
==================================================

GET /api/shopify/connect?shop=your-store.myshopify.com

Protected by Nexzsoft JWT authentication.

The controller gets the verified tenant from:

req.user.tenant_id

The frontend does NOT send tenant_id.
==================================================
*/

router.get(
    "/connect",
    authenticateToken,
    connectShopify
);


/*
==================================================
SHOPIFY OAUTH CALLBACK
==================================================

GET /api/shopify/callback

IMPORTANT:

DO NOT use authenticateToken here.

Shopify redirects the merchant's browser to this
endpoint after authorization. There is no Nexzsoft
JWT available here.

The tenant is recovered securely from the OAuth
state stored by the backend.
==================================================
*/

router.get(
    "/callback",
    shopifyCallback
);


/*
==================================================
GET SHOPIFY CONNECTION STATUS
==================================================

GET /api/shopify/status

Protected endpoint.

The controller gets the verified tenant from:

req.user.tenant_id
==================================================
*/

router.get(
    "/status",
    authenticateToken,
    getShopifyStatus
);


/*
==================================================
DISCONNECT SHOPIFY
==================================================

POST /api/shopify/disconnect

Protected endpoint.

The controller gets the verified tenant from:

req.user.tenant_id
==================================================
*/

router.post(
    "/disconnect",
    authenticateToken,
    disconnectShopifyController
);


export default router;
