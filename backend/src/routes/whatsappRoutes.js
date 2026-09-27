import express from "express";
import * as whatsappController from "../controllers/whatsappController.js";
import {
    authenticateToken
} from "../middleware/requestAuthorizer.js";

const router = express.Router();

/*
==================================================
JWT AUTHENTICATION
==================================================

Protected dashboard APIs must contain:

Authorization: Bearer <JWT>

The JWT is verified by authenticateToken.
After verification:

req.user.tenant_id

is available to the controller.

IMPORTANT:
The frontend tenantId is NOT trusted.
The controller compares it with the verified
JWT tenant_id.
==================================================
*/


/*
==================================================
MANUAL SEND MESSAGE
==================================================
*/

router.post(
    "/send-message",
    authenticateToken,
    whatsappController.sendWhatsAppMessage
);


/*
==================================================
CUSTOMERS
==================================================
*/

router.get(
    "/customers/:tenantId",
    authenticateToken,
    whatsappController.getCustomers
);


/*
==================================================
CONVERSATIONS
==================================================
*/

router.get(
    "/conversations/:tenantId",
    authenticateToken,
    whatsappController.getConversations
);


/*
==================================================
MARK CONVERSATION AS READ
==================================================
*/

router.put(
    "/conversations/:conversationId/read",
    authenticateToken,
    whatsappController.markConversationRead
);


/*
==================================================
PAUSE / RESUME AI FOR A SINGLE CONVERSATION
==================================================
*/

router.put(
    "/conversations/:conversationId/ai-pause",
    authenticateToken,
    whatsappController.toggleAiPause
);


/*
==================================================
TEST ROUTE
==================================================

This is also protected so that an unauthenticated
request cannot use it as a public API endpoint.
==================================================
*/

router.put(
    "/test",
    authenticateToken,
    (req, res) => {

        console.log(
            "TEST ROUTE HIT - JWT:",
            req.user?.tenant_id
        );

        return res.json({

            success: true,

            message:
                "JWT authentication successful",

            tenant_id:
                req.user?.tenant_id || null

        });

    }
);


/*
==================================================
MESSAGES
==================================================
*/

router.get(
    "/messages/:conversationId",
    authenticateToken,
    whatsappController.getMessages
);


/*
==================================================
EXPORT
==================================================
*/

export default router;