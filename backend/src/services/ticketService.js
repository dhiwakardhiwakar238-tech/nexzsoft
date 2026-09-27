/*
=========================================================
TICKET SERVICE
=========================================================
*/

import pool from "../config/db.js";


/*
=========================================================
GET TICKETS
=========================================================
*/

export const getTickets = async (
    tenantId
) => {

    const result = await pool.query(
        `
        SELECT
            tenant_id,
            ticket_number,
            customer_phone,
            title,
            description,
            status,
            assigned_to,
            channel,
            note,
            created_at,
            updated_at,
            resolved_at
        FROM tickets
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        `,
        [
            tenantId
        ]
    );


    return result.rows;

};


/*
=========================================================
GENERATE TICKET NUMBER
=========================================================
*/

const generateTicketNumber = async (
    client,
    tenantId
) => {

    const result = await client.query(
        `
        SELECT ticket_number
        FROM tickets
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        FOR UPDATE
        `,
        [
            tenantId
        ]
    );


    let nextNumber = 1;


    if (result.rows.length > 0) {

        const lastTicket =
            result.rows[0].ticket_number;


        const match =
            String(lastTicket).match(
                /(\d+)$/
            );


        if (match) {

            nextNumber =
                Number(match[1]) + 1;

        }

    }


    return `TKT-${String(
        nextNumber
    ).padStart(6, "0")}`;

};


/*
=========================================================
CREATE TICKET
=========================================================
*/

export const createTicket = async (
    tenantId,
    ticketData
) => {

    const client =
        await pool.connect();


    try {

        await client.query(
            "BEGIN"
        );


        const ticketNumber =
            await generateTicketNumber(
                client,
                tenantId
            );


        const result =
            await client.query(
                `
                INSERT INTO tickets (
                    tenant_id,
                    ticket_number,
                    customer_phone,
                    title,
                    description,
                    status,
                    assigned_to,
                    channel,
                    note
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    'Open',
                    NULL,
                    'WhatsApp',
                    NULL
                )
                RETURNING
                    tenant_id,
                    ticket_number,
                    customer_phone,
                    title,
                    description,
                    status,
                    assigned_to,
                    channel,
                    note,
                    created_at,
                    updated_at,
                    resolved_at
                `,
                [
                    tenantId,
                    ticketNumber,
                    ticketData.customerPhone,
                    ticketData.title,
                    ticketData.description
                ]
            );


        await client.query(
            "COMMIT"
        );


        return result.rows[0];

    } catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        client.release();

    }

};

/*
=========================================================
CREATE TICKET FOR CONVERSATION
=========================================================
*/

export const createTicketForConversation = async (
    tenantId,
    conversation,
    ticketData
) => {

    const client =
        await pool.connect();


    try {

        await client.query(
            "BEGIN"
        );


        /*
        =================================================
        GENERATE TICKET NUMBER
        =================================================
        */

        const ticketNumber =
            await generateTicketNumber(
                client,
                tenantId
            );


        /*
        =================================================
        CREATE TICKET
        =================================================
        */

        const ticketResult =
            await client.query(
                `
                INSERT INTO tickets (
                    tenant_id,
                    ticket_number,
                    customer_phone,
                    title,
                    description,
                    status,
                    assigned_to,
                    channel,
                    note
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    'Open',
                    NULL,
                    'WhatsApp',
                    NULL
                )
                RETURNING
                    tenant_id,
                    ticket_number,
                    customer_phone,
                    title,
                    description,
                    status,
                    assigned_to,
                    channel,
                    note,
                    created_at,
                    updated_at,
                    resolved_at
                `,
                [
                    tenantId,
                    ticketNumber,
                    ticketData.customerPhone,
                    ticketData.title,
                    ticketData.description
                ]
            );


        const ticket =
            ticketResult.rows[0];


        /*
        =================================================
        UPDATE CONVERSATION
        =================================================
        */

        const conversationResult =
            await client.query(
                `
                UPDATE conversations
                SET
                    ticket_number = $1,
                    agent_requested_at = NULL,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                  AND tenant_id = $3
                  AND state = 'ticket open'
                RETURNING *
                `,
                [
                    ticket.ticket_number,
                    conversation.id,
                    tenantId
                ]
            );


        /*
        =================================================
        CONVERSATION WAS ALREADY CHANGED
        =================================================
        */

        if (
            conversationResult.rows.length === 0
        ) {

            throw new Error(
                "Conversation is no longer waiting for agent"
            );

        }


        await client.query(
            "COMMIT"
        );


        return {
            ticket:
                ticket,

            conversation:
                conversationResult.rows[0]
        };


    } catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;


    } finally {

        client.release();

    }

};


/*
=========================================================
SAVE TICKET
=========================================================
*/

export const saveTicket = async (
    tenantId,
    ticketNumber,
    ticketData
) => {

    const result =
        await pool.query(
            `
            UPDATE tickets
            SET
                title = $3::varchar,
                description = $4::text,
                status = $5::varchar,
                assigned_to = $6::uuid,
                channel = $7::varchar,
                note = $8::text,
                updated_at = CURRENT_TIMESTAMP,

                resolved_at =
                    CASE
                        WHEN $5::varchar IN (
                            'Resolved',
                            'Closed'
                        )
                        AND resolved_at IS NULL
                        THEN CURRENT_TIMESTAMP

                        WHEN $5::varchar NOT IN (
                            'Resolved',
                            'Closed'
                        )
                        THEN NULL

                        ELSE resolved_at
                    END

            WHERE tenant_id = $1::uuid
              AND ticket_number = $2::varchar

            RETURNING
                tenant_id,
                ticket_number,
                title,
                description,
                status,
                assigned_to,
                channel,
                note,
                created_at,
                updated_at,
                resolved_at
            `,
            [
                tenantId,
                ticketNumber,
                ticketData.title,
                ticketData.description,
                ticketData.status,
                ticketData.assignedTo || null,
                ticketData.channel || "WhatsApp",
                ticketData.note || null
            ]
        );


    if (
        result.rows.length === 0
    ) {

        const error =
            new Error(
                "Ticket not found"
            );

        error.statusCode = 404;

        error.code =
            "TICKET_NOT_FOUND";

        throw error;

    }


    return result.rows[0];

};
