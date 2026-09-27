import { useState, useEffect, useCallback, useRef } from "react";

import toast from "react-hot-toast";

import "./DashboardV2.css";

import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import DashboardHome from "./DashboardHome/DashboardHome";

import Inbox from "./Inbox/Inbox";
import Broadcast from "./Broadcast/Broadcast";
import Contacts from "./Contacts/Contacts";
import WhatsappFlow from "./WhatsappFlow/WhatsappFlow";

import Analytics from "./Analytics/Analytics";
import AIStudio from "./KnowledgeBase/AIStudio";
import Subscription from "./Subscription/Subscription";
import Integration from "./Integration/Integration";
import Ticketing from "./Ticketing/Ticketing";
import TicketModal from "./TicketModal/TicketModal";

import Settings from "./Settings/Settings";

import WhatsAppConnect from "./WhatsApp/WhatsAppConnect";

import { 
    connectSocket
} from "../../services/socket";

import {
    getTenantSubscription,
    getCustomers,
    getConversations,
    markConversationRead,
    getMessages,
    sendWhatsAppMessage,
    toggleAiPause,
    getTickets,
} from "../../services/api";

import { getErrorMessage } from "../../config/apiConfig";
import { startSessionMonitoring, isSessionExpired } from "../../services/sessionManager";


function DashboardV2() {

    /* =====================================================
       SESSION INACTIVITY MONITOR
       Session expires only after 5 minutes with no user
       activity. Active usage keeps the session alive.
    ===================================================== */

    useEffect(() => {

        const stopMonitoring =
            startSessionMonitoring();

        return () => {
            stopMonitoring?.();
        };

    }, []);

    /* =====================================================
       WHATSAPP TAB
    ===================================================== */

    const [whatsAppTab, setWhatsAppTab] =
        useState("overview");


    /* =====================================================
       DASHBOARD
    ===================================================== */

    const [dashboardPage, setDashboardPage] =
        useState("dashboard");

    const [tickets, setTickets] = 
        useState([]);

    const [expandedPanel, setExpandedPanel] =
        useState(null);

    const [activeSidebar, setActiveSidebar] =
        useState("dashboard");


    /* =====================================================
       WHATSAPP DATA
    ===================================================== */

    const [customers, setCustomers] =
        useState([]);

    const [conversations, setConversations] =
        useState([]);


    /* =====================================================
       SELECTED CHAT
    ===================================================== */

    const [selectedCustomer, setSelectedCustomer] =
        useState(null);

    const [selectedConversation, setSelectedConversation] =
        useState(null);

    const [chat, setChat] =
        useState([]);

    const [message, setMessage] =
        useState("");


    /* =====================================================
       REFS
    ===================================================== */

    const selectedConversationRef =
        useRef(null);

    const selectedCustomerRef =
        useRef(null);

    const conversationsRef =
        useRef([]);

    /*
    -----------------------------------------------------
    Track socket messages that arrived while an API
    request was in progress.

    This prevents:

    Socket message
        ↓
    setChat(...)
        ↓
    old getMessages()
        ↓
    setChat(old messages)

    from deleting the live message.
    -----------------------------------------------------
    */

    const liveMessagesRef =
        useRef(new Map());

    const [ticketModal, setTicketModal] =
        useState({
            mode: null,
            ticket: null,
            customerPhone: ""
        });

    /* =====================================================
       KEEP REFS IN SYNC
    ===================================================== */

    useEffect(() => {

        selectedConversationRef.current =
            selectedConversation;

    }, [selectedConversation]);


    useEffect(() => {

        selectedCustomerRef.current =
            selectedCustomer;

    }, [selectedCustomer]);


    useEffect(() => {

        conversationsRef.current =
            Array.isArray(conversations)
                ? conversations
                : [];

    }, [conversations]);


    /* =====================================================
       AI PAUSE (SCOPED TO THE OPEN CHAT ONLY)
    ===================================================== */

    const activeConversationForPause =
        Array.isArray(conversations)
            ? conversations.find(
                (item) =>
                    item.id === selectedConversation
            )
            : null;

    const isAiPausedForActiveChat =
        activeConversationForPause?.ai_paused === true;


    const handleToggleAiPause = useCallback(async () => {

        const conversationId =
            selectedConversationRef.current;

        if (!conversationId) {
            return;
        }

        const current =
            conversationsRef.current.find(
                (item) => item.id === conversationId
            );

        const nextPaused =
            !(current?.ai_paused === true);

        /*
        ------------------------------------------
        OPTIMISTIC UPDATE — only the matching
        conversation is touched, every other chat
        keeps its own ai_paused value untouched.
        ------------------------------------------
        */

        setConversations((prev) =>
            (Array.isArray(prev) ? prev : []).map(
                (item) =>
                    item.id === conversationId
                        ? { ...item, ai_paused: nextPaused }
                        : item
            )
        );

        try {

            await toggleAiPause(
                conversationId,
                nextPaused
            );

        } catch (error) {

            console.error(
                "Failed to toggle AI pause:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );

            /* revert on failure */
            setConversations((prev) =>
                (Array.isArray(prev) ? prev : []).map(
                    (item) =>
                        item.id === conversationId
                            ? { ...item, ai_paused: !nextPaused }
                            : item
                )
            );
        }

    }, []);


    /* =====================================================
       TENANT ID
    ===================================================== */

    const getTenantId = useCallback(() => {

        const tenantId =
            localStorage.getItem("tenantId");

        if (!tenantId) {

            console.warn(
                "⚠️ Tenant ID not found in localStorage"
            );

            return null;
        }

        return tenantId;

    }, []);


    /* =====================================================
       NORMALIZE MESSAGE
    ===================================================== */

    const normalizeMessage = useCallback((msg) => {

        if (!msg) {
            return null;
        }

        const text =
            msg.message ??
            msg.text ??
            msg.body ??
            "";

        if (!text) {
            return null;
        }

        return {

            id:
                msg.id ||
                msg.whatsapp_message_id ||
                `socket-${Date.now()}-${Math.random()}`,

            sender:
                msg.sender || "customer",

            text,

            created_at:
                msg.created_at ||
                msg.timestamp ||
                new Date().toISOString(),

            status:
                msg.status ||
                "received",

            whatsapp_message_id:
                msg.whatsapp_message_id ||
                null,

        };

    }, []);


    /* =====================================================
       MESSAGE ID
    ===================================================== */

    const getMessageUniqueId = useCallback((msg) => {

        if (!msg) {
            return null;
        }

        if (msg.id) {
            return String(msg.id);
        }

        if (msg.whatsapp_message_id) {
            return String(msg.whatsapp_message_id);
        }

        return null;

    }, []);


    /* =====================================================
       MERGE MESSAGES
    ===================================================== */

    const mergeMessages = useCallback(
        (baseMessages, extraMessages) => {

            const all = [

                ...(Array.isArray(baseMessages)
                    ? baseMessages
                    : []),

                ...(Array.isArray(extraMessages)
                    ? extraMessages
                    : []),

            ];

            const result = [];

            const seenIds =
                new Set();

            for (const msg of all) {

                if (!msg) {
                    continue;
                }

                const uniqueId =
                    getMessageUniqueId(msg);

                /*
                --------------------------------------------------
                If a proper ID exists, use it for deduplication.
                --------------------------------------------------
                */

                if (uniqueId) {

                    if (seenIds.has(uniqueId)) {
                        continue;
                    }

                    seenIds.add(uniqueId);

                    result.push(msg);

                    continue;
                }

                /*
                --------------------------------------------------
                Fallback duplicate detection.
                --------------------------------------------------
                */

                const duplicate =
                    result.some(
                        (existing) =>
                            existing?.sender ===
                                msg?.sender &&
                            existing?.text ===
                                msg?.text &&
                            existing?.created_at ===
                                msg?.created_at
                    );

                if (!duplicate) {
                    result.push(msg);
                }

            }

            /*
            --------------------------------------------------
            SORT CHRONOLOGICALLY
            --------------------------------------------------
            */

            result.sort(
                (a, b) =>
                    new Date(a.created_at || 0) -
                    new Date(b.created_at || 0)
            );

            return result;

        },
        [getMessageUniqueId]
    );


    /* =====================================================
       LOAD CUSTOMERS + CONVERSATIONS
    ===================================================== */

    const loadData = useCallback(async () => {

        const tenantId =
            getTenantId();

        if (!tenantId) {
            return;
        }

        try {

            setLoadingData(true);

            const [
                customersResponse,
                conversationsResponse,
            ] = await Promise.all([

                getCustomers(
                    tenantId
                ),

                getConversations(
                    tenantId
                ),

            ]);


            const customerList =
                Array.isArray(
                    customersResponse
                )
                    ? customersResponse
                    : [];


            const conversationList =
                Array.isArray(
                    conversationsResponse
                )
                    ? conversationsResponse
                    : [];

            setCustomers(
                customerList
            );

            conversationsRef.current =
                conversationList;

            setConversations(
                conversationList
            );


            /*
            --------------------------------------------------
            Keep selected conversation alive.
            --------------------------------------------------
            */

            if (
                selectedConversationRef.current
            ) {

                const updatedConversation =
                    conversationList.find(
                        (conversation) =>
                            String(conversation.id) ===
                            String(
                                selectedConversationRef.current
                            )
                    );


                if (!updatedConversation) {

                    console.warn(
                        "⚠️ Selected conversation no longer exists:",
                        selectedConversationRef.current
                    );

                }

            }

        } catch (error) {

            console.error(
                "❌ DASHBOARD LOAD ERROR:",
                error
            );

        } finally {

            setLoadingData(false);

        }

    }, [getTenantId]);


    /* =====================================================
       LOADING
    ===================================================== */

    const [loadingData, setLoadingData] =
        useState(false);


    /* =====================================================
       REFRESH OPEN CHAT
    ===================================================== */

    const refreshOpenChatMessages =
        useCallback(
            async (conversationId) => {

                if (!conversationId) {
                    return;
                }

                try {

                    const messages =
                        await getMessages(
                            conversationId
                        );


                    const formatted =
                        Array.isArray(messages)
                            ? messages
                                .map(
                                    normalizeMessage
                                )
                                .filter(Boolean)
                            : [];


                    /*
                    --------------------------------------------------
                    IMPORTANT

                    Socket messages may have arrived while
                    getMessages() was running.

                    Merge them instead of replacing chat.
                    --------------------------------------------------
                    */

                    const liveMessages = [];

                    for (
                        const [
                            liveConversationId,
                            liveMessage
                        ]
                        of liveMessagesRef.current.entries()
                    ) {

                        if (
                            String(
                                liveConversationId
                            ) !==
                            String(
                                conversationId
                            )
                        ) {
                            continue;
                        }

                        if (liveMessage) {

                            liveMessages.push(
                                liveMessage
                            );

                        }

                    }


                    const merged =
                        mergeMessages(
                            formatted,
                            liveMessages
                        );


                    /*
                    --------------------------------------------------
                    Only update if this is still the open chat.
                    --------------------------------------------------
                    */

                    if (
                        String(
                            selectedConversationRef.current
                        ) ===
                        String(
                            conversationId
                        )
                    ) {

                        setChat(
                            merged
                        );

                    }

                } catch (error) {

                    console.error(
                        "❌ OPEN CHAT REFRESH ERROR:",
                        error
                    );

                }

            },
            [
                normalizeMessage,
                mergeMessages
            ]
        );


    /* =====================================================
       SOCKET.IO REALTIME
    ===================================================== */

    useEffect(() => {

        const tenantId =
            getTenantId();

        if (!tenantId) {
            return;
        }


        const socket =
            connectSocket(
                tenantId
            );


        if (!socket) {

            console.error(
                "❌ Socket.IO instance unavailable"
            );

            return;
        }


        console.log(
            "🟢 Dashboard Socket instance ready:",
            socket.id ||
                "connecting..."
        );


        /* =================================================
           SAME ID HELPER
        ================================================= */

        const sameId = (
            a,
            b
        ) => {

            if (
                a === null ||
                a === undefined ||
                b === null ||
                b === undefined
            ) {
                return false;
            }

            return (
                String(a) ===
                String(b)
            );

        };


        /* =================================================
           GET CONVERSATION ID
        ================================================= */

        const getConversationId = (
            payload
        ) => {

            return (

                payload?.conversationId ||

                payload?.conversation_id ||

                payload?.message?.conversation_id ||

                payload?.message?.conversationId ||

                payload?.data?.conversationId ||

                payload?.data?.conversation_id ||

                payload?.conversation?.id ||

                null

            );

        };


        /* =================================================
           GET MESSAGE
        ================================================= */

        const getMessage = (
            payload
        ) => {

            const raw =

                payload?.message ||

                payload?.data?.message ||

                payload?.data ||

                null;


            if (!raw) {
                return null;
            }


            return normalizeMessage(
                raw
            );

        };


        /* =================================================
           UPDATE CONVERSATION LIST
        ================================================= */

        const updateConversationList = (
            conversationId,
            payload,
            message
        ) => {

            setConversations(
                (prev) => {

                    const list =
                        Array.isArray(prev)
                            ? [...prev]
                            : [];


                    const index =
                        list.findIndex(
                            (item) =>
                                sameId(
                                    item.id,
                                    conversationId
                                )
                        );


                    const incomingConversation =
                        payload?.conversation ||
                        null;


                    /*
                    --------------------------------------------------
                    New conversation
                    --------------------------------------------------
                    */

                    if (index === -1) {

                        if (
                            !incomingConversation?.id
                        ) {

                            return list;

                        }


                        const next = [

                            {
                                ...incomingConversation,

                                last_message:
                                    payload?.last_message ??
                                    message?.text ??
                                    incomingConversation.last_message,

                                unread_count:
                                    payload?.unread_count ??
                                    incomingConversation.unread_count ??
                                    0,

                                updated_at:
                                    payload?.updated_at ??
                                    message?.created_at ??
                                    incomingConversation.updated_at,

                            },

                            ...list,

                        ];


                        conversationsRef.current =
                            next;


                        return next;

                    }


                    /*
                    --------------------------------------------------
                    Existing conversation
                    --------------------------------------------------
                    */

                    const existing =
                        list[index];


                    const updated = {

                        ...existing,

                        ...incomingConversation,

                        last_message:
                            payload?.last_message ??
                            message?.text ??
                            existing.last_message,

                        unread_count:
                            payload?.unread_count ??
                            existing.unread_count ??
                            0,

                        updated_at:
                            payload?.updated_at ??
                            message?.created_at ??
                            existing.updated_at,

                    };


                    const next = [

                        updated,

                        ...list.filter(
                            (_, i) =>
                                i !== index
                        ),

                    ];


                    conversationsRef.current =
                        next;


                    return next;

                }
            );

        };


        /* =================================================
           HANDLE REALTIME MESSAGE
        ================================================= */

        const handleRealtimeMessage =
            (payload) => {

                console.log(
                    "📩 REALTIME NEW MESSAGE:",
                    payload
                );


                /*
                --------------------------------------------------
                TENANT CHECK
                --------------------------------------------------
                */

                const payloadTenant =

                    payload?.tenantId ||

                    payload?.tenant_id ||

                    payload?.message?.tenant_id ||

                    payload?.data?.tenantId ||

                    payload?.data?.tenant_id ||

                    null;


                if (

                    payloadTenant &&

                    String(
                        payloadTenant
                    ) !==
                    String(
                        tenantId
                    )

                ) {

                    console.warn(
                        "⚠️ Ignoring message from another tenant:",
                        payloadTenant
                    );

                    return;

                }


                /*
                --------------------------------------------------
                CONVERSATION ID
                --------------------------------------------------
                */

                const conversationId =
                    getConversationId(
                        payload
                    );


                /*
                --------------------------------------------------
                MESSAGE
                --------------------------------------------------
                */

                const incomingMessage =
                    getMessage(
                        payload
                    );


                if (!conversationId) {

                    console.warn(
                        "⚠️ Realtime message missing conversationId:",
                        payload
                    );

                    return;

                }


                if (!incomingMessage) {

                    console.warn(
                        "⚠️ Realtime message missing message body:",
                        payload
                    );

                    return;

                }


                console.log(
                    "📨 Incoming live message:",
                    {
                        conversationId,
                        message:
                            incomingMessage.text,
                        sender:
                            incomingMessage.sender
                    }
                );


                /*
                --------------------------------------------------
                SAVE LIVE MESSAGE IN REF

                This survives an API refresh race.
                --------------------------------------------------
                */

                const existingLive =
                    liveMessagesRef.current.get(
                        String(
                            conversationId
                        )
                    ) || [];


                const mergedLive =
                    mergeMessages(
                        existingLive,
                        [incomingMessage]
                    );


                /*
                Keep only latest reasonable set.
                */

                const limitedLive =
                    mergedLive.slice(-50);


                liveMessagesRef.current.set(
                    String(
                        conversationId
                    ),
                    limitedLive
                );


                /*
                --------------------------------------------------
                UPDATE CONVERSATION LIST
                --------------------------------------------------
                */

                updateConversationList(
                    conversationId,
                    payload,
                    incomingMessage
                );


                /*
                --------------------------------------------------
                CHECK OPEN CHAT
                --------------------------------------------------
                */

                const currentConversationId =
                    selectedConversationRef.current;


                if (

                    sameId(
                        currentConversationId,
                        conversationId
                    )

                ) {

                    /*
                    ------------------------------------------------
                    OPEN CHAT

                    Append immediately.
                    Do NOT wait for GET /messages.
                    ------------------------------------------------
                    */

                    setChat(
                        (prev) => {

                            const current =
                                Array.isArray(prev)
                                    ? prev
                                    : [];


                            const merged =
                                mergeMessages(
                                    current,
                                    [incomingMessage]
                                );


                            console.log(
                                "⚡ LIVE MESSAGE APPENDED:",
                                {
                                    conversationId,
                                    text:
                                        incomingMessage.text,
                                    total:
                                        merged.length
                                }
                            );


                            return merged;

                        }
                    );


                    /*
                    ------------------------------------------------
                    Chat is currently open.

                    Therefore unread should remain zero.
                    ------------------------------------------------
                    */

                    setConversations(
                        (prev) => {

                            const list =
                                Array.isArray(prev)
                                    ? [...prev]
                                    : [];


                            const index =
                                list.findIndex(
                                    (item) =>
                                        sameId(
                                            item.id,
                                            conversationId
                                        )
                                );


                            if (
                                index === -1
                            ) {

                                return list;

                            }


                            list[index] = {

                                ...list[index],

                                unread_count:
                                    0,

                            };


                            conversationsRef.current =
                                list;


                            return list;

                        }
                    );


                    /*
                    ------------------------------------------------
                    Mark read.
                    ------------------------------------------------
                    */

                    markConversationRead(
                        conversationId
                    ).catch(
                        (error) => {

                            console.warn(
                                "⚠️ Live mark-read failed:",
                                error
                            );

                        }
                    );


                    console.log(
                        "👀 OPEN CHAT - MESSAGE SHOWN LIVE"
                    );


                } else {

                    /*
                    ------------------------------------------------
                    CLOSED CHAT

                    Conversation list gets unread count.
                    ------------------------------------------------
                    */

                    console.log(
                        "🔔 LIVE MESSAGE FOR CLOSED CHAT:",
                        conversationId
                    );

                }

            };


        /* =================================================
           HANDLE CONVERSATION UPDATED
        ================================================= */

        const handleConversationUpdated =
            (payload) => {

                console.log(
                    "🔄 REALTIME CONVERSATION UPDATED:",
                    payload
                );


                const payloadTenant =
                    payload?.tenantId ||
                    payload?.tenant_id;


                if (

                    payloadTenant &&

                    String(
                        payloadTenant
                    ) !==
                    String(
                        tenantId
                    )

                ) {

                    return;

                }


                const conversationId =
                    getConversationId(
                        payload
                    );


                if (!conversationId) {
                    return;
                }


                /*
                --------------------------------------------------
                IMPORTANT

                Do NOT append another message here.

                new_message is responsible for chat messages.

                conversation_updated is only for inbox list.
                --------------------------------------------------
                */

                updateConversationList(
                    conversationId,
                    payload,
                    null
                );

            };


        /* =================================================
           HANDLE MESSAGE STATUS
        ================================================= */

        const handleStatusUpdated =
            (payload) => {

                console.log(
                    "📌 REALTIME MESSAGE STATUS:",
                    payload
                );


                const conversationId =
                    getConversationId(
                        payload
                    );


                if (

                    !sameId(
                        selectedConversationRef.current,
                        conversationId
                    )

                ) {

                    return;

                }


                const whatsappMessageId =

                    payload?.whatsapp_message_id ||

                    payload?.whatsappMessageId ||

                    payload?.message?.whatsapp_message_id;


                const newStatus =

                    payload?.status ||

                    payload?.message?.status;


                if (!newStatus) {
                    return;
                }


                setChat(
                    (prev) => {

                        const current =
                            Array.isArray(prev)
                                ? prev
                                : [];


                        return current.map(
                            (item) => {

                                if (

                                    whatsappMessageId &&

                                    item?.whatsapp_message_id &&

                                    String(
                                        item.whatsapp_message_id
                                    ) ===
                                    String(
                                        whatsappMessageId
                                    )

                                ) {

                                    return {

                                        ...item,

                                        status:
                                            newStatus,

                                    };

                                }


                                return item;

                            }
                        );

                    }
                );

            };


        /* =================================================
           REGISTER SOCKET LISTENERS
        ================================================= */

        socket.on(
            "new_message",
            handleRealtimeMessage
        );


        socket.on(
            "conversation_updated",
            handleConversationUpdated
        );


        socket.on(
            "message_status_updated",
            handleStatusUpdated
        );


        /*
        --------------------------------------------------
        Backward-compatible event.

        Backend currently emits message_received too.

        We intentionally DO NOT register it because
        new_message already handles the same payload.

        Otherwise the same message could be processed twice.
        --------------------------------------------------
        */


        console.log(
            "🟢 Dashboard Socket listeners registered"
        );


        /* =================================================
           CLEANUP
        ================================================= */

        return () => {

            socket.off(
                "new_message",
                handleRealtimeMessage
            );


            socket.off(
                "conversation_updated",
                handleConversationUpdated
            );


            socket.off(
                "message_status_updated",
                handleStatusUpdated
            );


            console.log(
                "🧹 Dashboard Socket listeners removed"
            );

        };

    }, [
        getTenantId,
        normalizeMessage,
        mergeMessages
    ]);


    /* =====================================================
       REALTIME SAFETY NET

       Socket events can be missed (server restart, brief
       disconnect, tab thrown into bfcache, etc). This
       silently re-syncs the open chat + conversation list
       from the API on a short interval AND immediately
       whenever the socket (re)connects, so the inbox
       behaves like WhatsApp even if a live event was
       dropped. It never resets scroll/UI state — it only
       merges in whatever is missing.
    ===================================================== */

    useEffect(() => {

        const tenantId =
            getTenantId();

        if (!tenantId) {
            return;
        }

        let cancelled = false;

        const silentSync = async () => {

            if (
                cancelled ||
                isSessionExpired() ||
                !localStorage.getItem("token")
            ) {
                return;
            }

            /*
            ----------------------------------------------
            Refresh conversation list (unread badges,
            last message preview) without touching the
            open chat.
            ----------------------------------------------
            */

            try {

                const latestConversations =
                    await getConversations(tenantId);

                if (
                    !cancelled &&
                    Array.isArray(latestConversations)
                ) {

                    conversationsRef.current =
                        latestConversations;

                    setConversations(
                        latestConversations
                    );

                }

            } catch (error) {

                console.warn(
                    "⚠️ Silent conversation sync failed:",
                    error
                );

            }

            /*
            ----------------------------------------------
            Refresh the currently open chat, if any.
            ----------------------------------------------
            */

            const openConversationId =
                selectedConversationRef.current;

            if (!openConversationId) {
                return;
            }

            try {

                const messages =
                    await getMessages(
                        openConversationId
                    );

                if (cancelled) {
                    return;
                }

                if (
                    String(
                        selectedConversationRef.current
                    ) !==
                    String(
                        openConversationId
                    )
                ) {
                    return;
                }

                const formatted =
                    Array.isArray(messages)
                        ? messages
                            .map(normalizeMessage)
                            .filter(Boolean)
                        : [];

                const liveMessages =
                    liveMessagesRef.current.get(
                        String(openConversationId)
                    ) || [];

                const merged =
                    mergeMessages(
                        mergeMessages(formatted, liveMessages),
                        []
                    );

                setChat(
                    (prev) => {

                        const current =
                            Array.isArray(prev) ? prev : [];

                        /*
                        Only update if something actually
                        changed, to avoid needless re-renders.
                        */

                        if (
                            current.length ===
                            merged.length
                        ) {
                            return prev;
                        }

                        return merged;

                    }
                );

            } catch (error) {

                console.warn(
                    "⚠️ Silent chat sync failed:",
                    error
                );

            }

        };

        /*
        ----------------------------------------------
        Poll every 4s as a safety net.
        ----------------------------------------------
        */

        const intervalId =
            setInterval(
                silentSync,
                4000000
            );

        /*
        ----------------------------------------------
        Immediately re-sync whenever the socket
        (re)connects — this is the exact moment a
        live event could have been missed.
        ----------------------------------------------
        */

        const socket = connectSocket(tenantId);

        socket?.on("connect", silentSync);

        const handleSessionExpired = () => {

            cancelled = true;

            clearInterval(intervalId);

            socket?.off("connect", silentSync);

        };

        window.addEventListener(
            "session-expired",
            handleSessionExpired
        );

        return () => {

            cancelled = true;

            clearInterval(intervalId);

            socket?.off("connect", silentSync);

            window.removeEventListener(
                "session-expired",
                handleSessionExpired
            );

        };

    }, [
        getTenantId,
        normalizeMessage,
        mergeMessages
    ]);


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        loadData();

    }, [loadData]);


    /* =====================================================
       SUBSCRIPTION
    ===================================================== */

    const [subscription, setSubscription] =
        useState(null);


    useEffect(() => {

        const loadSubscription =
            async () => {

                try {

                    const tenantId =
                        getTenantId();


                    if (!tenantId) {
                        return;
                    }


                    console.log(
                        "💳 Loading subscription:",
                        tenantId
                    );


                    const data =
                        await getTenantSubscription(
                            tenantId
                        );


                    setSubscription(
                        data
                    );


                } catch (error) {

                    console.error(
                        "❌ Failed to load tenant subscription:",
                        error
                    );

                }

            };


        loadSubscription();

    }, [getTenantId]);


    /* =====================================================
       REALTIME FALLBACK
    ===================================================== */

    useEffect(() => {

        const tenantId =
            localStorage.getItem(
                "tenantId"
            );


        if (!tenantId) {
            return;
        }


        const interval =
            setInterval(
                async () => {

                    if (
                        isSessionExpired() ||
                        !localStorage.getItem("token")
                    ) {
                        clearInterval(interval);
                        return;
                    }

                    try {

                        const latest =
                            await getConversations(
                                tenantId
                            );


                        if (
                            Array.isArray(
                                latest
                            )
                        ) {

                            /*
                            ----------------------------------------
                            Do not blindly overwrite an open
                            conversation's unread state.

                            Backend is source of truth, but live
                            open-chat messages are handled separately.
                            ----------------------------------------
                            */

                            conversationsRef.current =
                                latest;


                            setConversations(
                                latest
                            );

                        }

                    } catch (error) {

                        console.warn(
                            "⚠️ Realtime fallback refresh failed:",
                            error
                        );

                    }

                },
                15000
            );


        const handleSessionExpired = () =>
            clearInterval(
                interval
            );

        window.addEventListener(
            "session-expired",
            handleSessionExpired
        );

        return () => {

            clearInterval(
                interval
            );

            window.removeEventListener(
                "session-expired",
                handleSessionExpired
            );

        };

    }, []);


    /* =====================================================
       OPEN CHAT
    ===================================================== */

    const openChat =
        useCallback(
            async (phone) => {

                try {

                    console.log(
                        "📱 Opening chat:",
                        phone
                    );


                    selectedCustomerRef.current =
                        phone;


                    setSelectedCustomer(
                        phone
                    );


                    setWhatsAppTab(
                        "inbox"
                    );


                    /*
                    --------------------------------------------------
                    FIND CONVERSATION
                    --------------------------------------------------
                    */

                    const conversationList =
                        Array.isArray(
                            conversationsRef.current
                        )
                            ? conversationsRef.current
                            : conversations;


                    const conversation =
                        conversationList.find(
                            (item) =>
                                String(
                                    item.customer_number
                                ) ===
                                String(
                                    phone
                                )
                        );


                    console.log(
                        "🔎 FOUND CONVERSATION:",
                        conversation
                    );


                    /*
                    --------------------------------------------------
                    NO CONVERSATION
                    --------------------------------------------------
                    */

                    if (!conversation) {

                        console.warn(
                            "⚠️ No conversation found for:",
                            phone
                        );


                        selectedConversationRef.current =
                            null;


                        setSelectedConversation(
                            null
                        );


                        setChat(
                            []
                        );


                        return;

                    }


                    /*
                    --------------------------------------------------
                    CONVERSATION ID
                    --------------------------------------------------
                    */

                    const conversationId =
                        conversation.id;


                    if (!conversationId) {

                        console.error(
                            "❌ Conversation ID missing:",
                            conversation
                        );


                        selectedConversationRef.current =
                            null;


                        setSelectedConversation(
                            null
                        );


                        setChat(
                            []
                        );


                        return;

                    }


                    console.log(
                        "💬 CONVERSATION ID:",
                        conversationId
                    );


                    /*
                    --------------------------------------------------
                    SET SELECTED CONVERSATION IMMEDIATELY

                    This is important.

                    Socket message arriving while getMessages()
                    is running must know which chat is open.
                    --------------------------------------------------
                    */

                    selectedConversationRef.current =
                        conversationId;


                    setSelectedConversation(
                        conversationId
                    );


                    /*
                    --------------------------------------------------
                    MARK READ
                    --------------------------------------------------
                    */

                    try {

                        await markConversationRead(
                            conversationId
                        );

                    } catch (error) {

                        console.warn(
                            "⚠️ Mark read failed:",
                            error
                        );

                    }


                    /*
                    --------------------------------------------------
                    IMMEDIATELY RESET UNREAD LOCALLY
                    --------------------------------------------------
                    */

                    setConversations(
                        (prev) => {

                            const list =
                                Array.isArray(prev)
                                    ? [...prev]
                                    : [];


                            const index =
                                list.findIndex(
                                    (item) =>
                                        String(
                                            item.id
                                        ) ===
                                        String(
                                            conversationId
                                        )
                                );


                            if (
                                index === -1
                            ) {

                                return list;

                            }


                            list[index] = {

                                ...list[index],

                                unread_count:
                                    0,

                            };


                            conversationsRef.current =
                                list;


                            return list;

                        }
                    );


                    /*
                    --------------------------------------------------
                    LOAD CONVERSATIONS

                    This is only to synchronize inbox metadata.

                    It must NOT clear chat.
                    --------------------------------------------------
                    */

                    try {

                        const updatedConversations =
                            await getConversations(
                                localStorage.getItem(
                                    "tenantId"
                                )
                            );


                        if (
                            Array.isArray(
                                updatedConversations
                            )
                        ) {

                            /*
                            ------------------------------------------
                            Preserve currently open conversation
                            as read.
                            ------------------------------------------
                            */

                            const normalized =
                                updatedConversations.map(
                                    (item) => {

                                        if (
                                            String(
                                                item.id
                                            ) ===
                                            String(
                                                conversationId
                                            )
                                        ) {

                                            return {

                                                ...item,

                                                unread_count:
                                                    0,

                                            };

                                        }

                                        return item;

                                    }
                                );


                            conversationsRef.current =
                                normalized;


                            setConversations(
                                normalized
                            );

                        }

                    } catch (error) {

                        console.warn(
                            "⚠️ Conversation refresh failed:",
                            error
                        );

                    }


                    /*
                    --------------------------------------------------
                    LOAD MESSAGES

                    IMPORTANT:
                    Do not use direct setChat(formatted).

                    mergeMessages() protects live socket messages.
                    --------------------------------------------------
                    */

                    console.log(
                        "📥 Loading messages:",
                        conversationId
                    );


                    const messages =
                        await getMessages(
                            conversationId
                        );


                    console.log(
                        "📨 MESSAGES FROM API:",
                        messages
                    );


                    const formatted =
                        Array.isArray(messages)
                            ? messages
                                .map(
                                    normalizeMessage
                                )
                                .filter(Boolean)
                            : [];


                    /*
                    --------------------------------------------------
                    GET LIVE MESSAGES RECEIVED DURING API REQUEST
                    --------------------------------------------------
                    */

                    const liveMessages =
                        liveMessagesRef.current.get(
                            String(
                                conversationId
                            )
                        ) || [];


                    /*
                    --------------------------------------------------
                    MERGE DB + LIVE
                    --------------------------------------------------
                    */

                    const merged =
                        mergeMessages(
                            formatted,
                            liveMessages
                        );


                    /*
                    --------------------------------------------------
                    Only update if the user is still viewing
                    the same conversation.
                    --------------------------------------------------
                    */

                    if (
                        sameConversation(
                            selectedConversationRef.current,
                            conversationId
                        )
                    ) {

                        setChat(
                            merged
                        );


                        console.log(
                            "🟢 CHAT LOADED:",
                            {
                                conversationId,
                                dbMessages:
                                    formatted.length,
                                liveMessages:
                                    liveMessages.length,
                                total:
                                    merged.length
                            }
                        );

                    }


                } catch (error) {

                    console.error(
                        "❌ OPEN CHAT ERROR:",
                        error
                    );


                    /*
                    Do not unnecessarily destroy an already
                    visible chat if the request fails.
                    */

                    if (
                        !selectedConversationRef.current
                    ) {

                        setChat(
                            []
                        );

                    }

                }

            },
            [
                conversations,
                getTenantId,
                normalizeMessage,
                mergeMessages
            ]
        );


    /* =====================================================
       SAME CONVERSATION HELPER
    ===================================================== */

    const sameConversation = (
        a,
        b
    ) => {

        if (
            a === null ||
            a === undefined ||
            b === null ||
            b === undefined
        ) {

            return false;

        }

        return (
            String(a) ===
            String(b)
        );

    };


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    const sendMessage =
        useCallback(
            async () => {

                if (
                    !message.trim()
                ) {

                    return;

                }


                const tenantId =
                    localStorage.getItem(
                        "tenantId"
                    );


                if (!tenantId) {

                    toast.error(
                        "Session expired. Please login again."
                    );

                    return;

                }


                if (!selectedCustomer) {

                    toast.error(
                        "Please select a customer."
                    );

                    return;

                }


                const msgText =
                    message.trim();


                setMessage(
                    ""
                );


                /*
                --------------------------------------------------
                OPTIMISTIC MESSAGE
                --------------------------------------------------
                */

                const tempMessage = {

                    id:
                        `temp-${Date.now()}`,

                    sender:
                        "agent",

                    text:
                        msgText,

                    created_at:
                        new Date().toISOString(),

                    status:
                        "sent",

                    whatsapp_message_id:
                        null,

                };


                setChat(
                    (prev) => {

                        const current =
                            Array.isArray(prev)
                                ? prev
                                : [];


                        return mergeMessages(
                            current,
                            [tempMessage]
                        );

                    }
                );


                try {

                    console.log(
                        "📤 Sending WhatsApp message"
                    );

                    await sendWhatsAppMessage(

                        tenantId,

                        selectedCustomer,

                        msgText,

                        selectedConversationRef.current

                    );


                    /*
                    --------------------------------------------------
                    DO NOT immediately call openChat().

                    Calling openChat() starts another GET request
                    and can create a race with the realtime socket.

                    The optimistic message is already visible.

                    Backend/socket status will update it.
                    --------------------------------------------------
                    */

                    console.log(
                        "🟢 WhatsApp message sent successfully"
                    );


                } catch (error) {

                    console.error(
                        "❌ SEND WHATSAPP MESSAGE ERROR:",
                        error
                    );


                    /*
                    --------------------------------------------------
                    Remove failed optimistic message.
                    --------------------------------------------------
                    */

                    setChat(
                        (prev) =>
                            (
                                Array.isArray(
                                    prev
                                )
                                    ? prev
                                    : []
                            ).filter(
                                (item) =>
                                    item.id !==
                                    tempMessage.id
                            )
                    );


                    toast.error(
                        getErrorMessage(error)
                    );

                }

            },
            [
                message,
                selectedCustomer,
                mergeMessages
            ]
        );

    /* =====================================================
       LOAD TICKETS
    ===================================================== */
    
    const loadTickets = useCallback(async () => {
    
        try {
    
            const tenantId =
                localStorage.getItem("tenantId");
    
            if (!tenantId) {
    
                console.warn(
                    "No tenantId found while loading tickets"
                );
    
                return;
            }
    
            const response =
                await getTickets(tenantId);
    
            const ticketList =
                Array.isArray(response)
                    ? response
                    : response?.tickets || [];
    
            setTickets(ticketList);
    
        } catch (error) {
    
            console.error(
                "Failed to load tickets:",
                error
            );
    
            setTickets([]);
    
        }
    
    }, []);
    
    
    /* =====================================================
       INITIAL TICKET LOAD
    ===================================================== */
    
    useEffect(() => {
    
        loadTickets();
    
    }, [loadTickets]);

    const handleCreateTicketFromChat = () => {

        setTicketModal({
            mode: "create",
            ticket: null,
            customerPhone:
                selectedCustomer || ""
        });
    
    };

    const handleOpenTicketFromChat = (
        ticketNumber
    ) => {
    
        const ticket =
            tickets.find(
                item =>
                    (
                        item.ticket_number ||
                        item.ticketNumber
                    ) === ticketNumber
            );
    
        if (!ticket) {
    
            toast.error(
                "Ticket details could not be found"
            );
    
            return;
        }
    
        setTicketModal({
            mode: "edit",
            ticket,
            customerPhone: ""
        });
    
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="dashboard">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar

                activeSidebar={
                    activeSidebar
                }

                setActiveSidebar={
                    setActiveSidebar
                }

                currentPlan={
                    subscription
                }

            />


            <div className="dashboard-content">


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <Topbar 
                    setActiveSidebar={setActiveSidebar} 
                />


                <div className="dashboard-main">


                    {/* =================================================
                        DASHBOARD
                    ================================================= */}

                    {activeSidebar ===
                        "dashboard" && (

                        <DashboardHome />

                    )}


                    {/* =================================================
                        WHATSAPP
                    ================================================= */}

                    {activeSidebar ===
                        "whatsapp" && (

                        <>

                            {/* =================================================
                                WHATSAPP TABS
                            ================================================= */}

                            <div className="whatsapp-tabs">


                                <button

                                    className={
                                        whatsAppTab ===
                                        "overview"
                                            ? "active"
                                            : ""
                                    }

                                    onClick={() =>
                                        setWhatsAppTab(
                                            "overview"
                                        )
                                    }

                                >

                                    Overview

                                </button>


                                <button

                                    className={
                                        whatsAppTab ===
                                        "inbox"
                                            ? "active"
                                            : ""
                                    }

                                    onClick={() =>
                                        setWhatsAppTab(
                                            "inbox"
                                        )
                                    }

                                >

                                    Inbox

                                </button>


                                <button

                                    className={
                                        whatsAppTab ===
                                        "broadcast"
                                            ? "active"
                                            : ""
                                    }

                                    onClick={() =>
                                        setWhatsAppTab(
                                            "broadcast"
                                        )
                                    }

                                >

                                    Broadcast

                                </button>


                                <button

                                    className={
                                        whatsAppTab ===
                                        "contacts"
                                            ? "active"
                                            : ""
                                    }

                                    onClick={() =>
                                        setWhatsAppTab(
                                            "contacts"
                                        )
                                    }

                                >

                                    Subscribers

                                </button>

                                <button

                                    className={
                                        whatsAppTab ===
                                        "whatsappflow"
                                            ? "active"
                                            : ""
                                    }

                                    onClick={() =>
                                        setWhatsAppTab(
                                            "whatsappflow"
                                        )
                                    }

                                >

                                    Whatsapp Flow

                                </button>

                                <button

                                    className={
                                        whatsAppTab ===
                                        "integration"
                                            ? "active"
                                            : ""
                                    }

                                    onClick={() =>
                                        setWhatsAppTab(
                                            "integration"
                                        )
                                    }

                                >

                                    Ecosystem

                                </button>


                            </div>


                            {/* =================================================
                                OVERVIEW
                            ================================================= */}

                            <div

                                style={{

                                    display:
                                        whatsAppTab ===
                                        "overview"
                                            ? "block"
                                            : "none",

                                    width:
                                        "100%",

                                    height:
                                        "100%",

                                }}

                            >

                                <WhatsAppConnect />

                            </div>


                            {/* =================================================
                                INBOX
                            ================================================= */}

                            <div

                                style={{

                                    display:
                                        whatsAppTab ===
                                        "inbox"
                                            ? "block"
                                            : "none",

                                    width:
                                        "100%",

                                    height:
                                        "100%",

                                }}

                            >

                                <Inbox

                                    customers={
                                        customers
                                    }

                                    conversations={
                                        conversations
                                    }

                                    selectedCustomer={
                                        selectedCustomer
                                    }

                                    setSelectedCustomer={
                                        setSelectedCustomer
                                    }

                                    chat={
                                        chat
                                    }

                                    openChat={
                                        openChat
                                    }

                                    message={
                                        message
                                    }

                                    setMessage={
                                        setMessage
                                    }

                                    sendMessage={
                                        sendMessage
                                    }

                                    aiPaused={
                                        isAiPausedForActiveChat
                                    }

                                    onToggleAiPause={
                                        handleToggleAiPause
                                    }

                                    tickets={
                                        tickets
                                    }

                                    onCreateTicket={
                                        handleCreateTicketFromChat
                                    }
                                
                                    onOpenTicket={
                                        handleOpenTicketFromChat
                                    }

                                />

                            </div>


                            {/* =================================================
                                BROADCAST
                            ================================================= */}

                            <div

                                style={{

                                    display:
                                        whatsAppTab ===
                                        "broadcast"
                                            ? "block"
                                            : "none",

                                }}

                            >

                                <Broadcast />

                            </div>


                            {/* =================================================
                                CONTACTS
                            ================================================= */}

                            <div

                                style={{

                                    display:
                                        whatsAppTab ===
                                        "contacts"
                                            ? "block"
                                            : "none",

                                }}

                            >

                                <Contacts

                                    customers={
                                        customers
                                    }

                                    conversations={
                                        conversations
                                    }

                                    openChat={
                                        openChat
                                    }

                                />

                            </div>

                            {/* =================================================
                                WhatsappFlow
                            ================================================= */}

                            <div

                                style={{

                                    display:
                                        whatsAppTab ===
                                        "whatsappflow"
                                            ? "block"
                                            : "none",

                                }}

                            >

                                <WhatsappFlow />

                            </div>

                            {/* =================================================
                                Ecosystem
                            ================================================= */}

                            <div

                                style={{

                                    display:
                                        whatsAppTab ===
                                        "integration"
                                            ? "block"
                                            : "none",

                                }}

                            >

                                <Integration />

                            </div>


                        </>

                    )}


                    {/* =================================================
                        ANALYTICS
                    ================================================= */}

                    {activeSidebar ===
                        "analytics" && (

                        <Analytics />

                    )}


                    {/* =================================================
                        AI STUDIO
                    ================================================= */}

                    {activeSidebar ===
                        "aistudio" && (

                        <AIStudio />

                    )}

                    {/* =================================================
                        TICKETING
                    ================================================= */}
                    
                    {activeSidebar === "ticketing" && (
                        <Ticketing
                            tickets={tickets}
                    
                            onCreateTicket={() => {
                                setTicketModal({
                                    mode: "create",
                                    ticket: null,
                                    customerPhone: selectedCustomer || ""
                                });
                            }}
                    
                            onOpenTicket={(ticket) => {
                                setTicketModal({
                                    mode: "edit",
                                    ticket,
                                    customerPhone: ""
                                });
                            }}
                        />
                    )}


                    {/* =================================================
                        SUBSCRIPTION
                    ================================================= */}

                    {activeSidebar ===
                        "subscription" && (

                        <Subscription

                            subscription={
                                subscription
                            }

                            setSubscription={
                                setSubscription
                            }

                        />

                    )}


                    {/* =================================================
                        CRM
                    ================================================= */}

                    {activeSidebar ===
                        "crm" && (

                        <h2>
                            CRM Module Coming Soon
                        </h2>

                    )}


                    {/* =================================================
                        SETTINGS
                    ================================================= */}

                    {activeSidebar ===
                        "settings" && (

                        <Settings
                            setActiveSidebar={setActiveSidebar}   
                        />

                    )}


                </div>

            </div>

            {/* =================================================
                GLOBAL TICKET MODAL
            ================================================= */}
    
            <TicketModal
    
                mode={
                    ticketModal.mode
                }
    
                ticket={
                    ticketModal.ticket
                }
    
                customerPhone={
                    ticketModal.customerPhone
                }
    
                onClose={() =>
                    setTicketModal({
                        mode: null,
                        ticket: null,
                        customerPhone: ""
                    })
                }
    
                onSaved={async () => {

                    await loadTickets();
                
                    setTicketModal({
                        mode: null,
                        ticket: null,
                        customerPhone: ""
                    });
                
                }}
    
            />

        </div>

    );

}


export default DashboardV2;
