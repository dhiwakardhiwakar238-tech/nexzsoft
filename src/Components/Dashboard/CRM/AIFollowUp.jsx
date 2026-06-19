import "./AIFollowUp.css";
import { useState } from "react";

function AIFollowUp() {

  const [message] = useState(`Hi Samsung Team,

Thank you for attending our product demo.

Based on our discussion, I believe our Enterprise Plan would be a strong fit for your customer engagement goals.

Would you like us to prepare a customized quotation?

Looking forward to your response.

Regards,
Nexzsoft Sales Team`);

  const copyMessage = () => {

    navigator.clipboard.writeText(message);

    alert("Message Copied");
  };

  return (
    <div className="ai-followup-card">

      <div className="followup-header">

        <h3>
          🤖 AI Auto Follow-Up Generator
        </h3>

        <span className="ai-live">
          AI Generated
        </span>

      </div>

      <textarea
        value={message}
        readOnly
      />

      <div className="followup-actions">

        <button onClick={copyMessage}>
          📋 Copy Message
        </button>

        <button>
          📧 Email Draft
        </button>

        <button>
          💬 WhatsApp Draft
        </button>

      </div>

    </div>
  );
}

export default AIFollowUp;