import express from "express";

import {
    getCustomerDetails,
    createCustomer,
    addCustomerNote,
    updateCustomer,
    deleteCustomer,
    importCustomer,
    exportCustomers
} from "../controllers/customerController.js";

const router = express.Router();

/* =========================================================
   EXPORT CUSTOMERS

   IMPORTANT:
   This must come BEFORE /:id/details
========================================================= */

/**
 * @swagger
 * /api/customers/export/{tenantId}:
 *   get:
 *     summary: Export customers
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Customers exported successfully
 *       404:
 *         description: Tenant not found
 */
router.get(
    "/export/:tenantId",
    exportCustomers
);


/* =========================================================
   GET ONE CUSTOMER
========================================================= */

/**
 * @swagger
 * /api/customers/{id}/details:
 *   get:
 *     summary: Get customer details
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123"
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully
 *       404:
 *         description: Customer not found
 */
router.get(
    "/:id/details",
    getCustomerDetails
);


/* =========================================================
   CREATE CUSTOMER
========================================================= */

/**
 * @swagger
 * /api/customers/createcustomer:
 *   post:
 *     summary: Create customer
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: John Doe
 *               email: john@example.com
 *               phone: "+1234567890"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Invalid request
 */
router.post(
    "/createcustomer",
    createCustomer
);


/* =========================================================
   UPDATE CUSTOMER
========================================================= */

/**
 * @swagger
 * /api/customers/updatecustomer:
 *   post:
 *     summary: Update customer
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               id: "123"
 *               name: John Doe
 *               email: john@example.com
 *               phone: "+1234567890"
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Customer not found
 */
router.post(
    "/updatecustomer",
    updateCustomer
);


/* =========================================================
   DELETE CUSTOMER
========================================================= */

/**
 * @swagger
 * /api/customers/deletecustomer:
 *   post:
 *     summary: Delete customer
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 */
router.post(
    "/deletecustomer",
    deleteCustomer
);


/* =========================================================
   IMPORT CUSTOMER
========================================================= */

/**
 * @swagger
 * /api/customers/importcustomer:
 *   post:
 *     summary: Import customers
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Customer import file
 *     responses:
 *       200:
 *         description: Customers imported successfully
 *       400:
 *         description: Invalid import file
 */
router.post(
    "/importcustomer",
    importCustomer
);


/* =========================================================
   ADD CUSTOMER NOTE
========================================================= */

/**
 * @swagger
 * /api/customers/{id}/note:
 *   post:
 *     summary: Add customer note
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - note
 *             properties:
 *               note:
 *                 type: string
 *                 example: Customer requested a callback.
 *     responses:
 *       200:
 *         description: Customer note added successfully
 *       404:
 *         description: Customer not found
 */
router.post(
    "/:id/note",
    addCustomerNote
);


export default router;