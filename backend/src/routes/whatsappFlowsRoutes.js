import express from "express";
import { saveFlow, getFlows } from "../controllers/whatsappFlowsController.js";
import { authenticateToken } from "../middleware/requestAuthorizer.js";

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    saveFlow
);

router.get(
    "/",
    authenticateToken,
    getFlows
);

export default router;
