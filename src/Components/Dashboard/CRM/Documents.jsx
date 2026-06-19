import "./Documents.css";
import { useState } from "react";

function Documents() {

  const [documents, setDocuments] = useState([
    {
      name: "Proposal.pdf",
      type: "Proposal"
    },
    {
      name: "Quotation.pdf",
      type: "Quotation"
    },
    {
      name: "NDA.pdf",
      type: "Legal"
    }
  ]);

  const uploadDocument = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setDocuments([
      ...documents,
      {
        name: file.name,
        type: "Uploaded"
      }
    ]);
  };

  return (
    <div className="documents-card">

      <h3>📂 Documents Center</h3>

      <label className="upload-btn">
        Upload Document
        <input
          type="file"
          onChange={uploadDocument}
          hidden
        />
      </label>

      <div className="document-list">

        {documents.map((doc, index) => (

          <div
            key={index}
            className="document-item"
          >
            <div>
              <h4>{doc.name}</h4>
              <p>{doc.type}</p>
            </div>

            <button>
              View
            </button>
          </div>

        ))}

      </div>

    </div>
  );
}

export default Documents;