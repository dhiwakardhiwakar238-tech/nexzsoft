import storageService from "./docman.storage.js";

import documentRepository from "../../repositories/docman/docmanRepository.js"

import documentParserService from "./docman.parser.js";

import { chunkDocument } from "./document.chunker.js";

import { randomUUID } from "crypto";

import embeddingService from "../rag/embedding.service.js";


async function uploadFile(file, user) {

    if (!file) {
        throw new Error("No file uploaded");
    }

    console.log(user)

    const tenantId = user.tenant_id;

    // Check existing document
    const exists = await documentRepository.hasDocuments(tenantId);

    if (exists) {
        throw new Error("DOCUMENT_ALREADY_EXISTS");
    }

    const documentId = randomUUID();

    const storageKey = `${user.tenant_id}/${documentId}/${file.originalname}`;

    // upload the document into S3
    await storageService.uploadDocument(file, storageKey);

    // Parse uploaded file
    const parsedText = await documentParserService.parseDocument(file);

    // Create document object
    const document = {
        documentId,
        tenantId,
        fileName: file.originalname,
        fileType: file.mimetype,
        storageKey,
        status: "UPLOADED",
        content: parsedText
    };

    // Store document metadata
    await documentRepository.createDocument(document);


    console.log("Extracted text:", parsedText);

    // Chunk document
    const chunks = chunkDocument(parsedText);

    console.log(`Created ${chunks.length} chunks`);


    // Generate embedding and store each chunk
    for (const chunk of chunks) {

        const embedding = await embeddingService.generateDocumentEmbedding(
            chunk.chunkText
        );

        await documentRepository.createChunk({
            documentId: document.documentId,
            tenantId: document.tenantId,
            chunkNumber: chunk.chunkNumber,
            chunkText: chunk.chunkText,
            embedding,
            metadata: {
                fileName: file.originalname,
                fileType: file.mimetype,
                chunkNumber: chunk.chunkNumber
            }
        });
    }

    return document.documentId;
}



const deleteDocument = async (documentId, user) => {

    try {

        documentRepository.get
        storageService.deleteDocument(storageKey);


        const storageKey = documentRepository.deleteDocument(documentId, user.tenantId);
        
        return {
            success: true,
            message: "Document deleted successfully"
        };
    }
    catch (error) {
        console.error("Delete document error:", error);
        throw error;
    }
}
export default {
    uploadFile
}