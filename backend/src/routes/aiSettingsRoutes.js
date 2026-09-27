import express from "express";

import {
    getAISettings,
    saveAISettings
} from "../controllers/aiSettingsController.js";

import {
    authenticateToken
} from "../middleware/requestAuthorizer.js";


const router = express.Router();


/*
==================================================
GET AI SETTINGS
==================================================

JWT required.

Expected:

Authorization: Bearer <JWT>

The JWT contains:

req.user.tenant_id
==================================================
*/

router.get(
    "/:tenantId",
    authenticateToken,
    getAISettings
);


/*
==================================================
SAVE AI SETTINGS
==================================================

JWT required.
==================================================
*/

router.post(
    "/:tenantId",
    authenticateToken,
    saveAISettings
);


export default router;