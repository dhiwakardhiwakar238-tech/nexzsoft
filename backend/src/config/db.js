import dotenv from "dotenv";
dotenv.config();

import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: process.env.DB_SSL === "true"
        ? {
            rejectUnauthorized: false
        }
        : false
});

pool.connect()
    .then(async (client) => {
        console.log("PostgreSQL Connected");

        const dbResult = await client.query(`
            SELECT
                current_database() AS database,
                current_schema() AS schema,
                current_user AS user
        `);

        console.log("DB DEBUG:", dbResult.rows[0]);

        const tableResult = await client.query(`
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_name = 'meta_configs'
        `);

        console.log(
            "META CONFIG TABLE:",
            tableResult.rows
        );

        client.release();
    })
    .catch((err) => {
        console.error(
            "DB CONNECTION ERROR:",
            err.message
        );
    });

export default pool;