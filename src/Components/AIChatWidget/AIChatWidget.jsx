import { useState } from "react";
import "./AIChatWidget.css";

function AIChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="chat-button"
        onClick={() => setOpen(!open)}
      >
        🤖
      </div>

      {open && (
        <div className="chat-box">
          <h3>Nexzsoft AI Assistant</h3>

          <p>
            Hi 👋 How can we help you today?
          </p>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}

export default AIChatWidget;