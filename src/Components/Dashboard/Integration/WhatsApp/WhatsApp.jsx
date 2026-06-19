import { useState } from "react";
import "./WhatsApp.css";
import WhatsAppInbox from "./WhatsAppInbox";

import CustomerProfileDrawer
  from "./CustomerProfileDrawer";

function WhatsApp() {
  const [message, setMessage] = useState("");

  const [connected, setConnected] =
    useState(false);

  const [selectedCustomer,
    setSelectedCustomer] =
    useState(null);

  const [autoReply, setAutoReply] =
    useState(true);

  const chats = [
    {
      id: 1,
      name: "Samsung India",
      company: "Samsung",
      email: "contact@samsung.com",
      phone: "+91 9876543210",
      last: "Need pricing",
      unread: 3,
      online: true,
      typing: true
    },

    {
      id: 2,
      name: "ABC Retail",
      company: "ABC Pvt Ltd",
      email: "info@abcretail.com",
      phone: "+91 9876543211",
      last: "WhatsApp API info",
      unread: 1,
      online: true,
      typing: false
    },

    {
      id: 3,
      name: "Tech World",
      company: "Tech World",
      email: "support@techworld.com",
      phone: "+91 9876543212",
      last: "Thanks",
      unread: 0,
      online: false,
      typing: false
    }
  ];

  return (
    <div className="whatsapp-page">

      {/* LEFT CONTACTS */}

      <div className="contact-panel">

        <div className="panel-header">
          Conversations
        </div>

        {chats.map((chat) => (
          <div
            key={chat.id}
            className="contact-card"
            onClick={() =>
              setSelectedCustomer(chat)
            }
          >

            <div className="contact-top">

              <div>

                <h4>{chat.name}</h4>

                <span
                  className={
                    chat.online
                      ? "online-status"
                      : "offline-status"
                  }
                >
                  {chat.online
                    ? "🟢 Online"
                    : "⚫ Offline"}
                </span>

              </div>

              {chat.unread > 0 && (
                <span className="unread-badge">
                  {chat.unread}
                </span>
              )}

            </div>

            <p>
              {chat.typing
                ? "Typing..."
                : chat.last}
            </p>

          </div>
        ))}

      </div>

      {/* CENTER CHAT */}

      <div className="chat-panel">
        <div className="chat-header">

          <div>

            <h3>Samsung India</h3>

            <span className="online-status">
              🟢 Online
            </span>

          </div>

        </div>

        <div className="chat-body">

          <div className="msg customer">
            Hi
          </div>

          <div className="msg agent">
            Hello! How can I help?
          </div>

          <div className="file-preview">

            📄 Product_Pricing.pdf

          </div>

          <div className="image-preview">

            🖼️ Product Image

          </div>

        </div>

        <div className="chat-footer">

          <button className="attach-btn">
            📎
          </button>

          <button className="attach-btn">
            📷
          </button>

          <button className="attach-btn">
            🎤
          </button>

          <input
            type="text"
            placeholder="Type message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          />

          <button className="send-btn">
            Send
          </button>

        </div>

      </div>

      {/* RIGHT AI PANEL */}

      <div className="ai-panel">

        <div className="card">

          <h3>📡 Connection Status</h3>

          <div
            className={
              connected
                ? "status-online"
                : "status-offline"
            }
          >
            {connected
              ? "🟢 WhatsApp Connected"
              : "🔴 Not Connected"}
          </div>

        </div>

        <div className="card">
          <h3>Connect WhatsApp</h3>

          <button
            className="connect-btn"
            onClick={() =>
              setConnected(!connected)
            }
          >
            {connected
              ? "Disconnect"
              : "Connect"}
          </button>
        </div>

        <div className="card">

          <h3>🤖 AI Suggested Reply</h3>

          <p className="ai-reply">
            Thank you for your interest.
            Would you like a live demo?
          </p>

          <button className="save-btn">
            Use Reply
          </button>

        </div>

        <div className="card">

          <h3>⚡ AI Auto Reply</h3>

          <label className="toggle-row">

            <input
              type="checkbox"
              checked={autoReply}
              onChange={() =>
                setAutoReply(!autoReply)
              }
            />

            {autoReply
              ? "Enabled"
              : "Disabled"}

          </label>

        </div>

        <div className="card">
          <h3>Knowledge Base</h3>

          <textarea
            placeholder="Upload documents or paste FAQs..."
          />

          <button className="save-btn">
            Save
          </button>
        </div>

        <div className="card">

          <h3>🤖 AI Suggested Reply</h3>

          <p>
            Thank you for your interest.
            Would you like a live demo?
          </p>

          <button className="save-btn">
            Use Reply
          </button>

        </div>

        <div className="card">

          <h3>AI Auto Reply</h3>

          <label>

            <input type="checkbox" />

            Enable Auto Reply

          </label>

        </div>

        <div className="card">
          <h3>AI Settings</h3>

          <input
            type="text"
            placeholder="Fallback Message"
          />

          <button className="save-btn">
            Update
          </button>
        </div>

        {selectedCustomer && (

          <CustomerProfileDrawer
            customer={selectedCustomer}
            closeDrawer={() =>
              setSelectedCustomer(null)
            }
          />

        )}

      </div>

    </div>
  );
}

export default WhatsApp;