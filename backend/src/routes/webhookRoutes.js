import express from "express";

import {

    verifyWebhook,

    whatsappWebhook

} from "../controllers/webhookController.js";

const router = express.Router();

/*
==================================================
VERIFY META WEBHOOK
==================================================
*/

router.get(

    "/",
    verifyWebhook
);

/*
==================================================
WHATSAPP WEBHOOK
==================================================
*/

router.post(

    "/",

    whatsappWebhook

);

export default router;