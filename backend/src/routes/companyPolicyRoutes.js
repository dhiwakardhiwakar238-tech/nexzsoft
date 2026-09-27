import express from "express";

import {

    searchCompanyPolicy

} from "../controllers/companyPolicyController.js";

const router = express.Router();

/*
==================================================
SEARCH KNOWLEDGE BASE
==================================================
*/

router.post(

    "/search",

    searchCompanyPolicy

);

export default router;