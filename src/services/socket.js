import { io } from "socket.io-client";


/*
==================================================
SOCKET URL
==================================================

Development:
VITE_SOCKET_URL=http://localhost:3000

Production:
VITE_SOCKET_URL=https://your-backend-domain.com

==================================================
*/

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    "http://localhost:3000";


let socket = null;

let joinedTenantId = null;


/*
==================================================
CONNECT SOCKET
==================================================
*/

export const connectSocket = (
    tenantId = null
) => {

    /*
    ----------------------------------------------
    Resolve tenant ID
    ----------------------------------------------
    */

    const resolvedTenantId =
        tenantId ||
        localStorage.getItem(
            "tenantId"
        );


    /*
    ----------------------------------------------
    Tenant ID required
    ----------------------------------------------
    */

    if (
        !resolvedTenantId
    ) {

        console.warn(
            "⚠️ Socket: tenantId missing"
        );

        return null;

    }


    /*
    ==================================================
    CREATE SOCKET ONLY ONCE
    ==================================================
    */

    if (!socket) {

        console.log(
            "🔌 Creating Socket.IO connection:",
            SOCKET_URL
        );


        socket = io(
            SOCKET_URL,
            {

                transports: [

                    "websocket",
                    "polling",

                ],

                autoConnect: true,

                reconnection: true,

                reconnectionAttempts:
                    Infinity,

                reconnectionDelay:
                    1000,

                reconnectionDelayMax:
                    5000,

                timeout:
                    20000,

            }
        );


        /*
        ==================================================
        CONNECT
        ==================================================
        */

        socket.on(
            "connect",
            () => {

                console.log(
                    "🟢 Socket connected:",
                    socket.id
                );


                /*
                ------------------------------------------
                Get latest tenant ID
                ------------------------------------------
                */

                const currentTenantId =
                    localStorage.getItem(
                        "tenantId"
                    ) ||
                    resolvedTenantId;


                if (
                    !currentTenantId
                ) {

                    console.warn(
                        "⚠️ Socket connected but tenantId missing"
                    );

                    return;

                }


                /*
                ------------------------------------------
                Tenant room
                ------------------------------------------
                */

                const room =
                    `tenant_${currentTenantId}`;


                console.log(
                    "🏢 Socket Tenant ID:",
                    currentTenantId
                );


                console.log(
                    "🏠 Joining Socket room:",
                    room
                );


                /*
                ------------------------------------------
                IMPORTANT

                Backend expects:

                socket.on("join_tenant", tenantId)

                So send tenantId directly.
                ------------------------------------------
                */

                socket.emit(
                    "join_tenant",
                    currentTenantId
                );


                joinedTenantId =
                    String(
                        currentTenantId
                    );


                console.log(
                    "🟢 Socket joined tenant:",
                    room
                );

            }
        );


        /*
        ==================================================
        DISCONNECT
        ==================================================
        */

        socket.on(
            "disconnect",
            (reason) => {

                console.log(
                    "🔴 Socket disconnected:",
                    reason
                );


                joinedTenantId =
                    null;

            }
        );


        /*
        ==================================================
        CONNECTION ERROR
        ==================================================
        */

        socket.on(
            "connect_error",
            (error) => {

                console.error(
                    "❌ Socket connection error:",
                    error?.message ||
                    error
                );

            }
        );


        /*
        ==================================================
        RECONNECT ATTEMPT
        ==================================================
        */

        socket.io.on(
            "reconnect_attempt",
            (attempt) => {

                /*
                --------------------------------------------------
                NEVER reconnect after the application session has
                been cleared. expireSession() disconnects the socket
                and removes the token; this guard prevents Socket.IO
                from opening another connection during that window.
                --------------------------------------------------
                */

                if (!localStorage.getItem("token")) {

                    console.log(
                        "🛑 Socket reconnect cancelled: no auth token"
                    );

                    socket.disconnect();
                    return;

                }

                console.log(
                    "🔄 Socket reconnect attempt:",
                    attempt
                );

            }
        );


        /*
        ==================================================
        RECONNECTED
        ==================================================
        */

        socket.io.on(
            "reconnect",
            (attempt) => {

                console.log(
                    "🔁 Socket reconnected:",
                    attempt
                );


                const currentTenantId =
                    localStorage.getItem(
                        "tenantId"
                    ) ||
                    resolvedTenantId;


                if (
                    !currentTenantId
                ) {

                    console.warn(
                        "⚠️ Reconnected but tenantId missing"
                    );

                    return;

                }


                const room =
                    `tenant_${currentTenantId}`;


                socket.emit(
                    "join_tenant",
                    currentTenantId
                );


                joinedTenantId =
                    String(
                        currentTenantId
                    );


                console.log(
                    "🟢 Socket rejoined tenant:",
                    room
                );

            }
        );


        /*
        ==================================================
        SOCKET PING TEST
        ==================================================
        */

        socket.on(
            "pong_socket",
            (data) => {

                console.log(
                    "🏓 Socket pong:",
                    data
                );

            }
        );

    }


    /*
    ==================================================
    EXISTING SOCKET
    ==================================================
    */

    if (
        socket.connected &&
        String(
            joinedTenantId
        ) !==
        String(
            resolvedTenantId
        )
    ) {

        console.log(
            "♻️ Socket tenant changed. Rejoining:",
            resolvedTenantId
        );


        /*
        ----------------------------------------------
        Leave old tenant logically and join new tenant
        ----------------------------------------------
        */

        socket.emit(
            "join_tenant",
            resolvedTenantId
        );


        joinedTenantId =
            String(
                resolvedTenantId
            );


        console.log(
            "🟢 Socket joined tenant:",
            `tenant_${resolvedTenantId}`
        );

    }


    /*
    ==================================================
    DEBUG
    ==================================================
    */

    console.log(
        "🟢 Socket instance ready:",
        socket.id ||
        "connecting..."
    );


    return socket;

};


/*
==================================================
GET SOCKET
==================================================
*/

export const getSocket = () => {

    return socket;

};


/*
==================================================
DISCONNECT SOCKET
==================================================
*/

export const disconnectSocket = () => {

    if (
        !socket
    ) {

        return;

    }


    console.log(
        "🔌 Disconnecting Socket.IO"
    );


    socket.removeAllListeners();


    socket.disconnect();


    socket = null;


    joinedTenantId =
        null;

};


/*
==================================================
DEFAULT EXPORT
==================================================
*/

export default connectSocket;