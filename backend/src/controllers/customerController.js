import pool from "../config/db.js";

import ExcelJS from "exceljs";

import {
    importCustomersService
} from "../services/customerService.js";


/*
==================================================
GET AUTHENTICATED TENANT
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


    if (!authenticatedTenantId) {

        return {

            allowed: false,

            status: 401,

            message:
                "Unauthorized. Tenant information is missing from token."

        };

    }


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
GET CUSTOMER DETAILS
==================================================
*/

export const getCustomerDetails = async (
    req,
    res,
    next
) => {

    try {

        const {
            id
        } = req.params;


        const tenantId =
            getAuthenticatedTenantId(req);


        if (!tenantId) {

            return res.status(401).json({

                success: false,

                message:
                    "Unauthorized."

            });

        }


        /*
        ------------------------------------------
        CUSTOMER MUST BELONG TO JWT TENANT
        ------------------------------------------
        */

        const customerResult =
            await pool.query(
                `
                SELECT *

                FROM customers

                WHERE id = $1
                AND tenant_id = $2

                LIMIT 1
                `,
                [
                    id,
                    tenantId
                ]
            );


        if (
            customerResult.rows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found"

            });

        }


        const customer =
            customerResult.rows[0];


        /*
        ------------------------------------------
        MEMORY
        ------------------------------------------
        */

        const memoryResult =
            await pool.query(
                `
                SELECT
                    memory_key,
                    memory_value

                FROM customer_memory

                WHERE customer_id = $1
                `,
                [
                    id
                ]
            );


        /*
        ------------------------------------------
        CONVERSATIONS
        ------------------------------------------
        */

        const conversationResult =
            await pool.query(
                `
                SELECT
                    id,
                    last_message,
                    updated_at

                FROM conversations

                WHERE customer_number = $1
                AND tenant_id = $2

                ORDER BY updated_at DESC

                LIMIT 10
                `,
                [
                    customer.phone,
                    tenantId
                ]
            );


        /*
        ------------------------------------------
        MESSAGES
        ------------------------------------------
        */

        const messageResult =
            await pool.query(
                `
                SELECT
                    m.id,
                    m.sender,
                    m.message,
                    m.created_at

                FROM messages m

                INNER JOIN conversations c
                    ON c.id = m.conversation_id

                WHERE c.customer_number = $1
                AND c.tenant_id = $2

                ORDER BY m.created_at DESC

                LIMIT 20
                `,
                [
                    customer.phone,
                    tenantId
                ]
            );


        /*
        ------------------------------------------
        NOTES
        ------------------------------------------
        */

        const notesResult =
            await pool.query(
                `
                SELECT
                    id,
                    note,
                    created_at

                FROM customer_notes

                WHERE customer_id = $1

                ORDER BY created_at DESC
                `,
                [
                    id
                ]
            );


        /*
        ------------------------------------------
        ANALYTICS
        ------------------------------------------
        */

        const totalMessages =
            messageResult.rows.length;


        const customerMessages =
            messageResult.rows.filter(
                (m) =>
                    m.sender === "customer"
            ).length;


        const assistantMessages =
            messageResult.rows.filter(
                (m) =>
                    ["assistant", "agent"].includes(m.sender)
            ).length;


        return res.json({

            success: true,

            customer,

            memory:
                memoryResult.rows,

            conversations:
                conversationResult.rows,

            messages:
                messageResult.rows,

            notes:
                notesResult.rows,

            analytics: {

                totalMessages,

                customerMessages,

                assistantMessages

            }

        });

    }
    catch (err) {

        return next(err);

    }

};


/*
==================================================
CREATE CUSTOMER
==================================================
*/

export const createCustomer = async (
    req,
    res,
    next
) => {

    try {

        const {

            name,

            phone,

            email,

            country,

            labels

        } = req.body;


        /*
        IMPORTANT:
        tenantId is NOT taken from body.

        JWT is the source of truth.
        */

        const tenantId =
            getAuthenticatedTenantId(req);


        if (!tenantId) {

            return res.status(401).json({

                success: false,

                message:
                    "Unauthorized."

            });

        }


        /*
        ------------------------------------------
        LABEL
        ------------------------------------------
        */

        const labelValue =
            Array.isArray(labels)
                ? labels[0] || null
                : labels || null;


        /*
        ------------------------------------------
        INSERT
        ------------------------------------------
        */

        const result =
            await pool.query(
                `
                INSERT INTO customers
                (
                    name,
                    phone,
                    email,
                    labels,
                    tenant_id,
                    country
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )

                RETURNING *
                `,
                [
                    name || null,

                    phone || null,

                    email || null,

                    labelValue,

                    tenantId,

                    country || null
                ]
            );


        return res.status(201).json({

            success: true,

            customer:
                result.rows[0]

        });

    }
    catch (err) {

        return next(err);

    }

};


/*
==================================================
UPDATE CUSTOMER
==================================================
*/

export const updateCustomer = async (
    req,
    res,
    next
) => {

    try {

        const {

            id,

            name,

            phone,

            email,

            country,

            labels

        } = req.body;


        const tenantId =
            getAuthenticatedTenantId(req);


        if (!tenantId) {

            return res.status(401).json({

                success: false,

                message:
                    "Unauthorized."

            });

        }


        if (!id) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer ID is required"

            });

        }


        const labelValue =
            Array.isArray(labels)
                ? labels[0] || null
                : labels || null;


        /*
        ------------------------------------------
        UPDATE ONLY OWN TENANT
        ------------------------------------------
        */

        const result =
            await pool.query(
                `
                UPDATE customers

                SET
                    name = $1,
                    phone = $2,
                    email = $3,
                    labels = $4,
                    country = $5

                WHERE id = $6
                AND tenant_id = $7

                RETURNING *
                `,
                [
                    name || null,

                    phone || null,

                    email || null,

                    labelValue,

                    country || null,

                    id,

                    tenantId
                ]
            );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found"

            });

        }


        return res.json({

            success: true,

            customer:
                result.rows[0]

        });

    }
    catch (err) {

        return next(err);

    }

};


/*
==================================================
DELETE CUSTOMER
==================================================
*/

export const deleteCustomer = async (
    req,
    res,
    next
) => {

    try {

        const {
            id
        } = req.body;


        const tenantId =
            getAuthenticatedTenantId(req);


        if (!tenantId) {

            return res.status(401).json({

                success: false,

                message:
                    "Unauthorized."

            });

        }


        if (!id) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer ID is required"

            });

        }


        const result =
            await pool.query(
                `
                DELETE FROM customers

                WHERE id = $1
                AND tenant_id = $2

                RETURNING *
                `,
                [
                    id,
                    tenantId
                ]
            );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found"

            });

        }


        return res.json({

            success: true,

            message:
                "Customer deleted successfully",

            customer:
                result.rows[0]

        });

    }
    catch (err) {

        return next(err);

    }

};


/*
==================================================
IMPORT CUSTOMERS
==================================================
*/

export const importCustomer = async (
    req,
    res,
    next
) => {

    try {

        const {
            tenantId: requestedTenantId,
            contacts
        } = req.body;


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


        const tenantId =
            access.tenantId;


        if (!Array.isArray(contacts)) {

            return res.status(400).json({

                success: false,

                message:
                    "Contacts must be an array."

            });

        }


        const result =
            await importCustomersService(
                tenantId,
                contacts
            );


        return res.status(200).json({

            success: true,

            message:
                "Import completed",

            ...result

        });

    }
    catch (error) {

        return next(error);

    }

};


/*
==================================================
ADD CUSTOMER NOTE
==================================================
*/

export const addCustomerNote = async (
    req,
    res,
    next
) => {

    try {

        const {
            id
        } = req.params;


        const {
            note
        } = req.body;


        const tenantId =
            getAuthenticatedTenantId(req);


        if (!tenantId) {

            return res.status(401).json({

                success: false,

                message:
                    "Unauthorized."

            });

        }


        if (!id) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer ID is required"

            });

        }


        if (
            !note ||
            !String(note).trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Note is required"

            });

        }


        /*
        ------------------------------------------
        VERIFY CUSTOMER OWNERSHIP
        ------------------------------------------
        */

        const customerResult =
            await pool.query(
                `
                SELECT id

                FROM customers

                WHERE id = $1
                AND tenant_id = $2

                LIMIT 1
                `,
                [
                    id,
                    tenantId
                ]
            );


        if (
            customerResult.rows.length === 0
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Forbidden. Customer does not belong to your tenant."

            });

        }


        /*
        ------------------------------------------
        ADD NOTE
        ------------------------------------------
        */

        const result =
            await pool.query(
                `
                INSERT INTO customer_notes
                (
                    customer_id,
                    note
                )

                VALUES
                (
                    $1,
                    $2
                )

                RETURNING *
                `,
                [
                    id,

                    String(note).trim()
                ]
            );


        return res.json({

            success: true,

            note:
                result.rows[0]

        });

    }
    catch (err) {

        return next(err);

    }

};


/*
==================================================
EXPORT CUSTOMERS
==================================================
*/

export const exportCustomers = async (
    req,
    res
) => {

    try {

        const {
            tenantId: requestedTenantId
        } = req.params;


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
        IMPORTANT:
        Use JWT tenant_id.
        */

        const tenantId =
            access.tenantId;


        /*
        ------------------------------------------
        GET CUSTOMERS
        ------------------------------------------
        */

        const result =
            await pool.query(
                `
                SELECT

                    c.name,

                    c.phone AS mobile,

                    c.email,

                    COALESCE(
                        cl.name,
                        ''
                    ) AS labels

                FROM customers c

                LEFT JOIN customer_labels cl

                    ON cl.id::text =
                       c.labels::text

                    AND cl.tenant_id::text =
                        c.tenant_id::text

                WHERE
                    c.tenant_id::text =
                    $1::text

                ORDER BY
                    c.name ASC
                `,
                [
                    tenantId
                ]
            );


        console.log(
            `Exporting ${result.rows.length} customers for authenticated tenant ${tenantId}`
        );


        /*
        ------------------------------------------
        WORKBOOK
        ------------------------------------------
        */

        const workbook =
            new ExcelJS.Workbook();


        workbook.creator =
            "Nexzsoft";


        workbook.lastModifiedBy =
            "Nexzsoft";


        workbook.created =
            new Date();


        workbook.modified =
            new Date();


        const worksheet =
            workbook.addWorksheet(
                "Customers"
            );


        worksheet.columns = [

            {
                header: "Name",
                key: "name",
                width: 30
            },

            {
                header: "Mobile",
                key: "mobile",
                width: 22
            },

            {
                header: "Email",
                key: "email",
                width: 35
            },

            {
                header: "Labels",
                key: "labels",
                width: 25
            }

        ];


        result.rows.forEach(
            (customer) => {

                const row =
                    worksheet.addRow({

                        name:
                            customer.name ||
                            "",

                        mobile:
                            customer.mobile ||
                            "",

                        email:
                            customer.email ||
                            "",

                        labels:
                            customer.labels ||
                            ""

                    });


                row.getCell(
                    "mobile"
                ).numFmt = "@";

            }
        );


        /*
        ------------------------------------------
        HEADER
        ------------------------------------------
        */

        const headerRow =
            worksheet.getRow(1);


        headerRow.font = {

            bold: true,

            size: 12

        };


        headerRow.alignment = {

            vertical: "middle",

            horizontal: "center"

        };


        headerRow.height = 22;


        /*
        ------------------------------------------
        FREEZE HEADER
        ------------------------------------------
        */

        worksheet.views = [

            {

                state: "frozen",

                ySplit: 1

            }

        ];


        /*
        ------------------------------------------
        FILTER
        ------------------------------------------
        */

        worksheet.autoFilter = {

            from: "A1",

            to: "D1"

        };


        /*
        ------------------------------------------
        FILE
        ------------------------------------------
        */

        const fileName =
            `customers_${Date.now()}.xlsx`;


        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );


        res.setHeader(

            "Content-Disposition",

            `attachment; filename="${fileName}"`

        );


        res.setHeader(

            "Cache-Control",

            "no-cache"

        );


        await workbook.xlsx.write(
            res
        );


        return res.end();

    }
    catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "EXPORT CUSTOMERS ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================="
        );


        if (res.headersSent) {

            return res.end();

        }


        return next(error);

    }

};
