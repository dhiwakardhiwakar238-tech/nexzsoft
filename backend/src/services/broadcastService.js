import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

import { sendTemplate } from "./whatsappService.js";


// ======================================================
// BUILD TEMPLATE SEND COMPONENTS
// ======================================================

const buildStoredTemplateComponents = async ({
    tenantId,
    templateName,
    language,
    suppliedComponents = []
}) => {

    const result = await db.query(
        `
        SELECT
            components,
            media_id
        FROM whatsapp_templates
        WHERE
            tenant_id = $1
            AND name = $2
            AND language = $3
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [
            tenantId,
            templateName,
            language || "en_US"
        ]
    );


    const stored =
        result.rows[0]?.components || [];


    const storedMediaId =
        result.rows[0]?.media_id || null;


    const templateComponents =
        typeof stored === "string"
            ? JSON.parse(stored)
            : stored;


    /*
    IMPORTANT:

    Keep frontend components.

    This preserves:

    BODY variables
    TEXT header variables
    BUTTON URL variables
    */

    const output =
        Array.isArray(suppliedComponents)
            ? JSON.parse(
                JSON.stringify(
                    suppliedComponents
                )
            )
            : [];


    // ==================================================
    // FIND HEADER
    // ==================================================

    const header =
        Array.isArray(templateComponents)
            ? templateComponents.find(
                component =>
                    String(
                        component?.type || ""
                    ).toUpperCase() === "HEADER"
            )
            : null;


    const format =
        String(
            header?.format || ""
        ).toUpperCase();


    console.log(
        "========== TEMPLATE SEND TYPE =========="
    );

    console.log({
        templateName,
        language,
        format,
        mediaId: storedMediaId
    });


    // ==================================================
    // MEDIA HEADER
    // IMAGE / VIDEO / DOCUMENT
    // ==================================================

    if (
        [
            "IMAGE",
            "VIDEO",
            "DOCUMENT"
        ].includes(format)
    ) {

        /*
        IMPORTANT:

        Template creation:

            header_handle
                =
            Meta template approval handle

        Broadcast sending:

            media_id
                =
            actual WhatsApp media ID

        Therefore:

        DO NOT use:

            header.example.header_handle

        Use:

            whatsapp_templates.media_id
        */


        const mediaId =
            storedMediaId || null;


        if (!mediaId) {

            console.error(
                "❌ MEDIA ID NOT FOUND FOR TEMPLATE"
            );

            console.error({
                tenantId,
                templateName,
                language,
                format
            });

        } else {

            const mediaType =
                format.toLowerCase();


            const mediaPayload = {

                type: mediaType,

                [mediaType]: {

                    id:
                        String(mediaId)

                }

            };


            const existingHeaderIndex =
                output.findIndex(
                    component =>
                        String(
                            component?.type || ""
                        ).toLowerCase() === "header"
                );


            const headerComponent = {

                type: "header",

                parameters: [

                    mediaPayload

                ]

            };


            if (
                existingHeaderIndex >= 0
            ) {

                output[
                    existingHeaderIndex
                ] = headerComponent;

            } else {

                output.push(
                    headerComponent
                );

            }


            console.log(
                "✅ MEDIA HEADER COMPONENT:"
            );

            console.log(
                JSON.stringify(
                    headerComponent,
                    null,
                    2
                )
            );

        }

    }


    // ==================================================
    // FINAL COMPONENTS
    // ==================================================

    console.log(
        "========== FINAL TEMPLATE COMPONENTS =========="
    );

    console.log(
        JSON.stringify(
            output,
            null,
            2
        )
    );

    console.log(
        "================================================"
    );


    return output;
};


// ======================================================
// GET CUSTOMERS
// ======================================================

const getCustomers = async (tenantId) => {

    if (!tenantId) {
        throw new Error(
            "TENANT ID IS REQUIRED"
        );
    }


    const result = await db.query(
        `
        SELECT
            id,
            name,
            phone
        FROM customers
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        `,
        [tenantId]
    );


    return result.rows;

};


// ======================================================
// GET BROADCAST LIST
// ======================================================

const getBroadcasts = async (tenantId) => {

    if (!tenantId) {
        throw new Error(
            "TENANT ID IS REQUIRED"
        );
    }


    const result = await db.query(
        `
        SELECT *
        FROM broadcasts
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        `,
        [tenantId]
    );


    return result.rows;

};


// ======================================================
// GET BROADCAST DETAILS
// ======================================================

const getBroadcastDetails = async (
    tenantId,
    broadcastId
) => {

    if (!tenantId) {

        throw new Error(
            "TENANT ID IS REQUIRED"
        );

    }


    if (!broadcastId) {

        throw new Error(
            "BROADCAST ID IS REQUIRED"
        );

    }


    const broadcast =
        await db.query(
            `
            SELECT *
            FROM broadcasts
            WHERE
                tenant_id = $1
                AND id = $2
            `,
            [
                tenantId,
                broadcastId
            ]
        );


    if (!broadcast.rows.length) {

        throw new Error(
            "Broadcast not found"
        );

    }


    /*
    Broadcast recipient logs
    are stored in broadcast_logs.
    */

    const logs =
        await db.query(
            `
            SELECT *
            FROM messages
            WHERE broadcast_id = $1
            ORDER BY created_at DESC
            `,
            [broadcastId]
        );


    return {

        broadcast:
            broadcast.rows[0],

        logs:
            logs.rows

    };

};


// ======================================================
// SEND BROADCAST
// ======================================================

const sendBroadcast = async ({
    tenantId,
    campaignName,
    templateName,
    language,
    recipients,
    components = []
}) => {

    if (!tenantId) {

        throw new Error(
            "TENANT ID IS REQUIRED"
        );

    }


    if (!templateName) {

        throw new Error(
            "TEMPLATE NAME IS REQUIRED"
        );

    }


    if (
        !Array.isArray(recipients) ||
        recipients.length === 0
    ) {

        throw new Error(
            "RECIPIENTS ARE REQUIRED"
        );

    }


    console.log(
        "========== BROADCAST =========="
    );


    console.log({

        tenantId,

        campaignName,

        templateName,

        language,

        recipients

    });


    console.log(
        "SUPPLIED COMPONENTS:",
        JSON.stringify(
            components,
            null,
            2
        )
    );


    console.log(
        "================================"
    );


    const broadcastId =
        uuidv4();


    // ==================================================
    // CREATE BROADCAST
    // ==================================================

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
            'SENDING',
            0,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        `,
        [
            broadcastId,

            tenantId,

            campaignName ||
                "Untitled Campaign",

            templateName,

            "Selected Contacts",

            recipients.length

        ]
    );


    let successCount = 0;

    let failedCount = 0;


    // ==================================================
    // SEND LOOP
    // ==================================================

    for (
        const phone of recipients
    ) {

        console.log(
            "Sending Template To :",
            phone
        );


        try {

            const finalComponents =
                await buildStoredTemplateComponents({

                    tenantId,

                    templateName,

                    language:
                        language ||
                        "en_US",

                    suppliedComponents:
                        components

                });


            console.log(
                "SEND TEMPLATE FINAL COMPONENTS:",
                JSON.stringify(
                    finalComponents,
                    null,
                    2
                )
            );


            const result =
                await sendTemplate(

                    tenantId,

                    phone,

                    templateName,

                    language ||
                        "en_US",

                    finalComponents

                );


            // ==================================================
            // SUCCESS
            // ==================================================

            if (
                result?.success
            ) {

                successCount++;


                const metaMessageId =
                    result.messageId ||
                    result.data
                        ?.messages?.[0]
                        ?.id ||
                    null;


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
                        $4,
                        $5,
                        NULL,
                        CURRENT_TIMESTAMP
                    )
                    `,
                    [

                        uuidv4(),

                        broadcastId,

                        phone,

                        "SUCCESS",

                        metaMessageId

                    ]
                );

            }


            // ==================================================
            // FAILED
            // ==================================================

            else {

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
                        $4,
                        NULL,
                        $5,
                        CURRENT_TIMESTAMP
                    )
                    `,
                    [

                        uuidv4(),

                        broadcastId,

                        phone,

                        "FAILED",

                        JSON.stringify(
                            result?.error || {
                                message:
                                    "Unknown Meta error"
                            }
                        )

                    ]
                );

            }

        }

        catch (sendError) {

            failedCount++;


            console.error(
                "RECIPIENT SEND FAILED:",
                phone,
                sendError.message
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
                    $4,
                    NULL,
                    $5,
                    CURRENT_TIMESTAMP
                )
                `,
                [

                    uuidv4(),

                    broadcastId,

                    phone,

                    "FAILED",

                    JSON.stringify({
                        message:
                            sendError.message
                    })

                ]
            );

        }

    }


    // ==================================================
    // FINAL STATUS
    // ==================================================

    let broadcastStatus =
        "FAILED";


    if (
        successCount ===
        recipients.length
    ) {

        broadcastStatus =
            "COMPLETED";

    }

    else if (
        successCount > 0 &&
        failedCount > 0
    ) {

        broadcastStatus =
            "PARTIAL";

    }


    // ==================================================
    // UPDATE BROADCAST
    // ==================================================

    await db.query(
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

            broadcastStatus,

            broadcastId,

            tenantId

        ]
    );


    // ==================================================
    // RESPONSE
    // ==================================================

    return {

        success: true,

        broadcastId,

        status:
            broadcastStatus,

        totalRecipients:
            recipients.length,

        successCount,

        failedCount

    };

};


// ======================================================
// RETRY FAILED NUMBERS
// ======================================================

const retryFailedBroadcast = async (
    tenantId,
    broadcastId
) => {

    if (!tenantId) {

        throw new Error(
            "TENANT ID IS REQUIRED"
        );

    }


    if (!broadcastId) {

        throw new Error(
            "BROADCAST ID IS REQUIRED"
        );

    }


    // ==================================================
    // GET BROADCAST
    // ==================================================

    const broadcast =
        await db.query(
            `
            SELECT
                id,
                tenant_id,
                template_name
            FROM broadcasts
            WHERE
                tenant_id = $1
                AND id = $2
            `,
            [
                tenantId,
                broadcastId
            ]
        );


    if (!broadcast.rows.length) {

        throw new Error(
            "Broadcast not found"
        );

    }


    const templateName =
        broadcast.rows[0]
            .template_name;


    // ==================================================
    // GET FAILED LOGS
    // ==================================================

    const failedLogs =
        await db.query(
            `
            SELECT
                id,
                phone,
                status,
                error
            FROM broadcast_logs
            WHERE
                broadcast_id = $1
                AND status = 'FAILED'
            ORDER BY created_at ASC
            `,
            [broadcastId]
        );


    let retrySuccessCount = 0;

    let retryFailedCount = 0;


    // ==================================================
    // RETRY LOOP
    // ==================================================

    for (
        const log of failedLogs.rows
    ) {

        try {

            const retryComponents =
                await buildStoredTemplateComponents({

                    tenantId,

                    templateName,

                    language:
                        "en_US",

                    suppliedComponents:
                        []

                });


            const result =
                await sendTemplate(

                    tenantId,

                    log.phone,

                    templateName,

                    "en_US",

                    retryComponents

                );


            if (
                result?.success
            ) {

                retrySuccessCount++;


                const metaMessageId =
                    result.messageId ||
                    result.data
                        ?.messages?.[0]
                        ?.id ||
                    null;


                await db.query(
                    `
                    UPDATE broadcast_logs
                    SET
                        status = 'SUCCESS',
                        meta_message_id = $1,
                        error = NULL
                    WHERE id = $2
                    `,
                    [
                        metaMessageId,
                        log.id
                    ]
                );

            }

            else {

                retryFailedCount++;


                await db.query(
                    `
                    UPDATE broadcast_logs
                    SET
                        status = 'FAILED',
                        error = $1
                    WHERE id = $2
                    `,
                    [

                        JSON.stringify(
                            result?.error || {
                                message:
                                    "Retry failed"
                            }
                        ),

                        log.id

                    ]
                );

            }

        }

        catch (error) {

            retryFailedCount++;


            await db.query(
                `
                UPDATE broadcast_logs
                SET
                    status = 'FAILED',
                    error = $1
                WHERE id = $2
                `,
                [

                    JSON.stringify({
                        message:
                            error.message
                    }),

                    log.id

                ]
            );

        }

    }


    // ==================================================
    // RECALCULATE COUNTS
    // ==================================================

    const countResult =
        await db.query(
            `
            SELECT

                COUNT(*) FILTER (
                    WHERE status = 'SUCCESS'
                ) AS success_count,

                COUNT(*) FILTER (
                    WHERE status = 'FAILED'
                ) AS failed_count,

                COUNT(*) FILTER (
                    WHERE LOWER(status) = 'read'
                ) AS read_count

            FROM broadcast_logs

            WHERE broadcast_id = $1
            `,
            [broadcastId]
        );


    const counts =
        countResult.rows[0];


    const finalSuccess =
        Number(
            counts.success_count || 0
        );


    const finalFailed =
        Number(
            counts.failed_count || 0
        );


    const finalRead =
        Number(
            counts.read_count || 0
        );


    // ==================================================
    // GET TOTAL RECIPIENTS
    // ==================================================

    const broadcastInfo =
        await db.query(
            `
            SELECT
                total_recipients
            FROM broadcasts
            WHERE
                tenant_id = $1
                AND id = $2
            `,
            [
                tenantId,
                broadcastId
            ]
        );


    const totalRecipients =
        Number(
            broadcastInfo.rows[0]
                ?.total_recipients || 0
        );


    // ==================================================
    // FINAL STATUS
    // ==================================================

    let finalStatus =
        "FAILED";


    if (
        finalSuccess ===
        totalRecipients &&
        totalRecipients > 0
    ) {

        finalStatus =
            "COMPLETED";

    }

    else if (
        finalSuccess > 0 &&
        finalFailed > 0
    ) {

        finalStatus =
            "PARTIAL";

    }

    else if (
        finalSuccess > 0
    ) {

        finalStatus =
            "PARTIAL";

    }


    // ==================================================
    // UPDATE BROADCAST
    // ==================================================

    await db.query(
        `
        UPDATE broadcasts
        SET
            success_count = $1,
            failed_count = $2,
            read_count = $3,
            status = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE
            tenant_id = $5
            AND id = $6
        `,
        [

            finalSuccess,

            finalFailed,

            finalRead,

            finalStatus,

            tenantId,

            broadcastId

        ]
    );


    return {

        success: true,

        broadcastId,

        status:
            finalStatus,

        retried:
            failedLogs.rows.length,

        successCount:
            retrySuccessCount,

        failedCount:
            retryFailedCount,

        totalSuccess:
            finalSuccess,

        totalFailed:
            finalFailed,

        readCount:
            finalRead

    };

};


// ======================================================
// SYNC BROADCAST READ COUNTS
// ======================================================

export const syncBroadcastReadCounts = async (
    tenantId
) => {

    if (!tenantId) {

        throw new Error(
            "Tenant ID is required"
        );

    }


    await db.query(
        `
        UPDATE broadcasts b

        SET

            read_count = (

                SELECT COUNT(*)

                FROM messages bl

                WHERE
                    bl.broadcast_id = b.id
                    AND LOWER(bl.status) = 'read'

            ),

            updated_at =
                CURRENT_TIMESTAMP

        WHERE
            b.tenant_id = $1
        `,
        [tenantId]
    );

};


// ======================================================
// EXPORT
// ======================================================

export default {

    getCustomers,

    getBroadcasts,

    getBroadcastDetails,

    sendBroadcast,

    retryFailedBroadcast,

    syncBroadcastReadCounts

};
