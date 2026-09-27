import toast from "react-hot-toast";
import "./Broadcast.css";

import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    RiInformationLine,
} from "react-icons/ri";

import CreateTemplateModal
    from "./CreateTemplateModal/CreateTemplateModal";

import {
    getMetaTemplates,
    sendBroadcast,
    getCustomers,
    getBroadcasts,
    getBroadcastDetails,
    syncMetaTemplates
} from "../../../services/api";

import { getErrorMessage } from "../../../config/apiConfig";

import { RefreshCw } from "lucide-react";


function Broadcast() {

    // ======================================================
    // STATE
    // ======================================================

    const [showCreateTemplate, setShowCreateTemplate] =
        useState(false);

    const [broadcasts, setBroadcasts] =
        useState([]);

    const [selectedBroadcast, setSelectedBroadcast] =
        useState(null);

    const [broadcastLogs, setBroadcastLogs] =
        useState([]);

    const [audience, setAudience] =
        useState("All Customers");

    const [customers, setCustomers] =
        useState([]);

    const [selectedTemplate, setSelectedTemplate] =
        useState("");

    const [recipientCount, setRecipientCount] =
        useState(0);

    const [templates, setTemplates] =
        useState([]);

    const [selectedTemplateData, setSelectedTemplateData] =
        useState(null);

    const [campaign, setCampaign] =
        useState("");

    const [variableValues, setVariableValues] =
        useState({});

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");


    // ======================================================
    // DEBUG
    // ======================================================

    useEffect(() => {

        console.log(
            "Selected Broadcast =",
            selectedBroadcast
        );

    }, [selectedBroadcast]);


    useEffect(() => {

        console.log(
            "Broadcast Logs =",
            broadcastLogs
        );

    }, [broadcastLogs]);


    useEffect(() => {

        console.log(
            "Variable Values =",
            variableValues
        );

    }, [variableValues]);


    // ======================================================
    // RECIPIENT COUNT
    // ======================================================

    useEffect(() => {

        setRecipientCount(

            audience === "All Customers"

                ? customers.length

                : customers.filter(
                    customer =>
                        customer.label_name === audience
                ).length

        );

    }, [audience, customers]);


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        const initializeBroadcastPage = async () => {

            // Load the local/DB templates first so the selector is
            // immediately usable even when Meta is slow.
            await loadTemplates();

            await loadCustomers();

            await loadBroadcasts();

        };

        initializeBroadcastPage();

    }, []);


    // ======================================================
    // AUDIENCES
    // ======================================================

    const audiences = Object.values(

        customers.reduce((acc, customer) => {

            if (!customer.label_name) {
                return acc;
            }

            if (!acc[customer.labels]) {

                acc[customer.labels] = {

                    value: customer.labels,

                    name: customer.label_name,

                    count: 0

                };

            }

            acc[customer.labels].count++;

            return acc;

        }, {})

    );


    // ======================================================
    // LOAD TEMPLATES
    // ======================================================

    const loadTemplates = async () => {

        const tenantId =
            localStorage.getItem("tenantId");

        if (!tenantId) {

            console.log(
                "Broadcast: tenantId missing"
            );

            return;

        }

        /*
        ======================================================
        STEP 1: LOAD SAVED TEMPLATES FIRST
        ======================================================

        The broadcast screen must not depend on Meta responding
        quickly. Templates already saved in our DB should remain
        available immediately.
        ======================================================
        */

        try {

            const response =
                await getMetaTemplates(tenantId);

            const data =
                Array.isArray(response)
                    ? response
                    : response?.templates || [];

            console.log(
                "LOADED SAVED META TEMPLATES:",
                data
            );

            // Never clear the selector because a later Meta sync fails.
            if (data.length > 0) {
                setTemplates(data);
            }

        }

        catch (error) {

            console.warn(
                "⚠️ LOAD SAVED META TEMPLATES FAILED:",
                error
            );

            // Do NOT setTemplates([]) here. Existing state must survive
            // a temporary API/network failure.

        }

        /*
        ======================================================
        STEP 2: SYNC META IN BACKGROUND
        ======================================================

        Meta is an external dependency and can occasionally take
        longer than expected. The sync must never block the
        Broadcast page or remove already-loaded templates.
        ======================================================
        */

        try {

            await syncMetaTemplates(tenantId);

            console.log(
                "✅ META TEMPLATE SYNC COMPLETED"
            );

            // Refresh from DB only after a successful sync.
            const refreshed =
                await getMetaTemplates(tenantId);

            const refreshedData =
                Array.isArray(refreshed)
                    ? refreshed
                    : refreshed?.templates || [];

            if (refreshedData.length > 0) {

                console.log(
                    "🔄 META TEMPLATES REFRESHED:",
                    refreshedData
                );

                setTemplates(refreshedData);

            }

        }

        catch (error) {

            console.warn(
                "⚠️ META TEMPLATE SYNC SKIPPED:",
                error?.message || error
            );

            // IMPORTANT:
            // Keep the templates already loaded from DB.
            // A Meta timeout must never make Select Template empty.

        }

    };


    // ======================================================
    // LOAD CUSTOMERS
    // ======================================================

    const loadCustomers = async () => {

        try {

            const tenantId =
                localStorage.getItem("tenantId");

            if (!tenantId) {
                return;
            }

            const response =
                await getCustomers(tenantId);

            const data =
                Array.isArray(response)

                    ? response

                    : response?.customers || [];

            setCustomers(data || []);

        }

        catch (error) {

            console.error(
                "LOAD CUSTOMERS ERROR:",
                error
            );

            setCustomers([]);

        }

    };


    // ======================================================
    // LOAD BROADCASTS
    // ======================================================

    const loadBroadcasts = async () => {

        try {

            const tenantId =
                localStorage.getItem("tenantId");

            if (!tenantId) {
                return;
            }

            const response =
                await getBroadcasts(tenantId);

            const data =
                Array.isArray(response)

                    ? response

                    : response?.broadcasts || [];

            setBroadcasts(data);

        }

        catch (error) {

            console.error(
                "LOAD BROADCASTS ERROR:",
                error
            );

            setBroadcasts([]);

        }

    };


    // ======================================================
    // GET BODY COMPONENT
    // ======================================================

    const getBodyComponent = (template) => {

        if (!template?.components) {
            return null;
        }

        return template.components.find(

            component =>

                String(component?.type || "")
                    .toUpperCase() === "BODY"

        ) || null;

    };


    // ======================================================
    // EXTRACT VARIABLES FROM TEXT
    // ======================================================

    const extractVariablesFromText = (text) => {

        if (!text) {
            return [];
        }

        const variables = [];

        const regex =
            /\{\{\s*([^}]+?)\s*\}\}/g;

        let match;

        while (
            (match = regex.exec(String(text))) !== null
        ) {

            const variable =
                String(match[1]).trim();

            if (
                variable &&
                !variables.includes(variable)
            ) {

                variables.push(variable);

            }

        }

        return variables;

    };


    // ======================================================
    // EXTRACT ALL TEMPLATE VARIABLES
    // ======================================================

    const extractTemplateVariables = (template) => {

        if (!template?.components) {
            return [];
        }

        const variables = [];


        const addVariables = (text) => {

            const found =
                extractVariablesFromText(text);

            found.forEach(variable => {

                if (!variables.includes(variable)) {

                    variables.push(variable);

                }

            });

        };


        template.components.forEach(component => {

            const type =
                String(component?.type || "")
                    .toUpperCase();


            // BODY
            if (type === "BODY") {

                addVariables(
                    component.text
                );

            }


            // HEADER TEXT
            if (type === "HEADER") {

                const format =
                    String(component?.format || "")
                        .toUpperCase();

                if (format === "TEXT") {

                    addVariables(
                        component.text
                    );

                }

            }


            // BUTTON URL
            if (type === "BUTTONS") {

                const buttons =
                    Array.isArray(component.buttons)

                        ? component.buttons

                        : [];

                buttons.forEach(button => {

                    addVariables(
                        button?.url
                    );

                });

            }

        });

        return variables;

    };


    // ======================================================
    // SELECTED TEMPLATE VARIABLES
    // ======================================================

    const templateVariables = useMemo(() => {

        return extractTemplateVariables(
            selectedTemplateData
        );

    }, [selectedTemplateData]);


    // ======================================================
    // POSITIONAL VARIABLE CHECK
    // ======================================================

    const isPositionalVariable = (variable) => {

        return /^\d+$/.test(
            String(variable)
        );

    };


    // ======================================================
    // TEMPLATE SELECT
    // ======================================================

    const handleTemplateChange = (event) => {

        const templateId =
            event.target.value;


        setSelectedTemplate(
            templateId
        );


        const template =
            templates.find(

                item =>

                    String(item?.id) ===
                    String(templateId)

            );


        console.log(
            "SELECTED TEMPLATE DATA:",
            template
        );


        setSelectedTemplateData(
            template || null
        );


        // ==================================================
        // RESET VARIABLES
        // ==================================================

        const variables =
            extractTemplateVariables(
                template
            );

        const initialValues = {};


        variables.forEach(variable => {

            initialValues[variable] = "";

        });


        setVariableValues(
            initialValues
        );


        // ==================================================
        // SET MESSAGE
        // ==================================================

        const body =
            getBodyComponent(template);

        setMessage(
            body?.text || ""
        );

    };


    // ======================================================
    // REPLACE VARIABLES
    // ======================================================

    const replaceVariables = (text) => {

        if (!text) {
            return "";
        }


        return String(text).replace(

            /\{\{\s*([^}]+?)\s*\}\}/g,

            (_, variable) => {

                const key =
                    String(variable).trim();

                const value =
                    variableValues?.[key];


                if (
                    value === undefined ||
                    value === null ||
                    String(value).trim() === ""
                ) {

                    return `{{${key}}}`;

                }


                return String(value);

            }

        );

    };


    // ======================================================
    // PREVIEW MESSAGE
    // ======================================================

    const previewMessage =
        useMemo(() => {

            return replaceVariables(
                message
            );

        }, [
            message,
            variableValues
        ]);


    // ======================================================
    // NORMALIZE PHONE
    // ======================================================

    const normalizePhone = (phone) => {

        if (
            phone === null ||
            phone === undefined
        ) {

            return null;

        }


        let value =
            String(phone)
                .trim()
                .replace(
                    /[\s\-().]/g,
                    ""
                );


        if (!value) {
            return null;
        }


        if (value.startsWith("+")) {

            value =
                value.substring(1);

        }


        if (value.startsWith("00")) {

            value =
                value.substring(2);

        }


        // Indian 10 digit number
        if (
            /^\d{10}$/.test(value) &&
            /^[6-9]/.test(value)
        ) {

            value =
                "91" + value;

        }


        // Indian 0XXXXXXXXXX
        if (
            /^0\d{10}$/.test(value)
        ) {

            value =
                "91" +
                value.substring(1);

        }


        return value;

    };


    // ======================================================
    // GET RECIPIENTS
    // ======================================================

    const getRecipients = () => {

        let selectedCustomers = [];


        if (
            audience === "All Customers"
        ) {

            selectedCustomers =
                customers;

        }


        else if (
            audience === "Premium Customers"
        ) {

            selectedCustomers =
                customers.filter(

                    customer =>

                        customer?.is_premium ||
                        customer?.customer_type === "premium"

                );

        }


        else if (
            audience === "Leads"
        ) {

            selectedCustomers =
                customers.filter(

                    customer =>

                        customer?.status === "lead" ||
                        customer?.type === "lead"

                );

        }


        else if (
            audience === "Inactive Customers"
        ) {

            selectedCustomers =
                customers.filter(

                    customer =>

                        customer?.status === "inactive"

                );

        }


        else {

            selectedCustomers =
                customers.filter(

                    customer =>
                        customer?.label_name === audience

                );

        }


        return selectedCustomers

            .map(
                customer =>
                    normalizePhone(
                        customer?.phone
                    )
            )

            .filter(Boolean)

            .filter(
                (phone, index, array) =>
                    array.indexOf(phone) === index
            );

    };


    // ======================================================
    // BUILD ONE PARAMETER
    // ======================================================

    const buildParameter = (variable) => {

        const value =
            variableValues?.[variable];


        const parameter = {

            type: "text",

            text:
                String(value ?? "").trim()

        };


        if (
            !isPositionalVariable(variable)
        ) {

            parameter.parameter_name =
                String(variable);

        }


        return parameter;

    };


    // ======================================================
    // BUILD META COMPONENTS
    // ======================================================

    const buildTemplateComponents = () => {

        if (!selectedTemplateData) {
            return [];
        }


        const output = [];


        const templateComponents =
            Array.isArray(
                selectedTemplateData.components
            )

                ? selectedTemplateData.components

                : [];


        // ==================================================
        // BODY
        // ==================================================

        const body =
            templateComponents.find(

                component =>

                    String(component?.type || "")
                        .toUpperCase() === "BODY"

            );


        const bodyVariables =
            extractVariablesFromText(
                body?.text
            );


        if (
            bodyVariables.length > 0
        ) {

            output.push({

                type: "body",

                parameters:
                    bodyVariables.map(
                        buildParameter
                    )

            });

        }


        // ==================================================
        // HEADER
        // ==================================================

        const header =
            templateComponents.find(

                component =>

                    String(component?.type || "")
                        .toUpperCase() === "HEADER"

            );


        const headerFormat =
            String(
                header?.format || ""
            ).toUpperCase();


        // ==================================================
        // TEXT HEADER
        // ==================================================

        if (
            headerFormat === "TEXT"
        ) {

            const headerVariables =
                extractVariablesFromText(
                    header?.text
                );


            if (
                headerVariables.length > 0
            ) {

                output.push({

                    type: "header",

                    parameters:
                        headerVariables.map(
                            buildParameter
                        )

                });

            }

        }


        // ==================================================
        // IMAGE / VIDEO / DOCUMENT HEADER
        // ==================================================

        if (
            headerFormat === "IMAGE" ||
            headerFormat === "VIDEO" ||
            headerFormat === "DOCUMENT"
        ) {

            const mediaId =
                selectedTemplateData?.media_id ||
                selectedTemplateData?.mediaId ||
                null;


            console.log(
                "========== MEDIA TEMPLATE =========="
            );

            console.log({
                template:
                    selectedTemplateData?.name,

                format:
                    headerFormat,

                mediaId
            });


            if (!mediaId) {

                console.error(
                    "MEDIA ID MISSING:",
                    selectedTemplateData
                );

            } else {

                const mediaType =
                    headerFormat.toLowerCase();


                output.push({

                    type: "header",

                    parameters: [

                        {

                            type: mediaType,

                            [mediaType]: {

                                id:
                                    String(mediaId)

                            }

                        }

                    ]

                });

            }

        }


        // ==================================================
        // BUTTON URL VARIABLES
        // ==================================================

        const buttonsComponent =
            templateComponents.find(

                component =>

                    String(component?.type || "")
                        .toUpperCase() === "BUTTONS"

            );


        const buttons =
            Array.isArray(
                buttonsComponent?.buttons
            )

                ? buttonsComponent.buttons

                : [];


        buttons.forEach(
            (button, index) => {

                const buttonVariables =
                    extractVariablesFromText(
                        button?.url
                    );


                if (
                    buttonVariables.length === 0
                ) {

                    return;

                }


                output.push({

                    type: "button",

                    sub_type: "url",

                    index:
                        String(index),

                    parameters:
                        buttonVariables.map(
                            buildParameter
                        )

                });

            }
        );


        console.log(
            "FINAL TEMPLATE COMPONENTS:",
            JSON.stringify(
                output,
                null,
                2
            )
        );


        return output;

    };


    // ======================================================
    // VALIDATE VARIABLES
    // ======================================================

    const validateVariables = () => {

        for (
            const variable of templateVariables
        ) {

            const value =
                variableValues?.[variable];


            if (
                value === undefined ||
                value === null ||
                String(value).trim() === ""
            ) {

                toast.error(
                    `Please enter value for {{${variable}}}`
                );

                return false;

            }

        }


        return true;

    };


    // ======================================================
    // SEND BROADCAST
    // ======================================================

    const handleSendBroadcast = async () => {

        if (loading) {
            return;
        }


        if (!selectedTemplateData) {

            toast.error(
                "Please select a WhatsApp template"
            );

            return;

        }


        const recipients =
            getRecipients();


        if (
            recipients.length === 0
        ) {

            toast.error(
                "No valid customers found"
            );

            return;

        }


        if (
            !validateVariables()
        ) {

            return;

        }


        const components =
            buildTemplateComponents();


        console.log(
            "========== BROADCAST PAYLOAD =========="
        );


        console.log(
            "Template:",
            selectedTemplateData?.name
        );


        console.log(
            "Language:",
            selectedTemplateData?.language
        );


        console.log(
            "Media ID:",
            selectedTemplateData?.media_id
        );


        console.log(
            "Recipients:",
            recipients
        );


        console.log(
            "Variable Values:",
            variableValues
        );


        console.log(
            "Components:",
            JSON.stringify(
                components,
                null,
                2
            )
        );


        console.log(
            "======================================="
        );


        try {

            setLoading(true);


            const tenantId =
                localStorage.getItem(
                    "tenantId"
                );


            console.log(
                "Send Broadcast:",
                tenantId,
                audience,
                campaign,
                selectedTemplateData.name,
                recipients,
                selectedTemplateData.language,
                components
            );


            const response =
                await sendBroadcast({

                    tenantId,

                    audience,

                    campaignName:
                        campaign ||
                        "Untitled Campaign",

                    templateName:
                        selectedTemplateData.name,

                    recipients,

                    language:
                        selectedTemplateData.language ||
                        "en_US",

                    components

                });


            console.log(
                "BROADCAST RESPONSE:",
                response
            );


            if (
                response?.success === false
            ) {

                toast.error(
                    response?.error?.message ||
                    response?.error ||
                    "Broadcast Failed"
                );

                return;

            }


            toast.success(
                `Broadcast Sent\n\nSuccess: ${
                    response?.successCount ?? 0
                }\nFailed: ${
                    response?.failedCount ?? 0
                }`
            );


            await loadBroadcasts();

        }

        catch (error) {

            console.error(
                "BROADCAST ERROR:",
                error
            );


            console.error(
                "SERVER RESPONSE:",
                error?.response?.data
            );


            toast.error(
                getErrorMessage(error)
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ======================================================
    // BROADCAST DETAILS
    // ======================================================

    const loadBroadcastDetails = async (id) => {

        try {

            const tenantId =
                localStorage.getItem(
                    "tenantId"
                );


            const response =
                await getBroadcastDetails(
                    id,
                    tenantId
                );


            console.log(
                "Broadcast Details =",
                response
            );


            setSelectedBroadcast(

                response?.broadcast ||
                response?.data?.broadcast ||
                null

            );


            setBroadcastLogs(

                response?.logs ||
                response?.data?.logs ||
                []

            );

        }

        catch (error) {

            console.error(
                "DETAIL ERROR:",
                error
            );

        }

    };


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="broadcast-page">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="broadcast-top">

                <div>

                    <h2>
                        📢 Broadcast Campaigns
                    </h2>

                    <p>
                        Send WhatsApp campaigns to your customers.
                    </p>

                </div>


                <div className="campaign-header-actions">

                    <button
                        className="create-template-btn"
                        onClick={() =>
                            setShowCreateTemplate(true)
                        }
                    >
                        + Create Template
                    </button>

                </div>

            </div>


            {/* ==================================================
                STATS
            ================================================== */}

            <div className="broadcast-stats">


                <div className="broadcast-stat-card">

                    <div className="stat-content">

                        <h2>
                            {broadcasts.length}
                        </h2>

                        <p>
                            Total Campaigns
                        </p>

                    </div>

                </div>


                <div className="broadcast-stat-card success">

                    <div className="stat-content">

                        <h2>

                            {broadcasts.length > 0

                                ? `${Math.round(

                                    (

                                        broadcasts.reduce(
                                            (sum, item) =>
                                                sum +
                                                Number(
                                                    item?.success_count || 0
                                                ),
                                            0
                                        )

                                        /

                                        Math.max(

                                            broadcasts.reduce(
                                                (sum, item) =>
                                                    sum +
                                                    Number(
                                                        item?.total_recipients || 0
                                                    ),
                                                0
                                            ),

                                            1

                                        )

                                    ) * 100

                                )}%`

                                : "0%"

                            }

                        </h2>

                        <p>
                            Delivery Rate
                        </p>

                    </div>

                </div>


                <div className="broadcast-stat-card info">

                    <div className="stat-content">

                        <h2>

                            {broadcasts.length > 0

                                ? `${Math.round(

                                    (

                                        broadcasts.reduce(
                                            (sum, item) =>
                                                sum +
                                                Number(
                                                    item?.read_count || 0
                                                ),
                                            0
                                        )

                                        /

                                        Math.max(

                                            broadcasts.reduce(
                                                (sum, item) =>
                                                    sum +
                                                    Number(
                                                        item?.total_recipients || 0
                                                    ),
                                                0
                                            ),

                                            1

                                        )

                                    ) * 100

                                )}%`

                                : "0%"

                            }

                        </h2>

                        <p>
                            Read Rate
                        </p>

                    </div>

                </div>


                <div className="broadcast-stat-card warning">

                    <div className="stat-content">

                        <h2>

                            {broadcasts.length > 0

                                ? `${Math.round(

                                    (

                                        broadcasts.reduce(
                                            (sum, item) =>
                                                sum +
                                                Number(
                                                    item?.reply_count || 0
                                                ),
                                            0
                                        )

                                        /

                                        Math.max(

                                            broadcasts.reduce(
                                                (sum, item) =>
                                                    sum +
                                                    Number(
                                                        item?.read_count || 0
                                                    ),
                                                0
                                            ),

                                            1

                                        )

                                    ) * 100

                                )}%`

                                : "0%"

                            }

                        </h2>

                        <p>
                            Reply Rate
                        </p>

                    </div>

                </div>

            </div>


            {/* ==================================================
                MAIN
            ================================================== */}

            <div className="broadcast-main">


                {/* ==================================================
                    LEFT — CAMPAIGN FORM
                ================================================== */}

                <div className="campaign-card">

                    <h3>
                        Send Campaign
                    </h3>


                    {/* CAMPAIGN NAME */}

                    <div className="form-group">

                        <label>
                            Campaign Name
                        </label>

                        <input
                            type="text"
                            value={campaign}
                            onChange={e =>
                                setCampaign(
                                    e.target.value
                                )
                            }
                            placeholder="New Campaign"
                        />

                    </div>


                    {/* AUDIENCE */}

                    <div className="form-group">

                        <label>
                            Audience
                        </label>


                        <div className="audience-row">

                            <select
                                value={audience}
                                onChange={e =>
                                    setAudience(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="All Customers">
                                    All Customers ({customers.length})
                                </option>


                                {audiences.map(label => (

                                    <option
                                        key={label.value}
                                        value={label.name}
                                    >
                                        {label.name} ({label.count})
                                    </option>

                                ))}

                            </select>


                            <div className="audience-preview">

                                <span className="audience-preview-label">
                                    Recipients
                                </span>

                                <span className="audience-preview-count">
                                    👥 {recipientCount} Customer
                                    {recipientCount !== 1 ? "s" : ""}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* WHATSAPP TEMPLATE */}

                    <div className="form-group">

                        <label>
                            WhatsApp Template
                        </label>


                        <select
                            value={selectedTemplate}
                            onChange={handleTemplateChange}
                        >

                            <option value="">
                                Select Template
                            </option>


                            {templates.map(template => (

                                <option
                                    key={template.id}
                                    value={template.id}
                                >

                                    {template.name}
                                    {" • "}
                                    {template.category}

                                </option>

                            ))}

                        </select>

                    </div>


                    {/* TEMPLATE VARIABLES */}

                    {selectedTemplateData &&
                        templateVariables.length > 0 && (

                            <div className="template-variables">

                                <h3>
                                    Template Variables
                                </h3>

                                <p className="variable-help">
                                    Enter values for all variables before sending.
                                </p>


                                {templateVariables.map(
                                    (variable, index) => (

                                        <div
                                            className="variable-field"
                                            key={variable}
                                        >

                                            <label>

                                                {`{{${variable}}}`}

                                                <span>
                                                    {" "}
                                                    Variable {index + 1}
                                                </span>

                                            </label>


                                            <input
                                                type="text"
                                                value={
                                                    variableValues?.[variable] || ""
                                                }
                                                placeholder={
                                                    `Enter value for {{${variable}}}`
                                                }
                                                onChange={e => {

                                                    const value =
                                                        e.target.value;


                                                    setVariableValues(
                                                        previous => ({

                                                            ...previous,

                                                            [variable]:
                                                                value

                                                        })
                                                    );

                                                }}
                                            />

                                        </div>
                                    )
                                )}

                            </div>

                        )}


                    {/* NO TEMPLATE VARIABLES */}

                    {selectedTemplateData &&
                        templateVariables.length === 0 && (

                            <div className="no-template-variables">

                                ✓ This template has no variables

                            </div>

                        )}


                    {/* CAMPAIGN ACTIONS */}

                    <div className="campaign-actions">

                        <button
                            type="button"
                            className="attach-btn"
                            disabled
                        >
                            📎 Attachment
                        </button>


                        <button
                            type="button"
                            className="schedule-btn"
                            disabled
                        >
                            📅 Schedule
                        </button>

                    </div>


                    {/* SEND CAMPAIGN */}

                    <button
                        type="button"
                        className="send-btn"
                        onClick={handleSendBroadcast}
                        disabled={
                            loading ||
                            !selectedTemplateData
                        }
                    >

                        {loading
                            ? "⏳ Sending..."
                            : "🚀 Send Broadcast"}

                    </button>


                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            color: "#667085",
                            fontSize: "11px",
                            padding: "0 2px",
                            paddingTop: "10px",
                        }}
                    >

                        <RiInformationLine />

                        Only send WhatsApp messages to contacts who have provided appropriate consent to receive communications.

                    </div>

                </div>


                {/* ==================================================
                    RIGHT — WHATSAPP PREVIEW
                ================================================== */}

                <div className="preview-card">

                    <h3>
                        WhatsApp Preview
                    </h3>


                    <div className="broadcast-phone">


                        <div className="broadcast-phone-header">

                            {campaign || "New Campaign"}

                        </div>


                        <div className="broadcast-phone-body">


                            <div className="broadcast-preview-message">


                                {!selectedTemplateData

                                    ? "Select Template"

                                    : selectedTemplateData.components?.map(

                                        (component, index) => {

                                            const type =
                                                String(
                                                    component?.type || ""
                                                ).toUpperCase();


                                            return (

                                                <div
                                                    key={index}
                                                >


                                                    {/* HEADER */}

                                                    {type === "HEADER" && (

                                                        <>

                                                            <strong>

                                                                {component?.format === "TEXT"

                                                                    ? replaceVariables(
                                                                        component?.text || ""
                                                                    )

                                                                    : component?.format === "IMAGE"

                                                                        ? "🖼️ [Image Header]"

                                                                        : component?.format === "VIDEO"

                                                                            ? "🎥 [Video Header]"

                                                                            : component?.format === "DOCUMENT"

                                                                                ? "📄 [Document Header]"

                                                                                : "[Media Header]"

                                                                }

                                                            </strong>


                                                            <br />
                                                            <br />

                                                        </>

                                                    )}


                                                    {/* BODY */}

                                                    {type === "BODY" && (

                                                        <>

                                                            <div
                                                                style={{
                                                                    whiteSpace: "pre-wrap"
                                                                }}
                                                            >

                                                                {
                                                                    replaceVariables(
                                                                        component?.text || ""
                                                                    )
                                                                }

                                                            </div>


                                                            <br />
                                                            <br />

                                                        </>

                                                    )}


                                                    {/* FOOTER */}

                                                    {type === "FOOTER" && (

                                                        <>

                                                            <small>

                                                                {
                                                                    replaceVariables(
                                                                        component?.text || ""
                                                                    )
                                                                }

                                                            </small>


                                                            <br />
                                                            <br />

                                                        </>

                                                    )}


                                                    {/* BUTTONS */}

                                                    {type === "BUTTONS" && (

                                                        <div
                                                            className="broadcast-preview-buttons"
                                                        >

                                                            {Array.isArray(
                                                                component?.buttons
                                                            ) &&

                                                                component.buttons.map(

                                                                    (btn, i) => (

                                                                        <button
                                                                            key={i}
                                                                            type="button"
                                                                        >

                                                                            {
                                                                                btn?.text ||
                                                                                `Button ${i + 1}`
                                                                            }

                                                                        </button>

                                                                    )

                                                                )

                                                            }

                                                        </div>

                                                    )}

                                                </div>

                                            );

                                        }

                                    )

                                }


                            </div>


                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                HISTORY
            ================================================== */}

            <div className="campaign-history">


                <div className="history-header">

                    <h3>
                        Campaign Insights
                    </h3>


                    <button
                        type="button"
                        className="refresh-btn"
                        onClick={loadBroadcasts}
                        aria-label="Refresh campaign insights"
                        title="Refresh"
                    >

                        <RefreshCw
                            size={16}
                            strokeWidth={2}
                        />

                    </button>

                </div>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Campaign
                            </th>

                            <th>
                                Audience
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Sent On
                            </th>

                            <th>
                                Delivered
                            </th>

                            <th>
                                Read
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {broadcasts.length === 0 ? (

                            <tr>

                                <td colSpan="7">
                                    No Broadcasts Found
                                </td>

                            </tr>

                        ) : (

                            broadcasts.map(
                                item => (

                                    <tr
                                        key={item.id}
                                    >

                                        <td>

                                            {
                                                item?.campaign_name ||
                                                "Untitled"
                                            }

                                        </td>


                                        <td>

                                            {
                                                item?.audience ||
                                                "All Customers"
                                            }

                                        </td>


                                        <td>

                                            <span
                                                className={`status ${
                                                    item.total_recipients === 0

                                                        ? "status-empty"

                                                        : item.failed_count === item.total_recipients

                                                            ? "status-failed"

                                                            : item.success_count === 0 &&
                                                              item.failed_count === 0

                                                                ? "status-pending"

                                                                : item.failed_count > 0

                                                                    ? "status-partial"

                                                                    : "status-success"
                                                }`}
                                            >

                                                {
                                                    item.total_recipients === 0

                                                        ? "Zero Recipients"

                                                        : item.failed_count === item.total_recipients

                                                            ? "Delivery Failed"

                                                            : item.success_count === 0 &&
                                                              item.failed_count === 0

                                                                ? "Not Sent"

                                                                : item.failed_count > 0

                                                                    ? "Partially Sent"

                                                                    : "Sent Successfully"
                                                }

                                            </span>

                                        </td>


                                        <td>

                                            {
                                                new Date(
                                                    item.created_at
                                                ).toLocaleDateString()
                                            }

                                        </td>


                                        <td>

                                            {
                                                item?.success_count || 0
                                            }

                                            /

                                            {
                                                item?.total_recipients || 0
                                            }

                                        </td>


                                        <td>

                                            {
                                                item?.read_count || 0
                                            }

                                            /

                                            {
                                                item?.success_count || 0
                                            }

                                        </td>


                                        <td>

                                            <button
                                                type="button"
                                                className="table-btn"
                                                onClick={() => {

                                                    console.log(
                                                        "CLICKED = ",
                                                        item.id
                                                    );

                                                    loadBroadcastDetails(
                                                        item.id
                                                    );

                                                }}
                                            >

                                                View

                                            </button>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>


            {/* ==================================================
                DETAILS
            ================================================== */}

            {selectedBroadcast && (

                <div className="broadcast-details">

                    <h3>

                        {
                            selectedBroadcast?.campaign_name
                        }

                    </h3>


                    <p>

                        Total:
                        {" "}

                        {
                            selectedBroadcast?.total_recipients ||
                            0
                        }

                    </p>


                    <p>

                        Success:
                        {" "}

                        {
                            selectedBroadcast?.success_count ||
                            0
                        }

                    </p>


                    <p>

                        Failed:
                        {" "}

                        {
                            selectedBroadcast?.failed_count ||
                            0
                        }

                    </p>


                    {broadcastLogs.map(
                        log => (

                            <div
                                key={log.id}
                                className="broadcast-log"
                            >

                                <span>
                                    {log.phone}
                                </span>

                                <span>

                                    {
                                        log.success
                                            ? "SUCCESS"
                                            : "FAILED"
                                    }

                                </span>

                            </div>

                        )
                    )}

                </div>

            )}


            {/* CREATE TEMPLATE MODAL */}

            <CreateTemplateModal
                open={
                    showCreateTemplate
                }
                onClose={() =>
                    setShowCreateTemplate(
                        false
                    )
                }
            />

        </div>

    );

}


export default Broadcast;