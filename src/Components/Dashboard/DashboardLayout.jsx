import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function DashboardLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [pdf, setPdf] = useState(null);

  const [chat, setChat] = useState([
    {
      sender: "customer",
      text: "Hi, I need help with my order.",
    },
    {
      sender: "ai",
      text: "Hello! How can I assist you today?",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setChat([
      ...chat,
      {
        sender: "customer",
        text: message,
      },
      {
        sender: "ai",
        text: "AI response will appear here.",
      },
    ]);

    setMessage("");
  };

  const handlePDFUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPdf(file);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <h2>Nexzsoft</h2>

        <ul>

          <li
            className={
              activeTab === "dashboard"
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
          >
            📊 Dashboard
          </li>

          <li
            className={
              activeTab === "whatsapp"
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveTab("whatsapp");
              setSidebarOpen(false);
            }}
          >
            💬 WhatsApp
          </li>

          <li
            className={
              activeTab === "broadcast"
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveTab("broadcast");
              setSidebarOpen(false);
            }}
          >
            📢 Broadcast
          </li>

          <li
            className={
              activeTab === "automation"
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveTab("automation");
              setSidebarOpen(false);
            }}
          >
            🤖 Automation
          </li>

          <li
            className={
              activeTab === "contacts"
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveTab("contacts");
              setSidebarOpen(false);
            }}
          >
            👥 Contacts
          </li>

          <li
            className={
              activeTab === "analytics"
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveTab("analytics");
              setSidebarOpen(false);
            }}
          >
            📈 Analytics
          </li>

        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        <div className="topbar">

          <button
            className="menu-btn"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            ☰
          </button>

          <h1>AI Customer Dashboard</h1>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <>
            <div className="stats-grid">

              <div className="stat-card">
                <h3>12,450</h3>
                <p>Total Messages</p>
              </div>

              <div className="stat-card">
                <h3>1,250</h3>
                <p>Customers</p>
              </div>

              <div className="stat-card">
                <h3>98%</h3>
                <p>AI Accuracy</p>
              </div>

              <div className="stat-card">
                <h3>24/7</h3>
                <p>Automation</p>
              </div>

            </div>

            <div className="chat-box">
              <h2>RAG Knowledge Base</h2>

              <input
                type="file"
                accept=".pdf"
                onChange={handlePDFUpload}
                className="file-input"
              />

              {pdf && (
                <div className="uploaded-file">
                  📄 {pdf.name}
                </div>
              )}

              <button className="logout-btn">
                Upload PDF
              </button>
            </div>
          </>
        )}

        {/* WhatsApp */}
        {activeTab === "whatsapp" && (
          <>
            <div className="chat-box">

              <h2>WhatsApp Connect</h2>

              <p className="status-text">
                Status:
                {isConnected
                  ? " Connected ✅"
                  : " Not Connected ❌"}
              </p>

              {!isConnected && (
                <button
                  className="logout-btn"
                  onClick={() =>
                    setIsConnected(true)
                  }
                >
                  Connect WhatsApp
                </button>
              )}

              {isConnected && (
                <div className="qr-box">
                  QR Code will appear here
                </div>
              )}

            </div>

            <div className="chat-box">

              <h2>Chat</h2>

              <div className="chat-messages">
                {chat.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.sender}`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="chat-input">

                <input
                  type="text"
                  placeholder="Type message..."
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                />

                <button
                  onClick={sendMessage}
                >
                  Send
                </button>

              </div>

            </div>
          </>
        )}

        {/* Broadcast */}
        {activeTab === "broadcast" && (
          <div className="chat-box">
            <h2>Broadcast Messaging</h2>

            <textarea
              className="dashboard-textarea"
              placeholder="Enter message..."
            />

            <button className="logout-btn">
              Send Broadcast
            </button>
          </div>
        )}

        {/* Automation */}
        {activeTab === "automation" && (
          <div className="chat-box">
            <h2>Automation Rules</h2>

            <input
              className="dashboard-input"
              placeholder="Trigger Keyword"
            />

            <textarea
              className="dashboard-textarea"
              placeholder="AI Response"
            />

            <button className="logout-btn">
              Save Rule
            </button>
          </div>
        )}

        {/* Contacts */}
        {activeTab === "contacts" && (
          <div className="chat-box">
            <h2>Contacts</h2>
            <p>
              Customer contacts coming soon...
            </p>
          </div>
        )}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="chat-box">
            <h2>Analytics</h2>
            <p>
              Analytics dashboard coming soon...
            </p>
          </div>
        )}

      </main>
    </div>
  );
}

export default DashboardLayout;