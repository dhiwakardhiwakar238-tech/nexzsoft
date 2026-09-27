import toast from "react-hot-toast";
import "./KnowledgeBase.css";

import { useState, useEffect, useRef } from "react";
// import { useRef } from "react"; 
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;



const KnowledgeBase = () => {

    const fileInput = useRef();

    const [documents, setDocuments] = useState([]);

    const [uploading, setUploading] = useState(false);

    const [uploadStatus, setUploadStatus] = useState("");

    const loadDocuments = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/api/knowledge/documents`
            );

            setDocuments(res.data.documents);

        }

        catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        loadDocuments();

    }, []);


    const uploadPDF = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            setUploading(true);

            setUploadStatus("Uploading PDF...");

            const formData = new FormData();

            formData.append("file", file);

            formData.append(

                "companyId",

                "9c59e2d8-d4c0-45e1-8d87-dba2f40ab9b5"

            );

            setUploadStatus("Extracting Text...");

            const res = await axios.post(

                `${API_URL}/api/knowledge/upload`,

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            setUploadStatus("Generating Embeddings...");

            await loadDocuments();

            setUploadStatus("Completed ✅");

            setTimeout(() => {

                setUploading(false);

                setUploadStatus("");

            }, 1500);

            console.log(res.data);

        }

        catch (err) {

            console.log(err);

            setUploading(false);

            setUploadStatus("");

            if (err.response?.status === 409) {

                toast.error("⚠️ This PDF is already uploaded.");

                return;

            }

            toast.error("Upload Failed");

        }

    };


    const deleteDocument = async (id) => {

        if (!window.confirm("Delete this document?")) return;

        try {

            await axios.delete(

                `${API_URL}/api/knowledge/documents/${id}`

            );

            await loadDocuments();

        }

        catch (err) {

            console.log(err);

            toast.error("Delete Failed");

        }

    };

    const reIndexDocument = async (id) => {

        try {

            await axios.post(

                `${API_URL}/api/knowledge/documents/${id}/reindex`

            );

            toast.success("Reindex Completed");

            await loadDocuments();

        }

        catch (err) {

            console.log(err);

            toast.error("Reindex Failed");

        }

    };

    return (

        <div className="knowledge-page">

            <div className="knowledge-header">

                <div>

                    <h2>AI Knowledge Base</h2>

                    <p>
                        Upload PDF documents for AI trainings
                    </p>

                </div>

                <button

                    className="upload-btn"

                    disabled={uploading}

                    onClick={() => fileInput.current.click()}

                >

                    {

                        uploading

                            ?

                            "Uploading..."

                            :

                            "+ Upload PDF"

                    }

                </button>

                {

                    uploading && (

                        <div className="upload-progress">

                            <div className="progress-bar">

                                <div className="progress-fill"></div>

                            </div>

                            <p>{uploadStatus}</p>

                        </div>

                    )

                }

                <input

                    type="file"

                    ref={fileInput}

                    accept=".pdf"

                    style={{ display: "none" }}

                    onChange={uploadPDF}

                />

            </div>

            <div className="knowledge-table">

                <div className="knowledge-table-header">

                    <span>Document</span>

                    <span>Chunks</span>

                    <span>Status</span>

                    <span>Uploaded</span>

                    <span>Actions</span>

                </div>

                {documents.length === 0 ? (

                    <div className="knowledge-empty">

                        <div className="empty-icon">

                            📄

                        </div>

                        <h3>

                            No Documents Uploaded

                        </h3>

                        <p>

                            Upload your first PDF to build the AI Knowledge Base.

                        </p>

                    </div>

                ) : (

                    documents.map(doc => (

                        <div
                            key={doc.id}
                            className="knowledge-row"
                        >

                            <span>{doc.title}</span>

                            <span>{doc.chunk_count || "-"}</span>

                            <span
                                className={
                                    doc.status === "READY"
                                        ? "status-ready"
                                        : doc.status === "PROCESSING"
                                            ? "status-processing"
                                            : "status-failed"
                                }
                            >
                                {doc.status}
                            </span>

                            <span>
                                {new Date(doc.created_at).toLocaleDateString()}
                            </span>

                            <span className="knowledge-actions">

                                <button
                                    className="reindex-btn"
                                    onClick={() => reIndexDocument(doc.id)}
                                >
                                    Reindex
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => deleteDocument(doc.id)}
                                >
                                    Delete
                                </button>

                            </span>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

};

export default KnowledgeBase;