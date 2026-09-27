import crypto from "crypto";


/*
==================================================
COMMON API ERROR PAGE (JSON)
==================================================

Every error that reaches the client — from ANY
route — goes through here and comes out in the
SAME shape:

{
    success: false,
    error: {
        code: "SOME_CODE",
        message: "Human friendly, specific message.",
        errorId: "8f3c1a2b9d",
        details: { ... }   // optional, safe-to-show details only
    }
}

Technical details (stack trace, raw DB error) are
only ever printed to the SERVER console, tagged
with the same errorId, so support can find the
exact failure without leaking internals to users.
==================================================
*/


/*
--------------------------------------------------
KNOWN POSTGRES ERROR CODES -> FRIENDLY MESSAGE

https://www.postgresql.org/docs/current/errcodes-appendix.html
--------------------------------------------------
*/

const PG_ERROR_MAP = {

    "42703": {
        statusCode: 500,
        code: "DB_SCHEMA_OUT_OF_DATE",
        message:
            "This feature isn't fully set up yet. Please contact support.",
    },

    "42P01": {
        statusCode: 500,
        code: "DB_SCHEMA_OUT_OF_DATE",
        message:
            "This feature isn't fully set up yet. Please contact support.",
    },

    "23505": {
        statusCode: 409,
        code: "DUPLICATE_ENTRY",
        message:
            "This already exists — please use a different value.",
    },

    "23503": {
        statusCode: 400,
        code: "INVALID_REFERENCE",
        message:
            "This action refers to something that no longer exists.",
    },

    "23502": {
        statusCode: 400,
        code: "MISSING_REQUIRED_FIELD",
        message:
            "A required field is missing. Please check your input.",
    },

    "ECONNREFUSED": {
        statusCode: 503,
        code: "DATABASE_UNAVAILABLE",
        message:
            "We can't reach the database right now. Please try again shortly.",
    },

};


/*
==================================================
404 HANDLER

For any route that doesn't match anything above
it in index.js.
==================================================
*/

export const notFoundHandler = (
    req,
    res
) => {

    return res.status(404).json({

        success: false,

        error: {

            code: "ROUTE_NOT_FOUND",

            message:
                `No such endpoint: ${req.method} ${req.originalUrl}`,

            errorId:
                crypto.randomUUID().slice(0, 10),

        },

    });

};


/*
==================================================
GLOBAL ERROR HANDLER

Register this LAST, after every route, so any
next(err) or thrown error inside an async route
lands here.
==================================================
*/

export const globalErrorHandler = (
    err,
    req,
    res,
    next
) => {

    const errorId =
        crypto.randomUUID().slice(0, 10);


    /*
    ------------------------------------------
    RESOLVE STATUS + SHAPE
    ------------------------------------------
    */

    let statusCode = 500;

    let code = "INTERNAL_ERROR";

    let message =
        "Something went wrong on our side. Please try again.";

    let details = null;


    if (err?.isApiError) {

        statusCode = err.statusCode || 500;

        code = err.code || code;

        message = err.message || message;

        details = err.details || null;

    }
    else if (
        err?.code &&
        PG_ERROR_MAP[err.code]
    ) {

        const mapped =
            PG_ERROR_MAP[err.code];

        statusCode = mapped.statusCode;

        code = mapped.code;

        message = mapped.message;

    }
    else if (err?.name === "JsonWebTokenError") {

        statusCode = 401;

        code = "INVALID_TOKEN";

        message =
            "Your session isn't valid. Please log in again.";

    }
    else if (err?.name === "TokenExpiredError") {

        statusCode = 401;

        code = "SESSION_EXPIRED";

        message =
            "Your session has expired. Please log in again.";

    }


    /*
    ------------------------------------------
    LOG THE TECHNICAL DETAIL (SERVER ONLY)
    ------------------------------------------
    */

    console.error(

        `❌ [${errorId}] ${req.method} ${req.originalUrl}`,

        "\n   code:",
        err?.code || code,

        "\n   message:",
        err?.message || message,

        "\n   stack:",
        err?.stack

    );


    return res.status(statusCode).json({

        success: false,

        error: {

            code,

            message,

            errorId,

            ...(details ? { details } : {}),

        },

    });

};
