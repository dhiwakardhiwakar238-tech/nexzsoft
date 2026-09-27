import axios from "axios";
import metaConfigService from "./metaConfigService.js";
import db from "../config/db.js";

const GRAPH_VERSION = "v24.0";

/*
==========================================
GET META CONFIG
==========================================
*/

const getMetaCredentials = async (tenantId) => {

    const metaConfig =
        await metaConfigService.getMetaConfig(
            tenantId
        );

    if (
        !metaConfig.success ||
        !metaConfig.data
    ) {
        throw new Error(
            "META CONFIG NOT FOUND"
        );
    }

    return {
        accessToken:
            metaConfig.data.access_token,

        phoneNumberId:
            metaConfig.data.phone_number_id,

        wabaId:
            metaConfig.data.waba_id
    };
};


/*
==========================================
SEND TO META API
==========================================
*/

const sendToMeta = async (
    tenantId,
    payload
) => {

    const meta =
        await getMetaCredentials(
            tenantId
        );

    /*
    IMPORTANT:
    Never print the actual access token.
    */

    console.log(
        "META CONFIG",
        {
            phoneNumberId:
                meta.phoneNumberId,

            wabaId:
                meta.wabaId,

            hasAccessToken:
                Boolean(meta.accessToken)
        }
    );

    console.log(
        "SEND META PAYLOAD:",
        JSON.stringify(
            payload,
            null,
            2
        )
    );

    const response =
        await axios.post(
            `https://graph.facebook.com/${GRAPH_VERSION}/${meta.phoneNumberId}/messages`,
            payload,
            {
                headers: {
                    Authorization:
                        `Bearer ${meta.accessToken}`,

                    "Content-Type":
                        "application/json"
                },

                timeout: 30000
            }
        );

    return response.data;
};


/*
==========================================
SEND WHATSAPP TEXT MESSAGE
==========================================
*/

export const sendMessage = async (
    tenantId,
    to,
    message
) => {

    try {

        console.log(
            "================================"
        );

        console.log(
            "WHATSAPP TEXT MESSAGE"
        );

        console.log(
            "TENANT:",
            tenantId
        );

        console.log(
            "TO:",
            to
        );

        console.log(
            "MESSAGE:",
            message
        );

        console.log(
            "================================"
        );

        const data =
            await sendToMeta(
                tenantId,
                {
                    messaging_product:
                        "whatsapp",

                    recipient_type:
                        "individual",

                    to,

                    type:
                        "text",

                    text: {
                        preview_url:
                            false,

                        body:
                            message
                    }
                }
            );

        console.log(
            "META TEXT SUCCESS"
        );

        console.log(
            data
        );

        return {
            success: true,
            data
        };

    } catch (error) {

        console.log(
            "META TEXT ERROR"
        );

        console.log(
            error.response?.data ||
            error.message
        );

        if (error.response) {

            return {
                success: false,

                status:
                    error.response.status,

                error:
                    error.response.data
            };
        }

        return {
            success: false,

            error:
                error.message
        };
    }
};


/*
==========================================
SEND TEMPLATE
==========================================

IMPORTANT:

Template creation:
HEADER example.header_handle
        ↓
Meta upload handle

Template sending:
HEADER parameters
        ↓
Runtime media_id

These are NOT the same value.
==========================================
*/

export const sendTemplate = async (
    tenantId,
    to,
    templateName,
    language = "en_US",
    components = []
) => {

    try {

        /*
        ----------------------------------
        1. COPY SUPPLIED COMPONENTS
        ----------------------------------
        */

        let finalComponents =
            Array.isArray(components)
                ? JSON.parse(
                    JSON.stringify(
                        components
                    )
                )
                : [];


        /*
        ----------------------------------
        2. GET STORED TEMPLATE
        ----------------------------------
        */

        const localTemplate =
            await db.query(
                `
                SELECT
                    media_id,
                    components
                FROM whatsapp_templates
                WHERE tenant_id = $1
                  AND LOWER(name) = LOWER($2)
                ORDER BY created_at DESC
                LIMIT 1
                `,
                [
                    tenantId,
                    templateName
                ]
            );


        const storedTemplate =
            localTemplate.rows[0];


        let storedComponents =
            storedTemplate?.components;


        if (
            typeof storedComponents ===
            "string"
        ) {

            try {

                storedComponents =
                    JSON.parse(
                        storedComponents
                    );

            } catch {

                storedComponents = [];
            }
        }


        /*
        ----------------------------------
        3. FIND HEADER FORMAT
        ----------------------------------
        */

        const storedHeader =
            Array.isArray(
                storedComponents
            )
                ? storedComponents.find(
                    (component) =>
                        String(
                            component?.type ||
                            ""
                        ).toUpperCase() ===
                        "HEADER"
                )
                : null;


        const mediaFormat =
            String(
                storedHeader?.format ||
                ""
            ).toUpperCase();


        const mediaId =
            storedTemplate?.media_id ||
            null;


        console.log(
            "TEMPLATE SEND INFO:",
            {
                templateName,
                mediaFormat,
                hasMediaId:
                    Boolean(mediaId),
                componentCount:
                    finalComponents.length
            }
        );


        /*
        ----------------------------------
        4. MEDIA TEMPLATE
        ----------------------------------
        */

        if (
            [
                "IMAGE",
                "VIDEO",
                "DOCUMENT"
            ].includes(
                mediaFormat
            )
        ) {

            /*
            Media template MUST have
            runtime media_id.
            */

            if (!mediaId) {

                throw new Error(
                    `MEDIA_ID_NOT_FOUND_FOR_TEMPLATE: ${templateName}`
                );
            }


            let parameterType;


            if (
                mediaFormat ===
                "IMAGE"
            ) {

                parameterType =
                    "image";

            } else if (
                mediaFormat ===
                "VIDEO"
            ) {

                parameterType =
                    "video";

            } else {

                parameterType =
                    "document";
            }


            /*
            ----------------------------------
            RUNTIME MEDIA PARAMETER
            ----------------------------------
            */

            const mediaParameter = {
                type:
                    parameterType,

                [parameterType]: {
                    id:
                        String(
                            mediaId
                        )
                }
            };


            /*
            ----------------------------------
            HEADER COMPONENT
            ----------------------------------
            */

            const runtimeHeader = {
                type:
                    "header",

                parameters: [
                    mediaParameter
                ]
            };


            /*
            Replace existing HEADER
            if frontend already supplied one.
            */

            const existingHeaderIndex =
                finalComponents.findIndex(
                    (component) =>
                        String(
                            component?.type ||
                            ""
                        ).toUpperCase() ===
                        "HEADER"
                );


            if (
                existingHeaderIndex >=
                0
            ) {

                finalComponents[
                    existingHeaderIndex
                ] =
                    runtimeHeader;

            } else {

                finalComponents.unshift(
                    runtimeHeader
                );
            }


            console.log(
                "MEDIA HEADER ADDED:",
                JSON.stringify(
                    runtimeHeader,
                    null,
                    2
                )
            );
        }


        /*
        ----------------------------------
        5. FINAL COMPONENTS
        ----------------------------------
        */

        console.log(
            "FINAL TEMPLATE COMPONENTS:"
        );

        console.log(
            JSON.stringify(
                finalComponents,
                null,
                2
            )
        );


        /*
        ----------------------------------
        6. META TEMPLATE PAYLOAD
        ----------------------------------
        */

        const payload = {

            messaging_product:
                "whatsapp",

            to,

            type:
                "template",

            template: {

                name:
                    templateName,

                language: {

                    code:
                        language
                },

                /*
                VERY IMPORTANT:

                Use finalComponents,
                NOT components.
                */

                components:
                    finalComponents
            }
        };


        console.log(
            "================================"
        );

        console.log(
            "FINAL WHATSAPP TEMPLATE PAYLOAD"
        );

        console.log(
            JSON.stringify(
                payload,
                null,
                2
            )
        );

        console.log(
            "================================"
        );


        /*
        ----------------------------------
        7. SEND TO META
        ----------------------------------
        */

        const data =
            await sendToMeta(
                tenantId,
                payload
            );


        console.log(
            "META TEMPLATE SUCCESS"
        );

        console.log(
            data
        );


        return {

            success: true,

            data

        };

    } catch (error) {

        console.log(
            "================================="
        );

        console.log(
            "META TEMPLATE ERROR"
        );

        console.log(
            "STATUS:",
            error.response?.status
        );

        console.log(
            "META ERROR:",
            JSON.stringify(
                error.response?.data,
                null,
                2
            )
        );

        console.log(
            "MESSAGE:",
            error.message
        );

        console.log(
            "================================="
        );


        return {

            success: false,

            error:
                error.response?.data ||
                error.message
        };
    }
};


/*
==========================================
SEND IMAGE
==========================================
*/

export const sendImage = async (
    tenantId,
    to,
    imageUrl,
    caption = ""
) => {

    try {

        const data =
            await sendToMeta(
                tenantId,
                {
                    messaging_product:
                        "whatsapp",

                    to,

                    type:
                        "image",

                    image: {

                        link:
                            imageUrl,

                        caption
                    }
                }
            );


        return {

            success: true,

            data

        };

    } catch (error) {

        console.log(
            "Image Error"
        );

        return {

            success: false,

            error:
                error.response?.data ||
                error.message

        };
    }
};


/*
==========================================
SEND DOCUMENT
==========================================
*/

export const sendDocument = async (
    tenantId,
    to,
    fileUrl,
    filename
) => {

    try {

        const data =
            await sendToMeta(
                tenantId,
                {
                    messaging_product:
                        "whatsapp",

                    to,

                    type:
                        "document",

                    document: {

                        link:
                            fileUrl,

                        filename
                    }
                }
            );


        return {

            success: true,

            data

        };

    } catch (error) {

        console.log(
            "Document Error"
        );

        return {

            success: false,

            error:
                error.response?.data ||
                error.message

        };
    }
};