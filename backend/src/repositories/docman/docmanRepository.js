import db from "../../config/db.js";


/*
 * Create a document record.
 *
 * This is used during document ingestion to store
 * the document metadata for a tenant.
 */
export const createDocument = async (document) => {

    const {
        documentId,
        tenantId,
        fileName,
        fileType,
        storageKey,
        status
    } = document;

    await db.query(
        `
        INSERT INTO documents
        (
            document_id,
            tenant_id,
            file_name,
            file_type,
            storage_key,
            status,
            created_at
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            NOW()
        )
        `,
        [
            documentId,
            tenantId,
            fileName,
            fileType,
            storageKey,
            status
        ]
    );

    return document;
};

/* 
* delete document & document_chunks
*/

export const deleteDocument = async (documentId, tenantId) => {

    const result = await db.query(
        `
            DELETE FROM documents
            WHERE document_id = $1
              AND tenant_id = $2
            RETURNING storage_key
            `,
        [documentId, tenantId]
    );

    if (result.rowCount === 0) {
        throw new Error("Document not found");
    }

    return result.rows[0];
};


/*
* Get document from db
*/

export const getDocument = async (tenantId) => {

    const result = await db.query(
        `
    SELECT *
    FROM documents
    WHERE  tenant_id = $1
    `,
        [tenantId]
    );

    if (result.rowCount === 0) {
        throw new Error("Document not found");
    }

    const document = result.rows[0];

};

/*
 * Check whether a tenant already has documents.
 */
export const hasDocuments = async (tenantId) => {

    const result = await db.query(
        `
        SELECT 1
        FROM documents
        WHERE tenant_id = $1
        LIMIT 1
        `,
        [tenantId]
    );

    return result.rows.length > 0;
};


/*
 * Create a document chunk and store its embedding.
 *
 * The embedding is converted into PostgreSQL vector format
 * before being inserted into the pgvector column.
 */
const createChunk = async ({
    documentId,
    tenantId,
    chunkNumber,
    chunkText,
    embedding,
    metadata
}) => {

    const query = `
        INSERT INTO document_chunks (
            document_id,
            tenant_id,
            chunk_number,
            chunk_text,
            embedding,
            metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6);
    `;

    const values = [
        documentId,
        tenantId,
        chunkNumber,
        chunkText,
        `[${embedding.join(",")}]`,
        metadata
    ];

    await db.query(query, values);
};


/*
 * Search for document chunks that are most similar
 * to the user's question embedding.
 *
 * Flow:
 *
 * User Question
 *      ↓
 * Query Embedding
 *      ↓
 * searchSimilarChunks()
 *      ↓
 * pgvector cosine distance
 *      ↓
 * Most relevant chunks
 *
 * tenantId is used to ensure that a tenant can only
 * retrieve its own documents.
 */
export const searchSimilarChunks = async (
    queryEmbedding,
    tenantId,
    limit = 5
) => {

    const query = `
        SELECT
            document_id,
            chunk_number,
            chunk_text,
            metadata,
            embedding <=> $1::vector AS distance
        FROM document_chunks
        WHERE tenant_id = $2
        ORDER BY embedding <=> $1::vector
        LIMIT $3;
    `;

    const values = [
        `[${queryEmbedding.join(",")}]`,
        tenantId,
        limit
    ];

    const result = await db.query(query, values);

    return result.rows;
};


/*
 * Export the repository methods.
 */
export default {
    createDocument,
    hasDocuments,
    createChunk,
    searchSimilarChunks
};