import { useState } from "react";
import "./Automation.css";

function Automation() {
  const [keyword, setKeyword] = useState("");
  const [reply, setReply] = useState("");

  return (
    <div className="automation-page">

      <h1>⚙️ Automation Rules</h1>

      <div className="automation-card">

        <input
          type="text"
          placeholder="Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <textarea
          placeholder="Auto Reply"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <button>
          Save Rule
        </button>

      </div>

    </div>
  );
}

export default Automation;