import db from "../config/db.js";
import * as whatsappService from "../services/whatsappService.js";
import { getIO } from "../config/socket.js";
import { ApiError, unauthorized, forbidden } from "../utils/apiError.js";

/*
==================================================
GET VERIFIED TENANT ID
==================================================

IMPORTANT:
Never trust tenantId coming from frontend.

The authenticated JWT is the source of truth.
==================================================
*/

const getAuthenticatedTenantId = (req) => {

    return req.user?.tenant_id || null;

};

/*
==================================================
CHECK REQUESTED TENANT
==================================================

If frontend sends a tenantId, it must match
the tenant_id inside the verified JWT.

This prevents:

Tenant A JWT
+
Tenant B tenantId
=
403 Forbidden
==================================================
*/

const validateTenantAccess = (
    req,
    requestedTenantId
) => {

    const authenticatedTenantId =
        getAuthenticatedTenantId(req);

    if (!authenticatedTenantId) {

        return {
            allowed: false,
            status: 401,
            message:
                "Unauthorized. Tenant information is missing from token."
        };

    }

    /*
    If a tenantId was supplied by frontend,
    compare it with JWT tenant_id.
    */

    if (
        requestedTenantId &&
        String(requestedTenantId) !==
        String(authenticatedTenantId)
    ) {

        return {
            allowed: false,
            status: 403,
            message:
                "Forbidden. You are not authorized to access this tenant."
        };

    }

    return {
        allowed: true,
        tenantId: authenticatedTenantId
    };

};


/*
==================================================
SEND WHATSAPP MESSAGE
==================================================
*/

export const sendWhatsAppMessage = async (
    req,
    res,
    next
) => {

    try {

        const {
            tenantId,
            to,
            message,
            conversationId
        } = req.body;

        /*
        ------------------------------------------
        JWT TENANT
        ------------------------------------------
        */

        const access =
            validateTenantAccess(
                req,
                tenantId
            );

        if (!access.allowed) {

            return res.status(
                access.status
            ).json({

                success: false,

                message:
                    access.message

            });

        }

        /*
        IMPORTANT:
        Use JWT tenant_id.
        Do not use frontend tenantId.
        */

        const authenticatedTenantId =
            access.tenantId;


        if (!to || !message) {

            return res.status(400).json({

                success: false,

                message:
                    "Phone number and message are required"

            });

        }


        /*
        ------------------------------------------
        CONVERSATION OWNERSHIP CHECK
        ------------------------------------------
        */

        if (conversationId) {

            const conversationResult =
                await db.query(
                    `
                    SELECT id
                    FROM conversations
                    WHERE id = $1
                    AND tenant_id = $2
                    LIMIT 1
                    `,
                    [
                        conversationId,
                        authenticatedTenantId
                    ]
                );

            if (
                conversationResult.rows.length === 0
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Forbidden. Conversation does not belong to your tenant."

                });

            }

        }


        /*
        ------------------------------------------
        SEND TO META
        ------------------------------------------
        */

        const metaResponse =
            await whatsappService.sendMessage(
                authenticatedTenantId,
                to,
                message
            );

        console.log(
            "META RESPONSE =",
            metaResponse
        );


        /*
        ------------------------------------------
        CHECK META FAILURE
        ------------------------------------------
        */

        if (!metaResponse.success) {

            return next(new ApiError(
                502,
                "WHATSAPP_SEND_FAILED",
                metaResponse.error?.message ||
                    "WhatsApp message could not be sent."
            ));

        }


        const whatsappMessageId =
            metaResponse.data
                ?.messages?.[0]?.id ||
            null;


        let savedMessage = null;


        /*
        ------------------------------------------
        SAVE MESSAGE
        ------------------------------------------
        */

        if (conversationId) {

            const result =
                await db.query(
                    `
                    INSERT INTO messages
                    (
                        conversation_id,
                        sender,
                        message,
                        message_type,
                        status,
                        whatsapp_message_id
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6
                    )
                    RETURNING *
                    `,
                    [
                        conversationId,
                        "agent",
                        message,
                        "text",
                        "sent",
                        whatsappMessageId
                    ]
                );


            savedMessage =
                result.rows[0];


            /*
            --------------------------------------
            UPDATE CONVERSATION
            --------------------------------------
            */

            await db.query(
                `
                UPDATE conversations

                SET
                    last_message = $1,
                    updated_at = CURRENT_TIMESTAMP

                WHERE id = $2
                AND tenant_id = $3
                `,
                [
                    message,
                    conversationId,
                    authenticatedTenantId
                ]
            );


            /*
            --------------------------------------
            SOCKET
            --------------------------------------
            */

            try {

                const io = getIO();

                io.emit(
                    "new_message",
                    {
                        tenantId:
                            authenticatedTenantId,

                        conversationId,

                        message:
                            savedMessage
                    }
                );


                io.emit(
                    "conversation_updated",
                    {
                        tenantId:
                            authenticatedTenantId,

                        conversationId,

                        last_message:
                            message,

                        updated_at:
                            new Date()
                    }
                );

            }
            catch (socketError) {

                console.log(
                    "Socket emit error:",
                    socketError.message
                );

            }

        }


        /*
        ------------------------------------------
        RESPONSE
        ------------------------------------------
        */

        return res.status(200).json({

            success: true,

            message:
                "Message sent successfully",

            whatsapp:
                metaResponse.data,

            db:
                savedMessage

        });

    }
    catch (err) {

        return next(err);

    }

};


/*
==================================================
GET CUSTOMERS
==================================================
*/

export const getCustomers = async (
    req,
    res,
    next
) => {

    try {

        const requestedTenantId =
            req.params.tenantId;


        const access =
            validateTenantAccess(
                req,
                requestedTenantId
            );


        if (!access.allowed) {

            return res.status(
                access.status
            ).json({

                success: false,

                message:
                    access.message

            });

        }


        const tenantId =
            access.tenantId;


        const result =
            await db.query(
                `
                SELECT
                    c.*,
                    cl.name AS label_name

                FROM customers c

                LEFT JOIN customer_labels cl
                    ON c.labels = cl.id

                WHERE c.tenant_id = $1

                ORDER BY c.created_at DESC
                `,
                [
                    tenantId
                ]
            );


        return res.status(200).json({

            success: true,

            total:
                result.rows.length,

            customers:
                result.rows

        });

    }
    catch (err) {

        return next(err);

    }

};


/*
==================================================
GET CONVERSATIONS
==================================================
*/

export const getConversations = async (
    req,
    res,
    next
) => {

    try {

        const requestedTenantId =
            req.params.tenantId;


        const access =
            validateTenantAccess(
                req,
                requestedTenantId
            );


        if (!access.allowed) {

            return res.status(
                access.status
            ).json({

                success: false,

                message:
                    access.message

            });

        }


        const tenantId =
            access.tenantId;


        const result =
            await db.query(
                `
                SELECT *

                FROM conversations

                WHERE tenant_id = $1

                ORDER BY updated_at DESC
                `,
                [
                    tenantId
                ]
            );


        return res.status(200).json({

            success: true,

            total:
                result.rows.length,

            conversations:
                result.rows

        });

    }
    catch (err) {

        return next(err);

    }

};


/*
==================================================
MARK CONVERSATION AS READ
==================================================
*/

export const markConversationRead = async (
    req,
    res,
    next
) => {

    try {

        const {
            conversationId
        } = req.params;


        const tenantId =
            getAuthenticatedTenantId(req);


        if (!tenantId) {

            return res.status(401).json({

                success: false,

                message:
                    "Unauthorized."

            });

        }


        /*
        ------------------------------------------
        UPDATE ONLY IF CONVERSATION BELONGS
        TO AUTHENTICATED TENANT
        ------------------------------------------
        */

        const result =
            await db.query(
                `
                UPDATE conversations

                SET unread_count = 0

                WHERE id = $1
                AND tenant_id = $2

                RETURNING id
                `,
                [
                    conversationId,
                    tenantId
                ]
            );


        if (
            result.rows.length === 0
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Forbidden. Conversation does not belong to your tenant."

            });

        }


        return res.status(200).json({

            success: true

        });

    }
    catch (err) {

        return next(err);

    }

};


/*
==================================================
PAUSE / RESUME AI FOR A SINGLE CONVERSATION

IMPORTANT:
This is scoped to ONE conversation only. It never
touches any other chat's ai_paused flag.
==================================================
*/

export const toggleAiPause = async (
    req,
    res,
    next
) => {

    try {

        const {
            conversationId
        } = req.params;

        const {
            paused
        } = req.body;

        const tenantId =
            getAuthenticatedTenantId(req);

        if (!tenantId) {

            throw unauthorized();

        }


        /*
        ------------------------------------------
        UPDATE ONLY IF CONVERSATION BELONGS
        TO AUTHENTICATED TENANT
        ------------------------------------------
        */

        const result =
            await db.query(
                `
                UPDATE conversations

                SET ai_paused = $1

                WHERE id = $2
                AND tenant_id = $3

                RETURNING id, ai_paused
                `,
                [
                    paused === true,
                    conversationId,
                    tenantId
                ]
            );


        if (
            result.rows.length === 0
        ) {

            throw forbidden(
                "This chat doesn't belong to your account."
            );

        }


        return res.status(200).json({

            success: true,

            ai_paused:
                result.rows[0].ai_paused

        });

    }
    catch (err) {

        /*
        ------------------------------------------
        HAND OFF TO THE COMMON API ERROR PAGE
        (see middleware/errorHandler.js) instead
        of building a one-off response here.
        ------------------------------------------
        */

        return next(err);

    }

};


/*
==================================================
GET MESSAGES
==================================================
*/

export const getMessages = async (
    req,
    res,
    next
) => {

    try {

        const {
            conversationId
        } = req.params;


        const tenantId =
            getAuthenticatedTenantId(req);


        if (!tenantId) {

            return res.status(401).json({

                success: false,

                message:
                    "Unauthorized."

            });

        }


        /*
        ------------------------------------------
        IMPORTANT SECURITY CHECK
        ------------------------------------------

        Do not query messages only by
        conversationId.

        First verify that conversation belongs
        to authenticated tenant.
        ------------------------------------------
        */

        const conversationResult =
            await db.query(
                `
                SELECT id

                FROM conversations

                WHERE id = $1
                AND tenant_id = $2

                LIMIT 1
                `,
                [
                    conversationId,
                    tenantId
                ]
            );


        if (
            conversationResult.rows.length === 0
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Forbidden. Conversation does not belong to your tenant."

            });

        }


        const result =
            await db.query(
                `
                SELECT *

                FROM messages

                WHERE conversation_id = $1

                ORDER BY created_at ASC
                `,
                [
                    conversationId
                ]
            );


        return res.status(200).json({

            success: true,

            total:
                result.rows.length,

            messages:
                result.rows

        });

    }
    catch (err) {

        return next(err);

    }

};
