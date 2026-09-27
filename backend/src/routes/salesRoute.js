import express from "express";
import salesController from "../controllers/salesController.js";

const router = express.Router();

    router.post(

        "/contacts",

        salesController.salesLead

    );

export default router;