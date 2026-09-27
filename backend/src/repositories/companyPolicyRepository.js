import pool from "../config/db.js";


/*
==========================================
INSERT PDF CHUNK
==========================================
*/

export const insertChunk = async (

    fileName,

    chunk,

    chunkIndex

) => {

    return await pool.query(

        `
        INSERT INTO document_chunks
        (

            file_name,

            chunk_text,

            chunk_index

        )

        VALUES

        (

            $1,

            $2,

            $3

        )
        `,

        [

            fileName,

            chunk,

            chunkIndex

        ]

    );

};



/*
==========================================
GET ALL
==========================================
*/

export const getAllChunks = async () => {

    const result = await pool.query(

        `
        SELECT *

        FROM document_chunks

        ORDER BY

            file_name,

            chunk_index
        `

    );

    return result.rows;

};



/*
==========================================
DELETE
==========================================
*/

export const deleteChunks = async (

    fileName

) => {

    await pool.query(

        `
        DELETE

        FROM document_chunks

        WHERE file_name=$1
        `,

        [

            fileName

        ]

    );

};



/*
==========================================
SMART RAG SEARCH
==========================================
*/

export const searchChunks = async (

    question

) => {

    const keywords = question

        .toLowerCase()

        .replace(/[^\w\s]/g, "")

        .split(/\s+/)

        .filter(

            word => word.length > 2

        );



    if (

        keywords.length === 0

    ) {

        return [];

    }



    const conditions = keywords.map(

        (_, index) =>

            `chunk_text ILIKE $${index + 1}`

    );



    const values = keywords.map(

        word => `%${word}%`

    );



    const result = await pool.query(

        `
        SELECT *

        FROM document_chunks

        WHERE

        ${conditions.join(" OR ")}

        ORDER BY

        file_name,

        chunk_index

        LIMIT 8
        `,

        values

    );



    return result.rows;

};