import * as aiSettingsService
    from "../services/aiSettingsService.js";


/*
==================================================
GET VERIFIED TENANT ID
==================================================

JWT is the source of truth.

Never trust tenantId from frontend alone.
==================================================
*/

const getAuthenticatedTenantId = (req) => {

    return req.user?.tenant_id || null;

};


/*
==================================================
VALIDATE TENANT ACCESS
==================================================

JWT Tenant A
+
URL Tenant B
=
403 Forbidden
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
    REQUESTED TENANT CHECK
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
GET AI SETTINGS
==================================================
*/

export const getAISettings = async (
    req,
    res,
    next
) => {

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
        USE VERIFIED JWT TENANT
        ------------------------------------------
        */

        const tenantId =
            access.tenantId;


        /*
        ------------------------------------------
        GET SETTINGS
        ------------------------------------------
        */

        const settings =
            await aiSettingsService.getAISettings(
                tenantId
            );


        return res.status(200).json({

            success: true,

            data: settings

        });

    }

    catch (error) {

        return next(error);

    }

};


/*
==================================================
SAVE AI SETTINGS
==================================================
*/

export const saveAISettings = async (
    req,
    res,
    next
) => {

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
        USE VERIFIED JWT TENANT
        ------------------------------------------
        */

        const tenantId =
            access.tenantId;


        /*
        ------------------------------------------
        REQUEST BODY
        ------------------------------------------
        */

        const settings =
            req.body;


        /*
        ------------------------------------------
        SAVE SETTINGS
        ------------------------------------------
        */

        const savedSettings =
            await aiSettingsService.saveAISettings(

                tenantId,

                settings

            );


        return res.status(200).json({

            success: true,

            message:
                "AI settings saved successfully.",

            data:
                savedSettings

        });

    }

    catch (error) {

        return next(error);

    }

};