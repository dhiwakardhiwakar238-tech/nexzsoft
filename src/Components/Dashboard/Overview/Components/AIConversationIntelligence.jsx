import "./AIConversationIntelligence.css";

function AIConversationIntelligence() {

  const conversations = [
    {
      customer: "Samsung India",
      message: "Can I get enterprise pricing?",
      intent: "Pricing Inquiry",
      probability: "92%",
      action: "Schedule Demo",
      sentiment: "Ready To Buy"
    },

    {
      customer: "ABC Retail",
      message: "Need WhatsApp integration details",
      intent: "Product Inquiry",
      probability: "81%",
      action: "Send Product Deck",
      sentiment: "Interested"
    },

    {
      customer: "Tech World",
      message: "Looking for CRM automation",
      intent: "Automation Request",
      probability: "88%",
      action: "Assign Sales Rep",
      sentiment: "High Intent"
    }
  ];

  return (
    <div className="ai-intelligence-card">

      <h2>
        🤖 AI Conversation Intelligence
      </h2>

      {conversations.map((item,index) => (

        <div
          key={index}
          className="ai-conversation-item"
        >

          <div className="ai-top">

            <h3>{item.customer}</h3>

            <span className="intent">
              {item.intent}
            </span>

          </div>

          <p className="customer-message">
            "{item.message}"
          </p>

          <div className="ai-grid">

            <div>
              <span>Buying Probability</span>
              <h4>{item.probability}</h4>
            </div>

            <div>
              <span>Sentiment</span>
              <h4>{item.sentiment}</h4>
            </div>

            <div>
              <span>Recommended Action</span>
              <h4>{item.action}</h4>
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}

export default AIConversationIntelligence;