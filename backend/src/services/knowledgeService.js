import fs from "fs";
import path from "path";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import repository from "../repositories/knowledgeRepository.js";

import parser from "./documentParserService.js";
import chunkService from "./chunkService.js";
import embeddingService from "./embeddingService.js";

/*
=====================================================
UPLOAD DOCUMENT
=====================================================
*/

const uploadDocument = async (

    file,

    companyId = null,

    companyName = null

) => {

    if (!file) {

        throw new Error("No file uploaded");

    }

    console.log("=================================");
    console.log("KNOWLEDGE UPLOAD START");
    console.log("=================================");

    /*
    =====================================
    UPLOAD FOLDER
    =====================================
    */

    const uploadDir = path.resolve("src/uploads/knowledge");

    if (!fs.existsSync(uploadDir)) {

        fs.mkdirSync(uploadDir, {

            recursive: true

        });

    }

    /*
    =====================================
    FILE NAME
    =====================================
    */

    const safeName =

        Date.now() +

        "_" +

        file.originalname.replace(/\s+/g, "_");

    const finalPath =

        path.join(uploadDir, safeName);

    /*
    =====================================
    SAVE FILE
    =====================================
    */

    let pdfBuffer;

    if (file.buffer) {

        pdfBuffer = file.buffer;

        fs.writeFileSync(finalPath, pdfBuffer);

    }

    else {

        pdfBuffer = fs.readFileSync(file.path);

        fs.renameSync(file.path, finalPath);

    }

    /*
    =====================================
    FILE HASH
    =====================================
    */

    const fileHash = crypto

        .createHash("sha256")

        .update(pdfBuffer)

        .digest("hex");

    /*
    =====================================
    DOCUMENT ID
    =====================================
    */

    const documentId = uuidv4();

    /*
    =====================================
    EXTRACT TEXT
    =====================================
    */

    console.log("Extracting Text...");

    const text = await parser.extractText(

        finalPath,

        file.mimetype

    );

    console.log("TEXT LENGTH =", text.length);

    /*
    =====================================
    CREATE DOCUMENT
    =====================================
    */

    const document = await repository.createDocument(

        documentId,

        companyId,

        companyName,

        file.originalname,

        safeName,

        file.mimetype,

        finalPath,

        fileHash

    );

    /*
    =====================================
    SPLIT CHUNKS
    =====================================
    */

    const chunks = chunkService.chunkText(text);

    console.log("TOTAL CHUNKS =", chunks.length);

    /*
    =====================================
    SAVE CHUNKS
    =====================================
    */

    for (

        let i = 0;

        i < chunks.length;

        i++

    ) {

        console.log(`Embedding ${i + 1}/${chunks.length}`);

        const embedding =

            await embeddingService.generateEmbedding(

                chunks[i]

            );

        await repository.saveChunk(

            uuidv4(),

            document.id,

            i,

            chunks[i],

            embedding

        );

    }

    /*
    =====================================
    READY
    =====================================
    */

    await repository.updateStatus(

        document.id,

        "READY"

    );

    console.log("UPLOAD COMPLETED");

    return document;

};

/*
=====================================================
DELETE DOCUMENT
=====================================================
*/

const deleteDocument = async (documentId) => {

    console.log("DELETE DOCUMENT");

    const doc = await repository.getDocument(documentId);

    if (!doc) {

        throw new Error("Document Not Found");

    }

    if (

        doc.file_path &&

        fs.existsSync(doc.file_path)

    ) {

        fs.unlinkSync(doc.file_path);

    }

    await repository.deleteChunks(documentId);

    await repository.deleteDocument(documentId);

    return {

        success: true

    };

};

/*
=====================================================
LIST DOCUMENTS
=====================================================
*/

const getDocuments = async () => {

    return await repository.getDocuments();

};

/*
=====================================================
REINDEX DOCUMENT
=====================================================
*/

const reIndexDocument = async (documentId) => {

    const doc = await repository.getDocument(documentId);

    if (!doc) {

        throw new Error("Document Missing");

    }

    console.log("REINDEX START");

    await repository.deleteChunks(documentId);

    const text = await parser.extractText(

        doc.file_path,

        doc.file_type

    );

    const chunks = chunkService.chunkText(text);

    for (

        let i = 0;

        i < chunks.length;

        i++

    ) {

        const embedding =

            await embeddingService.generateEmbedding(

                chunks[i]

            );

        await repository.saveChunk(

            uuidv4(),

            documentId,

            i,

            chunks[i],

            embedding

        );

    }

    await repository.updateStatus(

        documentId,

        "READY"

    );

    console.log("REINDEX DONE");

    return {

        success: true

    };

};

export default {

    uploadDocument,

    deleteDocument,

    getDocuments,

    reIndexDocument

};