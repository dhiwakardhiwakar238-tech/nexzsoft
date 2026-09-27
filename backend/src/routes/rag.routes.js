/*
 * RAG Routes
 *
 * Defines the API endpoints related to RAG.
 */

import express from "express";

import {
    askQuestion
} from "../controllers/ragController.js";

import { authenticateToken } from "../middleware/requestAuthorizer.js"

const router = express.Router();


/*
 * Ask a question against the tenant's documents.
 */

/**
 * @swagger
 * /api/rag/ask:
 *   post:
 *     summary: Ask a question against tenant documents
 *     description: Sends a question to the RAG system and returns an answer.
 *     tags:
 *       - RAG
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: Question to ask the RAG system
 *                 example: How long does a refund take?
 *
 *     responses:
 *       200:
 *         description: Successful response
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */
router.post(
  "/ask",
  authenticateToken,
  askQuestion
);


export default router;