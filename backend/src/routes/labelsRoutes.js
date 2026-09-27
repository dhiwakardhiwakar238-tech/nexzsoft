import express from "express";

import {
    getLabels,
    addLabel,
    deleteLabel
} from "../controllers/labelsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/customer-labels:
 *   get:
 *     summary: Get customer labels
 *     tags:
 *       - Customer Labels
 *     responses:
 *       200:
 *         description: Customer labels retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getLabels);


/**
 * @swagger
 * /api/customer-labels:
 *   post:
 *     summary: Add customer label
 *     tags:
 *       - Customer Labels
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: VIP
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Customer label created successfully.
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Internal server error.
 */
router.post("/", addLabel);


/**
 * @swagger
 * /api/customer-labels/{id}:
 *   delete:
 *     summary: Delete customer label
 *     tags:
 *       - Customer Labels
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the customer label.
 *         schema:
 *           type: string
 *         example: "123"
 *     responses:
 *       200:
 *         description: Customer label deleted successfully.
 *       404:
 *         description: Customer label not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteLabel);

export default router;