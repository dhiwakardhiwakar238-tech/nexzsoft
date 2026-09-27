import * as subscriptionService
    from "../services/subscriptionService.js";


/*
==================================================
GET VERIFIED TENANT ID
==================================================

JWT is the source of truth.

Never trust tenantId coming from frontend.
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
ACTIVATE USAGE SUBSCRIPTION
==================================================
*/

export const activateUsageSubscription = async (
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
        ACTIVATE SUBSCRIPTION
        ------------------------------------------
        */

        const result =
            await subscriptionService
                .activateUsageSubscription(
                    tenantId
                );


        return res.status(
            result.status
        ).json(result);

    }

    catch (error) {

        return next(error);

    }

};


/*
==================================================
GET TENANT SUBSCRIPTION
==================================================
*/

export const getTenantSubscription = async (
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
        GET SUBSCRIPTION
        ------------------------------------------
        */

        const subscription =
            await subscriptionService
                .getTenantSubscription(
                    tenantId
                );


        if (!subscription) {

            return res.status(404).json({

                success: false,

                message:
                    "Subscription not found"

            });

        }


        return res.status(200).json({

            success: true,

            data:
                subscription

        });

    }

    catch (error) {

        return next(error);

    }

};

/*
==================================================
GET PAYMENT HISTORY
==================================================
*/

export const getPaymentHistory = async (
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
        GET PAYMENT HISTORY
        ------------------------------------------
        */

        const history =
            await subscriptionService
                .getPaymentHistory(
                    tenantId
                );


        return res.status(200).json({

            success: true,

            paymentHistory:
                history

        });

    }

    catch (error) {

        return next(error);

    }

};

/*
==================================================
CANCEL SUBSCRIPTION
==================================================
*/

export const cancelSubscription = async (
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
        CANCEL SUBSCRIPTION
        ------------------------------------------
        */

        const result =
            await subscriptionService
                .cancelSubscription(
                    tenantId
                );


        return res.status(
            result.status
        ).json(result);

    }

    catch (error) {

        return next(error);

    }

};
