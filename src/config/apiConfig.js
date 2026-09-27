import axios from "axios";
import {
    expireSession,
    isSessionExpired
} from "../services/sessionManager";


/*
==================================================
API URL
==================================================
*/

export const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";


console.log(
    "API_URL =",
    API_URL
);


/*
==================================================
AXIOS API CLIENT
==================================================
*/

const apiClient = axios.create({

    baseURL: API_URL,

    headers: {
        "Content-Type": "application/json",
    },

    timeout: 30000,

});


/*
==================================================
PUBLIC AUTH ENDPOINTS
==================================================

These endpoints MUST always be accessible.

Even after a session expires, the user must be able
to login again.

Therefore:

/api/login
/api/register

must NEVER be blocked by the session-expired flag.
==================================================
*/

const isPublicAuthRequest = (url = "") => {

    const cleanUrl =
        String(url).split("?")[0];

    return (
        cleanUrl === "/api/login" ||
        cleanUrl === "/api/register"
    );

};


/*
==================================================
REQUEST INTERCEPTOR
==================================================

Every protected request automatically receives:

Authorization: Bearer <JWT>

IMPORTANT:

If the previous session expired, protected API
requests are blocked.

BUT login/register requests are ALWAYS allowed.
==================================================
*/

apiClient.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        const requestUrl =
            config?.url || "";

        const publicAuthRequest =
            isPublicAuthRequest(requestUrl);


        /*
        ==================================================
        SESSION EXPIRED CHECK
        ==================================================

        IMPORTANT FIX:

        Previously this check ran before checking whether
        the request was a login request.

        So after session expiry:

            sessionExpiredHandled = 1

        the next login request was also blocked.

        That caused:

            Error: Session expired

        BEFORE the request reached the backend.

        Now login/register bypass this check.
        ==================================================
        */

        if (
            token &&
            !publicAuthRequest &&
            isSessionExpired()
        ) {

            return Promise.reject(
                new Error(
                    "Session expired"
                )
            );

        }


        /*
        ==================================================
        AUTHORIZATION HEADER
        ==================================================
        */

        if (token) {

            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


/*
==================================================
RESPONSE INTERCEPTOR
==================================================

Handles:

401 → Unauthorized
403 → Forbidden

401 from a protected API means the authentication
session is no longer valid.

Login/register requests are excluded from triggering
expireSession().
==================================================
*/

apiClient.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        const status =
            error?.response?.status;

        const requestUrl =
            error?.config?.url || "";

        const publicAuthRequest =
            isPublicAuthRequest(requestUrl);


        /*
        ==================================================
        NORMALIZE API ERROR
        ==================================================
        */

        const backendError =
            error?.response?.data?.error;

        const backendMessage =
            error?.response?.data?.message;


        /*
        --------------------------------------------------
        NEW ERROR FORMAT
        --------------------------------------------------
        */

        if (
            backendError?.message
        ) {

            error.apiError = {

                code:
                    backendError.code ||
                    "UNKNOWN_ERROR",

                message:
                    backendError.message,

                errorId:
                    backendError.errorId ||
                    null,

                details:
                    backendError.details ||
                    null,

            };

        }


        /*
        --------------------------------------------------
        OLD ERROR FORMAT
        --------------------------------------------------
        */

        else if (
            backendMessage
        ) {

            error.apiError = {

                code:
                    "UNKNOWN_ERROR",

                message:
                    backendMessage,

                errorId:
                    null,

                details:
                    null,

            };

        }


        /*
        --------------------------------------------------
        REQUEST TIMEOUT
        --------------------------------------------------
        */

        else if (
            error.code ===
            "ECONNABORTED"
        ) {

            error.apiError = {

                code:
                    "TIMEOUT",

                message:
                    "That took too long to respond. Please try again.",

                errorId:
                    null,

                details:
                    null,

            };

        }


        /*
        --------------------------------------------------
        NETWORK ERROR
        --------------------------------------------------
        */

        else if (
            !error.response
        ) {

            error.apiError = {

                code:
                    "NETWORK_ERROR",

                message:
                    "Can't reach the server. Check your internet connection and try again.",

                errorId:
                    null,

                details:
                    null,

            };

        }


        /*
        --------------------------------------------------
        UNKNOWN ERROR
        --------------------------------------------------
        */

        else {

            error.apiError = {

                code:
                    "UNKNOWN_ERROR",

                message:
                    "Something went wrong. Please try again.",

                errorId:
                    null,

                details:
                    null,

            };

        }


        /*
        ==================================================
        401 AUTHENTICATION FAILURE
        ==================================================

        IMPORTANT:

        Do NOT call expireSession() for:

            /api/login
            /api/register

        because wrong login credentials should simply
        return the backend error.

        A failed login is NOT an expired session.
        ==================================================
        */

        if (
            status === 401 &&
            !publicAuthRequest &&
            localStorage.getItem("token") &&
            !isSessionExpired()
        ) {

            console.warn(
                "🔴 Authentication failed: 401"
            );


            /*
            Session is no longer valid.

            This is a stopper-level issue.
            */

            expireSession();

        }


        /*
        ==================================================
        403
        ==================================================
        */

        if (
            status === 403
        ) {

            console.warn(
                "🔴 Forbidden / invalid JWT: 403"
            );

        }


        return Promise.reject(error);

    }

);


/*
==================================================
getErrorMessage()
==================================================

Use this in normal UI error handling:

catch (error) {
    toast.error(getErrorMessage(error));
}

Do NOT use browser alert() for normal validation.
==================================================
*/

export const getErrorMessage = (
    error
) => {

    return (

        error?.apiError?.message ||

        error?.response?.data?.error?.message ||

        error?.response?.data?.message ||

        error?.message ||

        "Something went wrong. Please try again."

    );

};


export default apiClient;