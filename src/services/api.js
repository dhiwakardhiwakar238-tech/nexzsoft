import apiClient from "../config/apiConfig";
import { API_URL } from "../config/apiConfig";


console.log(
    "API_URL =",
    API_URL
);


// ======================================================
// AUTH
// ======================================================

export const signupUser = async (userData) => {
    const response = await apiClient.post(
        "/api/register",
        userData
    );

    return response.data;
};

export const loginUser = async (userData) => {
    const response = await apiClient.post(
        "/api/login",
        userData
    );

    return response.data;
};

// ======================================================
// USER
// ======================================================

export const getUserProfile = async (
    userId
) => {

    if (!userId) {
        throw new Error(
            "User ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/users/${encodeURIComponent(
                userId
            )}`
        );


    return response.data;
};


export const updateUserProfile = async (
    userId,
    userData
) => {

    if (!userId) {
        throw new Error(
            "User ID is missing."
        );
    }


    const response =
        await apiClient.put(
            `/api/users/${encodeURIComponent(
                userId
            )}`,
            userData
        );


    return response.data;
};


export const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    if (!userId) {
        throw new Error(
            "User ID is missing."
        );
    }


    const response =
        await apiClient.put(
            `/api/users/${encodeURIComponent(
                userId
            )}/password`,
            {
                currentPassword,
                newPassword,
            }
        );


    return response.data;
};


// ======================================================
// WHATSAPP CRM - CUSTOMERS
// ======================================================

export const getCustomers = async (
    tenantId
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/whatsapp/customers/${encodeURIComponent(
                tenantId
            )}`
        );


    console.log(
        "CUSTOMERS RESPONSE:",
        response.data
    );


    return (
        response.data?.customers ||
        []
    );
};


// ======================================================
// CONVERSATIONS
// ======================================================

export const getConversations = async (
    tenantId
) => {

    console.count("🔥 getConversations CALLED");

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/whatsapp/conversations/${encodeURIComponent(
                tenantId
            )}`
        );


    console.log(
        "CONVERSATIONS RESPONSES:",
        response.data
    );


    return (
        response.data?.conversations ||
        []
    );
};


// ======================================================
// SUBSCRIPTION
// ======================================================

export const getTenantSubscription = async (
    tenantId
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/subscriptions/${encodeURIComponent(
                tenantId
            )}`
        );


    return (
        response.data?.data ||
        null
    );
};

/*
==================================================
GET PAYMENT HISTORY
==================================================
*/

export const getPaymentHistory = async (tenantId) => {

    if (!tenantId) {
        throw new Error("Tenant ID is missing.");
    }

    const response = await apiClient.get(
        `/api/subscriptions/payment-history/${encodeURIComponent(tenantId)}`
    );

    return response.data?.paymentHistory || [];
};

/*
==================================================
CANCEL SUBSCRIPTION
==================================================
*/

export const cancelSubscription = async (tenantId) => {

    if (!tenantId) {
        throw new Error("Tenant ID is missing.");
    }

    const response = await apiClient.post(
        `/api/subscriptions/cancel/${encodeURIComponent(tenantId)}`
    );

    return response.data;
};

// ======================================================
// DEACTIVATE ACCOUNT
// ======================================================

export const deactivateAccount = async () => {

    const response =
        await apiClient.delete(
            "/api/account"
        );


    return response.data;
};

// =========================================================
// SHOPIFY
// =========================================================

export const shopifyApi = {
    /**
     * Start Shopify OAuth
     *
     * The request to Nexzsoft is authenticated through apiClient.
     * The backend generates the secure OAuth state and returns
     * the Shopify authorization URL.
     *
     * The browser is redirected to Shopify only after the
     * authenticated request succeeds.
     */
    connect: async (shopDomain) => {
        const normalizedShop = shopDomain
            ?.trim()
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/\/+$/, "");

        if (!normalizedShop) {
            throw new Error(
                "Shopify store domain is required."
            );
        }

        if (
            !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(
                normalizedShop
            )
        ) {
            throw new Error(
                "Invalid Shopify store domain."
            );
        }

        const response = await apiClient.get(
            "/api/shopify/connect",
            {
                params: {
                    shop: normalizedShop,
                },
            }
        );

        return response;
    },

    /**
     * Get current Shopify connection status
     */
    getStatus: async () => {
        const response = await apiClient.get(
            "/api/shopify/status"
        );

        return response.data;
    },

    /**
     * Disconnect Shopify
     */
    disconnect: async (shopDomain) => {
        const response = await apiClient.post(
            "/api/shopify/disconnect",
            {
                shopDomain,
            }
        );

        return response.data;
    },
};

// ======================================================
// ACTIVATE PAY AS YOU GROW
// ======================================================

export const activateUsageSubscription = async (
    tenantId
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.post(
            `/api/subscriptions/activate-usage/${encodeURIComponent(
                tenantId
            )}`
        );


    return response.data;
};


// ======================================================
// MESSAGES
// ======================================================

export const getMessages = async (
    conversationId
) => {

    if (!conversationId) {
        throw new Error(
            "Conversation ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/whatsapp/messages/${encodeURIComponent(
                conversationId
            )}`
        );


    return (
        response.data?.messages ||
        []
    );
};


// ======================================================
// MARK CONVERSATION READ
// ======================================================

export const markConversationRead = async (
    conversationId
) => {

    if (!conversationId) {
        throw new Error(
            "Conversation ID is missing."
        );
    }


    const response =
        await apiClient.put(
            `/api/whatsapp/read/conversations/${encodeURIComponent(
                conversationId
            )}/read`
        );


    return response.data;
};


// ======================================================
// PAUSE / RESUME AI FOR A SINGLE CONVERSATION
// ======================================================

export const toggleAiPause = async (
    conversationId,
    paused
) => {

    if (!conversationId) {
        throw new Error(
            "Conversation ID is missing."
        );
    }


    const response =
        await apiClient.put(
            `/api/whatsapp/conversations/${encodeURIComponent(
                conversationId
            )}/ai-pause`,
            {
                paused
            }
        );


    return response.data;
};

// ======================================================
// SAVE WHATSAPP FLOW
// ======================================================

export const saveFlow = async (flowData) => {
    const response = await apiClient.post(
        "/api/whatsapp-flows",
        flowData
    );

    return response.data?.data;
};

// ======================================================
// GET WHATSAPP FLOW
// ======================================================

export const getFlows = async () => {

    const response = await apiClient.get(
        "/api/whatsapp-flows"
    );

    return response.data?.data || [];
};

/* =========================================================
   TICKETS
========================================================= */

/*
=========================================================
GET TICKETS
=========================================================
*/

export const getTickets = async (tenantId) => {

    const response = await apiClient.get(
        "/api/tickets",
        {
            params: {
                tenantId
            }
        }
    );

    return response.data;

};


/*
=========================================================
CREATE TICKET
=========================================================
*/

export const createTicket = async (
    tenantId,
    ticketData
) => {

    const response = await apiClient.post(
        "/api/tickets",
        {
            tenantId,
            ...ticketData
        }
    );

    return response.data;

};


/*
=========================================================
SAVE TICKET
=========================================================
*/

export const saveTicket = async (
    tenantId,
    ticketNumber,
    ticketData
) => {

    const response = await apiClient.put(
        `/api/tickets/${encodeURIComponent(ticketNumber)}`,
        {
            tenantId,
            ...ticketData
        }
    );

    return response.data;

};

// ======================================================
// SEND WHATSAPP MESSAGE
// ======================================================

export const sendWhatsAppMessage = async (
    tenantId,
    to,
    message,
    conversationId
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    if (!to) {
        throw new Error(
            "Customer phone number is missing."
        );
    }


    if (!message?.trim()) {
        throw new Error(
            "Message is empty."
        );
    }


    const response =
        await apiClient.post(
            "/api/whatsapp/send-message",
            {

                tenantId,

                to,

                message:
                    message.trim(),

                conversationId:
                    conversationId || null,

            }
        );


    return response.data;
};


// ======================================================
// META TEMPLATES
// ======================================================

export const getMetaTemplates = async (
    tenantId
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/templates/tenant/${encodeURIComponent(
                tenantId
            )}`
        );


    return (
        response.data?.templates ||
        []
    );
};


// ======================================================
// SYNC META TEMPLATES
// ======================================================

export const syncMetaTemplates = async (
    tenantId
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/templates/sync/${encodeURIComponent(
                tenantId
            )}`,
            {
                // Meta is an external API. Keep sync bounded so a
                // slow Meta response cannot hang the broadcast flow.
                timeout: 15000,
            }
        );


    return response.data;
};


// ======================================================
// CREATE CUSTOMER
// ======================================================

export const createCustomer = async (
    data
) => {

    const tenantId =
        data?.tenantId ||
        localStorage.getItem(
            "tenantId"
        );


    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.post(
            "/api/customers/createcustomer",
            {
                ...data,
                tenantId,
            }
        );


    return response.data;
};


// ======================================================
// GET AI SETTINGS
// ======================================================

export const getAISettings = async (
    tenantId
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/ai-settings/${encodeURIComponent(
                tenantId
            )}`
        );


    return (
        response.data?.data ||
        null
    );
};


// ======================================================
// SAVE AI SETTINGS
// ======================================================

export const saveAISettings = async (
    tenantId,
    settings
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.post(
            `/api/ai-settings/${encodeURIComponent(
                tenantId
            )}`,
            settings
        );

    return response.data?.data || null;
};


// ======================================================
// UPDATE CUSTOMER
// ======================================================

export const updateCustomer = async (
    data
) => {

    const tenantId =
        data?.tenantId ||
        localStorage.getItem(
            "tenantId"
        );


    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.post(
            "/api/customers/updatecustomer",
            {
                ...data,
                tenantId,
            }
        );


    return response.data;
};


// ======================================================
// DELETE CUSTOMER
// ======================================================

export const deleteCustomer = async (
    data
) => {

    const tenantId =
        data?.tenantId ||
        localStorage.getItem(
            "tenantId"
        );


    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.post(
            "/api/customers/deletecustomer",
            {
                ...data,
                tenantId,
            }
        );


    return response.data;
};


// ======================================================
// IMPORT CUSTOMERS
// ======================================================

export const importCustomers = async (
    payload
) => {

    const tenantId =
        payload?.tenantId ||
        localStorage.getItem(
            "tenantId"
        );


    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.post(
            "/api/customers/importcustomer",
            {
                ...payload,
                tenantId,
            }
        );


    return response.data;
};


// ======================================================
// CUSTOMER DETAILS
// ======================================================

export const getCustomerDetails = async (
    id
) => {

    if (!id) {
        throw new Error(
            "Customer ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/customers/${encodeURIComponent(
                id
            )}/details`
        );


    return response.data;
};


// ======================================================
// CUSTOMER NOTE
// ======================================================

export const addCustomerNote = async (
    id,
    note
) => {

    if (!id) {
        throw new Error(
            "Customer ID is missing."
        );
    }


    const response =
        await apiClient.post(
            `/api/customers/${encodeURIComponent(
                id
            )}/note`,
            {
                note,
            }
        );


    return response.data;
};


// ======================================================
// BROADCAST
// ======================================================

export const sendBroadcast = async (
    data
) => {

    const response =
        await apiClient.post(
            "/api/meta/send-broadcast",
            data
        );


    return response.data;
};


// ======================================================
// CREATE TEMPLATE
// ======================================================

export const createTemplate = async (
    payload
) => {

    const response =
        await apiClient.post(
            "/api/templates",
            payload
        );


    return response.data;
};

// ======================================================
// UPLOAD TEMPLATE MEDIA (IMAGE / VIDEO / DOCUMENT)
// ======================================================
export const uploadMedia = async (file, headerType = "") => {
    if (!(file instanceof File)) {
        throw new Error("Media file is required.");
    }

    const formData = new FormData();
    formData.append("media", file, file.name);

    if (headerType) {
        formData.append("headerType", headerType);
    }

    const response = await apiClient.post(
        "/api/templates/media-upload",
        formData
    );

    return response.data;
};

// ======================================================
// GET BROADCASTS
// ======================================================

export const getBroadcasts = async (
    tenantId
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/broadcasts/tenant/${encodeURIComponent(
                tenantId
            )}`
        );


    return (
        response.data?.broadcasts ||
        []
    );
};


// ======================================================
// GET BROADCAST DETAILS
// ======================================================

export const getBroadcastDetails = async (
    id,
    tenantId
) => {

    if (!id) {
        throw new Error(
            "Broadcast ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/broadcasts/${encodeURIComponent(
                id
            )}`,
            {
                params: {
                    tenantId,
                },
            }
        );


    return response.data;
};


// ======================================================
// CUSTOMER LABELS
// ======================================================

export const getCustomerLabels = async (
    tenantId
) => {

    const response =
        await apiClient.get(
            "/api/customer-labels",
            {
                params: {
                    tenantId,
                },
            }
        );


    return response.data;
};


// ======================================================
// CREATE LABEL
// ======================================================

export const createCustomerLabel = async (
    payload
) => {

    const response =
        await apiClient.post(
            "/api/customer-labels",
            payload
        );


    return response.data;
};


// ======================================================
// DELETE LABEL
// ======================================================

export const deleteCustomerLabel = async (
    id,
    tenantId
) => {

    const response =
        await apiClient.delete(
            `/api/customer-labels/${encodeURIComponent(
                id
            )}`,
            {
                params: {
                    tenantId,
                },
            }
        );


    return response.data;
};


// ======================================================
// WHATSAPP CONNECT
// ======================================================

export const exchangeMetaCode = async (
    payload
) => {

    const response =
        await apiClient.post(
            "/api/meta/exchange",
            payload
        );


    return response.data;
};


// ======================================================
// SALES LEAD
// ======================================================

export const saleslead = async (
    payload
) => {

    const response =
        await apiClient.post(
            "/api/sales-lead/contacts",
            payload
        );


    return response.data;
};


// ======================================================
// DISCONNECT WHATSAPP
// ======================================================

export const disconnectWhatsApp = async (
    tenantId
) => {

    if (!tenantId) {

        throw new Error(
            "Tenant ID is missing."
        );

    }


    const response =
        await apiClient.delete(
            `/api/meta-config/${encodeURIComponent(
                tenantId
            )}`
        );


    return response.data;

};


// ======================================================
// META CONFIG
// ======================================================

export const getMetaConfig = async (
    tenantId
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/meta-config/${encodeURIComponent(
                tenantId
            )}`
        );


    return response.data;
};


export const updateMetaConfig = async (
    tenantId,
    payload
) => {

    if (!tenantId) {
        throw new Error(
            "Tenant ID is missing."
        );
    }


    const response =
        await apiClient.put(
            `/api/meta-config/${encodeURIComponent(
                tenantId
            )}`,
            payload
        );


    return response.data;
};


// ======================================================
// USER SETTINGS
// ======================================================

export const getTenantUser = async (
    userId
) => {

    if (!userId) {
        throw new Error(
            "User ID is missing."
        );
    }


    const response =
        await apiClient.get(
            `/api/users/${encodeURIComponent(
                userId
            )}`
        );


    return response.data;
};


export const updateTenantUser = async (
    userId,
    payload
) => {

    if (!userId) {
        throw new Error(
            "User ID is missing."
        );
    }


    const response =
        await apiClient.put(
            `/api/users/${encodeURIComponent(
                userId
            )}`,
            payload
        );


    return response.data;
};


export const updatePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    if (!userId) {
        throw new Error(
            "User ID is missing."
        );
    }


    const response =
        await apiClient.put(
            `/api/users/${encodeURIComponent(
                userId
            )}/password`,
            {

                currentPassword,

                newPassword,

            }
        );


    return response.data;
};


// ======================================================
// META EMBEDDED SIGNUP
// ======================================================

export const connectWhatsApp = async (
    payload
) => {

    const response =
        await apiClient.post(
            "/api/meta/connect",
            payload
        );


    return response.data;
};


// ======================================================
// EXPORT CUSTOMERS
// ======================================================

export const exportCustomers = async (
    tenantId
) => {

    if (!tenantId) {

        throw new Error(
            "Tenant ID is missing. Please login again."
        );

    }


    console.log(
        "EXPORT CUSTOMERS - TENANT ID:",
        tenantId
    );


    const response =
        await apiClient.get(
            `/api/customers/export/${encodeURIComponent(
                tenantId
            )}`,
            {
                responseType:
                    "blob",
            }
        );


    return response;
};
