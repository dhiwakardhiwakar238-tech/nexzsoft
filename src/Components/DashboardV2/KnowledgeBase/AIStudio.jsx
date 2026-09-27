import toast from "react-hot-toast";
import "./AIStudio.css";

import {
    RiAddLine,
    RiDeleteBin6Line,
    RiFileTextLine,
    RiRefreshLine,
    RiRobot2Fill,
    RiUploadCloud2Line,
    RiRobot2Line,
    RiQuestionAnswerLine,
    RiSaveLine,
    RiInformationLine,
    RiBuildingLine,
    RiGlobalLine,
    RiStoreLine,
    RiTimeLine,
    RiTeamLine,
    RiCheckboxCircleFill,
} from "react-icons/ri";

import { useState, useEffect } from "react";
import {
    getAISettings,
    saveAISettings
} from "../../../services/api";

import { getErrorMessage } from "../../../config/apiConfig";

function AIStudio() {

    // ======================================================
    // STATE
    // ======================================================

    const [saving, setSaving] = useState(false);

    const [loadingSettings, setLoadingSettings] =
        useState(true);
    
    const [activeTab, setActiveTab] = useState("documents");

    const [settings, setSettings] = useState({
        tone: "Friendly",
        style: "Short & Crisp",
        language: "Auto Detect",
        creativity: 30,
        emoji: "Occasionally",
        followUp: "When Necessary",
        responseLength: "Balanced",
    });

    // ======================================================
    // BUSINESS INFORMATION
    // ======================================================

    const [businessInfo, setBusinessInfo] = useState({
        businessName: "",
        businessType: "Online & Physical",
        workingHours: "",
        agentsAvailable: 1,
        description: "",
    });

    const handleBusinessInfoChange = (key, value) => {
        setBusinessInfo((prev) => ({ ...prev, [key]: value }));
    };

    // ======================================================
    // WEBSITE KNOWLEDGE
    // ======================================================

    const [websiteKnowledge, setWebsiteKnowledge] = useState({
        url: "",
        status: "not_connected",
        lastSynced: null,
        pagesIndexed: 0,
    });

    const handleWebsiteChange = (value) => {
        setWebsiteKnowledge((prev) => ({ ...prev, url: value }));
    };
    
    const [instructions, setInstructions] = useState(
        `You are the customer support assistant for our business.

        Always be polite, helpful and professional.
        
        Only provide information that is available in the business knowledge base.
        
        If you don't know something, do not make up an answer.
        
        Ask the customer for additional information when necessary.`
        
        );

    const [documents, setDocuments] = useState([
        {
            id: 1,
            name: "Product Guide.pdf",
            type: "PDF",
            size: "245 KB",
            chunks: 124,
            status: "ready",
            updated: "Today",
        },
        {
            id: 2,
            name: "Pricing Information.pdf",
            type: "PDF",
            size: "1.2 MB",
            chunks: 86,
            status: "processing",
            updated: "Today",
        },
        {
            id: 3,
            name: "Company Policy.pdf",
            type: "PDF",
            size: "89 KB",
            chunks: 42,
            status: "ready",
            updated: "Yesterday",
        },
    ]);

    const [faqs, setFaqs] = useState([
        {
            id: 1,
            question: "What are your business hours?",
            answer:
                "We are open Monday to Saturday, from 9 AM to 6 PM.",
        },
        {
            id: 2,
            question: "Do you provide home delivery?",
            answer:
                "Yes, we provide home delivery across Chennai.",
        },
        {
            id: 3,
            question: "How can I contact support?",
            answer:
                "You can contact our support team through WhatsApp or email.",
        },
    ]);

    // ======================================================
    // SETTINGS HANDLER
    // ======================================================

    const handleSettingChange = (key, value) => {

        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));

    };


    // ======================================================
    // FILE UPLOAD
    // ======================================================

    const handleUpload = (event) => {

        const files = Array.from(event.target.files || []);

        if (!files.length) return;

        const newDocuments = files.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            type:
                file.name.split(".").pop()?.toUpperCase() ||
                "FILE",
            size: formatFileSize(file.size),
            chunks: "-",
            status: "processing",
            updated: "Just now",
        }));

        setDocuments((prev) => [
            ...newDocuments,
            ...prev,
        ]);

        event.target.value = "";

    };


    // ======================================================
    // DELETE DOCUMENT
    // ======================================================

    const deleteDocument = (id) => {

        setDocuments((prev) =>
            prev.filter((document) => document.id !== id)
        );

    };


    // ======================================================
    // REINDEX DOCUMENT
    // ======================================================

    const reindexDocument = (id) => {

        setDocuments((prev) =>
            prev.map((document) =>
                document.id === id
                    ? {
                        ...document,
                        status: "processing",
                    }
                    : document
            )
        );

    };

    // ======================================================
    // SAVE SETTINGS
    // ======================================================

    const saveSettings = async () => {

        try {
    
            setSaving(true);
    
            const tenantId =
                localStorage.getItem("tenantId");
    
            if (!tenantId) {
    
                toast.error(
                    "Tenant ID not found."
                );
    
                return;
            } 
    
            const savedSettings =
                await saveAISettings(
    
                    tenantId,
    
                    {
                        ...settings,
    
                        creativity:
                            Number(
                                settings.creativity
                            ),
    
                        instructions
    
                    }
    
                );
    
    
            if (savedSettings) {
    
                setSettings({
    
                    tone:
                        savedSettings.tone,
    
                    style:
                        savedSettings.style,
    
                    language:
                        savedSettings.language,
    
                    creativity:
                        Number(
                            savedSettings.creativity
                        ),
    
                    emoji:
                        savedSettings.emoji,
    
                    followUp:
                        savedSettings.follow_up,
    
                    responseLength:
                        savedSettings.response_length
    
                });
    
    
                setInstructions(
                    savedSettings.instructions ||
                    DEFAULT_INSTRUCTIONS
                );
    
            }
        
            toast.success(
                "AI settings saved successfully."
            );
    
        }
    
        catch (error) {
            const message =
                getErrorMessage(error);
        
            console.error(
                "Failed to save AI instructions:",
                {
                    message,
                    status: error.response?.status,
                    response: error.response?.data
                }
            );
            toast.error(message);
        }
    
        finally {
    
            setSaving(false);
    
        }
    
    };

    // ======================================================
    // SAVE INSTRUCTIONS
    // ======================================================

    const saveInstructions = async () => {

        try {
    
            setSaving(true);
    
            const tenantId =
                localStorage.getItem("tenantId");
    
            if (!tenantId) {
    
                toast.error(
                    "Tenant ID not found."
                );
    
                return;
            }
    
    
            const savedSettings =
                await saveAISettings(
    
                    tenantId,
    
                    {
                        ...settings,
    
                        instructions
    
                    }
    
                );
    
    
            if (savedSettings) {
    
                setSettings({
    
                    tone:
                        savedSettings.tone,
    
                    style:
                        savedSettings.style,
    
                    language:
                        savedSettings.language,
    
                    creativity:
                        Number(
                            savedSettings.creativity
                        ),
    
                    emoji:
                        savedSettings.emoji,
    
                    followUp:
                        savedSettings.follow_up,
    
                    responseLength:
                        savedSettings.response_length
    
                });
    
    
                setInstructions(
                    savedSettings.instructions ||
                    DEFAULT_INSTRUCTIONS
                );
    
            }
    
    
            toast.success(
                "AI instructions saved successfully."
            );
    
        }
    
        catch (error) {
    
            const message =
                getErrorMessage(error);
        
            console.error(
                "Failed to save AI instructions:",
                {
                    message,
                    status: error.response?.status,
                    response: error.response?.data
                }
            );
        
            toast.error(message);
    
        }
    
        finally {
    
            setSaving(false);
    
        }
    
    };

    // ======================================================
    // ADD FAQ
    // ======================================================

    const addFaq = () => {

        const question = prompt(
            "Enter the FAQ question:"
        );

        if (!question) return;

        const answer = prompt(
            "Enter the FAQ answer:"
        );

        if (!answer) return;

        setFaqs((prev) => [
            ...prev,
            {
                id: Date.now(),
                question,
                answer,
            },
        ]);

    };


    // ======================================================
    // DELETE FAQ
    // ======================================================

    const deleteFaq = (id) => {

        setFaqs((prev) =>
            prev.filter((faq) => faq.id !== id)
        );

    };


    // ======================================================
    // HELPERS
    // ======================================================

    const formatFileSize = (bytes) => {

        if (!bytes) return "0 KB";

        const kb = bytes / 1024;

        if (kb < 1024) {
            return `${Math.round(kb)} KB`;
        }

        return `${(kb / 1024).toFixed(1)} MB`;

    };


    const getStatusLabel = (status) => {

        if (status === "ready") {
            return "Ready";
        }

        if (status === "processing") {
            return "Processing";
        }

        if (status === "failed") {
            return "Failed";
        }

        return status;

    };

    const DEFAULT_INSTRUCTIONS = `You are the customer support assistant for our business.
    Always be polite, helpful and professional.
    Only provide information that is available in the business knowledge base.
    If you don't know something, do not make up an answer.
    Ask the customer for additional information when necessary.`;
   
    useEffect(() => {

        const loadAISettings = async () => {
    
            try {
    
                const tenantId =
                    localStorage.getItem("tenantId");
    
                if (!tenantId) {
    
                    console.error(
                        "Tenant ID not found."
                    );
    
                    return;
                }
    
    
                const data =
                    await getAISettings(tenantId);
    
    
                if (data) {
    
                    setSettings({
    
                        tone:
                            data.tone ||
                            "Friendly",
    
                        style:
                            data.style ||
                            "Short & Crisp",
    
                        language:
                            data.language ||
                            "Auto Detect",
    
                        creativity:
                            Number(
                                data.creativity ?? 30
                            ),
    
                        emoji:
                            data.emoji ||
                            "Occasionally",
    
                        followUp:
                            data.follow_up ||
                            "When Necessary",
    
                        responseLength:
                            data.response_length ||
                            "Balanced"
    
                    });
    
    
                    setInstructions(
    
                        data.instructions ||
                        DEFAULT_INSTRUCTIONS
    
                    );
    
                }
    
            }
    
            catch (error) {
    
                console.error(
                    "Failed to load AI settings:",
                    {
                        message:
                            getErrorMessage(error),
    
                        status:
                            error.response?.status,
    
                        response:
                            error.response?.data
                    }
                );
    
            }
    
            finally {
    
                setLoadingSettings(false);
    
            }
    
        };
    
    
        loadAISettings();
    
    }, []);


    return (

        <div className="knowledge-page">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="knowledge-header">

                <div>

                    <h2>
                        AI Studio
                    </h2>

                    <p>
                        Configure what your AI knows and how
                        it responds to your customers.
                    </p>

                </div>


                <button
                    className="upload-btn"
                    onClick={saveSettings}
                    disabled={saving}
                >
                    <RiSaveLine />
                
                    {saving
                        ? "Saving..."
                        : "Save Changes"
                    }
                
                </button>

            </div>


            {/* ==================================================
                BUSINESS INFORMATION
            ================================================== */}

            <section className="business-info-card">
                <div className="business-info-header">
                    <div className="business-info-title">
                        <div className="business-info-icon"><RiBuildingLine /></div>
                        <div>
                            <h3>Tell us about your business</h3>
                            <p>Help your AI understand your business and provide more relevant responses.</p>
                        </div>
                    </div>
                </div>

                <div className="business-info-grid">
                    <div className="business-info-field">
                        <label>Business Name</label>
                        <input type="text" value={businessInfo.businessName} onChange={(e) => handleBusinessInfoChange("businessName", e.target.value)} placeholder="e.g. Estuna" />
                    </div>

                    <div className="business-info-field">
                        <label>Business Type</label>
                        <select value={businessInfo.businessType} onChange={(e) => handleBusinessInfoChange("businessType", e.target.value)}>
                            <option>Online Only</option>
                            <option>Physical Store</option>
                            <option>Online & Physical</option>
                        </select>
                    </div>

                    <div className="business-info-field">
                        <label>Working Hours</label>
                        <input type="text" value={businessInfo.workingHours} onChange={(e) => handleBusinessInfoChange("workingHours", e.target.value)} placeholder="e.g. Mon - Sat, 9 AM - 6 PM" />
                    </div>

                    <div className="business-info-field">
                        <label>Agents Available</label>
                        <input type="number" min="0" value={businessInfo.agentsAvailable} onChange={(e) => handleBusinessInfoChange("agentsAvailable", Math.max(0, Number(e.target.value)))} />
                        <span className="business-info-help">Agents available when a customer requests to connect to an agent.</span>
                    </div>

                    <div className="business-info-field business-info-field-full">
                        <label>About Your Business</label>
                        <textarea value={businessInfo.description} onChange={(e) => handleBusinessInfoChange("description", e.target.value)} rows="3" maxLength="500" placeholder="Briefly describe what your business does, the products or services you provide, and anything your AI should know." />
                    </div>
                </div>
            </section>

            {/* ==================================================
                WEBSITE KNOWLEDGE
            ================================================== */}

            <section className="website-knowledge-card">
                <div className="website-knowledge-header">
                    <div className="website-knowledge-title">
                        <div className="website-knowledge-icon"><RiGlobalLine /></div>
                        <div>
                            <h3>Website Knowledge</h3>
                            <p>Connect your website so your AI can learn from your business content.</p>
                        </div>
                    </div>
                </div>

                <div className="website-knowledge-body">
                    <label className="website-input-label">Website URL</label>
                    <div className="website-input-row">
                        <div className="website-input-wrapper">
                            <RiGlobalLine />
                            <input type="url" value={websiteKnowledge.url} onChange={(e) => handleWebsiteChange(e.target.value)} placeholder="https://www.nexzsoft.com" />
                        </div>
                        <button type="button" className="website-import-btn" disabled={!websiteKnowledge.url.trim()}>
                            <RiGlobalLine />
                            Import Website
                        </button>
                    </div>
                    <p className="website-knowledge-description">We'll analyze your website and create a knowledge base for your AI assistant.</p>

                    {websiteKnowledge.status !== "not_connected" && (
                        <div className="website-status-panel">
                            <div className="website-status-main">
                                <div className="website-status-icon"><RiCheckboxCircleFill /></div>
                                <div>
                                    <strong>Connected</strong>
                                    <span>Website knowledge is available to your AI assistant.</span>
                                </div>
                            </div>
                            <div className="website-status-details">
                                <div className="website-status-item"><span>Last synced</span><strong>{websiteKnowledge.lastSynced || "Not synced yet"}</strong></div>
                                <div className="website-status-item"><span>Pages indexed</span><strong>{websiteKnowledge.pagesIndexed}</strong></div>
                                <button type="button" className="website-sync-btn"><RiRefreshLine /> Sync Now</button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ==================================================
                AI BEHAVIOR
            ================================================== */}

            <section className="ai-settings-card">

                <div className="ai-settings-header">

                    <div>

                        <h3>
                            AI Behavior
                        </h3>

                        <p>
                            Configure how your AI communicates
                            with customers.
                        </p>

                    </div>

                </div>


                <div className="ai-settings-grid">


                    {/* TONE */}

                    <div className="ai-setting">

                        <div className="ai-setting-label">

                            <strong>
                                Response Tone
                            </strong>

                            <span>
                                How should your AI sound?
                            </span>

                        </div>


                        <select
                            value={settings.tone}
                            onChange={(e) =>
                                handleSettingChange(
                                    "tone",
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                Friendly
                            </option>

                            <option>
                                Professional
                            </option>

                            <option>
                                Casual
                            </option>

                            <option>
                                Formal
                            </option>

                            <option>
                                Empathetic
                            </option>

                            <option>
                                Confident
                            </option>

                        </select>

                    </div>


                    {/* STYLE */}

                    <div className="ai-setting">

                        <div className="ai-setting-label">

                            <strong>
                                Response Style
                            </strong>

                            <span>
                                Choose how answers are structured.
                            </span>

                        </div>


                        <select
                            value={settings.style}
                            onChange={(e) =>
                                handleSettingChange(
                                    "style",
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                Short & Crisp
                            </option>

                            <option>
                                Balanced
                            </option>

                            <option>
                                Detailed
                            </option>

                        </select>

                    </div>


                    {/* LANGUAGE */}

                    <div className="ai-setting">

                        <div className="ai-setting-label">

                            <strong>
                                Language
                            </strong>

                            <span>
                                Language used for responses.
                            </span>

                        </div>


                        <select
                            value={settings.language}
                            onChange={(e) =>
                                handleSettingChange(
                                    "language",
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                Auto Detect
                            </option>

                            <option>
                                English
                            </option>

                            <option>
                                Tamil
                            </option>

                            <option>
                                Hindi
                            </option>

                            <option>
                                Telugu
                            </option>

                            <option>
                                Malayalam
                            </option>

                            <option>
                                Kannada
                            </option>

                        </select>

                    </div>


                    {/* RESPONSE LENGTH */}

                    <div className="ai-setting">

                        <div className="ai-setting-label">

                            <strong>
                                Response Length
                            </strong>

                            <span>
                                Control the amount of detail.
                            </span>

                        </div>


                        <select
                            value={settings.responseLength}
                            onChange={(e) =>
                                handleSettingChange(
                                    "responseLength",
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                Concise
                            </option>

                            <option>
                                Balanced
                            </option>

                            <option>
                                Detailed
                            </option>

                        </select>

                    </div>


                    {/* CREATIVITY */}

                    <div className="ai-setting">

                        <div className="ai-setting-label">

                            <strong>
                                AI Creativity
                            </strong>

                            <span>
                                Balance accuracy and creativity.
                            </span>

                        </div>


                        <div className="ai-creativity">

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.creativity}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "creativity",
                                        e.target.value
                                    )
                                }
                                className="ai-creativity-slider"
                            />

                            <div className="ai-creativity-labels">

                                <span>
                                    Precise
                                </span>

                                <span>
                                    Creative
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* EMOJI */}

                    <div className="ai-setting">

                        <div className="ai-setting-label">

                            <strong>
                                Emoji Usage
                            </strong>

                            <span>
                                Control emoji usage in replies.
                            </span>

                        </div>


                        <select
                            value={settings.emoji}
                            onChange={(e) =>
                                handleSettingChange(
                                    "emoji",
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                Never
                            </option>

                            <option>
                                Occasionally
                            </option>

                            <option>
                                Frequently
                            </option>

                        </select>

                    </div>


                    {/* FOLLOW UP */}

                    <div className="ai-setting">

                        <div className="ai-setting-label">

                            <strong>
                                Follow-up Questions
                            </strong>

                            <span>
                                When should AI ask for more details?
                            </span>

                        </div>


                        <select
                            value={settings.followUp}
                            onChange={(e) =>
                                handleSettingChange(
                                    "followUp",
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                When Necessary
                            </option>

                            <option>
                                Always
                            </option>

                            <option>
                                Never
                            </option>

                        </select>

                    </div>


                </div>

            </section>


            {/* ==================================================
                KNOWLEDGE
            ================================================== */}

            <section className="knowledge-table">

                <div className="knowledge-section-header">

                    <div>

                        <h3>
                            Knowledge
                        </h3>

                        <p>
                            Give your AI access to your
                            business information.
                        </p>

                    </div>


                    <label className="upload-btn">

                        <RiUploadCloud2Line />

                        Add Knowledge

                        <input
                            type="file"
                            hidden
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                            onChange={handleUpload}
                        />

                    </label>

                </div>


                {/* TABS */}

                <div className="knowledge-tabs">

                    <button
                        className={`knowledge-tab ${
                            activeTab === "documents"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActiveTab("documents")
                        }
                    >
                        Documents
                    </button>


                    <button
                        className={`knowledge-tab ${
                            activeTab === "faqs"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActiveTab("faqs")
                        }
                    >
                        FAQs
                    </button>

                </div>


                {/* ==================================================
                    DOCUMENTS
                ================================================== */}

                {activeTab === "documents" && (

                    <>

                        <div className="knowledge-table-header">

                            <span>
                                DOCUMENT
                            </span>

                            <span>
                                TYPE
                            </span>

                            <span>
                                CHUNKS
                            </span>

                            <span>
                                STATUS
                            </span>

                            <span>
                                ACTIONS
                            </span>

                        </div>


                        {documents.length === 0 ? (

                            <div className="knowledge-empty">

                                <div className="empty-icon">

                                    <RiFileTextLine />

                                </div>

                                <h3>
                                    No documents yet
                                </h3>

                                <p>
                                    Upload your business documents
                                    to give your AI more knowledge.
                                </p>

                            </div>

                        ) : (

                            documents.map((document) => (

                                <div
                                    className="knowledge-row"
                                    key={document.id}
                                >

                                    <div className="knowledge-document">

                                        <div className="knowledge-document-icon">

                                            <RiFileTextLine />

                                        </div>


                                        <div className="knowledge-document-name">

                                            <strong>
                                                {document.name}
                                            </strong>

                                            <span>
                                                {document.size}
                                                {" • "}
                                                Updated {document.updated}
                                            </span>

                                        </div>

                                    </div>


                                    <span>
                                        {document.type}
                                    </span>


                                    <span>
                                        {document.chunks}
                                    </span>


                                    <span
                                        className={`status-${document.status}`}
                                    >
                                        {getStatusLabel(
                                            document.status
                                        )}
                                    </span>


                                    <div className="knowledge-actions">

                                        <button
                                            className="reindex-btn"
                                            title="Reprocess document"
                                            onClick={() =>
                                                reindexDocument(
                                                    document.id
                                                )
                                            }
                                        >

                                            <RiRefreshLine />

                                        </button>


                                        <button
                                            className="delete-btn"
                                            title="Delete document"
                                            onClick={() =>
                                                deleteDocument(
                                                    document.id
                                                )
                                            }
                                        >

                                            <RiDeleteBin6Line />

                                        </button>

                                    </div>

                                </div>

                            ))

                        )}

                    </>

                )}


                {/* ==================================================
                    FAQS
                ================================================== */}

                {activeTab === "faqs" && (

                    <>

                        <div
                            style={{
                                padding: "14px 22px",
                                borderBottom:
                                    "1px solid #F2F4F7",
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >

                            <button
                                className="reindex-btn"
                                onClick={addFaq}
                                style={{
                                    width: "auto",
                                    padding: "0 12px",
                                    gap: "5px",
                                }}
                            >

                                <RiAddLine />

                                Add FAQ

                            </button>

                        </div>


                        {faqs.length === 0 ? (

                            <div className="knowledge-empty">

                                <div className="empty-icon">

                                    <RiQuestionAnswerLine />

                                </div>

                                <h3>
                                    No FAQs yet
                                </h3>

                                <p>
                                    Add frequently asked questions
                                    to provide your AI with
                                    direct answers.
                                </p>

                            </div>

                        ) : (

                            faqs.map((faq) => (

                                <div
                                    className="faq-row"
                                    key={faq.id}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            gap: "20px",
                                        }}
                                    >

                                        <div>

                                            <div className="faq-question">

                                                {faq.question}

                                            </div>

                                            <div className="faq-answer">

                                                {faq.answer}

                                            </div>

                                        </div>


                                        <button
                                            className="delete-btn"
                                            title="Delete FAQ"
                                            onClick={() =>
                                                deleteFaq(
                                                    faq.id
                                                )
                                            }
                                        >

                                            <RiDeleteBin6Line />

                                        </button>

                                    </div>

                                </div>

                            ))

                        )}

                    </>

                )}

            </section>


            {/* ==================================================
                AI INSTRUCTIONS
            ================================================== */}

            <section className="ai-instructions-card">

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >

                    <RiRobot2Fill />

                    <h3>
                        AI Instructions
                    </h3>

                </div>


                <p>
                    Tell your AI how it should behave beyond
                    the settings above.
                </p>


                <textarea
                    value={instructions}
                    onChange={(e) =>
                        setInstructions(
                            e.target.value
                        )
                    }
                    placeholder="Describe how your AI should behave..."
                />


                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "12px",
                    }}
                >

                    <button
                        className="upload-btn"
                        onClick={saveInstructions}
                    >

                        <RiSaveLine />

                        Save Instructions

                    </button>

                </div>

            </section>


            {/* ==================================================
                PROCESSING INFORMATION
            ================================================== */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: "#667085",
                    fontSize: "11px",
                    padding: "0 2px",
                }}
            >

                <RiInformationLine />

                Documents are automatically processed,
                chunked and indexed so your AI can retrieve
                relevant information during conversations.

            </div>

        </div>

    );

}

export default AIStudio;
