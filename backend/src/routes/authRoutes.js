import express from "express";
import * as controller from "../controllers/authController.js";
import {
    authenticateToken
} from "../middleware/requestAuthorizer.js";

const router = express.Router();

/*

 Tenant registration endpoint
 Expected request body:
 {
   "name": "John Doe",
   "business_name": "John's Business",
   "whatsapp_number": "+1234567890",
   "email": "john.doe@example.com",
   "password": "securepassword"
 }

*/

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Tenant login
 *     tags:
 *       - Authentication
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", controller.login);

/*

 Tenant login endpoint

 Expected request body:
 {
   "email": "john.doe@example.com",
   "password": "securepassword"
 }

*/

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new tenant
 *     tags:
 *       - Authentication
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - business_name
 *               - whatsapp_number
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               business_name:
 *                 type: string
 *                 example: John's Business
 *               whatsapp_number:
 *                 type: string
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword
 *     responses:
 *       201:
 *         description: Tenant registered successfully
 *       400:
 *         description: Invalid request
 */
router.post("/register", controller.register);

/*
==================================================
DEACTIVATE ACCOUNT
==================================================

Protected endpoint.

The tenant_id is taken from the
authenticated JWT:

req.user.tenant_id

The frontend does NOT provide the tenant ID.
==================================================
*/

router.delete(
    "/account",
    authenticateToken,
    controller.deactivateAccount
);

export default router;
