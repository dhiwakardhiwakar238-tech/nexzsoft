import jwt from "jsonwebtoken";
import { unauthorized, forbidden, internal } from "../utils/apiError.js";

/*
==================================================
JWT AUTHENTICATION MIDDLEWARE
==================================================

Expected header:

Authorization: Bearer <JWT>

Flow:

Request
   ↓
Authorization header
   ↓
Extract Bearer token
   ↓
jwt.verify()
   ↓
Validate tenant_id
   ↓
Validate user_id
   ↓
Validate role
   ↓
Validate request tenantId
   ↓
Validate request userId
   ↓
req.user
   ↓
next()

Every failure below goes through next(err), so it
comes back in the SAME common error shape as every
other API (see middleware/errorHandler.js).
==================================================
*/

export const authenticateToken = (
    req,
    res,
    next
) => {

   console.log("🔐 AUTH DEBUG:", {
        method: req.method,
        url: req.originalUrl,
        hasAuthorizationHeader: Boolean(req.headers.authorization),
        authorizationHeaderType: typeof req.headers.authorization,
    });

    try {

        /*
        ==================================================
        GET AUTHORIZATION HEADER
        ==================================================
        */

        const authHeader =
            req.headers.authorization;


        /*
        ==================================================
        CHECK HEADER
        ==================================================
        */

        if (!authHeader) {

            throw unauthorized(
                "You're not logged in. Please log in again."
            );

        }


        /*
        ==================================================
        CHECK BEARER FORMAT
        ==================================================
        */

        if (
            !authHeader.startsWith("Bearer ")
        ) {

            throw unauthorized(
                "Your session token is malformed. Please log in again."
            );

        }


        /*
        ==================================================
        EXTRACT TOKEN
        ==================================================
        */

        const token =
            authHeader.substring(7).trim();


        if (!token) {

            throw unauthorized(
                "Your session token is missing. Please log in again."
            );

        }


        /*
        ==================================================
        JWT SECRET CHECK
        ==================================================
        */

        if (!process.env.JWT_SECRET) {

            console.error(
                "❌ JWT_SECRET is not configured."
            );

            throw internal(
                "Authentication isn't configured correctly. Please contact support."
            );

        }


        /*
        ==================================================
        VERIFY JWT
        ==================================================
        */

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        /*
        ==================================================
        VALIDATE REQUIRED TENANT ID
        ==================================================
        */

        if (!decoded?.tenant_id) {

            throw forbidden(
                "Your session is missing account information. Please log in again."
            );

        }


        /*
        ==================================================
        VALIDATE REQUIRED USER ID
        ==================================================
        */

        if (!decoded?.user_id) {

            throw forbidden(
                "Your session is missing user information. Please log in again."
            );

        }


        /*
        ==================================================
        VALIDATE REQUIRED ROLE
        ==================================================
        */

        if (!decoded?.role) {

            throw forbidden(
                "Your session is missing role information. Please log in again."
            );

        }


        /*
        ==================================================
        REQUEST TENANT ID CHECK
        ==================================================

        If frontend sends tenantId through:

        req.params.tenantId
        req.params.tenant_id
        req.query.tenantId
        req.query.tenant_id
        req.body.tenantId
        req.body.tenant_id

        it MUST match the tenant_id inside JWT.

        This prevents one tenant from requesting
        another tenant's data.
        ==================================================
        */

        const requestTenantId =
            req.params?.tenantId ||
            req.params?.tenant_id ||
            req.query?.tenantId ||
            req.query?.tenant_id ||
            req.body?.tenantId ||
            req.body?.tenant_id ||
            null;


        if (
            requestTenantId &&
            String(requestTenantId).trim() !==
            String(decoded.tenant_id).trim()
        ) {

            console.warn(
                "🚫 JWT TENANT MISMATCH:",
                {
                    jwt_tenant_id:
                        decoded.tenant_id,

                    request_tenant_id:
                        requestTenantId,

                    method:
                        req.method,

                    url:
                        req.originalUrl
                }
            );

            throw forbidden(
                "This account doesn't match your logged-in account."
            );

        }


        /*
        ==================================================
        REQUEST USER ID CHECK
        ==================================================

        If frontend sends userId through:

        req.params.userId
        req.params.user_id
        req.query.userId
        req.query.user_id
        req.body.userId
        req.body.user_id

        it MUST match the user_id inside JWT.
        ==================================================
        */

        const requestUserId =
            req.params?.userId ||
            req.params?.user_id ||
            req.query?.userId ||
            req.query?.user_id ||
            req.body?.userId ||
            req.body?.user_id ||
            null;


        if (
            requestUserId &&
            String(requestUserId).trim() !==
            String(decoded.user_id).trim()
        ) {

            console.warn(
                "🚫 JWT USER MISMATCH:",
                {
                    jwt_user_id:
                        decoded.user_id,

                    request_user_id:
                        requestUserId,

                    method:
                        req.method,

                    url:
                        req.originalUrl
                }
            );

            throw forbidden(
                "This user doesn't match your logged-in account."
            );

        }


        /*
        ==================================================
        ATTACH VERIFIED USER TO REQUEST
        ==================================================

        IMPORTANT:

        Controllers should use:

        req.user.tenant_id
        req.user.user_id
        req.user.role

        instead of trusting tenantId/userId
        supplied by frontend.
        ==================================================
        */

        req.user = decoded;


        /*
        ==================================================
        SAFE DEBUG
        ==================================================

        NEVER log the actual JWT token.
        ==================================================
        */

        console.log(
            "🔐 JWT verified:",
            {
                tenant_id:
                    decoded.tenant_id,

                user_id:
                    decoded.user_id,

                role:
                    decoded.role
            }
        );


        /*
        ==================================================
        CONTINUE
        ==================================================
        */

        next();

    } catch (error) {

        /*
        ==================================================
        EXPIRED TOKEN
        ==================================================
        */

        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return next(
                unauthorized(
                    "Your session has expired. Please log in again."
                )
            );

        }


        /*
        ==================================================
        INVALID TOKEN
        ==================================================
        */

        if (
            error.name ===
            "JsonWebTokenError"
        ) {

            return next(
                forbidden(
                    "Your session is invalid. Please log in again."
                )
            );

        }


        /*
        ==================================================
        ApiError THROWN ABOVE (unauthorized/forbidden/internal)
        OR ANY OTHER UNEXPECTED ERROR
        ==================================================
        */

        return next(error);

    }

};


export default {
    authenticateToken
};
