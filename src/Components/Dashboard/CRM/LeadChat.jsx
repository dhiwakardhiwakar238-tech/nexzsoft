import "./LeadChat.css";

function LeadChat() {

  const chats = [
    {
      sender: "customer",
      text: "Hi, WhatsApp API pricing?"
    },
    {
      sender: "agent",
      text: "Starts from ₹999/month."
    },
    {
      sender: "customer",
      text: "Need a demo."
    },
    {
      sender: "agent",
      text: "Demo scheduled for tomorrow."
    }
  ];

  return (
    <div className="chat-history-card">

      <h3>💬 Conversation History</h3>

      <div className="chat-history">

        {chats.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.sender}`}
          >
            {msg.text}
          </div>
        ))}

      </div>

    </div>
  );
}

export default LeadChat;