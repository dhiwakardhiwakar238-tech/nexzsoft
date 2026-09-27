import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";

const router = express.Router();


/*
==================================================
GET AUTHENTICATED TENANT ID
==================================================

JWT is the source of truth.

Frontend URL tenant ID is only checked
against the JWT tenant ID.
==================================================
*/

const getAuthenticatedTenantId = (req) => {

    return req.user?.tenant_id || null;

};


/*
==================================================
VALIDATE TENANT ACCESS
==================================================
*/

const validateTenantAccess = (
    req,
    requestedTenantId
) => {

    const authenticatedTenantId =
        getAuthenticatedTenantId(req);


    /*
    ------------------------------------------
    JWT TENANT CHECK
    ------------------------------------------
    */

    if (!authenticatedTenantId) {

        return {

            allowed: false,

            status: 401,

            message:
                "Unauthorized. Tenant information is missing from token."

        };

    }


    /*
    ------------------------------------------
    URL TENANT CHECK
    ------------------------------------------
    */

    if (
        requestedTenantId &&
        String(requestedTenantId) !==
        String(authenticatedTenantId)
    ) {

        return {

            allowed: false,

            status: 403,

            message:
                "Forbidden. You are not authorized to access this tenant."

        };

    }


    return {

        allowed: true,

        tenantId:
            authenticatedTenantId

    };

};


/*
==================================================
GET TENANT PROFILE
==================================================

GET /api/users/:tenantId

IMPORTANT:

:tenantId is a UUID.

We DO NOT query users table.

We query tenants table because the login account
is stored in tenants.
==================================================
*/

router.get(
    "/:tenantId",
    async (req, res, next) => {

        try {

            const requestedTenantId =
                req.params.tenantId;


            /*
            ------------------------------------------
            VALIDATE JWT TENANT
            ------------------------------------------
            */

            const access =
                validateTenantAccess(
                    req,
                    requestedTenantId
                );


            if (!access.allowed) {

                return res.status(
                    access.status
                ).json({

                    success: false,

                    message:
                        access.message

                });

            }


            /*
            ------------------------------------------
            GET TENANT PROFILE
            ------------------------------------------
            */

            const result =
                await pool.query(

                    `
                    SELECT
                        tenant_id,
                        name,
                        business_name,
                        business_whatsapp,
                        business_email,
                        role
                    FROM tenants
                    WHERE tenant_id = $1
                    LIMIT 1
                    `,

                    [
                        access.tenantId
                    ]

                );


            /*
            ------------------------------------------
            TENANT NOT FOUND
            ------------------------------------------
            */

            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Tenant not found"

                });

            }


            const tenant =
                result.rows[0];


            /*
            ------------------------------------------
            RETURN PROFILE
            ------------------------------------------
            */

            return res.status(200).json({

                success: true,

                data: {

                    id:
                        tenant.tenant_id,

                    tenant_id:
                        tenant.tenant_id,

                    name:
                        tenant.name,

                    business_name:
                        tenant.business_name,

                    whatsapp_number:
                        tenant.business_whatsapp,

                    email:
                        tenant.business_email,

                    role:
                        tenant.role

                }

            });

        }

        catch (error) {

            console.error(
                "Get User Error:",
                error
            );


            return next(error);

        }

    }
);


/*
==================================================
UPDATE TENANT PROFILE
==================================================

PUT /api/users/:tenantId
==================================================
*/

router.put(
    "/:tenantId",
    async (req, res, next) => {

        try {

            const requestedTenantId =
                req.params.tenantId;


            const {

                name,
                business_name,
                whatsapp_number,
                email

            } = req.body;


            /*
            ------------------------------------------
            VALIDATE JWT TENANT
            ------------------------------------------
            */

            const access =
                validateTenantAccess(
                    req,
                    requestedTenantId
                );


            if (!access.allowed) {

                return res.status(
                    access.status
                ).json({

                    success: false,

                    message:
                        access.message

                });

            }


            /*
            ------------------------------------------
            UPDATE TENANT
            ------------------------------------------
            */

            const result =
                await pool.query(

                    `
                    UPDATE tenants
                    SET
                        name = $1,
                        business_name = $2,
                        business_whatsapp = $3,
                        business_email = $4,
                        updated_at = NOW()
                    WHERE tenant_id = $5
                    RETURNING
                        tenant_id,
                        name,
                        business_name,
                        business_whatsapp,
                        business_email,
                        role
                    `,

                    [

                        name,

                        business_name,

                        whatsapp_number,

                        email,

                        access.tenantId

                    ]

                );


            /*
            ------------------------------------------
            TENANT NOT FOUND
            ------------------------------------------
            */

            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Tenant not found"

                });

            }


            const tenant =
                result.rows[0];


            /*
            ------------------------------------------
            RESPONSE
            ------------------------------------------
            */

            return res.status(200).json({

                success: true,

                message:
                    "Profile updated successfully",

                data: {

                    id:
                        tenant.tenant_id,

                    tenant_id:
                        tenant.tenant_id,

                    name:
                        tenant.name,

                    business_name:
                        tenant.business_name,

                    whatsapp_number:
                        tenant.business_whatsapp,

                    email:
                        tenant.business_email,

                    role:
                        tenant.role

                }

            });

        }

        catch (error) {

            console.error(
                "Update User Error:",
                error
            );


            /*
            ------------------------------------------
            DUPLICATE EMAIL
            ------------------------------------------
            */

            if (
                error.code === "23505"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email already exists."

                });

            }


            return next(error);

        }

    }
);


/*
==================================================
CHANGE PASSWORD
==================================================

PUT /api/users/:tenantId/password

Password is stored in:

tenants.password_hash
==================================================
*/

router.put(
    "/:tenantId/password",
    async (req, res, next) => {

        try {

            const requestedTenantId =
                req.params.tenantId;


            const {

                currentPassword,

                newPassword

            } = req.body;


            /*
            ------------------------------------------
            BASIC VALIDATION
            ------------------------------------------
            */

            if (
                !currentPassword ||
                !newPassword
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Current password and new password are required."

                });

            }


            /*
            ------------------------------------------
            PASSWORD LENGTH
            ------------------------------------------
            */

            if (
                newPassword.length < 6
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "New password must be at least 6 characters."

                });

            }


            /*
            ------------------------------------------
            VALIDATE JWT TENANT
            ------------------------------------------
            */

            const access =
                validateTenantAccess(
                    req,
                    requestedTenantId
                );


            if (!access.allowed) {

                return res.status(
                    access.status
                ).json({

                    success: false,

                    message:
                        access.message

                });

            }


            /*
            ------------------------------------------
            GET PASSWORD HASH
            ------------------------------------------
            */

            const userResult =
                await pool.query(

                    `
                    SELECT
                        tenant_id,
                        password_hash
                    FROM tenants
                    WHERE tenant_id = $1
                    LIMIT 1
                    `,

                    [
                        access.tenantId
                    ]

                );


            /*
            ------------------------------------------
            TENANT NOT FOUND
            ------------------------------------------
            */

            if (
                userResult.rows.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Tenant not found"

                });

            }


            const storedPassword =
                userResult.rows[0].password_hash;


            /*
            ------------------------------------------
            VERIFY CURRENT PASSWORD
            ------------------------------------------
            */

            const isMatch =
                await bcrypt.compare(

                    currentPassword,

                    storedPassword

                );


            if (!isMatch) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Current password incorrect"

                });

            }


            /*
            ------------------------------------------
            HASH NEW PASSWORD
            ------------------------------------------
            */

            const hashedPassword =
                await bcrypt.hash(

                    newPassword,

                    10

                );


            /*
            ------------------------------------------
            UPDATE PASSWORD
            ------------------------------------------
            */

            const updateResult =
                await pool.query(

                    `
                    UPDATE tenants
                    SET
                        password_hash = $1,
                        updated_at = NOW()
                    WHERE tenant_id = $2
                    RETURNING tenant_id
                    `,

                    [

                        hashedPassword,

                        access.tenantId

                    ]

                );


            if (
                updateResult.rows.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Tenant not found"

                });

            }


            /*
            ------------------------------------------
            SUCCESS
            ------------------------------------------
            */

            return res.status(200).json({

                success: true,

                message:
                    "Password updated successfully"

            });

        }

        catch (error) {

            console.error(
                "Change Password Error:",
                error
            );


            return next(error);

        }

    }
);


export default router;