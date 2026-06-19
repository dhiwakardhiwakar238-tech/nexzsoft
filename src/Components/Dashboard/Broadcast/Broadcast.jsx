import { useState } from "react";
import "./Broadcast.css";

function Broadcast() {

  const [campaign, setCampaign] = useState("");
  const [message, setMessage] = useState("");

  const sendBroadcast = () => {
    alert("Broadcast Sent Successfully!");
    setCampaign("");
    setMessage("");
  };

  return (
    <div className="broadcast-page">

      <div className="broadcast-header">
        <h1>📢 Broadcast Campaign</h1>
      </div>

      <div className="broadcast-card">

        <label>Campaign Name</label>

        <input
          type="text"
          value={campaign}
          onChange={(e) =>
            setCampaign(e.target.value)
          }
          placeholder="Festival Offer"
        />

        <label>Broadcast Message</label>

        <textarea
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Type your message..."
        />

        <button
          className="broadcast-btn"
          onClick={sendBroadcast}
        >
          Send Broadcast
        </button>

      </div>

      <div className="preview-card">

        <h3>Message Preview</h3>

        <div className="preview-box">
          {message || "Preview will appear here"}
        </div>

      </div>

    </div>
  );
}

export default Broadcast;