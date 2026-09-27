import express from "express";
import metaConfigController from "../controllers/metaConfigController.js";

const router = express.Router();

router.get(
    "/:tenantId",
    metaConfigController.getMetaConfig
);

router.put(
    "/:tenantId",
    metaConfigController.updateMetaConfig
);

router.delete(
    "/:tenantId",
    metaConfigController.disconnectMetaConfig
);

export default router;
