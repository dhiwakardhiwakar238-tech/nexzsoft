import { Server } from "socket.io";


let io = null;


/*
==================================================
ALLOWED FRONTEND ORIGINS
==================================================
*/

const allowedOrigins = [

    "http://localhost:5173",

    "https://localhost:5173",

    "https://www.nexzsoft.com",

    "https://nexzsoft.com",

    "https://nexzsoft-wa-apitest.vercel.app",

];


/*
==================================================
INITIALIZE SOCKET.IO
==================================================
*/

export const initSocket = (
    httpServer
) => {

    /*
    ----------------------------------------------
    Prevent duplicate initialization
    ----------------------------------------------
    */

    if (io) {

        console.log(
            "⚠️ Socket.IO already initialized"
        );

        return io;

    }


    /*
    ----------------------------------------------
    Create Socket.IO server
    ----------------------------------------------
    */

    io = new Server(
        httpServer,
        {

            cors: {

                origin: (
                    origin,
                    callback
                ) => {

                    /*
                    --------------------------------
                    Server-to-server / no origin
                    --------------------------------
                    */

                    if (!origin) {

                        return callback(
                            null,
                            true
                        );

                    }


                    /*
                    --------------------------------
                    Allowed frontend
                    --------------------------------
                    */

                    if (
                        allowedOrigins.includes(
                            origin
                        )
                    ) {

                        return callback(
                            null,
                            true
                        );

                    }


                    console.warn(
                        "⚠️ Socket CORS blocked:",
                        origin
                    );


                    return callback(
                        new Error(
                            "Socket.IO CORS blocked"
                        )
                    );

                },


                credentials: true,


                methods: [

                    "GET",
                    "POST",

                ],

            },


            transports: [

                "websocket",
                "polling",

            ],

        }
    );


    /*
    ==================================================
    SOCKET CONNECTION
    ==================================================
    */

    io.on(
        "connection",
        (socket) => {

            console.log(
                "⚡ WebSocket client connected:",
                socket.id
            );


            /*
            ==========================================
            JOIN TENANT FUNCTION
            ==========================================
            */

            const joinTenant = (
                tenantId
            ) => {

                /*
                --------------------------------------
                Validate tenant ID
                --------------------------------------
                */

                if (
                    !tenantId
                ) {

                    console.warn(
                        "⚠️ join_tenant called without tenantId:",
                        socket.id
                    );

                    return;

                }


                /*
                --------------------------------------
                Remove old tenant rooms
                --------------------------------------

                This prevents one socket from
                receiving messages from another
                tenant if tenant changes.
                --------------------------------------
                */

                for (
                    const room
                    of socket.rooms
                ) {

                    if (
                        room.startsWith(
                            "tenant_"
                        )
                    ) {

                        socket.leave(
                            room
                        );

                    }

                }


                /*
                --------------------------------------
                Create tenant room
                --------------------------------------
                */

                const room =
                    `tenant_${tenantId}`;


                socket.join(
                    room
                );


                console.log(
                    `🟢 Socket ${socket.id} joined ${room}`
                );


                console.log(
                    "🏢 Tenant ID:",
                    tenantId
                );


                console.log(
                    "🏠 Socket rooms:",
                    [
                        ...socket.rooms
                    ]
                );

            };


            /*
            ==================================================
            PRIMARY EVENT
            ==================================================
            */

            socket.on(
                "join_tenant",
                joinTenant
            );


            /*
            ==================================================
            BACKWARD COMPATIBILITY
            ==================================================
            */

            socket.on(
                "joinTenant",
                joinTenant
            );


            /*
            ==================================================
            OPTIONAL DEBUG EVENT
            ==================================================
            */

            socket.on(
                "ping_socket",
                () => {

                    socket.emit(
                        "pong_socket",
                        {
                            success: true,
                            socketId: socket.id
                        }
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
                        "❌ WebSocket client disconnected:",
                        socket.id,
                        "Reason:",
                        reason
                    );

                }
            );

        }
    );


    /*
    ==================================================
    INITIALIZED
    ==================================================
    */

    console.log(
        "🟢 Socket.IO initialized"
    );


    return io;

};


/*
==================================================
GET SOCKET.IO INSTANCE
==================================================
*/

export const getIO = () => {

    if (!io) {

        throw new Error(
            "❌ Socket.IO not initialized!"
        );

    }


    return io;

};