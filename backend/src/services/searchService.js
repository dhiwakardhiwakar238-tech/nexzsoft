import embeddingService from "./embeddingService.js";
import repository from "../repositories/knowledgeRepository.js";
import { v4 as uuidv4 } from "uuid";

/*
====================================================
COSINE SIMILARITY
====================================================
*/

const cosineSimilarity = (a, b) => {

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {

        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];

    }

    if (normA === 0 || normB === 0)
        return 0;

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));

};

/*
====================================================
HYBRID SEARCH
====================================================
*/

const searchKnowledge = async (



    question,

    companyName = null

) => {

    const startTime = Date.now();

    console.log("=================================");
    console.log("SEARCH START");
    console.log("QUESTION :", question);
    console.log("COMPANY :", companyName);
    console.log("=================================");

    /*
    ===================================
    QUESTION EMBEDDING
    ===================================
    */

    const questionEmbedding =
        await embeddingService.generateEmbedding(question);

    /*
    ===================================
    LOAD ALL CHUNKS
    ===================================
    */

    let allChunks =
        await repository.getAllChunks();

    console.log("TOTAL CHUNKS =", allChunks.length);

    /*
    ===================================
    COMPANY FILTER
    ===================================
    */

    if (companyName && companyName.trim() !== "") {

        allChunks = allChunks.filter(chunk =>

            chunk.company_name &&
            chunk.company_name.toLowerCase().trim() ===
            companyName.toLowerCase().trim()

        );

        console.log("FILTERED CHUNKS =", allChunks.length);

    }

    /*
 ===================================
 EMBEDDING SEARCH
 ===================================
 */

    const scored = [];

    for (const row of allChunks) {

        if (!row.embedding)
            continue;

        let embedding = row.embedding;

        try {

            if (typeof embedding === "string") {

                embedding = JSON.parse(embedding);

            }

            if (!Array.isArray(embedding))
                continue;

            const score = cosineSimilarity(

                questionEmbedding,
                embedding

            );

            scored.push({

                id: row.id,
                document_id: row.document_id,
                title: row.title,
                company_name: row.company_name,
                chunk: row.chunk_text,
                score

            });

        }

        catch (err) {

            console.log("Invalid Embedding :", row.id);

        }

    }

    /*
    ===================================
    KEYWORD SEARCH
    ===================================
    */

    const keywordChunks =

        await repository.keywordSearch(

            question,

            companyName

        );

    console.log(

        "KEYWORD MATCHES =",

        keywordChunks.length

    );

    /*
    ===================================
    MERGE RESULT
    ===================================
    */

    for (const row of keywordChunks) {

        const existing =

            scored.find(

                x => x.id === row.id

            );

        if (existing) {

            existing.score += 0.45;

        }

        else {

            scored.push({

                id: row.id,

                document_id: row.document_id,

                title: row.title,

                company_name: row.company_name,

                chunk: row.chunk_text,

                score: 0.30

            });

        }

    }

    /*
    ===================================
    REMOVE DUPLICATE
    ===================================
    */

    const unique = [];

    const ids = new Set();

    for (const row of scored) {

        if (!ids.has(row.id)) {

            ids.add(row.id);

            unique.push(row);

        }

    }

    /*
    ===================================
    SORT
    ===================================
    */

    unique.sort(

        (a, b) =>

            b.score - a.score

    );

    /*
    ===================================
    DEBUG
    ===================================
    */

    console.log("========== TOP RESULTS ==========");

    unique.slice(0, 5).forEach((x, index) => {

        console.log(

            index + 1,

            x.score.toFixed(3),

            x.title

        );

    });

    /*
    ===================================
    RETURN
    ===================================
    */

    const finalChunks = unique

        .filter(chunk => chunk.score >= 0.35)

        .slice(0, 5);


    console.log("=================================");
    console.log("SEARCH FINISHED");
    console.log("RETURNING =", finalChunks.length);
    console.log("=================================");



    return {

        success: true,

        total: finalChunks.length,

        bestScore:

            finalChunks.length

                ? finalChunks[0].score

                : 0,

        chunks: finalChunks

    };

};

export default {

    searchKnowledge

};