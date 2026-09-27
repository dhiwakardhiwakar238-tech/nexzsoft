import express from "express";

import embeddingService from "../services/embeddingService.js";

const router = express.Router();

router.get("/", async (req, res) => {

    const embedding = await embeddingService.generateEmbedding(

        "Samsung environmental policy"

    );

    res.json({

        length: embedding.length,

        embedding

    });

});

export default router;