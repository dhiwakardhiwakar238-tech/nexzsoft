/*
 * LLM Service
 *
 * This service provides a common interface for generating
 * answers using an LLM.
 *
 * The LangGraph nodes do not directly depend on a specific
 * LLM provider.
 */

import { generateGeminiAnswer } from "../rag/providers/geminiLLM.js";


/*
 * Generate an answer using the configured LLM provider.
 */
const generateAnswer = async (messages) => {

    /*
     * Read the provider from environment configuration.
     */
    const provider = process.env.LLM_PROVIDER || "gemini";


    /*
     * Select the appropriate LLM provider.
     */
    switch (provider) {

        case "gemini":

            return await generateGeminiAnswer(messages);

        default:

            throw new Error(
                `Unsupported LLM provider: ${provider}`
            );
    }
};


export default {
    generateAnswer
};