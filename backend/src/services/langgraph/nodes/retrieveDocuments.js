/*
 * Retrieve Documents Node
 *
 * This is the first node in our RAG LangGraph.
 *
 * Responsibility:
 *
 * 1. Convert the user's question into a query embedding.
 * 2. Search pgvector for similar document chunks.
 * 3. Store the retrieved chunks in the LangGraph state.
 */

import embeddingService from "../../rag/embedding.service.js";
import documentRepo from "../../../repositories/docman/docmanRepository.js";


/*
 * Execute document retrieval.
 */
const retrieveDocuments = async (state) => {

    /*
     * Get the current question and tenant ID
     * from the LangGraph state.
     */
    const {
        question,
        tenantId
    } = state;


    /*
     * Convert the user's question into a vector.
     *
     * This uses RETRIEVAL_QUERY internally.
     */
    const queryEmbedding =
        await embeddingService.generateQueryEmbedding(
            question
        );

    
        console.log("query embedding "+question);

    /*
     * Search the document chunks using pgvector.
     *
     * tenantId ensures that we only search documents
     * belonging to the current tenant.
     *
     * 5 = number of relevant chunks we want.
     */
    const chunks =
        await documentRepo.searchSimilarChunks(
            queryEmbedding,
            tenantId,
            1
        );

    /*
     * Return the retrieved chunks.
     *
     * LangGraph merges this value into the state.
     */
    return {
        retrievedChunks: chunks
    };
};


export default retrieveDocuments;