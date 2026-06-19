import { useState } from "react";
import "./AIControl.css";

function AIControl() {

  const [knowledge, setKnowledge] = useState("");

  return (
    <div className="ai-page">

      <h1>🤖 AI Knowledge Base</h1>

      <div className="ai-card">

        <textarea
          placeholder="Paste FAQs, Documents, Product Info..."
          value={knowledge}
          onChange={(e) => setKnowledge(e.target.value)}
        />

        <button>
          Save Knowledge
        </button>

      </div>

    </div>
  );
}

export default AIControl;