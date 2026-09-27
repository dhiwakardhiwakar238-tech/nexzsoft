import pool from "../config/db.js";


/*
==================================================
PROCESS AGENT HANDOFF TIMEOUTS
==================================================
*/

export const processAgentHandoffs = async () => {

    try {

        /*
        ==================================================
        FIND CONVERSATIONS WAITING FOR AGENT
        FOR 10 MINUTES OR MORE
        ==================================================
        */

        const result = await pool.query(
            `
            SELECT
                id,
                tenant_id,
                assigned_user_id,
                state,
                agent_requested_at
            FROM conversations
            WHERE state = 'waiting for agent'
              AND agent_requested_at IS NOT NULL
              AND agent_requested_at <=
                    CURRENT_TIMESTAMP - INTERVAL '10 minutes'
            `
        );


        /*
        ==================================================
        NOTHING TO PROCESS
        ==================================================
        */

        if (!result.rows.length) {

            return;

        }


        /*
        ==================================================
        PROCESS EACH CONVERSATION
        ==================================================
        */

        for (const conversation of result.rows) {

            /*
            ----------------------------------------------
            UPDATE STATE
            ----------------------------------------------
            */

            const updateResult =
                await pool.query(
                    `
                    UPDATE conversations
                    SET
                        state =
                            'ticket open',

                        updated_at =
                            CURRENT_TIMESTAMP

                    WHERE id = $1
                      AND tenant_id = $2
                      AND state = 'waiting for agent'

                    RETURNING *
                    `,
                    [
                        conversation.id,
                        conversation.tenant_id
                    ]
                );


            /*
            ----------------------------------------------
            MAKE SURE UPDATE ACTUALLY HAPPENED
            ----------------------------------------------
            */

            if (!updateResult.rows[0]) {

                continue;

            }


            console.log(
                "⏱️ AGENT HANDOFF TIMEOUT:",
                {
                    conversationId:
                        conversation.id,

                    tenantId:
                        conversation.tenant_id,

                    assignedUserId:
                        conversation.assigned_user_id
                }
            );

        }

    }

    catch (error) {

        console.error(
            "❌ AGENT HANDOFF JOB ERROR:",
            error
        );

    }

};
