import pool from "../config/db.js";
import * as aiService from "./groqService.js";


/*
==================================================
FIND AVAILABLE AGENT
==================================================

For now:

Each tenant has exactly one user.

So we simply return the first
tenant_users record for that tenant.

Later this can be replaced with
real agent availability logic.
==================================================
*/

export const findAvailableAgent = async (
    tenantId
) => {

    console.log("Finding Agent");

    const result = await pool.query(
        `
        SELECT
            user_id,
            tenant_id,
            name,
            email,
            role
        FROM tenant_users
        WHERE tenant_id = $1
        LIMIT 1
        `,
        [tenantId]
    );

    console.log("Finding Agent now:", result);

    return result.rows[0] || null;
};


/*
==================================================
HANDLE CONNECT TO AGENT
==================================================
*/

export const handleConnectToAgent = async ({
    tenantId,
    conversationId,
    text,
    memory = {},
    historyMessages = [],
    aiSettings = {}
}) => {

    console.log("Agent Service Called");

    /*
    ==================================================
    1. GET CURRENT CONVERSATION
    ==================================================
    */

    const result = await pool.query(
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

    const conversation =
        result.rows[0];


    if (!conversation) {

        throw new Error(
            "Conversation not found"
        );

    }


    /*
    ==================================================
    2. ALREADY WAITING FOR AGENT
    ==================================================

    Do not assign the same agent again.

    The customer may send another message
    while waiting.

    We simply generate an appropriate
    handoff response using the existing state.
    ==================================================
    */

    if (
        conversation.state ===
        "waiting for agent"
    ) {

        const reply =
            await aiService.generateAgentHandoffReply({

                question: text,

                conversation,

                memory,

                history:
                    historyMessages,

                aiSettings

            });


        return {

            reply,

            conversation

        };

    }


    /*
    ==================================================
    3. ALREADY IN AGENT CHAT
    ==================================================
    */

    if (
        conversation.state ===
        "agent in chat"
    ) {

        return {

            reply:
                "Our support team is already handling your conversation.",

            conversation

        };

    }


    /*
    ==================================================
    4. FIND AVAILABLE AGENT
    ==================================================
    */

    const agent =
        await findAvailableAgent(
            tenantId
        );


    if (!agent) {

        throw new Error(
            "No support agent found for this tenant"
        );

    }


    /*
    ==================================================
    5. UPDATE CONVERSATION
    ==================================================

    IMPORTANT:

    The database is updated BEFORE Groq
    is called.

    This guarantees that
    generateAgentHandoffReply()
    receives the actual current state.
    ==================================================
    */

    console.log("ready to run query for waiting for agent");

    const updateResult =
        await pool.query(
            `
            UPDATE conversations

            SET
                assigned_user_id = $1,
                state = 'waiting for agent',
                ai_paused = FALSE,
                activity = 'active',
                agent_requested_at =
                    CURRENT_TIMESTAMP,
                updated_at =
                    CURRENT_TIMESTAMP

            WHERE id = $2
              AND tenant_id = $3

            RETURNING *
            `,
            [
                agent.user_id,
                conversationId,
                tenantId
            ]
        );


    const updatedConversation =
        updateResult.rows[0];

    console.log("ready to run query for waiting for agent done:", updatedConversation);


    if (!updatedConversation) {

        throw new Error(
            "Failed to update conversation"
        );

    }


    /*
    ==================================================
    6. GENERATE HANDOFF REPLY
    ==================================================

    IMPORTANT:

    We pass updatedConversation,
    NOT the old conversation.

    Therefore Groq receives:

        state = waiting for agent

        assigned_user_id = agent.user_id

        ai_paused = false
    ==================================================
    */

    const reply =
        await aiService.generateAgentHandoffReply({

            question: text,

            conversation:
                updatedConversation,

            memory,

            history:
                historyMessages,

            aiSettings

        });


    /*
    ==================================================
    7. RETURN RESULT TO WEBHOOK
    ==================================================
    */

    return {

        reply,

        conversation:
            updatedConversation,

        agent

    };

};
