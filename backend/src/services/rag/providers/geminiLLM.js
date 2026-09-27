/*
 * Gemini LLM Provider
 *
 * This file contains the Gemini-specific implementation
 * for generating answers.
 *
 * The rest of the RAG application does not directly call
 * Gemini. It calls llm.service.js, which delegates here.
 */

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


/*
 * Create the Gemini chat model.
 *
 * The model name is taken from the environment so that
 * we can change the model without changing the code.
 */
const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: process.env.LLM_MODEL || "gemini-2.5-flash",
    temperature: 0
});


/*
 * Generate an answer using Gemini.
 *
 * messages contains:
 *
 * - System instructions
 * - Previous conversation messages
 * - Current question
 * - Retrieved RAG context
 */
const generateGeminiAnswer = async (messages) => {

    /*
     * Send the messages to Gemini.
     *
     * LangChain converts the message objects into
     * the format expected by the Gemini API.
     */
    const response = await model.invoke(messages);


    /*
     * Chat models return their generated text in
     * response.content.
     */
    return response.content;
};


export {
    generateGeminiAnswer
};