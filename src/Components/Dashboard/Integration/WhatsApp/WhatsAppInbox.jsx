import "./WhatsAppInbox.css";
import { useState } from "react";

function WhatsAppInbox() {

  const contacts = [
    {
      id: 1,
      name: "Samsung India",
      last: "Need pricing details"
    },
    {
      id: 2,
      name: "ABC Retail",
      last: "WhatsApp API info"
    },
    {
      id: 3,
      name: "Tech World",
      last: "Need CRM demo"
    }
  ];

  const [selected, setSelected] =
    useState(contacts[0]);

  const [messages] = useState([
    {
      sender: "customer",
      text: "Hi, pricing details venum"
    },
    {
      sender: "ai",
      text: "Our plans start at ₹999/month."
    }
  ]);

  return (
    <div className="wa-inbox">

      <div className="wa-sidebar">

        <h2>WhatsApp Inbox</h2>

        {contacts.map(contact => (

          <div
            key={contact.id}
            className="wa-contact"
            onClick={() =>
              setSelected(contact)
            }
          >
            <h4>{contact.name}</h4>
            <p>{contact.last}</p>
          </div>

        ))}

      </div>

      <div className="wa-chat">

        <div className="wa-chat-header">
          {selected.name}
        </div>

        <div className="wa-messages">

          {messages.map((msg,index) => (

            <div
              key={index}
              className={
                msg.sender === "customer"
                  ? "msg customer"
                  : "msg ai"
              }
            >
              {msg.text}
            </div>

          ))}

        </div>

        <div className="ai-suggestion">

          <h4>
            🤖 AI Suggested Reply
          </h4>

          <p>
            Thank you for your interest.
            Would you like a live demo?
          </p>

        </div>

        <div className="wa-input">

          <input
            placeholder="Type reply..."
          />

          <button>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default WhatsAppInbox;