
import pool from "../config/db.js";

import * as whatsappService from "../services/whatsappService.js";
import * as aiService from "../services/groqService.js";
import * as aiSettingsService from "../services/aiSettingsService.js";
import * as memoryService from "../services/memoryService.js";

import { detectIntent } from "../utils/intentDetector.js";
import * as ticketService from "../services/ticketService.js";

import ragService from "../services/ragService.js";
import {
    handleConnectToAgent
} from "../services/agentService.js";
import crmService from "../services/crmService.js";

import {
    getPolicyContext
} from "../services/companyPolicyService.js";

import {
    extractMemory
} from "../utils/memoryExtractor.js";

import { getIO } from "../config/socket.js";


/*
==================================================
VERIFY WEBHOOK
==================================================
*/

export const verifyWebhook = async (req, res) => {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("===== WEBHOOK VERIFY =====");
    console.log("MODE:", mode);
    console.log("TOKEN FROM URL:", token);
    console.log("TOKEN FROM ENV:", process.env.META_VERIFY_TOKEN);
    console.log("CHALLENGE:", challenge);
    console.log("==========================");

    if (
        mode === "subscribe" &&
        token === process.env.META_VERIFY_TOKEN
    ) {

        console.log("Webhook Verified");

        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
};


/*
==================================================
WHATSAPP WEBHOOK
==================================================
*/

export const whatsappWebhook = async (req, res) => {

    try {

        console.log("");
        console.log("==========================================");
        console.log("🔥 WEBHOOK HIT");
        console.log("🔥 TIME:", new Date().toISOString());
        console.log("==========================================");

        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;


        /*
        ==========================================
        MESSAGE STATUS UPDATE
        ==========================================
        */

        if (value?.statuses) {

            const status = value.statuses[0];

            const whatsappMessageId = status.id;
            const messageStatus = status.status;

            console.log(
                "STATUS UPDATE:",
                whatsappMessageId,
                messageStatus
            );

            const result = await pool.query(
                `
                UPDATE messages
                SET status = $1
                WHERE whatsapp_message_id = $2
                RETURNING conversation_id
                `,
                [
                    messageStatus,
                    whatsappMessageId
                ]
            );

            if (result.rows.length > 0) {

                try {

                    const io = getIO();

                    io.emit("message_status_updated", {
                        whatsapp_message_id: whatsappMessageId,
                        status: messageStatus,
                        conversation_id:
                            result.rows[0].conversation_id
                    });

                } catch (err) {

                    console.log(
                        "Socket emit error:",
                        err.message
                    );
                }
            }

            return res.sendStatus(200);
        }


        /*
        ==========================================
        INCOMING CUSTOMER MESSAGE
        ==========================================
        */

        if (!value?.messages) {

            console.log(
                "No incoming messages in webhook."
            );

            return res.sendStatus(200);
        }

        const msg = value.messages[0];

        const whatsappProfileName =
            value.contacts?.[0]?.profile?.name ||
            "Unknown Name";


        /*
        ==========================================
        MESSAGE ID
        ==========================================
        */

        const incomingWhatsappMessageId = msg.id;

        const repliedToWhatsappMessageId =
            msg.context?.id || null;

        console.log(
            "Incoming WhatsApp Message ID:",
            incomingWhatsappMessageId
        );

        console.log(
            "Replied To WhatsApp Message ID:",
            repliedToWhatsappMessageId
        );


        /*
        ==========================================
        ONLY TEXT MESSAGE
        ==========================================
        */

        if (!msg.text) {

            console.log(
                "Non-text message received. Skipping."
            );

            return res.sendStatus(200);
        }


        const from = msg.from;

        const phoneNumberId =
            value.metadata?.phone_number_id;

        console.log(
            "Phone Number ID:",
            phoneNumberId
        );


        /*
        ==========================================
        FIND TENANT
        ==========================================
        */

        const tenantResult =
            await pool.query(
                `
                SELECT tenant_id
                FROM meta_configs
                WHERE phone_number_id = $1
                `,
                [
                    phoneNumberId
                ]
            );

        if (
            tenantResult.rows.length === 0
        ) {

            console.log(
                "TENANT NOT FOUND"
            );

            return res.sendStatus(200);
        }

        const tenantId =
            tenantResult.rows[0].tenant_id;

        console.log(
            "TENANT ID:",
            tenantId
        );


        /*
        ==========================================
        AI SETTINGS
        ==========================================
        */

        const aiSettings =
            await aiSettingsService.getAISettings(
                tenantId
            );


        /*
        ==========================================
        BROADCAST REPLY DETECTION
        ==========================================
        */

        let broadcastId = null;

        if (repliedToWhatsappMessageId) {

            console.log(
                "Customer explicitly replied to:",
                repliedToWhatsappMessageId
            );

            const broadcastResult =
                await pool.query(
                    `
                    SELECT broadcast_id
                    FROM messages
                    WHERE whatsapp_message_id = $1
                      AND tenant_id = $2
                      AND broadcast_id IS NOT NULL
                    LIMIT 1
                    `,
                    [
                        repliedToWhatsappMessageId,
                        tenantId
                    ]
                );

            if (
                broadcastResult.rows.length > 0
            ) {

                broadcastId =
                    broadcastResult.rows[0].broadcast_id;

                console.log(
                    "BROADCAST REPLY DETECTED:",
                    broadcastId
                );

            } else {

                console.log(
                    "Reply target found, but it is not associated with a broadcast."
                );
            }

        } else {

            console.log(
                "No context.id - customer sent a normal message."
            );
        }


        /*
        ==========================================
        MESSAGE DETAILS
        ==========================================
        */

        const text = msg.text.body;

        console.log("================================");
        console.log("CUSTOMER MESSAGE");
        console.log("FROM:", from);
        console.log("MESSAGE:", text);
        console.log("TENANT:", tenantId);
        console.log("================================");


        /*
        ==================================================
        CUSTOMER
        ==================================================
        */

        let customerResult = await pool.query(
            `
            SELECT *
            FROM customers
            WHERE phone = $1
              AND tenant_id = $2
            `,
            [
                from,
                tenantId
            ]
        );

        let customerId;

        if (
            customerResult.rows.length === 0
        ) {

            console.log(
                "Creating new customer..."
            );

            const customer =
                await pool.query(
                    `
                    INSERT INTO customers
                    (
                        tenant_id,
                        phone,
                        name
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3
                    )
                    RETURNING id
                    `,
                    [
                        tenantId,
                        from,
                        whatsappProfileName
                    ]
                );

            customerId =
                customer.rows[0].id;

        } else {

            customerId =
                customerResult.rows[0].id;

            if (
                whatsappProfileName &&
                whatsappProfileName !== "Unknown Name"
            ) {

                await pool.query(
                    `
                    UPDATE customers
                    SET name = $1
                    WHERE id = $2
                      AND tenant_id = $3
                    `,
                    [
                        whatsappProfileName,
                        customerId,
                        tenantId
                    ]
                );
            }
        }


        /*
        ==================================================
        CONVERSATION
        ==================================================
        */
        
        let conversationResult = await pool.query(
            `
            SELECT *
            FROM conversations
            WHERE customer_number = $1
              AND tenant_id = $2
            ORDER BY updated_at DESC
            LIMIT 1
            `,
            [
                from,
                tenantId
            ]
        );
        
        let conversationId;
        let conversationRow = null;
        
        if (
            conversationResult.rows.length === 0
        ) {
        
            console.log(
                "Creating new conversation..."
            );
        
            const conversation =
                await pool.query(
                    `
                    INSERT INTO conversations
                    (
                        tenant_id,
                        customer_number,
                        last_message,
                        unread_count,
                        status,
                        state,
                        activity,
                        idle_at,
                        updated_at
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        1,
                        'open',
                        'ai in chat',
                        'active',
                        NULL,
                        CURRENT_TIMESTAMP
                    )
                    RETURNING *
                    `,
                    [
                        tenantId,
                        from,
                        text
                    ]
                );
        
            conversationRow =
                conversation.rows[0];
        
            conversationId =
                conversationRow.id;
        
        } else {
        
            conversationId =
                conversationResult.rows[0].id;
        
            console.log(
                "Updating existing conversation:",
                conversationId
            );
        
            const conversation =
                await pool.query(
                    `
                    UPDATE conversations
                    SET
                        status = 'open',
                        activity = 'active',
                        state = 'ai in chat',
                        idle_at = NULL,
                        last_message = $1,
                        unread_count =
                            COALESCE(unread_count, 0) + 1,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = $2
                      AND tenant_id = $3
                      AND (state = 'resolved' OR state = 'idle')
                    RETURNING *
                    `,
                    [
                        text,
                        conversationId,
                        tenantId
                    ]
                );
        
            conversationRow =
                conversation.rows[0];
        }


        /*
        ==================================================
        SAVE CUSTOMER MESSAGE
        ==================================================
        */

        const savedCustomerMessage =
            await pool.query(
                `
                INSERT INTO messages
                (
                    conversation_id,
                    sender,
                    message,
                    message_type,
                    status,
                    whatsapp_message_id,
                    broadcast_id,
                    tenant_id
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
                    $8
                )
                RETURNING *
                `,
                [
                    conversationId,
                    "customer",
                    text,
                    "text",
                    "received",
                    incomingWhatsappMessageId,
                    broadcastId,
                    tenantId
                ]
            );

        console.log(
            "Customer Message Saved:",
            savedCustomerMessage.rows[0]
        );


        /*
        ==================================================
        BROADCAST REPLY COUNT
        ==================================================
        */

        let isFirstBroadcastReply = false;

        if (broadcastId) {

            const existingReply =
                await pool.query(
                    `
                    SELECT id
                    FROM messages
                    WHERE broadcast_id = $1
                      AND conversation_id = $2
                      AND sender = 'customer'
                    LIMIT 1
                    `,
                    [
                        broadcastId,
                        conversationId
                    ]
                );

            if (
                existingReply.rows.length === 0
            ) {

                isFirstBroadcastReply = true;

                console.log(
                    `First reply from conversation ${conversationId} for broadcast ${broadcastId}`
                );

            } else {

                console.log(
                    `Customer already replied to broadcast ${broadcastId}`
                );
            }
        }


        if (
            broadcastId &&
            isFirstBroadcastReply
        ) {

            await pool.query(
                `
                UPDATE broadcasts
                SET reply_count =
                    COALESCE(reply_count, 0) + 1
                WHERE id = $1
                `,
                [
                    broadcastId
                ]
            );

            console.log(
                `Broadcast ${broadcastId} reply_count incremented`
            );
        }


        /*
        ==================================================
        REALTIME CUSTOMER MESSAGE
        ==================================================
        */

        let latestConversation = null;

        try {

            const io = getIO();

            const room =
                `tenant_${tenantId}`;

            const latestConversationResult =
                await pool.query(
                    `
                    SELECT *
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

            latestConversation =
                latestConversationResult.rows[0] ||
                null;


            const realtimePayload = {

                tenantId,
                tenant_id: tenantId,

                conversationId,
                conversation_id: conversationId,

                customer_number: from,

                message:
                    savedCustomerMessage.rows[0],

                conversation:
                    latestConversation,

                last_message:
                    text,

                unread_count:
                    latestConversation?.unread_count ?? 1,

                updated_at:
                    latestConversation?.updated_at ||
                    new Date().toISOString()
            };


            io.to(room).emit(
                "new_message",
                realtimePayload
            );

            io.to(room).emit(
                "message_received",
                realtimePayload
            );

            io.to(room).emit(
                "conversation_updated",
                realtimePayload
            );


            console.log(
                "🟢 REALTIME CUSTOMER MESSAGE EMITTED:",
                {
                    room,
                    conversationId,
                    messageId:
                        savedCustomerMessage.rows[0]?.id
                }
            );

        } catch (socketError) {

            console.error(
                "⚠️ Socket emit failed:",
                socketError?.message ||
                socketError
            );
        }


        /*
        ==================================================
        🔥 AI PAUSE DEBUG - STEP 1
        ==================================================
        */

        console.log("");
        console.log("==========================================");
        console.log("🔍 AI PAUSE DEBUG - AFTER CUSTOMER MESSAGE");
        console.log("==========================================");

        console.log(
            "Conversation ID:",
            conversationId
        );

        console.log(
            "Customer Number:",
            from
        );

        console.log(
            "Conversation Row ai_paused:",
            conversationRow?.ai_paused
        );

        console.log(
            "Latest Conversation ai_paused:",
            latestConversation?.ai_paused
        );

        console.log(
            "Conversation Row:",
            conversationRow
        );

        console.log(
            "Latest Conversation:",
            latestConversation
        );

        console.log("==========================================");


        /*
        ==================================================
        🔥 AI PAUSE DEBUG - STEP 2
        FRESH DATABASE CHECK
        ==================================================
        */

        const freshPauseResult =
            await pool.query(
                `
                SELECT
                    id,
                    customer_number,
                    tenant_id,
                    ai_paused,
                    updated_at
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

        const freshConversation =
            freshPauseResult.rows[0] || null;

        console.log("");
        console.log("==========================================");
        console.log("🔍 AI PAUSE DEBUG - FRESH DB QUERY");
        console.log("==========================================");

        console.log(
            "Fresh Conversation ID:",
            freshConversation?.id
        );

        console.log(
            "Fresh Customer Number:",
            freshConversation?.customer_number
        );

        console.log(
            "Fresh Tenant ID:",
            freshConversation?.tenant_id
        );

        console.log(
            "🔥 FRESH ai_paused:",
            freshConversation?.ai_paused
        );

        console.log(
            "Fresh Updated At:",
            freshConversation?.updated_at
        );

        console.log("==========================================");


        /*
        ==================================================
        🔥 FINAL AI PAUSE DECISION
        ==================================================
        */

        const isAiPausedForConversation =
            freshConversation?.ai_paused === true ||
            latestConversation?.ai_paused === true ||
            conversationRow?.ai_paused === true;


        console.log("");
        console.log("==========================================");
        console.log("🤖 FINAL AI PAUSE DECISION");
        console.log("==========================================");

        console.log(
            "Conversation ID:",
            conversationId
        );

        console.log(
            "conversationRow.ai_paused:",
            conversationRow?.ai_paused
        );

        console.log(
            "latestConversation.ai_paused:",
            latestConversation?.ai_paused
        );

        console.log(
            "freshConversation.ai_paused:",
            freshConversation?.ai_paused
        );

        console.log(
            "FINAL isAiPausedForConversation:",
            isAiPausedForConversation
        );

        console.log("==========================================");


        /*
        ==================================================
        🔇 STOP AI COMPLETELY FOR THIS CHAT
        ==================================================
        */

        if (isAiPausedForConversation) {

            console.log("");
            console.log("==========================================");
            console.log("🔇 AI PAUSED");
            console.log(
                `🔇 Conversation ${conversationId}`
            );
            console.log(
                `🔇 Customer ${from}`
            );
            console.log(
                "🔇 AI reply WILL NOT be generated."
            );
            console.log(
                "🔇 AI reply WILL NOT be sent."
            );
            console.log("==========================================");

            return res.sendStatus(200);
        }


        /*
        ==================================================
        AI IS NOT PAUSED
        ==================================================
        */

        console.log("");
        console.log("==========================================");
        console.log("🟢 AI ACTIVE");
        console.log(
            `Conversation ${conversationId}`
        );
        console.log(
            "AI reply generation will continue."
        );
        console.log("==========================================");


        /*
        ==================================================
        EXTRACT MEMORY
        ==================================================
        */

        const extractedMemory =
            extractMemory(text);

        for (
            const key of Object.keys(extractedMemory)
        ) {

            await memoryService.saveMemory(
                customerId,
                key,
                extractedMemory[key]
            );

            console.log(
                `Memory Saved -> ${key} : ${extractedMemory[key]}`
            );
        }


        /*
        ==================================================
        LOAD CUSTOMER MEMORY
        ==================================================
        */

        const customerMemory =
            await memoryService.getMemory(
                customerId
            );


        /*
        ==================================================
        CRM
        ==================================================
        */

        const crmResult =
            await crmService.processLead(
                from,
                customerMemory,
                text
            );

        console.log(
            "========== CRM =========="
        );

        console.log(crmResult);

        console.log(
            "Lead Score:",
            crmResult.score
        );

        console.log(
            crmResult.previousStage,
            "→",
            crmResult.currentStage
        );


        /*
        ==================================================
        MEMORY TEXT
        ==================================================
        */

        const memoryText =
            customerMemory.length > 0
                ? customerMemory
                    .map(
                        memory =>
                            `${memory.memory_key}: ${memory.memory_value}`
                    )
                    .join("\n")
                : "No customer memory available.";

        console.log(
            "========== MEMORY =========="
        );

        console.log(memoryText);


        /*
        ==================================================
        CONVERSATION HISTORY
        ==================================================
        */

        const historyResult =
            await pool.query(
                `
                SELECT
                    sender,
                    message
                FROM messages
                WHERE conversation_id = $1
                ORDER BY created_at ASC
                LIMIT 20
                `,
                [
                    conversationId
                ]
            );

        console.log(
            "Rows:",
            historyResult.rows.length
        );

        console.log(
            historyResult.rows
        );


        const history =
            historyResult.rows
                .map(
                    item =>
                        `${item.sender}: ${item.message}`
                )
                .join("\n");


        console.log(
            "========== HISTORY =========="
        );

        console.log(history);


        /*
        ==================================================
        GENERATE AI REPLY
        ==================================================
        */

        const intent =
            detectIntent(text);

        console.log(
            "Intent =",
            intent
        );


        let aiReply;


        const memory = {

            name:
                customerMemory.find(
                    x =>
                        x.memory_key === "name"
                )?.memory_value || "",

            company:
                customerMemory.find(
                    x =>
                        x.memory_key === "company"
                )?.memory_value || "",

            email:
                customerMemory.find(
                    x =>
                        x.memory_key === "email"
                )?.memory_value || "",

            phone:
                from,

            product:
                customerMemory.find(
                    x =>
                        x.memory_key === "product"
                )?.memory_value || ""
        };


        const historyMessages =
            historyResult.rows.map(
                item => ({
                    role: item.sender,
                    message: item.message
                })
            );


        try {

            /*
            ==================================================
            CUSTOMER IS WAITING FOR AGENT
            ==================================================
            */
            
            if (
                conversationRow?.state ===
                "waiting for agent"
            ) {
            
                aiReply =
                    await aiService.generateAgentHandoffReply({
            
                        question: text,
            
                        conversation:
                            conversationRow,
            
                        memory,
            
                        history:
                            historyMessages,
            
                        aiSettings
            
                    });
            
            } else if (
    conversationRow?.state ===
    "waiting for ticket description"
) {

    /*
    ================================================
    TICKET DESCRIPTION RECEIVED
    ================================================
    */

    const ticketDescription =
        text.trim();


    console.log(
        "🎫 TICKET DESCRIPTION RECEIVED:",
        {
            conversationId:
                conversationRow.id,

            tenantId,

            description:
                ticketDescription
        }
    );


    /*
    ================================================
    CREATE TICKET
    ================================================
    */

    const ticket =
        await ticketService.createTicketForConversation(
            tenantId,
            {
                customerPhone:
                    conversationRow.customer_phone,

                title:
                    "WhatsApp Customer Support",

                description:
                    ticketDescription
            }
        );


    console.log(
        "🎫 TICKET CREATED:",
        {
            ticketNumber:
                ticket.ticket_number,

            conversationId:
                conversationRow.id
        }
    );


    /*
    ================================================
    UPDATE CONVERSATION STATE
    ================================================
    */

    const ticketConversationResult =
        await pool.query(
            `
            UPDATE conversations
            SET
                state = 'ticket open',
                ticket_number = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
              AND tenant_id = $3
              AND state = 'waiting for ticket description'
            RETURNING *
            `,
            [
                ticket.ticket_number,
                conversationRow.id,
                tenantId
            ]
        );


    if (
        ticketConversationResult.rows.length === 0
    ) {

        throw new Error(
            "Failed to update conversation after ticket creation"
        );

    }


    conversationRow =
        ticketConversationResult.rows[0];


    /*
    ================================================
    CUSTOMER CONFIRMATION
    ================================================
    */

    aiReply =
        `Thank you. Your support ticket ${ticket.ticket_number} has been created. Our support team will review your request and assist you shortly.`;

}
            else {
            
                /*
                ==================================================
                NORMAL AI INTENT PROCESSING
                ==================================================
                */

            switch (intent) {

                case "greeting":

                    aiReply =
                        `Hello ${memory.name || ""} 👋 Welcome to Nexzsoft. How can I help you today?`;

                    break;


                case "thanks":

                    aiReply =
                        "You're welcome 😊";

                    break;


                case "bye":

                    aiReply =
                        "Thank you for contacting Nexzsoft. Have a great day 😊";

                    break;


                case "memory_update":

                    if (/name/i.test(text)) {

                        aiReply =
                            `Nice to meet you ${memory.name}. I'll remember your name.`;

                    } else if (/company/i.test(text)) {

                        aiReply =
                            `Great! I'll remember that your company is ${memory.company}.`;

                    } else if (/email/i.test(text)) {

                        aiReply =
                            "Thanks! I'll remember your email address.";

                    } else if (/phone/i.test(text)) {

                        aiReply =
                            "Thanks! I'll remember your phone number.";

                    } else {

                        aiReply =
                            "Thanks! I've updated your information.";
                    }

                    break;


                case "memory":

                    if (/company/i.test(text)) {

                        aiReply =
                            memory.company
                                ? `Your company is ${memory.company}.`
                                : "I don't know your company yet.";

                    } else if (/email/i.test(text)) {

                        aiReply =
                            memory.email
                                ? `Your email is ${memory.email}.`
                                : "I don't know your email.";

                    } else if (/phone/i.test(text)) {

                        aiReply =
                            `Your phone number is ${memory.phone}.`;

                    } else if (/name/i.test(text)) {

                        aiReply =
                            memory.name
                                ? `Your name is ${memory.name}.`
                                : "I don't know your name yet.";

                    } else {

                        aiReply =
                            "I don't have that information yet.";
                    }

                    break;


                case "sales": {

                    const lastActivity =
                        crmResult.activities?.length > 0
                            ? crmResult.activities[
                                crmResult.activities.length - 1
                            ]
                            : "";


                    if (
                        lastActivity ===
                        "Requested Demo"
                    ) {

                        aiReply =
                            await aiService.generateReply(
                                `
                                You are Nexzsoft Sales Assistant.

                                Customer has ALREADY requested a demo.

                                DO NOT ask "Need demo?" again.

                                Your job now is only to collect:

                                • Preferred Date
                                • Preferred Time

                                If customer already gave date,
                                ask only time.

                                If customer already gave time,
                                confirm booking.

                                Keep reply short.
                                `,
                                text,
                                memory,
                                historyMessages,
                                aiSettings
                            );

                    } else {

                        aiReply =
                            await aiService.generateSalesReply({
                                question: text,
                                customerMemory: memory,
                                crm: crmResult,
                                history: historyMessages,
                                aiSettings
                            });
                    }

                    break;
                }


                case "policy":

                    aiReply =
                        await ragService.askAI(
                            text,
                            memory,
                            historyMessages,
                            crmResult
                        );

                    break;

                case "connect_to_agent": {

                    console.log("connect to agent:", tenantId, conversationId);

                    const handoffResult =
                        await handleConnectToAgent({
                
                            tenantId,
                
                            conversationId,
                
                            text,
                
                            memory,
                
                            historyMessages,
                
                            aiSettings
                
                        });
                
                    conversationRow =
                        handoffResult.conversation;

                    console.log("connect to agent sent:", conversationRow, handoffResult.reply);
                
                    aiReply =
                        handoffResult.reply;
                
                    console.log(
                        "🤝 AGENT ASSIGNED:",
                        handoffResult.agent.user_id
                    );
                
                    break;
                }

                case "general":

                    aiReply =
                        await aiService.generateReply(
                            "",
                            text,
                            memory,
                            historyMessages,
                            aiSettings
                        );

                    break;


                default:

                    aiReply =
                        await aiService.generateReply(
                            "",
                            text,
                            memory,
                            historyMessages,
                            aiSettings
                        );

                    break;
            }

            }

        } catch (err) {

            console.log(
                "Groq Error:",
                err.message
            );

            aiReply =
                "Sorry, AI service is temporarily unavailable.";
        }


        console.log(
            "========== AI REPLY =========="
        );

        console.log(aiReply);


        /*
        ==================================================
        SEND WHATSAPP MESSAGE
        ==================================================
        */

        const whatsappResponse =
            await whatsappService.sendMessage(
                tenantId,
                from,
                aiReply
            );


        console.log(
            "========== WHATSAPP =========="
        );

        console.log(
            whatsappResponse
        );


        const whatsappMessageId =
            whatsappResponse.data.messages[0].id;


        /*
        ==================================================
        SAVE AI MESSAGE
        ==================================================
        */

        const savedAIMessage =
            await pool.query(
                `
                INSERT INTO messages
                (
                    conversation_id,
                    sender,
                    message,
                    message_type,
                    status,
                    whatsapp_message_id,
                    tenant_id
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                )
                RETURNING *
                `,
                [
                    conversationId,
                    "assistant",
                    aiReply,
                    "text",
                    "sent",
                    whatsappMessageId,
                    tenantId
                ]
            );


        console.log(
            "AI MESSAGE SAVED:",
            savedAIMessage.rows[0]
        );


        /*
        ==================================================
        UPDATE CONVERSATION
        ==================================================
        */

        const aiConversationUpdate =
            await pool.query(
                `
                UPDATE conversations
                SET
                    last_message = $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                  AND tenant_id = $3
                RETURNING *
                `,
                [
                    aiReply,
                    conversationId,
                    tenantId
                ]
            );


        /*
        ==================================================
        REALTIME AI MESSAGE
        ==================================================
        */

        try {

            const io = getIO();

            const room =
                `tenant_${tenantId}`;

            const updatedConversation =
                aiConversationUpdate.rows[0] ||
                conversationRow ||
                null;


            const realtimePayload = {

                tenantId,
                tenant_id: tenantId,

                conversationId,
                conversation_id: conversationId,

                customer_number: from,

                message:
                    savedAIMessage.rows[0],

                conversation:
                    updatedConversation,

                last_message:
                    aiReply,

                unread_count:
                    updatedConversation?.unread_count ?? 0,

                updated_at:
                    updatedConversation?.updated_at ||
                    new Date().toISOString()
            };


            console.log(
                "⚡ EMITTING LIVE AI MESSAGE:",
                {
                    room,
                    conversationId,
                    messageId:
                        savedAIMessage.rows[0]?.id
                }
            );


            io.to(room).emit(
                "new_message",
                realtimePayload
            );

            io.to(room).emit(
                "message_received",
                realtimePayload
            );

            io.to(room).emit(
                "conversation_updated",
                realtimePayload
            );

        } catch (socketError) {

            console.error(
                "⚠️ AI socket emit failed:",
                socketError?.message ||
                socketError
            );
        }


        /*
        ==================================================
        END WEBHOOK
        ==================================================
        */

        console.log("");
        console.log("==========================================");
        console.log("✅ WEBHOOK COMPLETED");
        console.log(
            "Conversation:",
            conversationId
        );
        console.log(
            "AI Reply Sent:",
            true
        );
        console.log("==========================================");

        return res.sendStatus(200);

    } catch (err) {

        console.log("");
        console.log("==========================================");
        console.log("❌ WEBHOOK ERROR");
        console.log("==========================================");

        console.log(err);

        console.log("==========================================");

        return res.sendStatus(500);
    }
};
