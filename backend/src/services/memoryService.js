import pool from "../config/db.js";


/*
====================================================
SAVE / UPDATE MEMORY
====================================================
*/

export const saveMemory = async (

    customerId,

    key,

    value

) => {

    try {

        const existing = await pool.query(

            `
            SELECT id

            FROM customer_memory

            WHERE customer_id=$1

            AND memory_key=$2
            `,

            [

                customerId,

                key

            ]

        );



        if (

            existing.rows.length > 0

        ) {

            await pool.query(

                `
                UPDATE customer_memory

                SET

                    memory_value=$1,

                    updated_at=CURRENT_TIMESTAMP

                WHERE

                    customer_id=$2

                AND

                    memory_key=$3
                `,

                [

                    value,

                    customerId,

                    key

                ]

            );

        }

        else {

            await pool.query(

                `
                INSERT INTO customer_memory
                (

                    customer_id,

                    memory_key,

                    memory_value

                )

                VALUES

                (

                    $1,

                    $2,

                    $3

                )
                `,

                [

                    customerId,

                    key,

                    value

                ]

            );

        }

    }

    catch (err) {

        console.log(

            "Memory Save Error:",

            err.message

        );

    }

};



/*
====================================================
GET MEMORY
====================================================
*/

export const getMemory = async (

    customerId

) => {

    try {

        const result = await pool.query(

            `
            SELECT

                memory_key,

                memory_value

            FROM customer_memory

            WHERE customer_id=$1

            ORDER BY memory_key ASC
            `,

            [

                customerId

            ]

        );

        return result.rows;

    }

    catch (err) {

        console.log(

            "Memory Fetch Error:",

            err.message

        );

        return [];

    }

};



/*
====================================================
DELETE MEMORY
====================================================
*/

export const deleteMemory = async (

    customerId

) => {

    try {

        await pool.query(

            `
            DELETE

            FROM customer_memory

            WHERE customer_id=$1
            `,

            [

                customerId

            ]

        );

    }

    catch (err) {

        console.log(

            "Memory Delete Error:",

            err.message

        );

    }

};



export default {

    saveMemory,

    getMemory,

    deleteMemory

};