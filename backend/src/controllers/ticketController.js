/*
=========================================================
TICKET CONTROLLER
=========================================================
*/

import * as ticketService
    from "../services/ticketService.js";


/*
=========================================================
GET TICKETS
=========================================================
*/

export const getTickets = async (
    req,
    res
) => {

    try {

        const tenantId =
            req.user?.tenant_id ||
            req.auth?.tenant_id;


        if (!tenantId) {

            return res.status(401).json({
                success: false,
                code: "TENANT_ID_MISSING",
                message:
                    "Tenant information is missing"
            });

        }


        const tickets =
            await ticketService.getTickets(
                tenantId
            );


        return res.status(200).json({
            success: true,
            tickets
        });

    } catch (error) {

        console.error(
            "Failed to get tickets:",
            error
        );


        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            code:
                error.code ||
                "TICKETS_FETCH_FAILED",
            message:
                error.message ||
                "Failed to fetch tickets"
        });

    }

};


/*
=========================================================
CREATE TICKET
=========================================================
*/

export const createTicket = async (
    req,
    res
) => {

    try {

        const tenantId =
            req.user?.tenant_id ||
            req.auth?.tenant_id;


        if (!tenantId) {

            return res.status(401).json({
                success: false,
                code: "TENANT_ID_MISSING",
                message:
                    "Tenant information is missing"
            });

        }


        const {
            title,
            description
        } = req.body;


        if (
            !title ||
            !String(title).trim()
        ) {

            return res.status(400).json({
                success: false,
                code: "TICKET_TITLE_REQUIRED",
                message:
                    "Ticket title is required"
            });

        }


        if (
            !description ||
            !String(description).trim()
        ) {

            return res.status(400).json({
                success: false,
                code:
                    "TICKET_DESCRIPTION_REQUIRED",
                message:
                    "Ticket description is required"
            });

        }


        const ticket =
            await ticketService.createTicket(
                tenantId,
                {
                    title:
                        String(title).trim(),

                    description:
                        String(description).trim()
                }
            );


        return res.status(201).json({
            success: true,
            message:
                "Ticket created successfully",
            ticket
        });

    } catch (error) {

        console.error(
            "Failed to create ticket:",
            error
        );


        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            code:
                error.code ||
                "TICKET_CREATE_FAILED",
            message:
                error.message ||
                "Failed to create ticket"
        });

    }

};


/*
=========================================================
SAVE TICKET
=========================================================
*/

export const saveTicket = async (
    req,
    res
) => {

    try {

        const tenantId =
            req.user?.tenant_id ||
            req.auth?.tenant_id;


        if (!tenantId) {

            return res.status(401).json({
                success: false,
                code: "TENANT_ID_MISSING",
                message:
                    "Tenant information is missing"
            });

        }


        const {
            ticketNumber
        } = req.params;


        if (
            !ticketNumber ||
            !String(ticketNumber).trim()
        ) {

            return res.status(400).json({
                success: false,
                code:
                    "TICKET_NUMBER_REQUIRED",
                message:
                    "Ticket number is required"
            });

        }


        const {
            title,
            description,
            status,
            assignedTo,
            channel,
            note
        } = req.body;


        if (
            !title ||
            !String(title).trim()
        ) {

            return res.status(400).json({
                success: false,
                code: "TICKET_TITLE_REQUIRED",
                message:
                    "Ticket title is required"
            });

        }


        if (
            !description ||
            !String(description).trim()
        ) {

            return res.status(400).json({
                success: false,
                code:
                    "TICKET_DESCRIPTION_REQUIRED",
                message:
                    "Ticket description is required"
            });

        }


        const ticket =
            await ticketService.saveTicket(
                tenantId,
                String(ticketNumber).trim(),
                {
                    title:
                        String(title).trim(),

                    description:
                        String(description).trim(),

                    status,

                    assignedTo,

                    channel,

                    note
                }
            );


        return res.status(200).json({
            success: true,
            message:
                "Ticket updated successfully",
            ticket
        });

    } catch (error) {

        console.error(
            "Failed to save ticket:",
            error
        );


        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            code:
                error.code ||
                "TICKET_UPDATE_FAILED",
            message:
                error.message ||
                "Failed to update ticket"
        });

    }

};
