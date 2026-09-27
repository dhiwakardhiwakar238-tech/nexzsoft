import { disconnectSocket } from "./socket";


/*
==================================================
SESSION INACTIVITY MANAGEMENT
==================================================

Session timeout:

    5 MINUTES OF INACTIVITY

This is NOT a fixed 5-minute JWT expiry.

Example:

    Login
       ↓
    User active
       ↓
    Timer resets
       ↓
    User active
       ↓
    Timer resets
       ↓
    No activity for 5 minutes
       ↓
    Session expired

User activity includes:

- mouse movement
- mouse click
- keyboard
- scroll
- touch
- pointer interaction

JWT itself has a longer lifetime.

The application-level session is controlled by
the inactivity timer.
==================================================
*/


export const SESSION_IDLE_TIMEOUT =
    5 * 60 * 1000;


/*
==================================================
LOCAL STORAGE KEYS
==================================================
*/

const LAST_ACTIVITY_KEY =
    "lastActivityAt";

const SESSION_EXPIRED_KEY =
    "sessionExpiredHandled";


/*
==================================================
INTERNAL STATE
==================================================
*/

let monitorStarted =
    false;

let inactivityTimer =
    null;

let activityWriteTimer =
    null;

let lastActivityAt =
    0;


/*
==================================================
GET LAST ACTIVITY
==================================================
*/

const getLastActivity = () => {

    const value =
        Number(
            localStorage.getItem(
                LAST_ACTIVITY_KEY
            ) || 0
        );


    return Number.isFinite(value)
        ? value
        : 0;

};


/*
==================================================
CLEAR AUTH STORAGE
==================================================

IMPORTANT:

Do NOT remove SESSION_EXPIRED_KEY here.

When a session expires we keep that flag until
the user successfully logs in again.

Why?

To prevent multiple API requests from repeatedly
triggering the session-expired stopper.

initializeSession() removes the flag after a
successful login.
==================================================
*/

export const clearAuthStorage = () => {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "userId"
    );

    localStorage.removeItem(
        "tenantId"
    );

    localStorage.removeItem(
        "user"
    );

    localStorage.removeItem(
        "userName"
    );

    localStorage.removeItem(
        "businessName"
    );

    localStorage.removeItem(
        "userEmail"
    );

    localStorage.removeItem(
        "userRole"
    );


    localStorage.removeItem(
        LAST_ACTIVITY_KEY
    );

};


/*
==================================================
INITIALIZE SESSION
==================================================

Called after successful login.

This starts a completely fresh session.
==================================================
*/

export const initializeSession = () => {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {
        return;
    }


    lastActivityAt =
        Date.now();


    localStorage.setItem(
        LAST_ACTIVITY_KEY,
        String(
            lastActivityAt
        )
    );


    /*
    IMPORTANT:

    A successful new login clears the old
    session-expired flag.
    */

    localStorage.removeItem(
        SESSION_EXPIRED_KEY
    );

};


/*
==================================================
CHECK IDLE TIME
==================================================
*/

export const isSessionIdle = () => {

    const lastActivity =
        lastActivityAt ||
        getLastActivity();


    if (!lastActivity) {
        return false;
    }


    return (
        Date.now() -
        lastActivity >=
        SESSION_IDLE_TIMEOUT
    );

};


/*
==================================================
CHECK EXPIRED FLAG
==================================================
*/

export const isSessionExpired = () => {

    return (
        localStorage.getItem(
            SESSION_EXPIRED_KEY
        ) === "1"
    );

};


/*
==================================================
EXPIRE SESSION
==================================================

This function is ONLY for stopper-level
authentication/session failures.

The browser alert is intentionally kept here.

Normal validation errors MUST use Toast.
==================================================
*/

export const expireSession = () => {

    /*
    --------------------------------------------------
    PREVENT DUPLICATE EXPIRY HANDLING
    --------------------------------------------------
    */

    if (
        isSessionExpired()
    ) {

        return;

    }


    /*
    --------------------------------------------------
    MARK SESSION EXPIRED
    --------------------------------------------------
    */

    localStorage.setItem(
        SESSION_EXPIRED_KEY,
        "1"
    );


    /*
    --------------------------------------------------
    STOP INACTIVITY TIMER
    --------------------------------------------------
    */

    if (
        inactivityTimer
    ) {

        clearTimeout(
            inactivityTimer
        );

        inactivityTimer =
            null;

    }


    /*
    --------------------------------------------------
    STOP LOCAL STORAGE WRITE TIMER
    --------------------------------------------------
    */

    if (
        activityWriteTimer
    ) {

        clearTimeout(
            activityWriteTimer
        );

        activityWriteTimer =
            null;

    }


    /*
    --------------------------------------------------
    RESET INTERNAL ACTIVITY STATE
    --------------------------------------------------
    */

    lastActivityAt =
        0;


    /*
    --------------------------------------------------
    NOTIFY APPLICATION
    --------------------------------------------------
    */

    if (
        typeof window !==
        "undefined"
    ) {

        window.dispatchEvent(
            new Event(
                "session-expired"
            )
        );

    }


    /*
    --------------------------------------------------
    DISCONNECT SOCKET
    --------------------------------------------------
    */

    try {

        disconnectSocket();

    }
    catch (socketError) {

        console.warn(
            "Socket disconnect warning:",
            socketError
        );

    }


    /*
    --------------------------------------------------
    CLEAR AUTHENTICATION
    --------------------------------------------------
    */

    clearAuthStorage();


    /*
    ==================================================
    STOPPER-LEVEL ALERT
    ==================================================

    Session expiry prevents the user from continuing
    the service.

    Therefore this is the ONLY blocking alert used
    by the session manager.

    Normal validation messages must use Toast.
    ==================================================
    */

    if (
        typeof window !==
        "undefined"
    ) {

        window.alert(
            "Session Expired. Login again to continue the service."
        );


        /*
        --------------------------------------------------
        REDIRECT TO LOGIN
        --------------------------------------------------
        */

        if (
            window.location.pathname !==
            "/"
        ) {

            window.location.href =
                "/";

        }

    }

};


/*
==================================================
SCHEDULE EXPIRY CHECK
==================================================
*/

const scheduleExpiryCheck = () => {

    /*
    --------------------------------------------------
    CLEAR PREVIOUS TIMER
    --------------------------------------------------
    */

    if (
        inactivityTimer
    ) {

        clearTimeout(
            inactivityTimer
        );

        inactivityTimer =
            null;

    }


    /*
    --------------------------------------------------
    NO TOKEN = NO SESSION
    --------------------------------------------------
    */

    if (
        !localStorage.getItem(
            "token"
        )
    ) {

        return;

    }


    /*
    --------------------------------------------------
    ALREADY EXPIRED
    --------------------------------------------------
    */

    if (
        isSessionExpired()
    ) {

        return;

    }


    /*
    --------------------------------------------------
    GET LAST ACTIVITY
    --------------------------------------------------
    */

    const lastActivity =
        lastActivityAt ||
        getLastActivity();


    if (!lastActivity) {

        return;

    }


    /*
    --------------------------------------------------
    CALCULATE REMAINING TIME
    --------------------------------------------------
    */

    const elapsed =
        Date.now() -
        lastActivity;


    const remaining =
        SESSION_IDLE_TIMEOUT -
        elapsed;


    /*
    --------------------------------------------------
    SESSION ALREADY IDLE
    --------------------------------------------------
    */

    if (
        remaining <= 0
    ) {

        expireSession();

        return;

    }


    /*
    --------------------------------------------------
    SCHEDULE NEXT CHECK
    --------------------------------------------------
    */

    inactivityTimer =
        setTimeout(
            () => {

                if (
                    isSessionIdle()
                ) {

                    expireSession();

                }
                else {

                    scheduleExpiryCheck();

                }

            },

            Math.max(
                remaining,
                1000
            )

        );

};


/*
==================================================
HANDLE USER ACTIVITY
==================================================
*/

const handleUserActivity = () => {

    /*
    --------------------------------------------------
    NO TOKEN = IGNORE ACTIVITY
    --------------------------------------------------
    */

    if (
        !localStorage.getItem(
            "token"
        )
    ) {

        return;

    }


    /*
    --------------------------------------------------
    EXPIRED SESSION = IGNORE
    --------------------------------------------------
    */

    if (
        isSessionExpired()
    ) {

        return;

    }


    /*
    --------------------------------------------------
    UPDATE MEMORY IMMEDIATELY
    --------------------------------------------------

    This is important for the race condition near
    the 5-minute boundary.

    Example:

        4:59.8 → user clicks

    The timer must recognize that click immediately.
    --------------------------------------------------
    */

    lastActivityAt =
        Date.now();


    /*
    --------------------------------------------------
    THROTTLE LOCAL STORAGE WRITES
    --------------------------------------------------

    We do not write localStorage on every mousemove.
    --------------------------------------------------
    */

    if (
        !activityWriteTimer
    ) {

        activityWriteTimer =
            setTimeout(
                () => {

                    activityWriteTimer =
                        null;


                    /*
                    User may have logged out during
                    this waiting period.
                    */

                    if (
                        !localStorage.getItem(
                            "token"
                        )
                    ) {

                        return;

                    }


                    if (
                        isSessionExpired()
                    ) {

                        return;

                    }


                    localStorage.setItem(
                        LAST_ACTIVITY_KEY,
                        String(
                            lastActivityAt
                        )
                    );


                    /*
                    Restart timeout using the latest
                    activity timestamp.
                    */

                    scheduleExpiryCheck();

                },

                1000

            );

    }

};


/*
==================================================
START SESSION MONITORING
==================================================
*/

export const startSessionMonitoring = () => {

    /*
    --------------------------------------------------
    SSR SAFETY
    --------------------------------------------------
    */

    if (
        typeof window ===
        "undefined"
    ) {

        return () => {};

    }


    /*
    --------------------------------------------------
    NO TOKEN
    --------------------------------------------------
    */

    if (
        !localStorage.getItem(
            "token"
        )
    ) {

        return () => {};

    }


    /*
    --------------------------------------------------
    EXPIRED SESSION
    --------------------------------------------------
    */

    if (
        isSessionExpired()
    ) {

        return () => {};

    }


    /*
    --------------------------------------------------
    RESTORE LAST ACTIVITY
    --------------------------------------------------
    */

    const storedLastActivity =
        getLastActivity();


    if (
        storedLastActivity
    ) {

        lastActivityAt =
            storedLastActivity;

    }
    else {

        /*
        New session / first initialization.
        */

        initializeSession();

    }


    /*
    --------------------------------------------------
    PREVENT DUPLICATE EVENT LISTENERS
    --------------------------------------------------
    */

    if (
        monitorStarted
    ) {

        scheduleExpiryCheck();

        return () => {};

    }


    monitorStarted =
        true;


    /*
    ==================================================
    USER ACTIVITY EVENTS
    ==================================================
    */

    const activityEvents = [

        "mousemove",

        "mousedown",

        "keydown",

        "scroll",

        "touchstart",

        "pointerdown",

    ];


    activityEvents.forEach(
        (eventName) => {

            window.addEventListener(
                eventName,
                handleUserActivity,
                {
                    passive: true
                }
            );

        }
    );


    /*
    ==================================================
    WINDOW FOCUS
    ==================================================
    */

    window.addEventListener(
        "focus",
        scheduleExpiryCheck
    );


    /*
    ==================================================
    TAB VISIBILITY
    ==================================================
    */

    document.addEventListener(
        "visibilitychange",
        scheduleExpiryCheck
    );


    /*
    ==================================================
    START TIMER
    ==================================================
    */

    scheduleExpiryCheck();


    /*
    ==================================================
    CLEANUP
    ==================================================
    */

    return () => {

        activityEvents.forEach(
            (eventName) => {

                window.removeEventListener(
                    eventName,
                    handleUserActivity
                );

            }
        );


        window.removeEventListener(
            "focus",
            scheduleExpiryCheck
        );


        document.removeEventListener(
            "visibilitychange",
            scheduleExpiryCheck
        );


        if (
            inactivityTimer
        ) {

            clearTimeout(
                inactivityTimer
            );

            inactivityTimer =
                null;

        }


        if (
            activityWriteTimer
        ) {

            clearTimeout(
                activityWriteTimer
            );

            activityWriteTimer =
                null;

        }


        monitorStarted =
            false;

    };

};


/*
==================================================
STOP SESSION MONITORING
==================================================
*/

export const stopSessionMonitoring = () => {

    if (
        inactivityTimer
    ) {

        clearTimeout(
            inactivityTimer
        );

        inactivityTimer =
            null;

    }


    if (
        activityWriteTimer
    ) {

        clearTimeout(
            activityWriteTimer
        );

        activityWriteTimer =
            null;

    }


    monitorStarted =
        false;

    lastActivityAt =
        0;

};