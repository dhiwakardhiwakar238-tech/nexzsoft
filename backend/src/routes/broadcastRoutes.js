import express from "express";
import broadcastController from "../controllers/broadcastController.js";

const router = express.Router();

/* =========================================================
   GET TENANT BROADCASTS
========================================================= */

/**
 * @swagger
 * /api/broadcasts/tenant/{tenantId}:
 *   get:
 *     summary: Get tenant broadcasts
 *     description: Retrieve all broadcasts for a tenant.
 *     tags:
 *       - Broadcasts
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         description: Unique identifier of the tenant.
 *         schema:
 *           type: string
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Broadcasts retrieved successfully.
 *       404:
 *         description: Tenant or broadcasts not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/broadcasts/tenant/:tenantId",
    broadcastController.getBroadcasts
);


/* =========================================================
   GET BROADCAST DETAILS
========================================================= */

/**
 * @swagger
 * /api/broadcasts/tenant/{tenantId}/{id}:
 *   get:
 *     summary: Get broadcast details
 *     description: Retrieve details of a specific broadcast.
 *     tags:
 *       - Broadcasts
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         description: Unique identifier of the tenant.
 *         schema:
 *           type: string
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the broadcast.
 *         schema:
 *           type: string
 *         example: "660e8400-e29b-41d4-a716-446655440111"
 *     responses:
 *       200:
 *         description: Broadcast details retrieved successfully.
 *       404:
 *         description: Broadcast not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/broadcasts/tenant/:tenantId/:id",
    broadcastController.getBroadcastDetails
);

export default router;