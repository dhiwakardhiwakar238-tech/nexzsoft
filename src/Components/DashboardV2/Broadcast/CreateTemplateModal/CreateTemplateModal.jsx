import toast from "react-hot-toast";
import "./CreateTemplateModal.css";
import { useState, useRef } from "react";
import {
    createTemplate,
    uploadMedia
} from "../../../../services/api";
import { getErrorMessage } from "../../../../config/apiConfig";

function CreateTemplateModal({ open, onClose }) {

    const bodyTextareaRef = useRef(null);

    const [templateName, setTemplateName] = useState("");
    const [category, setCategory] = useState("MARKETING");
    const [language, setLanguage] = useState("en_US");

    const [headerType, setHeaderType] = useState("NONE");
    const [headerText, setHeaderText] = useState("");
    const [headerMedia, setHeaderMedia] = useState(null);
    const [headerExample, setHeaderExample] = useState("");

    const [body, setBody] = useState("");
    const [footer, setFooter] = useState("");

    const [buttons, setButtons] = useState([]);
    const [showButtonMenu, setShowButtonMenu] = useState(false);

    const [bodyExamples, setBodyExamples] = useState({});


    // ======================================================
    // EXTRACT BODY VARIABLES
    // ======================================================

    const extractBodyVariables = (text) => {

        if (!text) {
            return [];
        }

        const regex = /{{\s*([^}]+?)\s*}}/g;

        const variables = [];

        let match;

        while ((match = regex.exec(text)) !== null) {

            const variable = match[1].trim();

            if (!variables.includes(variable)) {
                variables.push(variable);
            }
        }

        return variables;
    };


    // ======================================================
    // ADD BODY VARIABLE
    // ======================================================

    const addBodyVariable = () => {

        const existingVariables =
            extractBodyVariables(body);

        const numericVariables =
            existingVariables
                .filter((item) => /^\d+$/.test(item))
                .map(Number);

        const nextNumber =
            numericVariables.length > 0
                ? Math.max(...numericVariables) + 1
                : 1;

        const variable = `{{${nextNumber}}}`;

        const textarea = bodyTextareaRef.current;

        if (!textarea) {

            setBody((prev) =>
                prev +
                (prev ? " " : "") +
                variable
            );

        } else {

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            setBody((prev) => {

                const before =
                    prev.substring(0, start);

                const after =
                    prev.substring(end);

                return (
                    before +
                    variable +
                    after
                );
            });

            setTimeout(() => {

                const cursorPosition =
                    start + variable.length;

                textarea.focus();

                textarea.setSelectionRange(
                    cursorPosition,
                    cursorPosition
                );

            }, 0);
        }

        setBodyExamples((prev) => ({
            ...prev,
            [String(nextNumber)]:
                prev[String(nextNumber)] || ""
        }));
    };


    // ======================================================
    // UPDATE BODY EXAMPLE
    // ======================================================

    const updateBodyExample = (
        variable,
        value
    ) => {

        setBodyExamples((prev) => ({
            ...prev,
            [variable]: value
        }));
    };


    // ======================================================
    // ADD BUTTON
    // ======================================================

    const addButton = (type) => {

        setButtons((prev) => [
            ...prev,
            {
                type,
                text: "",
                url: "",
                phone_number: "",
                offer_code: "",
                flow_id: ""
            }
        ]);

        setShowButtonMenu(false);
    };


    // ======================================================
    // UPDATE BUTTON
    // ======================================================

    const updateButton = (
        index,
        field,
        value
    ) => {

        const updated = [...buttons];

        updated[index] = {
            ...updated[index],
            [field]: value
        };

        setButtons(updated);
    };


    // ======================================================
    // REMOVE BUTTON
    // ======================================================

    const removeButton = (index) => {

        const updated = [...buttons];

        updated.splice(index, 1);

        setButtons(updated);
    };


    // ======================================================
    // RESET FORM
    // ======================================================

    const resetForm = () => {

        setTemplateName("");
        setCategory("MARKETING");
        setLanguage("en_US");

        setHeaderType("NONE");
        setHeaderText("");
        setHeaderMedia(null);
        setHeaderExample("");

        setBody("");
        setBodyExamples({});

        setFooter("");

        setButtons([]);

        setShowButtonMenu(false);
    };


    // ======================================================
    // CLOSE
    // ======================================================

    const handleClose = () => {

        onClose();
    };


    // ======================================================
    // BODY VARIABLES
    // ======================================================

    const bodyVariables =
        extractBodyVariables(body);


    // ======================================================
    // VALIDATE VARIABLE PLACEMENT
    // ======================================================

    const hasInvalidBodyVariablePlacement = () => {

        if (!body?.trim()) {
            return false;
        }

        const regex =
            /{{\s*([^}]+?)\s*}}/g;

        let match;

        while ((match = regex.exec(body)) !== null) {

            const variableStart = match.index;
            const variableEnd = regex.lastIndex;

            const textBeforeVariable =
                body.substring(
                    0,
                    variableStart
                );

            const textAfterVariable =
                body.substring(
                    variableEnd
                );

            if (!textBeforeVariable.trim()) {
                return true;
            }

            if (!textAfterVariable.trim()) {
                return true;
            }
        }

        return false;
    };


    // ======================================================
    // VALIDATE BODY EXAMPLES
    // ======================================================

    const hasMissingBodyExample = () => {

        if (bodyVariables.length === 0) {
            return false;
        }

        return bodyVariables.some(
            (variable) =>
                !bodyExamples[variable]?.trim()
        );
    };


    // ======================================================
    // CREATE TEMPLATE
    // ======================================================

    const handleCreateTemplate = async () => {

        /*
         * IMPORTANT
         *
         * mediaId:
         *   Used for sending media later / DB reference.
         *
         * headerHandle:
         *   Used ONLY while creating Meta template.
         *
         * DO NOT use mediaId as header_handle.
         */

        let uploadedMediaIdForTemplate = null;

        try {

            // ==================================================
            // BASIC VALIDATION
            // ==================================================

            if (!templateName.trim()) {

                toast.error(
                    "Template Name Required"
                );

                return;
            }

            if (!body.trim()) {

                toast.error(
                    "Body Required"
                );

                return;
            }


            // ==================================================
            // BODY VARIABLE PLACEMENT
            // ==================================================

            if (
                hasInvalidBodyVariablePlacement()
            ) {

                toast.error(
                    "Variables can't be at the start or end of the template."
                );

                return;
            }


            // ==================================================
            // BODY EXAMPLES
            // ==================================================

            const missingExampleVariable =
                bodyVariables.find(
                    (variable) =>
                        !bodyExamples[
                            variable
                        ]?.trim()
                );

            if (missingExampleVariable) {

                toast.error(
                    `Example value required for {{${missingExampleVariable}}}`
                );

                return;
            }


            // ==================================================
            // COMPONENTS
            // ==================================================

            const components = [];


            // ==================================================
            // HEADER TEXT
            // ==================================================

            if (headerType === "TEXT") {

                if (!headerText.trim()) {

                    toast.error(
                        "Header Text Required"
                    );

                    return;
                }

                const headerVariables =
                    extractBodyVariables(
                        headerText
                    );

                const headerComponent = {

                    type: "HEADER",

                    format: "TEXT",

                    text: headerText.trim()

                };


                if (headerVariables.length > 0) {

                    headerComponent.example = {

                        header_text: [
                            headerVariables.map(
                                (variable) =>
                                    headerExample?.trim() ||
                                    bodyExamples[
                                        variable
                                    ]?.trim() ||
                                    "Example"
                            )
                        ]

                    };
                }

                components.push(
                    headerComponent
                );
            }


            // ==================================================
            // HEADER MEDIA
            // IMAGE / VIDEO / DOCUMENT
            // ==================================================

            if (
                headerType === "IMAGE" ||
                headerType === "VIDEO" ||
                headerType === "DOCUMENT"
            ) {

                if (!headerMedia) {

                    toast.error(
                        "Please upload header media"
                    );

                    return;
                }

                if (
                    headerType === "VIDEO" &&
                    headerMedia.size > 16 * 1024 * 1024
                ) {

                    toast.error(
                        "Video size must be 16 MB or less."
                    );

                    return;
                }


                console.log(
                    "=================================="
                );

                console.log(
                    "UPLOADING HEADER MEDIA"
                );

                console.log(
                    "TYPE:",
                    headerType
                );

                console.log(
                    "FILE:",
                    headerMedia.name
                );

                console.log(
                    "MIME:",
                    headerMedia.type
                );

                console.log(
                    "SIZE:",
                    headerMedia.size
                );

                console.log(
                    "=================================="
                );


                // ==================================================
                // UPLOAD MEDIA
                // ==================================================

                const uploadResponse =
                    await uploadMedia(
                        headerMedia,
                        headerType
                    );


                console.log(
                    "=================================="
                );

                console.log(
                    "UPLOAD RESPONSE:"
                );

                console.log(
                    uploadResponse
                );

                console.log(
                    "=================================="
                );


                // ==================================================
                // GET MEDIA ID
                // ==================================================

                const mediaId =
                    uploadResponse?.mediaId ||
                    uploadResponse?.id ||
                    null;


                // ==================================================
                // GET META HEADER HANDLE
                // ==================================================

                const headerHandle =
                    uploadResponse?.headerHandle ||
                    uploadResponse?.header_handle ||
                    null;


                // ==================================================
                // DEBUG
                // ==================================================

                console.log(
                    "MEDIA ID RECEIVED:",
                    mediaId
                );

                console.log(
                    "HEADER HANDLE RECEIVED:",
                    headerHandle
                );


                // ==================================================
                // MEDIA ID VALIDATION
                // ==================================================

                if (!mediaId) {

                    console.error(
                        "MEDIA ID MISSING:",
                        uploadResponse
                    );

                    toast.error(
                        "Meta Media ID not received"
                    );

                    return;
                }


                // ==================================================
                // HEADER HANDLE VALIDATION
                // ==================================================

                if (!headerHandle) {

                    console.error(
                        "META HEADER HANDLE MISSING:",
                        uploadResponse
                    );

                    toast.error(
                        "Meta Header Handle not received"
                    );

                    return;
                }


                /*
                 * SAVE MEDIA ID
                 *
                 * This goes to whatsapp_templates.media_id
                 *
                 * DO NOT send this as header_handle.
                 */

                uploadedMediaIdForTemplate =
                    mediaId;


                // ==================================================
                // HEADER COMPONENT
                // ==================================================

                const mediaHeaderComponent = {

                    type: "HEADER",

                    format: headerType,

                    example: {

                        header_handle: [
                            headerHandle
                        ]

                    }

                };


                console.log(
                    "MEDIA HEADER COMPONENT:",
                    JSON.stringify(
                        mediaHeaderComponent,
                        null,
                        2
                    )
                );


                components.push(
                    mediaHeaderComponent
                );
            }


            // ==================================================
            // BODY
            // ==================================================

            const bodyComponent = {

                type: "BODY",

                text: body.trim()

            };


            if (bodyVariables.length > 0) {

                const exampleValues =
                    bodyVariables.map(
                        (variable) => {

                            return (
                                bodyExamples[
                                    variable
                                ]?.trim() ||
                                "Example"
                            );

                        }
                    );


                bodyComponent.example = {

                    body_text: [
                        exampleValues
                    ]

                };
            }


            components.push(
                bodyComponent
            );


            // ==================================================
            // FOOTER
            // ==================================================

            if (footer.trim()) {

                components.push({

                    type: "FOOTER",

                    text: footer.trim()

                });
            }


            // ==================================================
            // BUTTONS
            // ==================================================

            if (buttons.length > 0) {

                const formattedButtons =
                    buttons.map(
                        (btn) => {

                            // ==================================================
                            // QUICK REPLY
                            // ==================================================

                            if (
                                btn.type ===
                                "QUICK_REPLY"
                            ) {

                                if (
                                    !btn.text?.trim()
                                ) {

                                    throw new Error(
                                        "Quick Reply button text is required"
                                    );
                                }

                                return {

                                    type:
                                        "QUICK_REPLY",

                                    text:
                                        btn.text.trim()

                                };
                            }


                            // ==================================================
                            // URL
                            // ==================================================

                            if (
                                btn.type ===
                                "URL"
                            ) {

                                if (
                                    !btn.text?.trim()
                                ) {

                                    throw new Error(
                                        "URL button text is required"
                                    );
                                }

                                if (
                                    !btn.url?.trim()
                                ) {

                                    throw new Error(
                                        "Website URL is required"
                                    );
                                }

                                return {

                                    type:
                                        "URL",

                                    text:
                                        btn.text.trim(),

                                    url:
                                        btn.url.trim()

                                };
                            }


                            // ==================================================
                            // PHONE NUMBER
                            // ==================================================

                            if (
                                btn.type ===
                                "PHONE_NUMBER"
                            ) {

                                let phone =
                                    String(
                                        btn.phone_number ||
                                        ""
                                    )
                                        .trim()
                                        .replace(
                                            /[^\d+]/g,
                                            ""
                                        );


                                if (
                                    /^\d{10}$/.test(
                                        phone
                                    )
                                ) {

                                    phone =
                                        `+91${phone}`;
                                }


                                if (
                                    /^91\d{10}$/.test(
                                        phone
                                    )
                                ) {

                                    phone =
                                        `+${phone}`;
                                }


                                if (
                                    !/^\+\d{10,15}$/.test(
                                        phone
                                    )
                                ) {

                                    throw new Error(
                                        "Invalid phone number. Use international format, example: +918122945108"
                                    );
                                }


                                if (
                                    !btn.text?.trim()
                                ) {

                                    throw new Error(
                                        "Phone button text is required"
                                    );
                                }


                                return {

                                    type:
                                        "PHONE_NUMBER",

                                    text:
                                        btn.text.trim(),

                                    phone_number:
                                        phone

                                };
                            }


                            // ==================================================
                            // COPY CODE
                            // ==================================================

                            if (
                                btn.type ===
                                "COPY_CODE"
                            ) {

                                if (
                                    !btn.text?.trim()
                                ) {

                                    throw new Error(
                                        "Copy Code button text is required"
                                    );
                                }

                                if (
                                    !btn.offer_code?.trim()
                                ) {

                                    throw new Error(
                                        "Offer code is required"
                                    );
                                }

                                return {

                                    type:
                                        "COPY_CODE",

                                    text:
                                        btn.text.trim(),

                                    example: [
                                        btn.offer_code.trim()
                                    ]

                                };
                            }


                            // ==================================================
                            // FLOW
                            // ==================================================

                            if (
                                btn.type ===
                                "FLOW"
                            ) {

                                if (
                                    !btn.text?.trim()
                                ) {

                                    throw new Error(
                                        "Flow button text is required"
                                    );
                                }

                                if (
                                    !btn.flow_id?.trim()
                                ) {

                                    throw new Error(
                                        "Flow ID is required"
                                    );
                                }

                                return {

                                    type:
                                        "FLOW",

                                    text:
                                        btn.text.trim(),

                                    flow_id:
                                        btn.flow_id.trim()

                                };
                            }


                            return btn;

                        }
                    );


                components.push({

                    type: "BUTTONS",

                    buttons:
                        formattedButtons

                });
            }


            // ==================================================
            // TENANT
            // ==================================================

            const tenantId =
                localStorage.getItem(
                    "tenantId"
                );


            if (!tenantId) {

                toast.error(
                    "Tenant ID not found"
                );

                return;
            }


            // ==================================================
            // NORMALIZE TEMPLATE NAME
            // ==================================================

            const normalizedTemplateName =
                templateName
                    .trim()
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9_]/g,
                        "_"
                    )
                    .replace(
                        /_+/g,
                        "_"
                    );


            if (!normalizedTemplateName) {

                toast.error(
                    "Invalid template name"
                );

                return;
            }


            // ==================================================
            // FINAL PAYLOAD
            // ==================================================

            const payload = {

                tenant_id:
                    tenantId,

                name:
                    normalizedTemplateName,

                category,

                language,

                components,

                /*
                 * IMPORTANT
                 *
                 * media_id is separate from
                 * components[].example.header_handle
                 */

                media_id:
                    uploadedMediaIdForTemplate ||
                    null

            };


            // ==================================================
            // FINAL DEBUG
            // ==================================================

            console.log(
                "=========================================="
            );

            console.log(
                "CREATE TEMPLATE PAYLOAD"
            );

            console.log(
                JSON.stringify(
                    payload,
                    null,
                    2
                )
            );

            console.log(
                "=========================================="
            );


            // ==================================================
            // CREATE TEMPLATE API
            // ==================================================

            const response =
                await createTemplate(
                    payload
                );


            console.log(
                "CREATE TEMPLATE RESPONSE:",
                response
            );


            // ==================================================
            // SUCCESS
            // ==================================================

            toast.success(
                "Template Created Successfully"
            );

            resetForm();

            onClose();

            window.location.reload();

        }

        catch (error) {

            console.error(
                "=========================================="
            );

            console.error(
                "CREATE TEMPLATE ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            console.error(
                "META ERROR:",
                error.response?.data?.metaError
            );

            console.error(
                "=========================================="
            );


            toast.error(
                getErrorMessage(error)
            );
        }
    };


    // ======================================================
    // PREVIEW BODY
    // ======================================================

    const getPreviewBody = () => {

        let preview = body;

        bodyVariables.forEach(
            (variable) => {

                const exampleValue =
                    bodyExamples[
                        variable
                    ]?.trim();


                const regex =
                    new RegExp(
                        `\\{\\{\\s*${variable}\\s*\\}\\}`,
                        "g"
                    );


                preview =
                    preview.replace(
                        regex,
                        exampleValue ||
                        `{{${variable}}}`
                    );
            }
        );

        return preview;
    };


    // ======================================================
    // MODAL
    // ======================================================

    if (!open) {
        return null;
    }


    return (

        <div className="template-overlay">

            <div className="meta-template-modal">


                {/* =================================================
                    MODAL HEADER
                ================================================= */}

                <div className="meta-template-header">

                    <div>

                        <h2>
                            Create Template
                        </h2>

                        <p>
                            Build reusable WhatsApp template
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>

                </div>


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="template-layout">


                    {/* =================================================
                        LEFT FORM
                    ================================================= */}

                    <div className="template-form">

                        <div className="form-card">


                            {/* =================================================
                                BASIC INFORMATION
                            ================================================= */}

                            <div className="card-title">

                                <h3>
                                    Basic Information
                                </h3>

                            </div>


                            <label>
                                Template Name
                            </label>

                            <input
                                type="text"
                                value={templateName}
                                placeholder="Enter template name"
                                onChange={(e) =>
                                    setTemplateName(
                                        e.target.value
                                    )
                                }
                            />


                            <label>
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="MARKETING">
                                    MARKETING
                                </option>

                                <option value="UTILITY">
                                    UTILITY
                                </option>

                                <option value="AUTHENTICATION">
                                    AUTHENTICATION
                                </option>

                            </select>


                            {/* =================================================
                                HEADER TYPE
                            ================================================= */}

                            <label>
                                Header Type
                            </label>

                            <select
                                value={headerType}
                                onChange={(e) => {

                                    setHeaderType(
                                        e.target.value
                                    );

                                    /*
                                     * Clear old media when switching
                                     * header type.
                                     */

                                    setHeaderMedia(null);

                                    setHeaderText("");
                                    setHeaderExample("");

                                }}
                            >

                                <option value="NONE">
                                    None
                                </option>

                                <option value="TEXT">
                                    Text
                                </option>

                                <option value="IMAGE">
                                    Image
                                </option>

                                <option value="VIDEO">
                                    Video
                                </option>

                                <option value="DOCUMENT">
                                    Document
                                </option>

                            </select>


                            {/* =================================================
                                TEXT HEADER
                            ================================================= */}

                            {headerType === "TEXT" && (

                                <>

                                    <label>
                                        Header Text
                                    </label>

                                    <input
                                        type="text"
                                        value={headerText}
                                        placeholder="Enter header text"
                                        onChange={(e) =>
                                            setHeaderText(
                                                e.target.value
                                            )
                                        }
                                    />


                                    {headerText.includes("{{") && (

                                        <>

                                            <label>
                                                Header Example
                                            </label>

                                            <input
                                                type="text"
                                                value={headerExample}
                                                placeholder="Example header value"
                                                onChange={(e) =>
                                                    setHeaderExample(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </>

                                    )}

                                </>

                            )}


                            {/* =================================================
                                IMAGE
                            ================================================= */}

                            {headerType === "IMAGE" && (

                                <>

                                    <label>
                                        Upload Image
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) =>
                                            setHeaderMedia(
                                                e.target.files?.[0] ||
                                                null
                                            )
                                        }
                                    />


                                    {headerMedia && (

                                        <small className="file-name">

                                            {headerMedia.name}

                                        </small>

                                    )}

                                </>

                            )}


                            {/* =================================================
                                VIDEO
                            ================================================= */}

                            {headerType === "VIDEO" && (

                                <>

                                    <label>
                                        Upload Video
                                    </label>

                                    <input
                                        type="file"
                                        accept="video/mp4"
                                        onChange={(e) =>
                                            setHeaderMedia(
                                                e.target.files?.[0] ||
                                                null
                                            )
                                        }
                                    />


                                    {headerMedia && (

                                        <small className="file-name">

                                            {headerMedia.name}

                                        </small>

                                    )}

                                </>

                            )}


                            {/* =================================================
                                DOCUMENT
                            ================================================= */}

                            {headerType === "DOCUMENT" && (

                                <>

                                    <label>
                                        Upload Document
                                    </label>

                                    <input
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        onChange={(e) =>
                                            setHeaderMedia(
                                                e.target.files?.[0] ||
                                                null
                                            )
                                        }
                                    />


                                    {headerMedia && (

                                        <small className="file-name">

                                            {headerMedia.name}

                                        </small>

                                    )}

                                </>

                            )}


                            {/* =================================================
                                BODY
                            ================================================= */}

                            <div className="card-title">

                                <label>
                                    Message
                                </label>

                                <span>
                                    {body.length}/1024
                                </span>

                            </div>


                            <textarea
                                ref={bodyTextareaRef}
                                rows={8}
                                maxLength={1024}
                                value={body}
                                placeholder="Enter your message..."
                                onChange={(e) =>
                                    setBody(
                                        e.target.value
                                    )
                                }
                            />


                            {/* =================================================
                                VARIABLE WARNING
                            ================================================= */}

                            {hasInvalidBodyVariablePlacement() && (

                                <div className="variable-placement-warning">

                                    Variables can't be at the start or end of the template.

                                </div>

                            )}


                            {/* =================================================
                                VARIABLE TOOLBAR
                            ================================================= */}

                            <div className="variable-toolbar">

                                <button
                                    type="button"
                                    className="variable-btn"
                                    onClick={addBodyVariable}
                                >
                                    + Add Variable
                                </button>

                            </div>


                            {/* =================================================
                                VARIABLE EXAMPLES
                            ================================================= */}

                            {bodyVariables.length > 0 && (

                                <div className="body-variable-examples">

                                    <label>
                                        Example Values
                                    </label>


                                    {bodyVariables.map(
                                        (variable) => {

                                            const exampleValue =
                                                bodyExamples[
                                                    variable
                                                ] || "";

                                            const isMissing =
                                                !exampleValue.trim();


                                            return (

                                                <div
                                                    key={variable}
                                                    className="body-example-field"
                                                >

                                                    <span>
                                                        {`{{${variable}}}`}
                                                    </span>


                                                    <div className="body-example-input-wrapper">

                                                        <input
                                                            type="text"
                                                            value={exampleValue}
                                                            placeholder={
                                                                `Example for {{${variable}}}`
                                                            }
                                                            onChange={(e) =>
                                                                updateBodyExample(
                                                                    variable,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={
                                                                isMissing
                                                                    ? "body-example-input required"
                                                                    : "body-example-input"
                                                            }
                                                        />


                                                        {isMissing && (

                                                            <div className="example-required-message">

                                                                Add sample text

                                                            </div>

                                                        )}

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}


                            <div className="meta-tip">

                                Variables help personalize messages.

                                <br />

                                Example: Hello {"{{1}}"}

                            </div>


                            {/* =================================================
                                FOOTER
                            ================================================= */}

                            <label>
                                Footer Text
                            </label>

                            <input
                                type="text"
                                placeholder="Footer (Optional)"
                                value={footer}
                                maxLength={60}
                                onChange={(e) =>
                                    setFooter(
                                        e.target.value
                                    )
                                }
                            />

                            <small>
                                Footer is optional and supports
                                up to 60 characters.
                            </small>


                            {/* =================================================
                                BUTTONS
                            ================================================= */}

                            <div className="button-header">

                                <div className="card-title">

                                    <h3>
                                        Buttons
                                    </h3>

                                </div>

                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={() =>
                                        setShowButtonMenu(
                                            !showButtonMenu
                                        )
                                    }
                                >
                                    + Add Button
                                </button>

                            </div>


                            {/* =================================================
                                BUTTON MENU
                            ================================================= */}

                            {showButtonMenu && (

                                <div className="button-menu">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addButton(
                                                "QUICK_REPLY"
                                            )
                                        }
                                    >
                                        💬 Quick Reply
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addButton(
                                                "URL"
                                            )
                                        }
                                    >
                                        🌐 Visit Website
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addButton(
                                                "PHONE_NUMBER"
                                            )
                                        }
                                    >
                                        📞 Call Phone Number
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addButton(
                                                "COPY_CODE"
                                            )
                                        }
                                    >
                                        🏷 Copy Offer Code
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addButton(
                                                "FLOW"
                                            )
                                        }
                                    >
                                        ⚡ Complete Flow
                                    </button>

                                </div>

                            )}


                            {/* =================================================
                                ADDED BUTTONS
                            ================================================= */}

                            {buttons.map(
                                (btn, index) => (

                                    <div
                                        key={index}
                                        className="button-card"
                                    >

                                        <div className="button-card-header">

                                            <strong>
                                                {btn.type}
                                            </strong>

                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() =>
                                                    removeButton(
                                                        index
                                                    )
                                                }
                                            >
                                                ✕
                                            </button>

                                        </div>


                                        <label>
                                            Button Text
                                        </label>

                                        <input
                                            type="text"
                                            value={btn.text}
                                            placeholder="Button Text"
                                            onChange={(e) =>
                                                updateButton(
                                                    index,
                                                    "text",
                                                    e.target.value
                                                )
                                            }
                                        />


                                        {/* URL */}

                                        {btn.type === "URL" && (

                                            <>

                                                <label>
                                                    Website URL
                                                </label>

                                                <input
                                                    type="url"
                                                    value={btn.url}
                                                    placeholder="https://"
                                                    onChange={(e) =>
                                                        updateButton(
                                                            index,
                                                            "url",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </>

                                        )}


                                        {/* PHONE */}

                                        {btn.type === "PHONE_NUMBER" && (

                                            <>

                                                <label>
                                                    Phone Number
                                                </label>

                                                <input
                                                    type="tel"
                                                    value={
                                                        btn.phone_number
                                                    }
                                                    placeholder="+917904009090"
                                                    onChange={(e) =>
                                                        updateButton(
                                                            index,
                                                            "phone_number",
                                                            e.target.value.replace(
                                                                /[^\d+]/g,
                                                                ""
                                                            )
                                                        )
                                                    }
                                                />

                                                <small>
                                                    Example:
                                                    +917904009090
                                                </small>

                                            </>

                                        )}


                                        {/* COPY CODE */}

                                        {btn.type === "COPY_CODE" && (

                                            <>

                                                <label>
                                                    Offer Code
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        btn.offer_code
                                                    }
                                                    placeholder="SAVE20"
                                                    onChange={(e) =>
                                                        updateButton(
                                                            index,
                                                            "offer_code",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </>

                                        )}


                                        {/* FLOW */}

                                        {btn.type === "FLOW" && (

                                            <>

                                                <label>
                                                    Flow ID
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        btn.flow_id
                                                    }
                                                    placeholder="Flow ID"
                                                    onChange={(e) =>
                                                        updateButton(
                                                            index,
                                                            "flow_id",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT PREVIEW
                    ================================================= */}

                    <div className="meta-preview">

                        <div className="phone">

                            <div className="phone-header">
                                WhatsApp Preview
                            </div>


                            <div className="phone-body">

                                <div className="broadcast-preview-message">


                                    {/* HEADER TEXT */}

                                    {headerType === "TEXT" && (

                                        <div className="preview-header">

                                            {headerText ||
                                                "Header"}

                                        </div>

                                    )}


                                    {/* IMAGE */}

                                    {headerType === "IMAGE" && (

                                        <div className="preview-media">

                                            🖼️ Image

                                        </div>

                                    )}


                                    {/* VIDEO */}

                                    {headerType === "VIDEO" && (

                                        <div className="preview-media">

                                            🎥 Video

                                        </div>

                                    )}


                                    {/* DOCUMENT */}

                                    {headerType === "DOCUMENT" && (

                                        <div className="preview-media">

                                            📄 Document

                                        </div>

                                    )}


                                    {/* BODY */}

                                    <div className="preview-body">

                                        {getPreviewBody() ||
                                            "Message Body"}

                                    </div>


                                    {/* FOOTER */}

                                    {footer && (

                                        <div className="preview-footer">

                                            {footer}

                                        </div>

                                    )}


                                    {/* BUTTONS */}

                                    {buttons.length > 0 && (

                                        <div className="preview-buttons">

                                            {buttons.map(
                                                (btn, index) => (

                                                    <button
                                                        key={index}
                                                        type="button"
                                                    >

                                                        {btn.text ||
                                                            btn.type}

                                                    </button>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MODAL FOOTER
                ================================================= */}

                <div className="template-footer">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className="save-btn"
                        onClick={handleCreateTemplate}
                        disabled={
                            hasInvalidBodyVariablePlacement() ||
                            hasMissingBodyExample()
                        }
                    >
                        Create Template
                    </button>

                </div>

            </div>

        </div>

    );
}

export default CreateTemplateModal;