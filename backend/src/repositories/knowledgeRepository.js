import db from "../config/db.js";

/*
=========================================================
CREATE DOCUMENT
=========================================================
*/

const createDocument = async (

    id,
    companyId,
    companyName,
    title,
    fileName,
    fileType,
    filePath,
    fileHash

) => {

    /*
    =====================================
    HASH CHECK
    =====================================
    */

    const duplicate = await db.query(

        `

        SELECT id

        FROM knowledge_documents

        WHERE

        company_id=$1

        AND file_hash=$2

        LIMIT 1

        `,

        [

            companyId,
            fileHash

        ]

    );

    if (duplicate.rows.length > 0) {

        throw new Error("DOCUMENT_ALREADY_EXISTS");

    }

    /*
    =====================================
    INSERT
    =====================================
    */

    const result = await db.query(

        `

        INSERT INTO knowledge_documents
        (
            id,
            company_id,
            company_name,
            title,
            file_name,
            file_type,
            file_path,
            file_hash,
            status,
            created_at
        )

        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,
            'READY',
            NOW()
        )

        RETURNING *;

        `,

        [

            id,
            companyId,
            companyName,
            title,
            fileName,
            fileType,
            filePath,
            fileHash

        ]

    );

    return result.rows[0];

};

/*
=========================================================
SAVE CHUNK
=========================================================
*/

const saveChunk = async (

    id,
    documentId,
    chunkIndex,
    chunkText,
    embedding

) => {

    const query = `

    INSERT INTO knowledge_chunks
    (
        id,
        document_id,
        chunk_index,
        chunk_text,
        embedding,
        created_at
    )

    VALUES
    (
        $1,$2,$3,$4,$5,NOW()
    )

    `;

    await db.query(query, [

        id,
        documentId,
        chunkIndex,
        chunkText,
        JSON.stringify(embedding)

    ]);

};

/*
=========================================================
GET ALL CHUNKS
=========================================================
*/

const getAllChunks = async () => {

    const query = `

    SELECT

        kc.id,
        kc.document_id,
        kc.chunk_index,
        kc.chunk_text,
        kc.embedding,

        kd.title,
        kd.company_name,
        kd.company_id

    FROM knowledge_chunks kc

    JOIN knowledge_documents kd

    ON kc.document_id = kd.id

    ORDER BY
    kc.chunk_index ASC

    `;

    const result = await db.query(query);

    return result.rows;

};

/*
=========================================================
KEYWORD SEARCH
=========================================================
*/

const keywordSearch = async (

    question,
    companyName = null

) => {

    const words = question
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2);

    if (words.length === 0) {
        return [];
    }

    let conditions = [];
    let values = [];
    let index = 1;

    for (const word of words) {

        conditions.push(

            `LOWER(kc.chunk_text) LIKE LOWER($${index})`

        );

        values.push(`%${word}%`);

        index++;

    }

    let query = `

    SELECT

        kc.id,
        kc.document_id,
        kc.chunk_text,

        kd.title,
        kd.company_name

    FROM knowledge_chunks kc

    JOIN knowledge_documents kd

    ON kc.document_id = kd.id

    WHERE

    (${conditions.join(" OR ")})

    `;

    if (companyName) {

        query += `

        AND LOWER(kd.company_name)=LOWER($${index})

        `;

        values.push(companyName);

    }

    query += `

    LIMIT 20

    `;

    const result = await db.query(

        query,

        values

    );

    return result.rows;

};

/*
=========================================================
GET DOCUMENTS
=========================================================
*/

const getDocuments = async () => {

    const result = await db.query(`

    SELECT

        kd.*,

        COUNT(kc.id)::int AS chunk_count

    FROM knowledge_documents kd

    LEFT JOIN knowledge_chunks kc

    ON kc.document_id = kd.id

    GROUP BY kd.id

    ORDER BY kd.created_at DESC

    `);

    return result.rows;

};

/*
=========================================================
GET DOCUMENT
=========================================================
*/

const getDocument = async (id) => {

    const result = await db.query(

        `

        SELECT *

        FROM knowledge_documents

        WHERE id=$1

        `,

        [id]

    );

    return result.rows[0];

};

/*
=========================================================
DELETE CHUNKS
=========================================================
*/

const deleteChunks = async (documentId) => {

    await db.query(

        `

        DELETE FROM knowledge_chunks

        WHERE document_id=$1

        `,

        [documentId]

    );

};

/*
=========================================================
DELETE DOCUMENT
=========================================================
*/

const deleteDocument = async (documentId) => {

    await db.query(

        `

        DELETE FROM knowledge_documents

        WHERE id=$1

        `,

        [documentId]

    );

};

/*
=========================================================
UPDATE DOCUMENT STATUS
=========================================================
*/

const updateStatus = async (

    documentId,
    status

) => {

    await db.query(

        `

        UPDATE knowledge_documents

        SET status=$2

        WHERE id=$1

        `,

        [

            documentId,
            status

        ]

    );

};

/*
=========================================================
SAVE KNOWLEDGE LOG
=========================================================
*/

const saveKnowledgeLog = async (

    id,
    companyId,
    question,
    matchedDocument,
    similarityScore,
    aiResponse,
    responseTime

) => {

    await db.query(

        `

        INSERT INTO knowledge_logs
        (

            id,
            company_id,
            question,
            matched_document,
            similarity_score,
            ai_response,
            response_time,
            created_at

        )

        VALUES
        (

            $1,$2,$3,$4,$5,$6,$7,NOW()

        )

        `,

        [

            id,
            companyId,
            question,
            matchedDocument,
            similarityScore,
            aiResponse,
            responseTime

        ]

    );

};

/*
=========================================================
GET KNOWLEDGE LOGS
=========================================================
*/

const getKnowledgeLogs = async (

    companyId = null

) => {

    let query = `

    SELECT *

    FROM knowledge_logs

    `;

    let values = [];

    if (companyId) {

        query += `

        WHERE company_id=$1

        `;

        values.push(companyId);

    }

    query += `

    ORDER BY created_at DESC

    LIMIT 100

    `;

    const result = await db.query(

        query,

        values

    );

    return result.rows;

};

/*
=========================================================
TOP DOCUMENTS
=========================================================
*/

const getTopDocuments = async (

    companyId = null

) => {

    let query = `

    SELECT

        matched_document,

        COUNT(*) AS total

    FROM knowledge_logs

    `;

    let values = [];

    if (companyId) {

        query += `

        WHERE company_id=$1

        `;

        values.push(companyId);

    }

    query += `

    GROUP BY matched_document

    ORDER BY total DESC

    LIMIT 10

    `;

    const result = await db.query(

        query,

        values

    );

    return result.rows;

};

/*
=========================================================
SEARCH ANALYTICS
=========================================================
*/

const getSearchAnalytics = async (

    companyId = null

) => {

    let query = `

    SELECT

        COUNT(*)::int AS total_searches,

        AVG(similarity_score)::numeric(10,2) AS average_similarity,

        AVG(response_time)::numeric(10,2) AS average_response_time

    FROM knowledge_logs

    `;

    let values = [];

    if (companyId) {

        query += `

        WHERE company_id=$1

        `;

        values.push(companyId);

    }

    const result = await db.query(

        query,

        values

    );

    return result.rows[0];

};

export default {

    createDocument,

    saveChunk,

    getAllChunks,

    keywordSearch,

    getDocuments,

    getDocument,

    deleteChunks,

    deleteDocument,

    updateStatus,

    saveKnowledgeLog,

    getKnowledgeLogs,

    getTopDocuments,

    getSearchAnalytics

};