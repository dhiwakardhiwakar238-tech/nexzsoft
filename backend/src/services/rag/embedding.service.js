/*
 * Embedding Service
 *
 * This service handles embedding generation for both:
 *
 * 1. Document chunks
 *    RETRIEVAL_DOCUMENT
 *
 * 2. User queries
 *    RETRIEVAL_QUERY
 *
 * Both operations use the same configured embedding provider.
 */

import { generateGeminiEmbedding } from "./providers/geminiEmbedding.js";


/*
 * Generate an embedding using the configured provider.
 *
 * This is the common internal implementation used by both
 * document and query embedding operations.
 */
const generateEmbedding = async (text, taskType) => {

    /*
     * Validate the input text.
     */
    if (!text || !text.trim()) {
        throw new Error("Text is required for embedding");
    }


    /*
     * Get the configured embedding provider.
     */
    const provider = process.env.EMBEDDING_PROVIDER || "gemini";


    /*
     * Generate the embedding using the selected provider.
     */
    switch (provider) {

        case "gemini":

            return await generateGeminiEmbedding(
                text,
                taskType
            );

        default:

            throw new Error(
                `Unsupported embedding provider: ${provider}`
            );
    }
};


/*
 * Generate an embedding for a document chunk.
 *
 * The resulting vector is stored in pgvector.
 */
const generateDocumentEmbedding = async (text) => {

    return generateEmbedding(
        text,
        "RETRIEVAL_DOCUMENT"
    );
};


/*
 * Generate an embedding for a user's question.
 *
 * The resulting vector is used for pgvector similarity search.
 */
const generateQueryEmbedding = async (question) => {

    return generateEmbedding(
        question,
        "RETRIEVAL_QUERY"
    );
};


export default {
    generateDocumentEmbedding,
    generateQueryEmbedding
};