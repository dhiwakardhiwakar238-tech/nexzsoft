import pool from "../config/db.js";


/* =========================================================
   IMPORT CUSTOMERS
========================================================= */

export const importCustomersService = async (
    tenantId,
    contacts
) => {

    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (!tenantId) {

        throw new Error(
            "Tenant ID is required."
        );

    }


    if (!Array.isArray(contacts)) {

        throw new Error(
            "Contacts must be an array."
        );

    }


    const total =
        contacts.length;


    /* =====================================================
       NOTHING TO IMPORT
    ===================================================== */

    if (total === 0) {

        return {

            total: 0,

            imported: 0,

            duplicates: 0,

            invalid: 0

        };

    }


    /* =====================================================
       PHONE NORMALIZATION
    ===================================================== */

    const normalizePhone = (phone) => {

        let value =
            String(phone || "")
                .trim()
                .replace(/\s+/g, "")
                .replace(/-/g, "");


        if (!value) {

            return null;

        }


        /* Remove + */

        if (value.startsWith("+")) {

            value =
                value.substring(1);

        }


        /* Remove leading 0 */

        if (value.startsWith("0")) {

            value =
                value.substring(1);

        }


        /* Indian 10 digit number */

        if (
            value.length === 10 &&
            value.startsWith("9")
        ) {

            value =
                "91" + value;

        }


        /* Final validation */

        if (
            !/^\d{10,15}$/.test(value)
        ) {

            return null;

        }


        return value;

    };


    /* =====================================================
       VALID CONTACTS
    ===================================================== */

    const validContacts = [];

    const invalidContacts = [];


    contacts.forEach(
        (contact, index) => {

            const phone =
                normalizePhone(
                    contact?.phone
                );


            /* Phone mandatory */

            if (!phone) {

                invalidContacts.push({

                    row:
                        index + 1,

                    reason:
                        "Invalid or missing phone number"

                });

                return;

            }


            /* ---------------------------------------------
               LABEL
            --------------------------------------------- */

            let labelId = null;


            if (

                contact?.labels !== undefined &&

                contact?.labels !== null &&

                String(
                    contact.labels
                ).trim() !== ""

            ) {

                const parsedLabelId =
                    Number(
                        contact.labels
                    );


                if (

                    !Number.isInteger(
                        parsedLabelId
                    ) ||

                    parsedLabelId <= 0

                ) {

                    invalidContacts.push({

                        row:
                            index + 1,

                        reason:
                            "Invalid label ID"

                    });

                    return;

                }


                labelId =
                    parsedLabelId;

            }


            /* ---------------------------------------------
               VALID CONTACT
            --------------------------------------------- */

            validContacts.push({

                name:
                    contact?.name
                        ? String(
                            contact.name
                        ).trim()
                        : "",

                phone,

                email:
                    contact?.email
                        ? String(
                            contact.email
                        ).trim()
                        : "",

                labels:
                    labelId

            });

        }
    );


    /* =====================================================
       REMOVE FILE DUPLICATES
    ===================================================== */

    const uniqueContacts = [];

    const duplicatePhoneSet =
        new Set();


    validContacts.forEach(
        (contact) => {

            if (
                duplicatePhoneSet.has(
                    contact.phone
                )
            ) {

                return;

            }


            duplicatePhoneSet.add(
                contact.phone
            );


            uniqueContacts.push(
                contact
            );

        }
    );


    const fileDuplicates =
        validContacts.length -
        uniqueContacts.length;


    /* =====================================================
       FIND EXISTING CUSTOMERS
    ===================================================== */

    const phoneNumbers =
        uniqueContacts.map(
            (contact) =>
                contact.phone
        );


    let existingPhones =
        new Set();


    if (
        phoneNumbers.length > 0
    ) {

        const existingResult =
            await pool.query(
                `
                SELECT phone

                FROM customers

                WHERE tenant_id = $1

                AND phone = ANY(
                    $2::text[]
                )
                `,
                [

                    tenantId,

                    phoneNumbers

                ]
            );


        existingPhones =
            new Set(

                existingResult.rows.map(
                    (row) =>
                        String(
                            row.phone
                        )
                )

            );

    }


    /* =====================================================
       SEPARATE DUPLICATES
    ===================================================== */

    const newContacts = [];

    let databaseDuplicates = 0;


    uniqueContacts.forEach(
        (contact) => {

            if (
                existingPhones.has(
                    contact.phone
                )
            ) {

                databaseDuplicates++;

                return;

            }


            newContacts.push(
                contact
            );

        }
    );


    const duplicates =
        fileDuplicates +
        databaseDuplicates;


    /* =====================================================
       NOTHING NEW
    ===================================================== */

    if (
        newContacts.length === 0
    ) {

        return {

            total,

            imported: 0,

            duplicates,

            invalid:
                invalidContacts.length

        };

    }


    /* =====================================================
       BULK INSERT
    ===================================================== */

    const values = [];

    const placeholders = [];


    newContacts.forEach(
        (contact, index) => {

            const base =
                index * 5;


            placeholders.push(
                `(
                    $${base + 1},
                    $${base + 2},
                    $${base + 3},
                    $${base + 4},
                    $${base + 5}
                )`
            );


            values.push(

                contact.name,

                contact.phone,

                contact.email,

                contact.labels,

                tenantId

            );

        }
    );


    /* =====================================================
       TRANSACTION
    ===================================================== */

    await pool.query(
        "BEGIN"
    );


    try {

        await pool.query(
            `
            INSERT INTO customers
            (
                name,
                phone,
                email,
                labels,
                tenant_id
            )
            VALUES
            ${placeholders.join(",")}
            `,
            values
        );


        await pool.query(
            "COMMIT"
        );

    }
    catch (error) {

        await pool.query(
            "ROLLBACK"
        );

        throw error;

    }


    /* =====================================================
       RESULT
    ===================================================== */

    return {

        total,

        imported:
            newContacts.length,

        duplicates,

        invalid:
            invalidContacts.length

    };

};