import "./AIProposal.css";
import { useState } from "react";

function AIProposal() {

  const [proposal, setProposal] =
    useState("");

  const generateProposal = () => {

    const generated = `
PROPOSAL

Client:
Samsung India

Project:
WhatsApp API + CRM Automation

Objectives:
• Automate customer conversations
• Centralize support operations
• Improve lead conversion

Scope:
• WhatsApp API Integration
• CRM Pipeline
• AI Chatbot
• Team Dashboard

Pricing:
Enterprise Plan
₹ 2,50,000 / Year

Implementation:
14 Business Days

Support:
24x7 Priority Support

Prepared By:
Nexzsoft
`;

    setProposal(generated);
  };

  return (
    <div className="proposal-card">

      <div className="proposal-header">

        <h3>
          📄 AI Proposal Generator
        </h3>

        <button
          className="generate-btn"
          onClick={generateProposal}
        >
          Generate Proposal
        </button>

      </div>

      <textarea
        value={proposal}
        readOnly
        placeholder="AI proposal will appear here..."
      />

      <div className="proposal-actions">

        <button>
          📥 Download PDF
        </button>

        <button>
          📧 Send Proposal
        </button>

      </div>

    </div>
  );
}

export default AIProposal;