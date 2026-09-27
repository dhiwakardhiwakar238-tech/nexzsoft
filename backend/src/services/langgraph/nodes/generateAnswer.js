/*
 * Generate Answer Node
 *
 * This is the second node in our RAG LangGraph.
 *
 * It receives:
 *
 * - The user's current question
 * - Previous conversation messages
 * - Relevant document chunks
 *
 * It combines them into a prompt and sends the
 * messages to the LLM through llmService.
 */

import llmService from "../../llm/llm.service.js";


/*
 * Generate the final answer.
 */
const generateAnswer = async (state) => {

    const {
        question,
        retrievedChunks
    } = state;


    /*
     * Convert retrieved chunks into context that
     * can be provided to the LLM.
     */
    const context = retrievedChunks
        .map((chunk, index) => {
            return `Document ${index + 1}:\n${chunk.chunk_text}`;
        })
        .join("\n\n");


    /*
     * Build the messages sent to the LLM.
     *
     * The previous conversation is kept separate from
     * the retrieved document context.
     */
    const messages = [

        {
            role: "system",
            content:
                "You are a helpful assistant. " +
                "Answer the user's question using the provided context. " +
                "Do not invent information that is not present in the context."
        },
        {
            role: "user",
            content:
                `Context:\n\n${context}\n\n` +
                `Question:\n${question}`
        }
    ];


    /*
     * Call the LLM through our abstraction layer.
     */
    const answer =
        await llmService.generateAnswer(messages);


    /*
     * Store the generated answer in LangGraph state.
     */
    return {
        answer
    };
};


export default generateAnswer;