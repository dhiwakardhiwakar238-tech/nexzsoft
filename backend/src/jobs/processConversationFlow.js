/*
==================================
PROCESS CONVERSATION FLOW
==================================
*/

import db from "../config/db.js";


const processConversationFlow = async () => {

    console.log("🔍 Checking conversation lifecycle...");

    try {

        /*
        ==================================
        STAGE 1
        AI IN CHAT → IDLE
        ==================================

        If the latest customer message is older
        than 15 minutes:

        state      = idle
        activity   = active
        status     = open
        idle_at    = NOW()
        */

        const idleResult = await db.query(`
            UPDATE conversations c
            SET
                state = 'idle',
                activity = 'active',
                status = 'open',
                idle_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            FROM (
                SELECT
                    c.id AS conversation_id,
                    MAX(m.created_at) AS last_customer_message_at
                FROM conversations c
                INNER JOIN messages m
                    ON m.conversation_id = c.id
                WHERE m.sender = 'customer'
                GROUP BY c.id
                HAVING MAX(m.created_at) <
                    CURRENT_TIMESTAMP - INTERVAL '15 minutes'
            ) latest
            WHERE c.id = latest.conversation_id
              AND c.status = 'open'
              AND c.activity = 'active'
              AND c.state = 'ai in chat'
            RETURNING
                c.id,
                c.customer_number,
                c.status,
                c.activity,
                c.state,
                c.idle_at,
                latest.last_customer_message_at;
        `);

        if (idleResult.rowCount > 0) {
            console.log(
                `⏳ ${idleResult.rowCount} conversation(s) changed to idle.`
            );
        }


        /*
        ==================================
        STAGE 2
        IDLE + ACTIVE → IDLE + INACTIVE
        ==================================

        1 hour after idle_at:

        state      = idle
        activity   = inactive
        status     = open

        idle_at remains unchanged because it represents
        the exact time the conversation became idle.
        */

        const inactiveResult = await db.query(`
            UPDATE conversations
            SET
                activity = 'inactive',
                updated_at = CURRENT_TIMESTAMP
            WHERE status = 'open'
              AND state = 'idle'
              AND activity = 'active'
              AND idle_at IS NOT NULL
              AND idle_at < CURRENT_TIMESTAMP - INTERVAL '1 hour'
            RETURNING id;
        `);

        if (inactiveResult.rowCount > 0) {
            console.log(
                `💤 ${inactiveResult.rowCount} conversation(s) changed to inactive.`
            );
        }


        /*
        ==================================
        STAGE 3
        IDLE + INACTIVE → RESOLVED + CLOSED
        ==================================

        24 hours after idle_at:

        state      = resolved
        activity   = inactive
        status     = closed
        */

        const closedResult = await db.query(`
            UPDATE conversations
            SET
                status = 'closed',
                state = 'resolved',
                activity = 'inactive',
                updated_at = CURRENT_TIMESTAMP
            WHERE status = 'open'
              AND state = 'idle'
              AND activity = 'inactive'
              AND idle_at IS NOT NULL
              AND idle_at < CURRENT_TIMESTAMP - INTERVAL '24 hours'
            RETURNING id;
        `);

        if (closedResult.rowCount > 0) {
            console.log(
                `🔒 ${closedResult.rowCount} conversation(s) closed and resolved.`
            );
        }


        console.log("🏁 Conversation lifecycle job completed.");

    } catch (error) {

        console.error(
            "❌ Conversation lifecycle job failed:",
            error
        );

    }
};


export default processConversationFlow;
