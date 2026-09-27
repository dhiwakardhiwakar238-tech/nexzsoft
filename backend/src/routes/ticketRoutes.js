/*
=========================================================
TICKET ROUTES
=========================================================
*/

import express from "express";

import {
    getTickets,
    createTicket,
    saveTicket
} from "../controllers/ticketController.js";

import {
    authenticateToken
} from "../middleware/requestAuthorizer.js";


const router =
    express.Router();


/*
=========================================================
GET ALL TICKETS
=========================================================

GET /api/tickets
*/

router.get(
    "/",
    authenticateToken,
    getTickets
);


/*
=========================================================
CREATE TICKET
=========================================================

POST /api/tickets
*/

router.post(
    "/",
    authenticateToken,
    createTicket
);


/*
=========================================================
UPDATE TICKET
=========================================================

PUT /api/tickets/:ticketNumber
*/

router.put(
    "/:ticketNumber",
    authenticateToken,
    saveTicket
);


export default router;
