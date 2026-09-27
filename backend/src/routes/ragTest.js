import express from "express";

import ragService from "../services/ragService.js";

const router = express.Router();

router.get("/", async (req, res) => {

    const answer =
        await ragService.askAI(

            req.query.question,

            {
                name: "Dhiwakar",

                company: "Nexzsoft",

                phone: "916383539133",

                email: "demo@nexzsoft.com"
            },

            [

                {

                    role: "customer",

                    message: "Hello"

                },

                {

                    role: "assistant",

                    message: "Hi"

                }

            ]

        );

    res.json({

        success: true,

        answer

    });

});

export default router;