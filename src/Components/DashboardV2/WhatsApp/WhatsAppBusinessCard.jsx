import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppBusinessCard.css";

export default function WhatsAppBusinessCard() {
  return (
    <div className="wa-card">
      <div className="wa-header">
        <h2>WhatsApp Business API</h2>

        <div className="connected-badge">
          <span className="green-dot"></span>
          Connected
        </div>
      </div>

      <div className="wa-body">
        <div className="wa-details">
          <div className="detail-item">
            <span className="label">Phone Number</span>
            <h4>+91 919942229988</h4>
          </div>

          <div className="detail-item">
            <span className="label">Phone Number ID</span>
            <h4>2036985177526166</h4>
          </div>

          <div className="detail-item">
            <span className="label">WhatsApp Business Account ID</span>
            <h4>1161625913708353</h4>
          </div>

          <div className="detail-item">
            <span className="label">API Status</span>

            <div className="api-status">
              <span className="green-dot"></span>
              Active
            </div>
          </div>
        </div>

        <div className="wa-icon-wrapper">
          <div className="icon-bg">
            <div className="icon-inner">
              <FaWhatsapp />
            </div>
          </div>
        </div>
      </div>

      <div className="wa-footer">
        <p>Connected on 05 Jan 2025, 10:23 AM</p>

        <button className="disconnect-btn">
          Disconnect
        </button>
      </div>
    </div>
  );
}