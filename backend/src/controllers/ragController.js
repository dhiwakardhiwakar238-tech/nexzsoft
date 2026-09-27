/*
 * RAG Controller
 *
 * Handles HTTP requests from the UI and passes the
 * question to the RAG LangGraph.
 */

import ragGraph from "../services/langgraph/graphs/ragGraph.js";
import { badRequest } from "../utils/apiError.js";


/*
 * Process a user's RAG question.
 */
export const askQuestion = async (req, res, next) => {

    try {

        /*
         * Get the question and tenant ID from the request.
         */
        const {
            question
        } = req.body;


        /*
         * Validate the required fields.
         */
        if (!question || !question.trim()) {

            throw badRequest("Question is required.");
        }

        const tenantId = req.user.tenant_id;

        if (!tenantId) {

            throw badRequest("Tenant ID is required.");
        }


        /*
         * Start the LangGraph workflow.
         */
        const result = await ragGraph.invoke({

            question,

            tenantId

        });


        /*
         * Return only what the UI needs.
         */
        return res.status(200).json({

            answer: result.answer

        });

    } catch (error) {

        return next(error);
    }
};