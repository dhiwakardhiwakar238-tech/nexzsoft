import express from "express";
import axios from "axios";

import db from "../config/db.js";
import { sendTemplate } from "../services/whatsappService.js";
import { getIO } from "../config/socket.js";
import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../utils/apiError.js";


const router = express.Router();
const DEFAULT_COUNTRY_CODE = "91";

/*
==================================================
GET OR CREATE CONVERSATION
==================================================
*/

const getOrCreateConversation = async (
    tenantId,
    phone
) => {
    if (!tenantId) {
        throw new Error("TENANT ID IS REQUIRED");
    }

    if (!phone) {
        throw new Error("PHONE IS REQUIRED");
    }

    /*
    ----------------------------------------------
    GET EXISTING CONVERSATION
    ----------------------------------------------
    */

    const existing = await db.query(
        `
        SELECT id
        FROM conversations
        WHERE
            tenant_id = $1
            AND customer_number = $2
        ORDER BY updated_at DESC
        LIMIT 1
        `,
        [
            tenantId,
            phone
        ]
    );

    if (existing.rows.length) {
        return existing.rows[0].id;
    }

    /*
    ----------------------------------------------
    CREATE NEW CONVERSATION
    ----------------------------------------------

    IMPORTANT:
    Your local conversations schema does NOT
    contain unread_count.
    ----------------------------------------------
    */

    const conversationId = uuidv4();

    const result = await db.query(
        `
        INSERT INTO conversations
        (
            id,
            tenant_id,
            customer_number,
            status,
            started_at,
            updated_at,
            unread_count
        )
        VALUES
        (
            $1,
            $2,
            $3,
            'open',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            0
        )
        ON CONFLICT
        (
            tenant_id,
            customer_number
        )
        DO UPDATE
        SET updated_at = NOW()
        RETURNING id
        `,
        [
            conversationId,
            tenantId,
            phone
        ]
    );

    return result.rows[0].id;
};

/*
==================================================
GET META TEMPLATES
==================================================
*/

router.get(
    "/templates",
    async (req, res, next) => {
        try {
            const wabaId =
                process.env.WABA_ID;

            const accessToken =
                process.env.META_ACCESS_TOKEN;

            if (!wabaId) {
                return next(new ApiError(
                    500,
                    "META_WABA_ID_NOT_CONFIGURED",
                    "WhatsApp Business Account configuration is missing."
                ));
            }

            if (!accessToken) {
                return next(new ApiError(
                    500,
                    "META_ACCESS_TOKEN_NOT_CONFIGURED",
                    "WhatsApp Meta configuration is incomplete."
                ));
            }

            const response = await axios.get(
                `https://graph.facebook.com/v23.0/${wabaId}/message_templates`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`
                    },
                    timeout: 30000
                }
            );

            const localTenantId = req.user?.tenant_id;

            const localTemplatesResult = localTenantId
                ? await db.query(
                    `
                    SELECT name, media_id
                    FROM whatsapp_templates
                    WHERE tenant_id = $1
                    `,
                    [localTenantId]
                )
                : { rows: [] };

            const localMediaByName = new Map(
                localTemplatesResult.rows.map((row) => [
                    String(row.name || "").toLowerCase(),
                    row.media_id || null
                ])
            );

            const templates =
                Array.isArray(response.data?.data)
                    ? response.data.data
                        .filter(
                            (template) =>
                                template?.status === "APPROVED"
                        )
                        .map((template) => ({
                            id: template.id,
                            name: template.name,
                            category: template.category,
                            language: template.language,
                            status: template.status,
                            media_id:
                                localMediaByName.get(
                                    String(template.name || "").toLowerCase()
                                ) || null,
                            components: template.components || []
                        }))
                    : [];

            return res.json(templates);
        } catch (err) {
            console.error(
                "GET META TEMPLATES ERROR:",
                err.response?.data ||
                err.message ||
                err
            );

            return next(err);
        }
    }
);

/*
==================================================
SEND BROADCAST
==================================================
*/

router.post(
    "/send-broadcast",
    async (req, res, next) => {
        try {
            const {
                tenantId,
                templateName,
                recipients,
                audience,
                language,
                campaignName,
                components,
                variables,
                recipientVariables
            } = req.body;

            /*
            ==============================================
            VALIDATION
            ==============================================
            */

            if (!tenantId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Tenant ID is required"
                });
            }

            if (
                !templateName ||
                !String(templateName).trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Template name is required"
                });
            }

            if (
                !Array.isArray(recipients) ||
                recipients.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Recipients are required"
                });
            }

            const cleanTemplateName =
                String(templateName).trim();

            const templateLanguage =
                language ||
                "en_US";

            const broadcastComponents =
                Array.isArray(components)
                    ? components
                    : [];

            const defaultVariables =
                variables &&
                typeof variables === "object" &&
                !Array.isArray(variables)
                    ? variables
                    : {};

            const perRecipientVariables =
                recipientVariables &&
                typeof recipientVariables === "object" &&
                !Array.isArray(recipientVariables)
                    ? recipientVariables
                    : {};

            /*
            ==============================================
            CREATE BROADCAST
            ==============================================
            */

            const broadcastId =
                uuidv4();

            await db.query(
                `
                INSERT INTO broadcasts
                (
                    id,
                    tenant_id,
                    campaign_name,
                    template_name,
                    audience,
                    total_recipients,
                    success_count,
                    failed_count,
                    status,
                    read_count,
                    components,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    0,
                    0,
                    'PROCESSING',
                    0,
                    $7,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                )
                `,
                [
                    broadcastId,
                    tenantId,
                    campaignName ||
                        "Untitled Campaign",
                    cleanTemplateName,
                    audience ||
                        "Selected Contacts",
                    recipients.length,
                    JSON.stringify(
                        broadcastComponents
                    )
                ]
            );

            let successCount = 0;
            let failedCount = 0;

            /*
            ------------------------------------------
            NORMALIZE PHONE NUMBER
            ------------------------------------------
            */
            
            const normalizePhoneNumber = (phone) => {
            
                if (
                    phone === null ||
                    phone === undefined
                ) {
                    return null;
                }
            
                let normalizedPhone =
                    String(phone)
                        .trim()
                        .replace(/\D/g, "");
            
                if (!normalizedPhone) {
                    return null;
                }
            
                /*
                ------------------------------------------
                COUNTRY CODE
                ------------------------------------------
            
                If the number does not already start
                with the configured country code and
                contains only a local 10-digit number,
                prepend the default country code.
                */
            
                if (
                    !normalizedPhone.startsWith(
                        DEFAULT_COUNTRY_CODE
                    ) &&
                    normalizedPhone.length === 10
                ) {
                    normalizedPhone =
                        DEFAULT_COUNTRY_CODE +
                        normalizedPhone;
                }
            
                return normalizedPhone;
            };

            /*
            ==============================================
            SEND LOOP
            ==============================================
            */

            for (
                const recipient of recipients
            ) {
                let phone = null;

                let currentVariables = {
                    ...defaultVariables
                };

                /*
                ------------------------------------------
                STRING / NUMBER RECIPIENT
                ------------------------------------------
                */

                if (
                    typeof recipient === "string" ||
                    typeof recipient === "number"
                ) {
                    phone =
                        String(recipient).trim();

                    const specificVariables =
                        perRecipientVariables[
                            String(phone)
                        ];

                    if (
                        specificVariables &&
                        typeof specificVariables ===
                            "object" &&
                        !Array.isArray(
                            specificVariables
                        )
                    ) {
                        currentVariables = {
                            ...specificVariables
                        };
                    }
                }

                /*
                ------------------------------------------
                OBJECT RECIPIENT
                ------------------------------------------
                */

                else if (
                    recipient &&
                    typeof recipient === "object"
                ) {
                    phone =
                        recipient.phone ||
                        recipient.whatsapp_number ||
                        recipient.number ||
                        recipient.mobile ||
                        null;

                    if (
                        recipient.variables &&
                        typeof recipient.variables ===
                            "object" &&
                        !Array.isArray(
                            recipient.variables
                        )
                    ) {
                        currentVariables = {
                            ...recipient.variables
                        };
                    } else if (phone) {
                        const specificVariables =
                            perRecipientVariables[
                                String(phone)
                            ];

                        if (
                            specificVariables &&
                            typeof specificVariables ===
                                "object"
                        ) {
                            currentVariables = {
                                ...specificVariables
                            };
                        }
                    }
                }

                if (!phone) {
                    failedCount++;

                    console.error(
                        "INVALID PHONE:",
                        recipient
                    );

                    await db.query(
                        `
                        INSERT INTO broadcast_logs
                        (
                            id,
                            broadcast_id,
                            phone,
                            status,
                            meta_message_id,
                            error,
                            created_at
                        )
                        VALUES
                        (
                            $1,
                            $2,
                            $3,
                            'FAILED',
                            NULL,
                            $4,
                            CURRENT_TIMESTAMP
                        )
                        `,
                        [
                            uuidv4(),
                            broadcastId,
                            "",
                            JSON.stringify({
                                message:
                                    "Invalid phone number"
                            })
                        ]
                    );

                    continue;
                }

                /*
                ------------------------------------------
                NORMALIZE PHONE
                ------------------------------------------
                */

                const normalizedPhone =
                    normalizePhoneNumber(phone);

                if (!normalizedPhone) {
                    failedCount++;

                    await db.query(
                        `
                        INSERT INTO broadcast_logs
                        (
                            id,
                            broadcast_id,
                            phone,
                            status,
                            meta_message_id,
                            error,
                            created_at
                        )
                        VALUES
                        (
                            $1,
                            $2,
                            $3,
                            'FAILED',
                            NULL,
                            $4,
                            CURRENT_TIMESTAMP
                        )
                        `,
                        [
                            uuidv4(),
                            broadcastId,
                            String(phone),
                            JSON.stringify({
                                message:
                                    "Invalid phone number"
                            })
                        ]
                    );

                    continue;
                }

                /*
                ------------------------------------------
                GET / CREATE CONVERSATION
                ------------------------------------------
                */

                let conversationId = null;

                try {
                    conversationId =
                        await getOrCreateConversation(
                            tenantId,
                            normalizedPhone
                        );
                } catch (conversationError) {
                    failedCount++;

                    console.error(
                        "CONVERSATION ERROR:",
                        conversationError
                    );

                    await db.query(
                        `
                        INSERT INTO broadcast_logs
                        (
                            id,
                            broadcast_id,
                            phone,
                            status,
                            meta_message_id,
                            error,
                            created_at
                        )
                        VALUES
                        (
                            $1,
                            $2,
                            $3,
                            'FAILED',
                            NULL,
                            $4,
                            CURRENT_TIMESTAMP
                        )
                        `,
                        [
                            uuidv4(),
                            broadcastId,
                            normalizedPhone,
                            JSON.stringify({
                                message:
                                    conversationError.message
                            })
                        ]
                    );

                    continue;
                }

                console.log("==================================");
                console.log("TENANT ID :",tenantId);
                console.log("PHONE :",normalizedPhone);
                console.log("TEMPLATE :",cleanTemplateName);
                console.log("CONVERSATION ID :",conversationId);
                console.log("==================================");

                /*
                ------------------------------------------
                SEND WHATSAPP TEMPLATE
                ------------------------------------------

                sendTemplate signature:
                (
                    tenantId,
                    to,
                    templateName,
                    language,
                    components,
                    variables
                )
                */

                let result;

                try {
                    result =
                        await sendTemplate(
                            tenantId,
                            normalizedPhone,
                            cleanTemplateName,
                            templateLanguage,
                            broadcastComponents,
                            currentVariables
                        );
                } catch (sendError) {
                    result = {
                        success: false,
                        error: {
                            message:
                                sendError.message
                        }
                    };
                }

                const metaMessageId =
                    result?.messageId ||
                    result?.data?.messages?.[0]?.id ||
                    null;

                console.log(
                    "Phone Number & Message ID:",
                    normalizedPhone
                );

                console.log(
                    metaMessageId
                );

                /*
                ==========================================
                SUCCESS
                ==========================================
                */

                let savedMessage = null;

                if (result?.success) {
                    successCount++;

                    /*
                    --------------------------------------
                    MESSAGES TABLE

                    Actual schema:
                    id	
                    conversation_id	
                    sender	
                    message	
                    message_type	
                    status	
                    metadata	
                    created_at	
                    updated_at	
                    whatsapp_message_id	
                    meta_message_id	
                    broadcast_id	
                    phone	
                    error	
                    tenant_id	
                    variables
                    --------------------------------------
                    */

                    const insertRes = await db.query(
                        `
                        INSERT INTO messages
                        (
                            id,
                            conversation_id,
                            sender,
                            message,
                            message_type,
                            status,
                            metadata,
                            broadcast_id,
                            whatsapp_message_id,
                            tenant_id,
                            phone,
                            created_at
                        )
                        VALUES
                        (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5,
                            $6,
                            $7,
                            $8,
                            $9,
                            $10,
                            $11,
                            CURRENT_TIMESTAMP
                        )
                        `,
                        [
                            uuidv4(),
                            conversationId,
                            "agent",
                            `📢 Broadcast Sent: ${cleanTemplateName}`,
                            "template",
                            "sent",
                            JSON.stringify({
                                broadcast_id:
                                    broadcastId,
                                phone:
                                    normalizedPhone,
                                whatsapp_message_id:
                                    metaMessageId,
                                template_name:
                                    cleanTemplateName,
                                language:
                                    templateLanguage,
                                variables:
                                    currentVariables
                            }),
                            broadcastId,
                            metaMessageId,
                            tenantId,
                            normalizedPhone
                        ]
                    );
                    savedMessage = insertRes.rows[0];

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
                        `,
                        [
                            `📢 Broadcast Sent: ${cleanTemplateName}`,
                            conversationId
                        ]
                    );
                }

                /*
                ==========================================
                FAILED
                ==========================================
                */

                else {
                    failedCount++;

                    const errorPayload =
                        result?.error ||
                        {
                            message:
                                "Unknown WhatsApp error"
                        };

                    /*
                    --------------------------------------
                    MESSAGES TABLE
                    --------------------------------------
                    */

                    const insertRes = await db.query(
                        `
                        INSERT INTO messages
                        (
                            id,
                            conversation_id,
                            sender,
                            message,
                            message_type,
                            status,
                            metadata,
                            broadcast_id,
                            whatsapp_message_id,
                            tenant_id,
                            phone,
                            error,
                            created_at
                        )
                        VALUES
                        (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5,
                            $6,
                            $7,
                            $8,
                            $9,
                            $10,
                            $11,
                            $12,
                            CURRENT_TIMESTAMP
                        )
                        `,
                        [
                            uuidv4(),
                            conversationId,
                            "agent",
                            `📢 Broadcast Failed: ${cleanTemplateName}`,
                            "template",
                            "failed",
                            JSON.stringify({
                                broadcast_id:
                                    broadcastId,
                                phone:
                                    normalizedPhone,
                                template_name:
                                    cleanTemplateName,
                                language:
                                    templateLanguage,
                                variables:
                                    currentVariables,
                                error:
                                    errorPayload
                            }),
                            broadcastId,
                            "Msg failed",
                            tenantId,
                            normalizedPhone,
                            JSON.stringify(
                                errorPayload
                            )
                        ]
                    );
                    savedMessage = insertRes.rows[0];

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
                        `,
                        [
                            `📢 Broadcast Failed: ${cleanTemplateName}`,
                            conversationId
                        ]
                    );
                }
                /*
                --------------------------------------
                WEBSOCKET: EMIT EACH OUTGOING BROADCAST MESSAGE
                --------------------------------------
                */
                try {
                    const io = getIO();
                    io.emit("new_message", {
                        tenantId,
                        broadcastId,
                        phone,
                        status: result.success ? "SUCCESS" : "FAILED",
                        message: savedMessage
                    });
                } catch (err) {
                    console.log("Socket emit error:", err.message);
                }
            }

            /*
            ==============================================
            FINAL BROADCAST STATUS
            ==============================================
            */

            let finalStatus = "FAILED";

            if (
                successCount ===
                recipients.length
            ) {
                finalStatus = "COMPLETED";
            } else if (
                successCount > 0 &&
                failedCount > 0
            ) {
                finalStatus = "PARTIAL";
            }

            /*
            ==============================================
            UPDATE BROADCAST
            ==============================================
            */

            const updatedBroadcast = await db.query(
                `
                UPDATE broadcasts
                SET
                    success_count = $1,
                    failed_count = $2,
                    status = $3,
                    updated_at = CURRENT_TIMESTAMP
                WHERE
                    id = $4
                    AND tenant_id = $5
                `,
                [
                    successCount,
                    failedCount,
                    finalStatus,
                    broadcastId,
                    tenantId
                ]
            );

            /*
            ==============================================
            WEBSOCKET: EMIT OVERALL BROADCAST COMPLETION
            ==============================================
            */
            try {
                const io = getIO();
                io.emit("broadcast_updated", {
                    tenantId,
                    broadcast: updatedBroadcast.rows[0]
                });
            } catch (err) {
                console.log("Socket emit error:", err.message);
            }

            /*
            ==============================================
            RESPONSE
            ==============================================
            */

            return res.json({
                success: true,
                broadcastId,
                status: finalStatus,
                totalRecipients:
                    recipients.length,
                successCount,
                failedCount
            });
        } catch (err) {
            console.error(
                "SEND BROADCAST ERROR"
            );

            console.error(
                err?.response?.data ||
                err?.message ||
                err
            );

            return next(err);
        }
    }
);

export default router;
