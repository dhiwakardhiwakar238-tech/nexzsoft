import { getPolicyContext } from "../services/companyPolicyService.js";
import { badRequest } from "../utils/apiError.js";

/*
==================================================
SEARCH COMPANY POLICY (RAG)
==================================================
*/

export const searchCompanyPolicy = async (req, res, next) => {

    try {

        const { question } = req.body;

        if (!question) {

            throw badRequest("Question is required.");

        }

        const context = await getPolicyContext(question);

        return res.json({

            success: true,

            context

        });

    }

    catch (err) {

        return next(err);

    }

};
