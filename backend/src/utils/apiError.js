/*
==================================================
API ERROR

A single error shape used across the whole
backend. Throw this (or call next(new ApiError(...)))
from any controller and the global error handler
will turn it into a consistent JSON response.
==================================================
*/

export class ApiError extends Error {

    constructor(
        statusCode,
        code,
        message,
        details = null
    ) {

        super(message);

        this.statusCode = statusCode;

        this.code = code;

        this.details = details;

        this.isApiError = true;

    }

}


/*
==================================================
COMMON, READY-TO-USE ERRORS
==================================================
*/

export const badRequest = (
    message = "The request was invalid.",
    details = null
) =>
    new ApiError(
        400,
        "BAD_REQUEST",
        message,
        details
    );


export const unauthorized = (
    message = "You need to log in again."
) =>
    new ApiError(
        401,
        "UNAUTHORIZED",
        message
    );


export const forbidden = (
    message = "You don't have access to this."
) =>
    new ApiError(
        403,
        "FORBIDDEN",
        message
    );


export const notFound = (
    message = "We couldn't find what you're looking for."
) =>
    new ApiError(
        404,
        "NOT_FOUND",
        message
    );


export const conflict = (
    message = "This already exists."
) =>
    new ApiError(
        409,
        "CONFLICT",
        message
    );


export const internal = (
    message = "Something went wrong on our side. Please try again."
) =>
    new ApiError(
        500,
        "INTERNAL_ERROR",
        message
    );

export const phoneVerificationRequired = (
    message = "This WhatsApp phone number needs to be verified again in Meta before it can be registered."
) =>
    new ApiError(
        400,
        "PHONE_VERIFICATION_REQUIRED",
        message
    );
