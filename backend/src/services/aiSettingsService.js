import pool from "../config/db.js";

/*
==================================================
DEFAULT AI SETTINGS
==================================================
*/

const DEFAULT_AI_SETTINGS = {
    tone: "Friendly",
    style: "Short & Crisp",
    language: "Auto Detect",
    creativity: 30,
    emoji: "Occasionally",
    followUp: "When Necessary",
    responseLength: "Balanced",

    instructions:
        `You are the customer support assistant for our business.

Always be polite, helpful and professional.

Only provide information that is available in the business knowledge base.

If you don't know something, do not make up an answer.

Ask the customer for additional information when necessary.`
};


/*
==================================================
GET AI SETTINGS
==================================================
*/

export const getAISettings = async (tenantId) => {

    const result = await pool.query(
        `
        SELECT
            id,
            tenant_id,
            tone,
            style,
            language,
            creativity,
            emoji,
            follow_up,
            response_length,
            instructions,
            created_at,
            updated_at
        FROM ai_settings
        WHERE tenant_id = $1
        LIMIT 1
        `,
        [tenantId]
    );

    /*
    --------------------------------------------------
    IF SETTINGS DO NOT EXIST
    --------------------------------------------------
    */

    if (result.rows.length === 0) {

        return {
            tenant_id: tenantId,
            ...DEFAULT_AI_SETTINGS
        };

    }

    return result.rows[0];
};


/*
==================================================
SAVE / UPDATE AI SETTINGS
==================================================
*/

export const saveAISettings = async (
    tenantId,
    settings
) => {

    const {

        tone = DEFAULT_AI_SETTINGS.tone,

        style = DEFAULT_AI_SETTINGS.style,

        language = DEFAULT_AI_SETTINGS.language,

        creativity = DEFAULT_AI_SETTINGS.creativity,

        emoji = DEFAULT_AI_SETTINGS.emoji,

        followUp = DEFAULT_AI_SETTINGS.followUp,

        responseLength = DEFAULT_AI_SETTINGS.responseLength,

        instructions = DEFAULT_AI_SETTINGS.instructions

    } = settings;


    const result = await pool.query(

        `
        INSERT INTO ai_settings
        (
            tenant_id,
            tone,
            style,
            language,
            creativity,
            emoji,
            follow_up,
            response_length,
            instructions
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
            $9
        )

        ON CONFLICT (tenant_id)

        DO UPDATE SET

            tone = EXCLUDED.tone,

            style = EXCLUDED.style,

            language = EXCLUDED.language,

            creativity = EXCLUDED.creativity,

            emoji = EXCLUDED.emoji,

            follow_up = EXCLUDED.follow_up,

            response_length = EXCLUDED.response_length,

            instructions = EXCLUDED.instructions,

            updated_at = CURRENT_TIMESTAMP

        RETURNING *
        `,

        [
            tenantId,
            tone,
            style,
            language,
            Number(creativity),
            emoji,
            followUp,
            responseLength,
            instructions
        ]

    );

    return result.rows[0];
};


export default {

    getAISettings,

    saveAISettings

};
