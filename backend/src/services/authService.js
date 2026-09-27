
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

/*
==================================================
REGISTER
==================================================
*/

const register = async (
    name,
    business_name,
    country,
    whatsapp_number,
    email,
    password
) => {

    /*
    ------------------------------------------
    BASIC NORMALIZATION
    ------------------------------------------
    */

    const cleanName =
        String(name || "").trim();

    const cleanBusinessName =
        String(business_name || "").trim();

    const cleanCountry =
        String(country || "").trim().toUpperCase();

    const cleanWhatsapp =
        String(whatsapp_number || "").trim();

    const cleanEmail =
        String(email || "").trim().toLowerCase();

    const cleanPassword =
        String(password || "");

    /*
    ------------------------------------------
    VALIDATION
    ------------------------------------------
    */

    if (!cleanName) {
        throw new Error("Name is required");
    }

    if (!cleanBusinessName) {
        throw new Error("Business name is required");
    }

    if (!cleanCountry) {
        throw new Error("Country is required");
    }

    if (!cleanWhatsapp) {
        throw new Error("WhatsApp number is required");
    }

    if (!cleanEmail) {
        throw new Error("Email is required");
    }

    if (!cleanPassword) {
        throw new Error("Password is required");
    }

    if (cleanPassword.length < 6) {
        throw new Error(
            "Password must be at least 6 characters"
        );
    }

    /*
    ------------------------------------------
    CHECK EXISTING EMAIL
    ------------------------------------------

    Login email is stored in:
    tenants.business_email
    ------------------------------------------
    */

    const existingTenant =
        await pool.query(
            `
            SELECT
                tenant_id
            FROM tenants
            WHERE LOWER(business_email) = LOWER($1)
            LIMIT 1
            `,
            [cleanEmail]
        );

    if (existingTenant.rows.length > 0) {

        throw new Error(
            "Email already exists"
        );

    }

    /*
    ------------------------------------------
    CREATE UUIDs
    ------------------------------------------
    */

    const tenantId =
        uuidv4();

    const userId =
        uuidv4();

    /*
    ------------------------------------------
    HASH PASSWORD
    ------------------------------------------
    */

    const passwordHash =
        await bcrypt.hash(
            cleanPassword,
            10
        );

    /*
    ------------------------------------------
    DATABASE TRANSACTION
    ------------------------------------------

    We create:

    1. tenants
    2. meta_configs
    3. tenant_subscriptions
    4. tenant_users

    If anything fails,
    everything is rolled back.
    ------------------------------------------
    */

    const client =
        await pool.connect();

    try {

        await client.query("BEGIN");

        /*
        ==========================================
        CREATE TENANT
        ==========================================
        */

        const tenantResult =
            await client.query(
                `
                INSERT INTO tenants (
                    tenant_id,
                    name,
                    business_name,
                    country,
                    business_email,
                    business_whatsapp,
                    password_hash,
                    role
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8
                )
                RETURNING
                    tenant_id,
                    name,
                    business_name,
                    country,
                    business_email,
                    business_whatsapp,
                    role
                `,
                [
                    tenantId,
                    cleanName,
                    cleanBusinessName,
                    cleanCountry,
                    cleanEmail,
                    cleanWhatsapp,
                    passwordHash,
                    "admin"
                ]
            );

        /*
        ==========================================
        CREATE META CONFIG
        ==========================================
        */

        await client.query(
            `
            INSERT INTO meta_configs (
                tenant_id,
                business_name
            )
            VALUES ($1, $2)
            `,
            [
                tenantId,
                cleanBusinessName || "Unknown"
            ]
        );

        /*
        ==========================================
        CREATE SUBSCRIPTION
        ==========================================
        */

        await client.query(
            `
            INSERT INTO tenant_subscriptions (
                tenant_id,
                plan_id
            )
            VALUES ($1, $2)
            `,
            [
                tenantId,
                4
            ]
        );

        /*
        ==========================================
        CREATE TENANT USER RECORD
        ==========================================

        IMPORTANT:

        tenant_users.user_id
        =
        ACTUAL USER UUID

        tenant_users.tenant_id
        =
        TENANT UUID
        ==========================================
        */

        await client.query(
            `
            INSERT INTO tenant_users (
                user_id,
                tenant_id,
                name,
                email,
                role
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            `,
            [
                userId,
                tenantId,
                cleanName,
                cleanEmail,
                "admin"
            ]
        );

        /*
        ==========================================
        COMMIT
        ==========================================
        */

        await client.query("COMMIT");

        /*
        ==========================================
        RETURN REGISTERED ACCOUNT
        ==========================================
        */

        return {
            ...tenantResult.rows[0],

            user_id:
                userId,

            tenant_id:
                tenantId,

            email:
                cleanEmail,

            country:
                cleanCountry,

            whatsapp_number:
                cleanWhatsapp,

            role:
                "admin"
        };

    } catch (error) {

        /*
        ------------------------------------------
        ROLLBACK
        ------------------------------------------
        */

        await client.query("ROLLBACK");

        /*
        ------------------------------------------
        DUPLICATE EMAIL
        ------------------------------------------
        */

        if (
            error.code === "23505"
        ) {

            throw new Error(
                "Email already exists"
            );

        }

        throw error;

    } finally {

        client.release();

    }
};


/*
==================================================
LOGIN
==================================================
*/

const login = async (
    email,
    password
) => {

    /*
    ------------------------------------------
    NORMALIZE
    ------------------------------------------
    */

    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();

    const cleanPassword =
        String(password || "");

    /*
    ------------------------------------------
    VALIDATION
    ------------------------------------------
    */

    if (!cleanEmail || !cleanPassword) {

        throw new Error(
            "Invalid email or password"
        );

    }

    /*
    ------------------------------------------
    GET TENANT ACCOUNT
    ------------------------------------------
    
    The tenants table is the
    authentication and account table.
    
    tenant_id
        = tenant/account identifier
    
    password_hash
        = login password
    
    status
        = tenant account status
    
    last_login
        = last successful login time
    ------------------------------------------
    */

    const result =
        await pool.query(
            `
            SELECT
    
                tenant_id,
                name,
                business_name,
                country,
                business_email,
                business_whatsapp,
                password_hash,
                role,
                status
    
            FROM tenants
    
            WHERE
                LOWER(business_email) = LOWER($1)
    
            LIMIT 1
            `,
            [cleanEmail]
        );

    /*
    ------------------------------------------
    ACCOUNT NOT FOUND
    ------------------------------------------
    */

    if (
        result.rows.length === 0
    ) {

        throw new Error(
            "Invalid email or password"
        );

    }

    const tenant =
        result.rows[0];

    /*
    ------------------------------------------
    ACCOUNT STATUS
    ------------------------------------------
    */

    if (
        tenant.status &&
        String(
            tenant.status
        ).toLowerCase() !== "active"
    ) {

        throw new Error(
            "Your account is inactive. Please contact support team."
        );

    }

    /*
    ------------------------------------------
    PASSWORD HASH
    ------------------------------------------
    
    Password is stored only in:
    
    tenants.password_hash
    ------------------------------------------
    */

    const storedPassword =
        tenant.password_hash;

    if (!storedPassword) {

        throw new Error(
            "Account password is not configured"
        );

    }

    /*
    ------------------------------------------
    VERIFY PASSWORD
    ------------------------------------------
    */

    const isMatch =
        await bcrypt.compare(
            cleanPassword,
            storedPassword
        );

    if (!isMatch) {

        throw new Error(
            "Invalid email or password"
        );

    }

    /*
    ------------------------------------------
    GET USER ID
    ------------------------------------------
    */

    const userResult =
        await pool.query(
            `
            SELECT
                user_id
            FROM tenant_users
            WHERE
                tenant_id = $1
                AND LOWER(email) = LOWER($2)
            LIMIT 1
            `,
            [
                tenant.tenant_id,
                cleanEmail
            ]
        );

    if (userResult.rows.length === 0) {

        throw new Error(
            "User information not found"
        );

    }

    const userId =
        userResult.rows[0].user_id;

    /*
    ------------------------------------------
    TENANT ID CHECK
    ------------------------------------------
    */

    if (!tenant.tenant_id) {

        throw new Error(
            "Tenant information not found"
        );

    }

    /*
    ------------------------------------------
    UPDATE LAST LOGIN
    ------------------------------------------
    */

    await pool.query(
        `
        UPDATE tenants
        SET
            last_login = NOW(),
            updated_at = NOW()
        WHERE tenant_id = $1
        `,
        [
            tenant.tenant_id
        ]
    );

    /*
    ------------------------------------------
    FINAL ROLE
    ------------------------------------------
    */

    const role =
        tenant.role;

    /*
    ------------------------------------------
    JWT PAYLOAD
    ------------------------------------------
    */

    const tokenPayload = {

        tenant_id:
            tenant.tenant_id,

        user_id:
            userId,

        name:
            tenant.name,

        email:
            tenant.business_email,

        role:
            role

    };

    /*
    ------------------------------------------
    JWT SECRET CHECK
    ------------------------------------------
    */

    if (!process.env.JWT_SECRET) {

        throw new Error(
            "JWT_SECRET is not configured"
        );

    }

    /*
    ------------------------------------------
    CREATE JWT
    ------------------------------------------
    */

    const token =
        jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN ||
                    "1d"
            }
        );

    /*
    ------------------------------------------
    GET SUBSCRIPTION
    ------------------------------------------

    Optional lookup.

    If subscription does not exist,
    login should still work.
    ------------------------------------------
    */

    let planId = null;

    try {

        const subscriptionResult =
            await pool.query(
                `
                SELECT
                    plan_id
                FROM tenant_subscriptions
                WHERE tenant_id = $1
                ORDER BY created_at DESC NULLS LAST
                LIMIT 1
                `,
                [
                    tenant.tenant_id
                ]
            );

        if (
            subscriptionResult.rows.length > 0
        ) {

            planId =
                subscriptionResult.rows[0].plan_id;

        }

    } catch (subscriptionError) {

        /*
        ------------------------------------------
        DO NOT FAIL LOGIN IF SUBSCRIPTION
        LOOKUP FAILS
        ------------------------------------------
        */

        console.warn(
            "Subscription lookup warning:",
            subscriptionError.message
        );

    }

    /*
    ------------------------------------------
    RETURN LOGIN DATA
    ------------------------------------------
    */

    return {

        token,

        tenant: {

            /*
            ----------------------------------
            IMPORTANT IDS
            ----------------------------------
            */

            tenant_id:
                tenant.tenant_id,

            /*
            ----------------------------------
            USER INFO
            ----------------------------------
            */

            user_id:
                userId,

            name:
                tenant.name,

            business_name:
                tenant.business_name,

            country:
                tenant.country,

            email:
                tenant.business_email,

            whatsapp_number:
                tenant.business_whatsapp,

            role:
                role,

            /*
            ----------------------------------
            SUBSCRIPTION
            ----------------------------------
            */

            plan_id:
                planId

        }

    };
};


/*
==================================================
DEACTIVATE ACCOUNT
==================================================
*/

const deactivateAccount = async (tenantId) => {

    /*
    ------------------------------------------
    VALIDATION
    ------------------------------------------
    */

    if (!tenantId) {
        throw new Error(
            "Tenant ID is required"
        );
    }

    /*
    ------------------------------------------
    DEACTIVATE TENANT
    ------------------------------------------
    */

    const result = await pool.query(
        `
        UPDATE tenants
        SET
            status = 'inactive',
            updated_at = NOW()
        WHERE tenant_id = $1
        RETURNING
            tenant_id,
            status,
            updated_at
        `,
        [tenantId]
    );

    /*
    ------------------------------------------
    ACCOUNT NOT FOUND
    ------------------------------------------
    */

    if (result.rows.length === 0) {
        throw new Error(
            "Tenant account not found"
        );
    }

    /*
    ------------------------------------------
    RETURN UPDATED ACCOUNT
    ------------------------------------------
    */

    return result.rows[0];
};


/*
==================================================
EXPORT
==================================================
*/

export default {
    register,
    login,
    deactivateAccount
};
