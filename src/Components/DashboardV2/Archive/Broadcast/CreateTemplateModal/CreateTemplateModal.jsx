import toast from "react-hot-toast";
import "./CreateTemplateModal.css";
import { useState } from "react";

import {
    createTemplate
}
    from "../../../../services/api";

function CreateTemplateModal({ open, onClose }) {

    const [templateName, setTemplateName] = useState("");

    const [category, setCategory] = useState("MARKETING");

    const [language, setLanguage] = useState("en_US");

    const [headerType, setHeaderType] = useState("NONE");

    const [headerText, setHeaderText] = useState("");

    const [body, setBody] = useState("");

    const [footer, setFooter] = useState("");

    const [buttonType, setButtonType] = useState("NONE");

    if (!open) return null;

    return (

        <div className="template-overlay">

            <div className="template-modal">

                <div className="template-header">

                    <h2>Create WhatsApp Template</h2>

                    <button onClick={onClose}>✕</button>

                </div>

                <div className="template-body">

                    <label>Template Name</label>

                    <input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                    />

                    <label>Category</label>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >

                        <option>MARKETING</option>

                        <option>UTILITY</option>

                        <option>AUTHENTICATION</option>

                    </select>

                    <label>Language</label>

                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >

                        <option value="en_US">English (US)</option>

                        <option value="en_GB">English (UK)</option>

                    </select>

                    <label>Header</label>

                    <select
                        value={headerType}
                        onChange={(e) => setHeaderType(e.target.value)}
                    >

                        <option value="NONE">None</option>

                        <option value="TEXT">Text</option>

                        <option value="IMAGE">Image</option>

                        <option value="VIDEO">Video</option>

                        <option value="DOCUMENT">Document</option>

                    </select>

                    {

                        headerType === "TEXT" &&

                        <input
                            placeholder="Header Text"
                            value={headerText}
                            onChange={(e) => setHeaderText(e.target.value)}
                        />

                    }

                    <label>Body</label>

                    <textarea
                        rows={6}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />

                    <label>Footer</label>

                    <input
                        value={footer}
                        onChange={(e) => setFooter(e.target.value)}
                    />

                    <label>Buttons</label>

                    <select
                        value={buttonType}
                        onChange={(e) => setButtonType(e.target.value)}
                    >

                        <option value="NONE">None</option>

                        <option value="QUICK_REPLY">Quick Reply</option>

                        <option value="CALL_TO_ACTION">Call To Action</option>

                    </select>

                </div>

                <div className="template-footer">

                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        onClick={async () => {

                            if (!templateName.trim()) {
                                toast.error("Template name required");
                                return;
                            }

                            if (!body.trim()) {
                                toast.error("Body required");
                                return;
                            }

                            const payload = {

                                tenant_id:

                                    localStorage.getItem("tenantId"),
                                name: templateName
                                    .trim()
                                    .toLowerCase()
                                    .replace(/\s+/g, "_"),

                                category,
                                language,

                                components: [
                                    {
                                        type: "BODY",
                                        text: body
                                    }
                                ]
                            };

                            console.log("PAYLOAD =", payload);

                            try {

                                const response =
                                    await createTemplate(payload);

                                console.log(
                                    "META RESPONSE =",
                                    response
                                );

                                toast.success("Template Created Successfully");

                                onClose();

                                window.location.reload();

                            }
                            catch (err) {

                                console.log(
                                    "FRONTEND ERROR =",
                                    err.response?.data
                                );

                            }

                        }}
                    >

                        Save Template

                    </button>

                </div>

            </div>

        </div>

    );

}

export default CreateTemplateModal;