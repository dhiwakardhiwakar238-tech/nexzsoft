import pool from "../config/db.js";

export const saveFlow = async (flowData, tenantId) => {
    const {
        name,
        description,
        steps,
        status = "draft",
    } = flowData;

    if (!tenantId) {
        throw new Error("tenant_id is required");
    }

    if (!name) {
        throw new Error("Flow name is required");
    }

    if (!Array.isArray(steps)) {
        throw new Error("Flow steps must be an array");
    }

    // Get the next version for this tenant + flow
    const versionResult = await pool.query(
        `
        SELECT COALESCE(MAX(version), 0) + 1 AS next_version
        FROM flow_definitions
        WHERE tenant_id = $1
          AND name = $2
        `,
        [tenantId, name]
    );

    const version = Number(versionResult.rows[0].next_version);

    const result = await pool.query(
        `
        INSERT INTO flow_definitions (
            tenant_id,
            name,
            description,
            steps,
            status,
            version
        )
        VALUES ($1, $2, $3, $4::jsonb, $5, $6)
        RETURNING *
        `,
        [
            tenantId,
            name,
            description || null,
            JSON.stringify(steps),
            status,
            version,
        ]
    );

    return result.rows[0];
};

export const getFlows = async (tenantId) => {

    const result = await pool.query(
        `
        SELECT
            flow_id,
            tenant_id,
            name,
            description,
            steps,
            status,
            version,
            created_at,
            updated_at
        FROM (
            SELECT
                flow_id,
                tenant_id,
                name,
                description,
                steps,
                status,
                version,
                created_at,
                updated_at,

                ROW_NUMBER() OVER (
                    PARTITION BY name
                    ORDER BY version DESC, updated_at DESC
                ) AS row_num

            FROM flow_definitions

            WHERE tenant_id = $1
              AND status = 'published'
        ) latest_flows

        WHERE row_num = 1

        ORDER BY updated_at DESC
        `,
        [tenantId]
    );

    return result.rows;
};
