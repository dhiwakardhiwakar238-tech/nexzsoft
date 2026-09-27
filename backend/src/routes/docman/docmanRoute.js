import express from "express";

import multerConfig from "../../config/multer.config.js";
import controller from "../../controllers/documan/docmanController.js";
import { authenticateToken } from "../../middleware/requestAuthorizer.js";

const router = express.Router();

/*
==================================================
UPLOAD DOCUMENT
==================================================
*/

/**
 * @swagger
 * /api/document/upload:
 *   post:
 *     summary: Upload a document
 *     description: Upload a document to the document management system.
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Document file to upload.
 *     responses:
 *       200:
 *         description: Document uploaded successfully.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
    "/upload",
    authenticateToken,
    multerConfig.uploadMiddleware.single("file"),
    controller.upload
);

/*
==================================================
LIST DOCUMENTS
==================================================
*/

/**
 * @swagger
 * /api/document/documents:
 *   get:
 *     summary: Get documents
 *     description: Retrieve documents belonging to the authenticated tenant.
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents retrieved successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
    "/documents",
    authenticateToken,
    controller.getDocuments
);

/*
==================================================
DELETE DOCUMENT
==================================================
*/

/**
 * @swagger
 * /api/document/documents/{id}:
 *   delete:
 *     summary: Delete a document
 *     description: Delete a document from the document management system.
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the document.
 *         schema:
 *           type: string
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Document deleted successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
    "/documents/:id",
    authenticateToken,
    controller.removeDocument
);

/*
==================================================
REINDEX DOCUMENT
==================================================
*/

/**
 * @swagger
 * /api/document/documents/{id}/reindex:
 *   post:
 *     summary: Reindex a document
 *     description: Reprocess and reindex an existing document.
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the document.
 *         schema:
 *           type: string
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Document reindexed successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
    "/documents/:id/reindex",
    authenticateToken,
    controller.reindex
);

export default router;