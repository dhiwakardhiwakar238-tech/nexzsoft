import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

/*
=====================================
ADD LABEL
=====================================
*/

const addLabel = async (tenantId, name) => {

    if (!name || !name.trim()) {

        throw new Error(
            "LABEL NAME IS REQUIRED"
        );

    }

    const existing = await db.query(

        `
        SELECT id
        FROM customer_labels
        WHERE LOWER(name)=LOWER($1) AND tenant_id=$2
        `,

        [name.trim(), tenantId]

    );

    if (existing.rows.length > 0) {

        throw new Error(
            "Label already exists"
        );

    }

    const result = await db.query(

        `
        INSERT INTO customer_labels
        (
            name,
            tenant_id
        )
        VALUES
        (
            $1,
            $2
        )
        RETURNING *
        `,

        [

            name.trim(),
            tenantId

        ]

    );

    return result.rows[0];

};



/*
=====================================
GET LABELS
=====================================
*/

const getLabels = async (tenantId) => {

    const result = await db.query(

        `
        SELECT *
        FROM customer_labels
        WHERE tenant_id = $1
        ORDER BY name ASC
        `,
        
        [tenantId]

    );

    return result.rows;

};

/*
=====================================
DELETE LABEL
=====================================
*/

const deleteLabel = async (id) => {

    const existing = await db.query(

        `
        SELECT id
        FROM customer_labels
        WHERE id=$1
        `,

        [id]

    );

    if (existing.rows.length === 0) {

        throw new Error(
            "Label not found"
        );

    }

    await db.query(

        `
        DELETE
        FROM customer_labels
        WHERE id=$1
        `,

        [id]

    );

    return {

        success: true

    };

};



export default {

    addLabel,
    getLabels,
    deleteLabel

};
