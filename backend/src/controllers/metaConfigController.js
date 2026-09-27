
import metaConfigService from "../services/metaConfigService.js";


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
GET META CONFIG
==================================================
*/

const getMetaConfig = async (
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
        GET META CONFIG
        ------------------------------------------
        */

        const data =
            await metaConfigService.getMetaConfig(
                tenantId
            );


        return res.status(200).json(data);

    }

    catch (err) {

        return next(err);

    }

};


/*
==================================================
UPDATE META CONFIG
==================================================
*/

const updateMetaConfig = async (
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
        UPDATE META CONFIG
        ------------------------------------------
        */

        const data =
            await metaConfigService.updateMetaConfig(

                tenantId,

                req.body

            );


        return res.status(200).json(data);

    }

    catch (err) {

        return next(err);

    }

};

/*
==================================================
DISCONNECT META CONFIG
==================================================
*/

const disconnectMetaConfig = async (
    req,
    res
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
        DISCONNECT META CONFIG
        ------------------------------------------
        */

        const data =
            await metaConfigService.disconnectMetaConfig(
                tenantId
            );


        return res.status(200).json(data);

    }

    catch (err) {

        console.error(
            "Disconnect Meta Config Error:",
            {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                requestId:
                    err.response?.headers?.["x-fb-request-id"],
                traceId:
                    err.response?.headers?.["x-fb-trace-id"]
            }
        );

        const status =
                err.response?.status || 500;

        return res.status(status).json({           

            success: false,

            message:
            err.response?.data?.error?.message ||
            err.message

        });

    }

};


export default {

    getMetaConfig,

    updateMetaConfig,

    disconnectMetaConfig

};
