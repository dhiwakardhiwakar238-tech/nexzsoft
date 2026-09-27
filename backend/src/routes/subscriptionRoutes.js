import express from "express";

import {
    getTenantSubscription,
    activateUsageSubscription,
    getPaymentHistory,
    cancelSubscription
} from "../controllers/subscriptionController.js";


const router = express.Router();


/*
==================================================
ACTIVATE PAY AS YOU GROW
==================================================
*/

router.post(
    "/activate-usage/:tenantId",
    activateUsageSubscription
);


/*
==================================================
GET TENANT SUBSCRIPTION
==================================================
*/

router.get(
    "/:tenantId",
    getTenantSubscription
);

/*
==================================================
GET PAYMENT HISTORY
==================================================
*/

router.get(
    "/payment-history/:tenantId",
    getPaymentHistory
);

/*
==================================================
CANCEL SUBSCRIPTION
==================================================
*/

router.post(
    "/cancel/:tenantId",
    cancelSubscription
);

export default router;
