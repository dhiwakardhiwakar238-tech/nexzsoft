import express from "express";

import searchService from "../services/searchService.js";

const router = express.Router();

router.get("/", async (req, res) => {

    const question =

        req.query.question ||

        "What is Samsung safety policy?";

    const result =

        await searchService.searchKnowledge(question);

    res.json(result);

});

export default router;