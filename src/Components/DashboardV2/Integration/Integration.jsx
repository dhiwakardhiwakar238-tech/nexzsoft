import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import "./Integration.css";
import { shopifyApi } from "../../../services/api";

import {
    Search,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    RefreshCw,
    Copy,
    Check,
    Radio,
    X,
    Sliders,
    Zap,
    Activity,
    Clock,
    Webhook,
    Key,
    Package,
    Terminal,
    Play,
    Building,
    ShieldCheck,
} from "lucide-react";


/* =========================================================
   INTEGRATION DATA
========================================================= */

const INTEGRATIONS_DATA = [
    {
        id: "shopify",
        name: "Shopify",
        category: "storefronts",
        logo: "🛍️",
        description:
            "Sync Shopify storefront orders, catalog items, abandoned checkouts, and customer profiles.",
        status: "disconnected",
        health: "99.98%",
        latency: "120ms",
        webhooksToday: "42,890",
        type: "Storefront",
        popular: true,

        authFields: [
            {
                key: "shopDomain",
                label: "Store Domain",
                placeholder: "your-brand.myshopify.com",
                type: "text",
                required: true,
                desc: "Enter your Shopify store domain to connect your store.",
            },
        ],

        automationTriggers: [
            {
                id: "abandoned_cart",
                name: "Abandoned Checkout Reminders",
                desc: "Trigger WhatsApp template 15m & 2h after cart abandonment",
                enabled: true,
            },
            {
                id: "order_confirm",
                name: "Order Placement Confirmation",
                desc: "Send immediate WhatsApp receipt with items & tracking link",
                enabled: true,
            },
            {
                id: "fulfillment_update",
                name: "Fulfillment & AWB Updates",
                desc: "Notify customer on dispatch with live courier tracking",
                enabled: true,
            },
            {
                id: "cod_verify",
                name: "COD Verification Flow",
                desc: "Request interactive WhatsApp confirmation for COD orders",
                enabled: false,
            },
        ],

        facilityCodeRequired: false,
    },

    {
        id: "myntra",
        name: "Myntra PPMP",
        category: "marketplaces",
        logo: "🔴",
        description:
            "Manage Myntra PPMP (Dropship) & Omni-channel orders, warehouse facility mapping, and courier labels.",
        status: "active",
        health: "99.40%",
        latency: "240ms",
        webhooksToday: "18,450",
        type: "Regional Marketplace",
        popular: true,

        authFields: [
            {
                key: "merchantId",
                label: "Myntra Merchant ID",
                placeholder: "MYN_VENDOR_8849",
                type: "text",
                required: true,
            },
            {
                key: "apiKey",
                label: "PPMP API Key / Token",
                placeholder: "myn_sec_key_xxxxxxxxxxxxx",
                type: "password",
                required: true,
            },
            {
                key: "facilityCode",
                label: "Primary Warehouse Facility Code",
                placeholder: "WH_BLR_01",
                type: "text",
                required: true,
                desc: "Mandatory location code registered in Myntra Seller Portal",
            },
            {
                key: "integrationModel",
                label: "Integration Model",
                placeholder: "PPMP (Dropship)",
                type: "select",
                options: ["PPMP (Dropship)", "Omni-Channel", "SJIT"],
                required: true,
            },
        ],

        automationTriggers: [
            {
                id: "myntra_order_ack",
                name: "Myntra Order Acknowledgment",
                desc: "Send WhatsApp notification upon order confirmation",
                enabled: true,
            },
            {
                id: "myntra_dispatch",
                name: "Courier Dispatch & AWB Sync",
                desc: "Send tracking code and package dispatch update",
                enabled: true,
            },
            {
                id: "myntra_returns",
                name: "Return/RTO Status Alert",
                desc: "Notify customer when return pickup is scheduled or processed",
                enabled: true,
            },
            {
                id: "myntra_address_validate",
                name: "NDR / Address Correction",
                desc: "Trigger automated WhatsApp prompt for failed delivery re-attempts",
                enabled: false,
            },
        ],

        facilityCodeRequired: true,
    },

    {
        id: "amazon",
        name: "Amazon SP-API",
        category: "marketplaces",
        logo: "📦",
        description:
            "Selling Partner API integration for order notification webhooks, inventory updates, and buyer messaging.",
        status: "active",
        health: "99.95%",
        latency: "180ms",
        webhooksToday: "89,120",
        type: "Global Marketplace",
        popular: true,

        authFields: [
            {
                key: "sellerId",
                label: "Amazon Merchant / Seller ID",
                placeholder: "A2XXXXXXXXXXXX",
                type: "text",
                required: true,
            },
            {
                key: "lwaClientId",
                label: "LWA Client ID",
                placeholder: "amzn1.application-oa2-client.xxx",
                type: "text",
                required: true,
            },
            {
                key: "lwaClientSecret",
                label: "LWA Client Secret",
                placeholder: "amzn1.oa2-cs.v1.xxxxxxxxx",
                type: "password",
                required: true,
            },
            {
                key: "awsRegion",
                label: "Selling Region",
                placeholder: "eu-west-1",
                type: "select",
                options: [
                    "us-east-1 (NA)",
                    "eu-west-1 (Europe)",
                    "us-west-2 (FE / India / JP)",
                ],
                required: true,
            },
        ],

        automationTriggers: [
            {
                id: "amazon_order_sync",
                name: "Order State Notifications",
                desc: "Sync Amazon buyer orders into unified inbox",
                enabled: true,
            },
            {
                id: "amazon_buyer_msg",
                name: "Permitted Buyer Messaging",
                desc: "Send Amazon policy-compliant delivery alerts via Meta Cloud API",
                enabled: true,
            },
            {
                id: "amazon_inv_sync",
                name: "Real-time Stock Buffer Sync",
                desc: "Sync multi-channel warehouse inventory to prevent overselling",
                enabled: true,
            },
        ],

        facilityCodeRequired: false,
    },

    {
        id: "woocommerce",
        name: "WooCommerce",
        category: "storefronts",
        logo: "🟣",
        description:
            "Connect WordPress WooCommerce via REST API. Automate cart recovery, order updates, and CRM sync.",
        status: "action_needed",
        health: "88.50%",
        latency: "450ms",
        webhooksToday: "8,120",
        type: "Storefront",
        popular: false,

        authFields: [
            {
                key: "siteUrl",
                label: "WordPress Site URL",
                placeholder: "https://store.yourdomain.com",
                type: "text",
                required: true,
            },
            {
                key: "consumerKey",
                label: "Consumer Key",
                placeholder: "ck_xxxxxxxxxxxxxxxxxxxxxxxx",
                type: "text",
                required: true,
            },
            {
                key: "consumerSecret",
                label: "Consumer Secret",
                placeholder: "cs_xxxxxxxxxxxxxxxxxxxxxxxx",
                type: "password",
                required: true,
            },
        ],

        automationTriggers: [
            {
                id: "woo_cart",
                name: "WooCommerce Abandoned Cart",
                desc: "Trigger checkout recovery sequence on cart session expiry",
                enabled: true,
            },
            {
                id: "woo_order_status",
                name: "Order Status Change Alert",
                desc: "Map WooCommerce status transitions to WhatsApp templates",
                enabled: true,
            },
        ],

        facilityCodeRequired: false,
    },

    {
        id: "hubspot",
        name: "HubSpot CRM",
        category: "crms",
        logo: "🟧",
        description:
            "Bi-directional contact sync, deal stage automation, and WhatsApp conversation logging inside HubSpot Timeline.",
        status: "active",
        health: "100.0%",
        latency: "95ms",
        webhooksToday: "31,040",
        type: "CRM & Engagement",
        popular: true,

        authFields: [
            {
                key: "portalId",
                label: "HubSpot Portal ID / Hub ID",
                placeholder: "24910293",
                type: "text",
                required: true,
            },
            {
                key: "privateAppToken",
                label: "Private App Access Token",
                placeholder: "pat-eu1-xxxxxxxxxxxxxxxx",
                type: "password",
                required: true,
            },
        ],

        automationTriggers: [
            {
                id: "hs_lead_sync",
                name: "New WhatsApp Contact → HubSpot Lead",
                desc: "Auto-create contact record when a new lead messages on WhatsApp",
                enabled: true,
            },
            {
                id: "hs_deal_stage",
                name: "Deal Stage Triggered Template",
                desc: "Send WhatsApp message when deal reaches Quote Sent stage",
                enabled: true,
            },
            {
                id: "hs_timeline_log",
                name: "Conversation Timeline Logging",
                desc: "Log incoming and outgoing Meta Cloud API chats on contact timeline",
                enabled: true,
            },
        ],

        facilityCodeRequired: false,
    },

    {
        id: "stripe",
        name: "Stripe Payments",
        category: "payments",
        logo: "💳",
        description:
            "Generate dynamic payment links inside WhatsApp chats and capture instant payment webhook confirmations.",
        status: "active",
        health: "100.0%",
        latency: "85ms",
        webhooksToday: "64,120",
        type: "Payment Gateway",
        popular: true,

        authFields: [
            {
                key: "publishableKey",
                label: "Publishable Key",
                placeholder: "pk_live_xxxxxxxxxxxxxxxx",
                type: "text",
                required: true,
            },
            {
                key: "secretKey",
                label: "Secret API Key",
                placeholder: "sk_live_xxxxxxxxxxxxxxxx",
                type: "password",
                required: true,
            },
            {
                key: "webhookSecret",
                label: "Webhook Signing Secret",
                placeholder: "whsec_xxxxxxxxxxxxxxxx",
                type: "password",
                required: true,
            },
        ],

        automationTriggers: [
            {
                id: "stripe_payment_link",
                name: "In-Chat Dynamic Payment Link",
                desc: "Generate & attach Stripe payment URL directly in WhatsApp conversations",
                enabled: true,
            },
            {
                id: "stripe_paid_confirm",
                name: "Instant Payment Confirmation",
                desc: "Send automated WhatsApp receipt immediately upon payment capture",
                enabled: true,
            },
        ],

        facilityCodeRequired: false,
    },

    {
        id: "razorpay",
        name: "Razorpay",
        category: "payments",
        logo: "🟦",
        description:
            "Enable native UPI, NetBanking & Cards checkout via WhatsApp templates and convert COD to Prepaid.",
        status: "active",
        health: "99.90%",
        latency: "110ms",
        webhooksToday: "52,900",
        type: "Payment Gateway",
        popular: true,

        authFields: [
            {
                key: "keyId",
                label: "Razorpay Key ID",
                placeholder: "rzp_live_xxxxxxxxxxxx",
                type: "text",
                required: true,
            },
            {
                key: "keySecret",
                label: "Razorpay Key Secret",
                placeholder: "xxxxxxxxxxxxxxxxxxxxxxxx",
                type: "password",
                required: true,
            },
        ],

        automationTriggers: [
            {
                id: "rzp_cod_convert",
                name: "COD-to-Prepaid Discount Push",
                desc: "Send UPI payment link with discount to convert pending COD orders",
                enabled: true,
            },
            {
                id: "rzp_paid_webhook",
                name: "Payment Capture Listener",
                desc: "Listen for payment.captured event to trigger fulfillment",
                enabled: true,
            },
        ],

        facilityCodeRequired: false,
    },

    {
        id: "salesforce",
        name: "Salesforce Service Cloud",
        category: "crms",
        logo: "☁️",
        description:
            "Sync Meta Cloud API messages to Salesforce Cases, assign agents dynamically, and track SLAs.",
        status: "disconnected",
        health: "0.0%",
        latency: "0ms",
        webhooksToday: "0",
        type: "Enterprise CRM",
        popular: false,

        authFields: [
            {
                key: "instanceUrl",
                label: "Salesforce Instance URL",
                placeholder: "https://yourcompany.my.salesforce.com",
                type: "text",
                required: true,
            },
            {
                key: "clientId",
                label: "Consumer Key / Client ID",
                placeholder: "3MVG9xxxxxxxxxxxxxxxx",
                type: "text",
                required: true,
            },
            {
                key: "clientSecret",
                label: "Consumer Secret",
                placeholder: "xxxxxxxxxxxxxxxxxxxxxxxx",
                type: "password",
                required: true,
            },
        ],

        automationTriggers: [
            {
                id: "sf_case_create",
                name: "WhatsApp to Case Creation",
                desc: "Open a Salesforce Case when a customer requests live human support",
                enabled: false,
            },
            {
                id: "sf_agent_sync",
                name: "Omni-Channel Agent Sync",
                desc: "Route active WhatsApp thread to available agent in Salesforce Console",
                enabled: false,
            },
        ],

        facilityCodeRequired: false,
    },

    {
        id: "flipkart",
        name: "Flipkart Seller Hub",
        category: "marketplaces",
        logo: "🟡",
        description:
            "Fetch Flipkart orders, update tracking status, and trigger WhatsApp delivery updates for buyers.",
        status: "disconnected",
        health: "0.0%",
        latency: "0ms",
        webhooksToday: "0",
        type: "Regional Marketplace",
        popular: false,

        authFields: [
            {
                key: "appId",
                label: "Flipkart Application ID",
                placeholder: "fk-app-id-xxxx",
                type: "text",
                required: true,
            },
            {
                key: "appSecret",
                label: "Flipkart Application Secret",
                placeholder: "fk-sec-xxxx",
                type: "password",
                required: true,
            },
        ],

        automationTriggers: [
            {
                id: "fk_order_sync",
                name: "Order Sync Listener",
                desc: "Ingest Flipkart buyer orders into order pipeline",
                enabled: false,
            },
        ],

        facilityCodeRequired: true,
    },
];


/* =========================================================
   COMPONENT
========================================================= */

export default function Integration() {
    const [integrations, setIntegrations] = useState(INTEGRATIONS_DATA);
    const [shopifyConnection, setShopifyConnection] = useState(null);
    const [shopifyStatusLoading, setShopifyStatusLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [activeModalIntegration, setActiveModalIntegration] =
        useState(null);

    const [activeTab, setActiveTab] = useState("auth");

    const [formData, setFormData] = useState({});
    const [automationStates, setAutomationStates] = useState({});

    const [catalogSyncConfig, setCatalogSyncConfig] = useState({
        autoSyncCatalog: true,
        syncInterval: "15m",
        bufferStock: "5",
        mappedCatalogId: "META_CATALOG_8841920",
    });

    const [testingConnection, setTestingConnection] = useState(false);
    const [testResults, setTestResults] = useState(null);

    const [toast, setToast] = useState(null);


    /* =====================================================
       TOAST
    ===================================================== */

    const showToast = (message, type = "success") => {
        setToast({
            message,
            type,
        });

        setTimeout(() => {
            setToast(null);
        }, 3500);
    };


    /* =====================================================
       METRICS
    ===================================================== */

    const metrics = useMemo(() => {
        const total = integrations.length;

        const active = integrations.filter(
            (item) => item.status === "active"
        ).length;

        const actionNeeded = integrations.filter(
            (item) => item.status === "action_needed"
        ).length;

        const disconnected = integrations.filter(
            (item) => item.status === "disconnected"
        ).length;

        const totalWebhooks = integrations.reduce(
            (total, item) =>
                total +
                (parseInt(
                    item.webhooksToday.replace(/,/g, ""),
                    10
                ) || 0),
            0
        );

        return {
            total,
            active,
            actionNeeded,
            disconnected,
            healthAvg: "99.82%",
            totalWebhooksFormatted:
                totalWebhooks.toLocaleString(),
        };
    }, [integrations]);


    /* =====================================================
       FILTERING
    ===================================================== */

    const filteredIntegrations = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return integrations.filter((item) => {
            const categoryMatch =
                selectedCategory === "all" ||
                item.category === selectedCategory;

            const searchMatch =
                !query ||
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query);

            const statusMatch =
                statusFilter === "all" ||
                item.status === statusFilter;

            return categoryMatch && searchMatch && statusMatch;
        });
    }, [
        integrations,
        selectedCategory,
        searchQuery,
        statusFilter,
    ]);


    /* =====================================================
       OPEN CONFIGURATION
    ===================================================== */

    const handleOpenConfig = (integration) => {
        setActiveModalIntegration(integration);
        setActiveTab("auth");
        setTestResults(null);

        const initialForm = {};

        integration.authFields.forEach((field) => {
            initialForm[field.key] =
                field.defaultValue || "";
        });

        setFormData(initialForm);

        const triggerState = {};

        integration.automationTriggers.forEach((trigger) => {
            triggerState[trigger.id] = trigger.enabled;
        });

        setAutomationStates(triggerState);
    };


    /* =====================================================
       SHOPIFY CONNECT
    ===================================================== */
    const startShopifyOAuth = async (shopDomain) => {
        if (!shopDomain) {
            showToast(
                "Shopify store domain is unavailable.",
                "error"
            );
            return;
        }
    
        const normalizedShop = shopDomain
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/\/+$/, "");
    
        if (
            !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(
                normalizedShop
            )
        ) {
            showToast(
                "Please enter a valid Shopify store domain.",
                "error"
            );
            return;
        }
    
        try {
            setShopifyStatusLoading(true);
    
            const response =
                await shopifyApi.connect(
                    normalizedShop
                );
    
            const authorizationUrl =
                response?.data?.authorizationUrl;
    
            if (!authorizationUrl) {
                throw new Error(
                    "Shopify authorization URL was not returned."
                );
            }
    
            /*
             * JWT authentication has already happened
             * through shopifyApi.connect().
             *
             * This navigation is now only to Shopify.
             */
            window.location.href =
                authorizationUrl;
    
        } catch (error) {
            console.error(
                "Failed to start Shopify OAuth:",
                error
            );
    
            showToast(
                error?.response?.data?.message ||
                    "Unable to start Shopify connection.",
                "error"
            );
    
            setShopifyStatusLoading(false);
        }
    };
    const handleShopifyConnect = async () => {
        const shop = formData.shopDomain?.trim();
    
        if (!shop) {
            showToast(
                "Please enter your Shopify store domain.",
                "error"
            );
            return;
        }
    
        await startShopifyOAuth(shop);
    };


    /* =====================================================
       TOGGLE INTEGRATION
    ===================================================== */

    const handleToggleIntegrationStatus = (id, event) => {
        event.stopPropagation();

        setIntegrations((current) =>
            current.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                const newStatus =
                    item.status === "active"
                        ? "disconnected"
                        : "active";

                showToast(
                    `${item.name} is now ${
                        newStatus === "active"
                            ? "CONNECTED"
                            : "DISCONNECTED"
                    }.`,
                    newStatus === "active"
                        ? "success"
                        : "info"
                );

                return {
                    ...item,
                    status: newStatus,
                };
            })
        );
    };


    /* =====================================================
       COPY
    ===================================================== */

    const copyToClipboard = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);

            showToast(
                `${label} copied to clipboard.`,
                "info"
            );
        } catch {
            showToast(
                `Unable to copy ${label}.`,
                "error"
            );
        }
    };


    /* =====================================================
       DIAGNOSTIC TEST
    ===================================================== */

    const runDiagnosticTest = () => {
        if (!activeModalIntegration) {
            return;
        }

        setTestingConnection(true);
        setTestResults(null);

        setTimeout(() => {
            const success =
                activeModalIntegration.status !==
                "action_needed";

            setTestingConnection(false);

            setTestResults({
                timestamp: new Date()
                    .toISOString()
                    .substring(11, 19),

                httpCode: success ? 200 : 401,

                status: success
                    ? "HEALTHY"
                    : "UNAUTHORIZED",

                latencyMs: success
                    ? Math.floor(Math.random() * 80) + 90
                    : 420,

                message: success
                    ? "API handshake successful. Webhook endpoint reachable and credentials accepted."
                    : "Authentication token expired or missing required API permission scopes.",

                payloadResponse: {
                    partner:
                        activeModalIntegration.name,

                    meta_tech_provider_id:
                        "TP_META_99201948",

                    cloud_api_version:
                        "v19.0",

                    rate_limit_remaining:
                        4982,

                    webhook_listener:
                        `https://api.yourdomain.com/v1/webhooks/${activeModalIntegration.id}`,
                },
            });
        }, 1200);
    };


    /* =====================================================
       SHOPIFY STATUS
    ===================================================== */

    const loadShopifyStatus = async () => {
        try {
            setShopifyStatusLoading(true);

            const response = await shopifyApi.getStatus();

            const data =
                response?.data?.data ??
                response?.data ??
                response;

            setShopifyConnection(data);

            setIntegrations((current) =>
                current.map((item) => {
                    if (item.id !== "shopify") {
                        return item;
                    }

                    const connected =
                        data?.connected === true &&
                        data?.connectionStatus === "active";

                    return {
                        ...item,
                        status: connected
                            ? "active"
                            : "disconnected",
                    };
                })
            );
        } catch (error) {
            console.error(
                "Failed to load Shopify connection status:",
                error
            );

            setShopifyConnection(null);

            setIntegrations((current) =>
                current.map((item) =>
                    item.id === "shopify"
                        ? {
                              ...item,
                              status: "disconnected",
                          }
                        : item
                )
            );
        } finally {
            setShopifyStatusLoading(false);
        }
    };


    useEffect(() => {
        loadShopifyStatus();
    }, []);


    /* =====================================================
       SHOPIFY DISCONNECT
    ===================================================== */

    const handleShopifyDisconnect = async () => {
        const shopDomain =
            shopifyConnection?.shopDomain;

        if (!shopDomain) {
            showToast(
                "No Shopify store is currently connected.",
                "error"
            );
            return;
        }

        try {
            setShopifyStatusLoading(true);

            await shopifyApi.disconnect(shopDomain);

            setShopifyConnection(null);

            setIntegrations((current) =>
                current.map((item) =>
                    item.id === "shopify"
                        ? {
                              ...item,
                              status: "disconnected",
                          }
                        : item
                )
            );

            showToast(
                "Shopify disconnected successfully.",
                "success"
            );

            setActiveModalIntegration(null);
        } catch (error) {
            console.error(
                "Failed to disconnect Shopify:",
                error
            );

            showToast(
                error?.response?.data?.message ||
                    "Failed to disconnect Shopify.",
                "error"
            );
        } finally {
            setShopifyStatusLoading(false);
        }
    };


    /* =====================================================
       SAVE
    ===================================================== */

    const handleSaveConfiguration = () => {
        if (!activeModalIntegration) {
            return;
        }

        setIntegrations((current) =>
            current.map((item) => {
                if (
                    item.id !==
                    activeModalIntegration.id
                ) {
                    return item;
                }

                return {
                    ...item,

                    status: "active",

                    health: "100.0%",

                    automationTriggers:
                        item.automationTriggers.map(
                            (trigger) => ({
                                ...trigger,

                                enabled:
                                    automationStates[
                                        trigger.id
                                    ] !== undefined
                                        ? automationStates[
                                              trigger.id
                                          ]
                                        : trigger.enabled,
                            })
                        ),
                };
            })
        );

        showToast(
            `Configuration saved for ${activeModalIntegration.name}.`,
            "success"
        );

        setActiveModalIntegration(null);
    };


    /* =====================================================
       DRAWER
       Render through document.body so the drawer is not
       trapped inside the Dashboard/Topbar stacking context.
    ===================================================== */

    const renderConfigurationDrawer = () => {
        if (!activeModalIntegration) {
            return null;
        }

        return createPortal(
            <div
                className="integration-overlay"
                onMouseDown={() =>
                    setActiveModalIntegration(null)
                }
            >
                <aside
                    className="integration-drawer"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >

                    {/* =================================================
                        DRAWER HEADER
                    ================================================= */}

                    <div className="integration-drawer-header">

                        <div className="integration-drawer-title">

                            <div className="integration-drawer-logo">
                                {activeModalIntegration.logo}
                            </div>

                            <div>

                                <div className="integration-drawer-name">

                                    <h2>
                                        {activeModalIntegration.name}
                                    </h2>

                                    <span>
                                        {activeModalIntegration.type}
                                    </span>

                                </div>

                                <p>
                                    {activeModalIntegration.id === "shopify"
                                        ? "Connect your Shopify store, configure WhatsApp automations and manage synchronization settings."
                                        : activeModalIntegration.description}
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="integration-drawer-close"
                            onClick={() =>
                                setActiveModalIntegration(null)
                            }
                            aria-label="Close configuration drawer"
                            title="Close"
                        >
                            <X />
                        </button>

                    </div>


                    {/* =================================================
                        DRAWER TABS
                    ================================================= */}

                    <div className="integration-drawer-tabs">

                        {[
                            {
                                id: "auth",
                                label: "Credentials",
                                icon: Key,
                            },
                            {
                                id: "webhooks",
                                label: "Automations",
                                icon: Webhook,
                            },
                            {
                                id: "catalog",
                                label: "Catalog Sync",
                                icon: Package,
                            },
                            {
                                id: "diagnostics",
                                label: "Diagnostics",
                                icon: Terminal,
                            },
                        ].map((tab) => {

                            const Icon = tab.icon;

                            return (
                                <button
                                    type="button"
                                    key={tab.id}
                                    className={
                                        activeTab === tab.id
                                            ? "integration-drawer-tab active"
                                            : "integration-drawer-tab"
                                    }
                                    onClick={() =>
                                        setActiveTab(tab.id)
                                    }
                                >
                                    <Icon />

                                    <span>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}

                    </div>


                    {/* =================================================
                        DRAWER BODY
                    ================================================= */}

                    <div className="integration-drawer-body">

                        {/* =================================================
                            AUTH
                        ================================================= */}

                        {activeTab === "auth" && (
                            <div className="integration-drawer-section">

                                <div className="integration-security-note">

                                    <ShieldCheck />

                                    <div>

                                        <strong>
                                            Enterprise Security
                                        </strong>

                                        <p>
                                            API credentials should
                                            be stored securely and
                                            transmitted only over
                                            encrypted connections.
                                        </p>

                                    </div>

                                </div>


                                {activeModalIntegration.facilityCodeRequired && (
                                    <div className="integration-warning">

                                        <Building />

                                        <div>

                                            <strong>
                                                Warehouse Mapping Required
                                            </strong>

                                            <p>
                                                This marketplace
                                                requires a facility
                                                or warehouse code
                                                for operational sync.
                                            </p>

                                        </div>

                                    </div>
                                )}


                                <div className="integration-form">

                                    {activeModalIntegration.id === "shopify" ? (
                                        shopifyConnection?.connected &&
                                        shopifyConnection?.connectionStatus === "active" ? (
                                            <div className="integration-shopify-connected">

                                                <div className="integration-oauth-info">

                                                    <ShieldCheck />

                                                    <div>

                                                        <strong>
                                                            Shopify Connected
                                                        </strong>

                                                        <p>
                                                            Your Shopify store is securely
                                                            connected to Nexzsoft.
                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="integration-field">

                                                    <label>
                                                        <span>
                                                            Store Domain
                                                        </span>
                                                    </label>

                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={
                                                            shopifyConnection.shopDomain ||
                                                            ""
                                                        }
                                                    />

                                                </div>


                                                <div className="integration-field">

                                                    <label>
                                                        <span>
                                                            Store Name
                                                        </span>
                                                    </label>

                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={
                                                            shopifyConnection.shopName ||
                                                            "—"
                                                        }
                                                    />

                                                </div>


                                                {shopifyConnection.shopEmail && (
                                                    <div className="integration-field">

                                                        <label>
                                                            <span>
                                                                Store Email
                                                            </span>
                                                        </label>

                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={
                                                                shopifyConnection.shopEmail
                                                            }
                                                        />

                                                    </div>
                                                )}


                                                <div className="integration-field">

                                                    <label>
                                                        <span>
                                                            API Version
                                                        </span>
                                                    </label>

                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={
                                                            shopifyConnection.apiVersion ||
                                                            "2026-07"
                                                        }
                                                    />

                                                </div>


                                                <div className="integration-oauth-info">

                                                    <ShieldCheck />

                                                    <div>

                                                        <strong>
                                                            Granted Permissions
                                                        </strong>

                                                        <p>
                                                            {Array.isArray(
                                                                shopifyConnection.grantedScopes
                                                            )
                                                                ? shopifyConnection.grantedScopes.join(
                                                                      ", "
                                                                  )
                                                                : shopifyConnection.grantedScopes ||
                                                                  "No scope information available."}
                                                        </p>

                                                    </div>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="integration-primary-btn"
                                                    onClick={() =>
                                                        startShopifyOAuth(
                                                            shopifyConnection?.shopDomain
                                                        )
                                                    }
                                                >
                                                    Reconnect Shopify
                                                </button>

                                            </div>
                                        ) : (
                                            <>
                                                <div className="integration-field">

                                                    <label>

                                                        <span>
                                                            Store Domain
                                                            <em>*</em>
                                                        </span>

                                                        <small>
                                                            Enter your Shopify store domain.
                                                        </small>

                                                    </label>

                                                    <input
                                                        type="text"
                                                        placeholder="your-brand.myshopify.com"
                                                        value={
                                                            formData.shopDomain || ""
                                                        }
                                                        onChange={(event) =>
                                                            setFormData({
                                                                ...formData,
                                                                shopDomain:
                                                                    event.target.value,
                                                            })
                                                        }
                                                    />

                                                </div>


                                                <div className="integration-oauth-info">

                                                    <ShieldCheck />

                                                    <div>

                                                        <strong>
                                                            Secure Shopify Authorization
                                                        </strong>

                                                        <p>
                                                            Nexzsoft will redirect you to
                                                            Shopify to securely authorize
                                                            access to your store. Your
                                                            Shopify password and API
                                                            credentials are never entered
                                                            into Nexzsoft.
                                                        </p>

                                                    </div>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="integration-primary-btn"
                                                    onClick={handleShopifyConnect}
                                                >
                                                    Connect Shopify
                                                </button>
                                            </>
                                        )
                                    ) : (
                                        activeModalIntegration.authFields.map(
                                            (field) => (
                                                <div
                                                    className="integration-field"
                                                    key={field.key}
                                                >

                                                    <label>

                                                        <span>
                                                            {field.label}

                                                            {field.required && (
                                                                <em>
                                                                    *
                                                                </em>
                                                            )}
                                                        </span>

                                                        {field.desc && (
                                                            <small>
                                                                {field.desc}
                                                            </small>
                                                        )}

                                                    </label>

                                                    {field.type === "select" ? (
                                                        <select
                                                            value={
                                                                formData[field.key] || ""
                                                            }
                                                            onChange={(event) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    [field.key]:
                                                                        event.target.value,
                                                                })
                                                            }
                                                        >
                                                            <option value="">
                                                                Select option...
                                                            </option>

                                                            {field.options?.map(
                                                                (option) => (
                                                                    <option
                                                                        key={option}
                                                                        value={option}
                                                                    >
                                                                        {option}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type={field.type}
                                                            placeholder={
                                                                field.placeholder
                                                            }
                                                            value={
                                                                formData[field.key] || ""
                                                            }
                                                            onChange={(event) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    [field.key]:
                                                                        event.target.value,
                                                                })
                                                            }
                                                        />
                                                    )}

                                                </div>
                                            )
                                        )
                                    )}

                                </div>


                                {activeModalIntegration.id !== "shopify" && (
                                    <div className="integration-webhook-field">

                                        <label>
                                            Target Webhook Listener
                                        </label>

                                        <div>

                                            <input
                                                readOnly
                                                value={`https://api.yourdomain.com/v1/webhooks/${activeModalIntegration.id}`}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        `https://api.yourdomain.com/v1/webhooks/${activeModalIntegration.id}`,
                                                        "Webhook URL"
                                                    )
                                                }
                                            >
                                                <Copy />
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>
                        )}


                        {/* =================================================
                            AUTOMATIONS
                        ================================================= */}

                        {activeTab === "webhooks" && (
                            <div className="integration-drawer-section">

                                <div className="integration-section-heading">

                                    <div>

                                        <h3>
                                            WhatsApp Automations
                                        </h3>

                                        <p>
                                            Choose which platform
                                            events should trigger
                                            WhatsApp workflows.
                                        </p>

                                    </div>

                                </div>


                                <div className="integration-automation-list">

                                    {activeModalIntegration.automationTriggers.map(
                                        (trigger) => {

                                            const checked =
                                                automationStates[
                                                    trigger.id
                                                ] ??
                                                trigger.enabled;

                                            return (
                                                <div
                                                    className="integration-automation-item"
                                                    key={trigger.id}
                                                >

                                                    <div>

                                                        <div className="integration-automation-title">

                                                            <strong>
                                                                {trigger.name}
                                                            </strong>

                                                            <span>
                                                                META_TEMPLATE
                                                            </span>

                                                        </div>

                                                        <p>
                                                            {trigger.desc}
                                                        </p>

                                                    </div>


                                                    <button
                                                        type="button"
                                                        className={`integration-switch small ${
                                                            checked
                                                                ? "on"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            setAutomationStates(
                                                                (current) => ({
                                                                    ...current,
                                                                    [trigger.id]:
                                                                        !checked,
                                                                })
                                                            )
                                                        }
                                                    >
                                                        <span />
                                                    </button>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            </div>
                        )}


                        {/* =================================================
                            CATALOG
                        ================================================= */}

                        {activeTab === "catalog" && (
                            <div className="integration-drawer-section">

                                <div className="integration-catalog-card">

                                    <div className="integration-catalog-header">

                                        <div>

                                            <h3>
                                                Auto-Sync Meta Catalog
                                            </h3>

                                            <p>
                                                Keep products, stock,
                                                images and pricing
                                                synchronized.
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            className={`integration-switch small ${
                                                catalogSyncConfig.autoSyncCatalog
                                                    ? "on"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setCatalogSyncConfig({
                                                    ...catalogSyncConfig,
                                                    autoSyncCatalog:
                                                        !catalogSyncConfig.autoSyncCatalog,
                                                })
                                            }
                                        >
                                            <span />
                                        </button>

                                    </div>


                                    <div className="integration-catalog-grid">

                                        <div className="integration-field">

                                            <label>
                                                Sync Interval
                                            </label>

                                            <select
                                                value={
                                                    catalogSyncConfig.syncInterval
                                                }
                                                onChange={(event) =>
                                                    setCatalogSyncConfig({
                                                        ...catalogSyncConfig,
                                                        syncInterval:
                                                            event.target.value,
                                                    })
                                                }
                                            >
                                                <option value="5m">
                                                    Every 5 minutes
                                                </option>

                                                <option value="15m">
                                                    Every 15 minutes
                                                </option>

                                                <option value="1h">
                                                    Every hour
                                                </option>
                                            </select>

                                        </div>


                                        <div className="integration-field">

                                            <label>
                                                Safety Buffer Stock
                                            </label>

                                            <input
                                                type="number"
                                                value={
                                                    catalogSyncConfig.bufferStock
                                                }
                                                onChange={(event) =>
                                                    setCatalogSyncConfig({
                                                        ...catalogSyncConfig,
                                                        bufferStock:
                                                            event.target.value,
                                                    })
                                                }
                                            />

                                        </div>

                                    </div>

                                </div>


                                <div className="integration-catalog-card">

                                    <div className="integration-field">

                                        <label>
                                            Connected Meta Catalog ID
                                        </label>

                                        <input
                                            readOnly
                                            value={
                                                catalogSyncConfig.mappedCatalogId
                                            }
                                        />

                                    </div>

                                </div>

                            </div>
                        )}


                        {/* =================================================
                            DIAGNOSTICS
                        ================================================= */}

                        {activeTab === "diagnostics" && (
                            <div className="integration-drawer-section">

                                <div className="integration-diagnostic-card">

                                    <div>

                                        <h3>
                                            Endpoint Health Check
                                        </h3>

                                        <p>
                                            Test API credentials,
                                            endpoint reachability and
                                            permission status.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className="integration-primary-btn"
                                        disabled={testingConnection}
                                        onClick={runDiagnosticTest}
                                    >

                                        {testingConnection ? (
                                            <RefreshCw className="spin" />
                                        ) : (
                                            <Play />
                                        )}

                                        {testingConnection
                                            ? "Testing..."
                                            : "Test Connection"}

                                    </button>

                                </div>


                                {testResults && (
                                    <div className="integration-test-result">

                                        <div className="integration-test-header">

                                            <span>
                                                Timestamp:{" "}
                                                {testResults.timestamp}
                                            </span>

                                            <strong
                                                className={
                                                    testResults.httpCode ===
                                                    200
                                                        ? "success"
                                                        : "error"
                                                }
                                            >
                                                HTTP{" "}
                                                {testResults.httpCode}{" "}
                                                —{" "}
                                                {testResults.status}
                                            </strong>

                                        </div>


                                        <p>
                                            {testResults.message}
                                        </p>


                                        <pre>
                                            {JSON.stringify(
                                                testResults.payloadResponse,
                                                null,
                                                2
                                            )}
                                        </pre>

                                    </div>
                                )}

                            </div>
                        )}

                    </div>


                    {/* =================================================
                        DRAWER FOOTER
                    ================================================= */}

                    <div className="integration-drawer-footer">

                        {activeModalIntegration.id === "shopify" ? (
                            <>
                                <button
                                    type="button"
                                    className="integration-cancel-btn"
                                    onClick={() =>
                                        setActiveModalIntegration(null)
                                    }
                                >
                                    Close
                                </button>

                                {shopifyConnection?.connected &&
                                    shopifyConnection?.connectionStatus ===
                                        "active" && (
                                        <button
                                            type="button"
                                            className="integration-save-btn"
                                            onClick={handleShopifyDisconnect}
                                            disabled={shopifyStatusLoading}
                                        >
                                            <X />

                                            {shopifyStatusLoading
                                                ? "Disconnecting..."
                                                : "Disconnect Shopify"}
                                        </button>
                                    )}
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="integration-cancel-btn"
                                    onClick={() =>
                                        setActiveModalIntegration(null)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="integration-save-btn"
                                    onClick={handleSaveConfiguration}
                                >
                                    <Check />
                                    Save & Enable
                                </button>
                            </>
                        )}

                    </div>

                </aside>
            </div>,
            document.body
        );
    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="integration-page">

            {/* =================================================
                TOAST
            ================================================= */}

            {toast && (
                <div
                    className={`integration-toast ${
                        toast.type || "success"
                    }`}
                >
                    {toast.type === "success" && (
                        <CheckCircle2 />
                    )}

                    {toast.type === "info" && (
                        <Zap />
                    )}

                    {toast.type === "error" && (
                        <AlertTriangle />
                    )}

                    <span>{toast.message}</span>
                </div>
            )}


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section className="integration-page-header">

                <div>
                    <div className="integration-eyebrow">
                        INTEGRATION ECOSYSTEM
                    </div>

                    <h1>
                        Ecosystem Integrations
                    </h1>

                    <p>
                        Connect storefronts, marketplaces,
                        CRMs and payment gateways to your
                        Meta Cloud API engine.
                    </p>
                </div>

                <div className="integration-page-actions">

                    <button
                        type="button"
                        className="integration-secondary-btn"
                        onClick={async () => {
                            await loadShopifyStatus();

                            showToast(
                                "Integration status refreshed.",
                                "info"
                            );
                        }}
                    >
                        <RefreshCw />
                        Refresh Status
                    </button>

                    <button
                        type="button"
                        className="integration-primary-btn"
                        onClick={() =>
                            copyToClipboard(
                                "https://api.yourdomain.com/v1/meta/webhooks/listener",
                                "Global webhook URL"
                            )
                        }
                    >
                        <Webhook />
                        Copy Global Webhook
                    </button>

                </div>

            </section>


            {/* =================================================
                METRICS
            ================================================= */}

            <section className="integration-metrics">

                <div className="integration-metric-card">

                    <div className="integration-metric-icon indigo">
                        <Zap />
                    </div>

                    <div>
                        <span>
                            Active Integrations
                        </span>

                        <strong>
                            {metrics.active}
                        </strong>

                        <small>
                            of {metrics.total} platforms
                        </small>
                    </div>

                </div>


                <div className="integration-metric-card">

                    <div className="integration-metric-icon green">
                        <Activity />
                    </div>

                    <div>
                        <span>
                            Platform Health
                        </span>

                        <strong>
                            {metrics.healthAvg}
                        </strong>

                        <small>
                            aggregate health
                        </small>
                    </div>

                </div>


                <div className="integration-metric-card">

                    <div className="integration-metric-icon amber">
                        <AlertTriangle />
                    </div>

                    <div>
                        <span>
                            Action Required
                        </span>

                        <strong>
                            {metrics.actionNeeded}
                        </strong>

                        <small>
                            integrations need attention
                        </small>
                    </div>

                </div>


                <div className="integration-metric-card">

                    <div className="integration-metric-icon blue">
                        <Radio />
                    </div>

                    <div>
                        <span>
                            Events Today
                        </span>

                        <strong>
                            {metrics.totalWebhooksFormatted}
                        </strong>

                        <small>
                            webhook events
                        </small>
                    </div>

                </div>

            </section>


            {/* =================================================
                FILTER TOOLBAR
            ================================================= */}

            <section className="integration-toolbar dashboard-card">

                <div className="integration-category-list">

                    {[
                        ["all", "All"],
                        ["storefronts", "Storefronts"],
                        ["marketplaces", "Marketplaces"],
                        ["crms", "CRMs"],
                        ["payments", "Payments"],
                    ].map(([id, label]) => (
                        <button
                            type="button"
                            key={id}
                            className={
                                selectedCategory === id
                                    ? "integration-category-btn active"
                                    : "integration-category-btn"
                            }
                            onClick={() =>
                                setSelectedCategory(id)
                            }
                        >
                            {label}
                        </button>
                    ))}

                </div>


                <div className="integration-filter-controls">

                    <div className="integration-search">

                        <Search />

                        <input
                            type="text"
                            placeholder="Search integrations..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearchQuery("")
                                }
                                aria-label="Clear search"
                            >
                                <X />
                            </button>
                        )}

                    </div>


                    <select
                        className="integration-status-select"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >
                        <option value="all">
                            All Statuses
                        </option>

                        <option value="active">
                            Active Only
                        </option>

                        <option value="action_needed">
                            Action Needed
                        </option>

                        <option value="disconnected">
                            Disconnected
                        </option>
                    </select>

                </div>

            </section>


            {/* =================================================
                INTEGRATION GRID
            ================================================= */}

            <section className="integration-grid">

                {filteredIntegrations.map((item) => {

                    const isActive =
                        item.id === "shopify"
                            ? shopifyConnection?.connected === true &&
                              shopifyConnection?.connectionStatus ===
                                  "active"
                            : item.status === "active";

                    const isActionNeeded =
                        item.status === "action_needed";

                    return (
                        <article
                            key={item.id}
                            className={`integration-card ${
                                isActionNeeded
                                    ? "action-needed"
                                    : ""
                            } ${
                                !isActive &&
                                !isActionNeeded
                                    ? "disconnected"
                                    : ""
                            }`}
                        >

                            <div>

                                <div className="integration-card-header">

                                    <div className="integration-card-brand">

                                        <div className="integration-card-logo">
                                            {item.logo}
                                        </div>

                                        <div>

                                            <div className="integration-card-title">

                                                <h3>
                                                    {item.name}
                                                </h3>

                                                {item.popular && (
                                                    <span className="integration-popular">
                                                        Popular
                                                    </span>
                                                )}

                                            </div>

                                            <span className="integration-card-type">
                                                {item.type}
                                            </span>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        className={`integration-switch ${
                                            isActive
                                                ? "on"
                                                : ""
                                        }`}
                                        onClick={(event) => {
                                            event.stopPropagation();

                                            if (
                                                item.id ===
                                                "shopify"
                                            ) {
                                                if (isActive) {
                                                    handleShopifyDisconnect();
                                                } else {
                                                    handleOpenConfig(
                                                        item
                                                    );
                                                }

                                                return;
                                            }

                                            handleToggleIntegrationStatus(
                                                item.id,
                                                event
                                            );
                                        }}
                                        disabled={
                                            item.id ===
                                                "shopify" &&
                                            shopifyStatusLoading
                                        }
                                        title={
                                            isActive
                                                ? "Disconnect integration"
                                                : "Enable integration"
                                        }
                                    >
                                        <span />
                                    </button>

                                </div>


                                <p className="integration-card-description">
                                    {item.description}
                                </p>


                                <div className="integration-card-health">

                                    <div>
                                        <Clock />

                                        <span>
                                            Latency
                                        </span>

                                        <strong>
                                            {item.latency}
                                        </strong>
                                    </div>

                                    <div>
                                        <Activity />

                                        <span>
                                            Events
                                        </span>

                                        <strong>
                                            {item.webhooksToday}
                                        </strong>
                                    </div>

                                    <div>
                                        <ShieldCheck />

                                        <span>
                                            Health
                                        </span>

                                        <strong>
                                            {item.health}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            <div className="integration-card-footer">

                                <div>

                                    {isActive && (
                                        <span className="integration-status connected">
                                            <span />
                                            Connected
                                        </span>
                                    )}

                                    {isActionNeeded && (
                                        <span className="integration-status action-needed">
                                            <AlertTriangle />
                                            Action Needed
                                        </span>
                                    )}

                                    {!isActive &&
                                        !isActionNeeded && (
                                            <span className="integration-status disconnected">
                                                <XCircle />
                                                Disconnected
                                            </span>
                                        )}

                                </div>


                                <button
                                    type="button"
                                    className="integration-configure-btn"
                                    onClick={() =>
                                        handleOpenConfig(item)
                                    }
                                >
                                    <Sliders />
                                    Configure
                                </button>

                            </div>

                        </article>
                    );
                })}

            </section>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredIntegrations.length === 0 && (
                <div className="integration-empty-state">

                    <Search />

                    <h3>
                        No matching integrations found
                    </h3>

                    <p>
                        Try adjusting your category,
                        search query or status filter.
                    </p>

                </div>
            )}


            {/* =================================================
                CONFIGURATION DRAWER
                Rendered outside Dashboard via Portal.
            ================================================= */}

            {renderConfigurationDrawer()}

        </div>
    );
}
