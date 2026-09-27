
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import toast from "react-hot-toast";

import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import WhatsApp from "./Integration/WhatsApp/WhatsApp";
import Facebook from "./Integration/Facebook/Facebook";

import Instagram from "./Integration/Instagram/Instagram";
import Telegram from "./Integration/Telegram/Telegram";
import WebChat from "./Integration/WebChat/WebChat";
import WeChat from "./Integration/WeChat/WeChat";

import Overview from "./Overview/Overview";
import Contacts from "./Contacts/Contacts";

import Broadcast from "./Broadcast/Broadcast";


import Automation from "./Automation/Automation";
import Analytics from "./Analytics/Analytics";
import AIControl from "./AIControl/AIControl";
import Settings from "./Settings/Settings";

import Users from "./Users/Users";

import Subscription from "./Subscription/Subscription";

import DemoRequests from "./DemoRequests/DemoRequests";

import Notifications from "./Notifications/Notifications";

import SupportTickets from "./SupportTickets/SupportTickets";

import CRM from "./CRM/CRM";

import { useState, useEffect, useRef } from "react";

// import {
//   getCustomers,
//   getConversations,
//   getMessages
// } from "../../services/api";

import {
  getCustomers,
  getConversations,
  getMessages,
  sendWhatsAppMessage
} from "../../services/api";



function DashboardLayout() {


  const navigate = useNavigate();

  useEffect(() => {

    loadData();

  }, []);

  const [chatFullscreen, setChatFullscreen] =
    useState(false);


  const loadData = async () => {

    const cust =
      await getCustomers();

    const conv =
      await getConversations();

    setCustomers(cust || []);
    setConversations(conv || []);

    // if (
    //   conv &&
    //   conv.length > 0
    // ) {

    //   const firstConversation =
    //     conv[0];

    //   await openChat(
    //     firstConversation.customer_number
    //   );

    // }

  };


  useEffect(() => {
    loadCustomers();
    loadConversations();
  }, []);

  const loadCustomers =
    async () => {

      const data =
        await getCustomers();

      if (data)
        setContacts(data);

    };

  const loadConversations =
    async () => {

      const data =
        await getConversations();

      if (data)
        setConversations(data);

    };

  const loadMessages = async (conversationId) => {

    console.log(
      "LOAD MESSAGES CALLED =",
      conversationId
    );

    const data =
      await getMessages(
        conversationId
      );

    console.log(
      "RAW DATA =",
      data
    );

    if (!data) return;

    const formatted =
      data.map(msg => ({
        sender: msg.sender,
        text: msg.message
      }));

    console.log(
      "FORMATTED =",
      formatted
    );

    setChat(formatted);

    console.log(
      "CHAT UPDATED"
    );

  };

  // Navigation and Sub-tabs states
  const [activeSidebar, setActiveSidebar] = useState("dashboard");
  const [activeTopTab, setActiveTopTab] = useState("inbox");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Functional States

  const [chat, setChat] = useState([]);
  // useEffect(() => {
  //   console.log(
  //     "CHAT STATE CHANGED =",
  //     chat.length,
  //     chat
  //   );
  // }, [chat]);
  // console.log(
  //   "RENDER CHAT =",
  //   chat.length
  // );
  const [message, setMessage] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [chat]);


  const [customers,
    setCustomers] = useState([]);

  const [selectedCustomer,
    setSelectedCustomer] =
    useState(null);


  const [fallbackMsg, setFallbackMsg] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [autoKeyword, setAutoKeyword] = useState("");
  const [autoResponse, setAutoResponse] = useState("");

  // Sample static contact list matching old template structure
  const [contacts, setContacts] =
    useState([]);

  const [conversations, setConversations] =
    useState([]);

  const [selectedConversation,
    setSelectedConversation] =
    useState(null);

  // Send Message Logic
  const sendMessage = async () => {

    console.log("SEND CLICKED");
    console.log("message =", message);
    console.log("selectedCustomer =", selectedCustomer);
    console.log("selectedConversation =", selectedConversation);

    if (!message.trim()) {
      return;
    }

    const msgText = message;

    setMessage("");

    try {


      const result =
        await sendWhatsAppMessage(
          selectedCustomer,
          msgText,
          selectedConversation
        );

      console.log(
        "API RESULT =",
        result
      );

      console.log(
        "BEFORE LOAD"
      );
      await loadMessages(
        selectedConversation
      );

      console.log(
        "BEFORE LOAD"
      );


    } catch (error) {


      console.error(
        "SEND ERROR =",
        error
      );


    }

  };





  // Connect WhatsApp Logic
  const connectWhatsApp = () => {
    toast.success("Trigger embedded signup!");
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("userId");

    toast.success(
      "Logged out successfully!"
    );

    setTimeout(
      () => navigate("/"),
      1000
    );
  };



  // 👇 INGA ADD PANNU

  const openChat = async (phone) => {



    // console.log(
    //   "PHONE CLICKED =",
    //   phone
    // );

    const conversation =
      conversations.find(
        (c) =>
          c.customer_number === phone
      );

    // console.log(
    //   "FOUND CONVERSATION =",
    //   conversation
    // );

    if (!conversation) {

      setSelectedCustomer(phone);
      setSelectedConversation(null);
      setChat([]);

      console.log(
        "NO CONVERSATION FOUND"
      );

      return;
    }

    const msgs =
      await getMessages(
        conversation.id
      );

    // console.log(
    //   "MESSAGES =",
    //   msgs
    // );

    const formatted =
      msgs.map((m) => ({
        sender: m.sender,
        text: m.message,
      }));

    setSelectedCustomer(
      phone
    );

    setSelectedConversation(
      conversation.id
    );

    setChat(
      formatted
    );

  };

  // chatbox maximize





  return (
    <div className="dashboard dark">
      {/* SIDEBAR */}
      <Sidebar
        activeSidebar={activeSidebar}
        setActiveSidebar={setActiveSidebar}
      />

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {/* HEADER */}
        <Topbar logout={logout} />

        {/* TOP FEATURE NAV */}
        <div className="topnav">
          <div
            className={activeTopTab === "inbox" ? "active-tab" : ""}
            onClick={() => setActiveTopTab("inbox")}
          >
            Inbox
          </div>
          <div
            className={activeTopTab === "broadcast" ? "active-tab" : ""}
            onClick={() => setActiveTopTab("broadcast")}
          >
            Broadcast
          </div>
          <div
            className={activeTopTab === "automation" ? "active-tab" : ""}
            onClick={() => setActiveTopTab("automation")}
          >
            Automation
          </div>
          <div
            className={activeTopTab === "contacts" ? "active-tab" : ""}
            onClick={() => setActiveTopTab("contacts")}
          >
            Contacts
          </div>
        </div>

        {/* TAB RENDERING LOGIC */}
        <div className="content-container">

          {activeSidebar === "dashboard" && (
            <Overview />
          )}

          {activeSidebar === "whatsapp" && (
            <WhatsApp />
          )}


          {activeSidebar === "facebook" && (
            <Facebook />
          )}

          {activeSidebar === "instagram" && (
            <Instagram />
          )}

          {activeSidebar === "telegram" && (
            <Telegram />
          )}

          {activeSidebar === "webchat" && (
            <WebChat />
          )}

          {activeSidebar === "wechat" && (
            <WeChat />
          )}

          {activeSidebar === "contacts" && (
            <Contacts />
          )}

          {activeSidebar === "broadcast" && (
            <Broadcast />
          )}


          {activeSidebar === "automation" && <Automation />}
          {activeSidebar === "analytics" && <Analytics />}
          {activeSidebar === "aicontrol" && <AIControl />}
          {activeSidebar === "settings" && <Settings />}

          {activeSidebar === "users" && (
            <Users />
          )}

          {activeSidebar === "subscription" && (
            <Subscription />
          )}

          {activeSidebar === "demorequests" && (
            <DemoRequests />
          )}


          {activeSidebar === "notifications" && (
            <Notifications />
          )}

          {activeSidebar === "tickets" && (
            <SupportTickets />
          )}

          {activeSidebar === "crm" && (
            <CRM />
          )}
          {/* INBOX (CHAT & SETTINGS SPLIT) */}
          {activeTopTab === "inbox" && (
            <div className="inbox-layout">
              <div className="contacts-sidebar">

                {customers.map((c) => (

                  <div
                    key={c.id}
                    className="contact-item"
                    onClick={() => {

                      // console.log(
                      //   "CUSTOMER CLICKED =",
                      //   c
                      // );

                      openChat(
                        c.customer_number ||
                        c.phone_number ||
                        c.phone
                      );

                    }}
                  >

                    {
                      c.customer_number ||
                      c.phone_number ||
                      c.phone
                    }

                  </div>

                ))}

              </div>
              {/* CHAT SECTION */}
              <div
                className={
                  chatFullscreen
                    ? "chat-section fullscreen"
                    : "chat-section"
                }
              >


                <div className="chat-header">
                  <span>
                    {selectedCustomer || "WhatsApp Chat"}
                  </span>

                  <button
                    className="fullscreen-btn"
                    onClick={() => {

                      const next =
                        !chatFullscreen;

                      setChatFullscreen(next);

                      if (next) {
                        document.body.classList.add(
                          "chat-fullscreen"
                        );
                      } else {
                        document.body.classList.remove(
                          "chat-fullscreen"
                        );
                      }

                    }}
                  >
                    ⛶
                  </button>
                </div>
                {/* <h3>CHAT COUNT = {chat.length}</h3>   */}

                <div className="chat-messages">

                  {chat.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.sender}`}
                    >
                      {msg.text}
                    </div>
                  ))}

                  <div ref={chatEndRef}></div>

                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>

              {/* SETTINGS SIDEBAR */}
              <div className="settings-panel">
                <div className="card">
                  <h3>Connect WhatsApp</h3>
                  <button className="primary-btn" onClick={connectWhatsApp}>Connect</button>
                </div>

                <div className="card">
                  <h3>AI Configuration (RAG)</h3>
                  <textarea
                    placeholder="Add knowledge base..."
                    value={knowledgeBase}
                    onChange={(e) => setKnowledgeBase(e.target.value)}
                  />
                  <button className="primary-btn" onClick={() => toast.success("Knowledge Base Saved!")}>Save</button>
                </div>

                <div className="card">
                  <h3>Automation Settings</h3>
                  <input
                    type="text"
                    placeholder="Fallback message"
                    value={fallbackMsg}
                    onChange={(e) => setFallbackMsg(e.target.value)}
                  />
                  <button className="primary-btn" onClick={() => toast.success("Fallback Saved!")}>Save</button>
                </div>
              </div>
            </div>
          )}

          {/* BROADCAST MESSAGING */}
          {activeTopTab === "broadcast" && (
            <div className="card full-tab-card">
              <h2>Broadcast Messaging</h2>
              <textarea
                placeholder="Enter your message..."
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
              />
              <button className="primary-btn" onClick={() => { toast.success("Broadcast Sent!"); setBroadcastMsg(""); }}>
                Send Broadcast
              </button>
            </div>
          )}

          {/* AUTOMATION RULES */}
          {activeTopTab === "automation" && (
            <div className="card full-tab-card">
              <h2>Automation Rules</h2>
              <input
                type="text"
                placeholder="Keyword trigger"
                value={autoKeyword}
                onChange={(e) => setAutoKeyword(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <textarea
                placeholder="Response"
                value={autoResponse}
                onChange={(e) => setAutoResponse(e.target.value)}
              />
              <button className="primary-btn" onClick={() => { toast.success("Rule Saved!"); setAutoKeyword(""); setAutoResponse(""); }}>
                Save Rule
              </button>
            </div>
          )}

          {/* CONTACTS LIST */}
          {activeTopTab === "contacts" && (
            <div className="card full-tab-card">
              <h2>Contacts</h2>
              <div className="contacts-list">
                {contacts.map((c) => {

                  const conversation =
                    conversations.find(
                      conv =>
                        conv.customer_number ===
                        c.phone
                    );

                  return (

                    <div
                      key={c.id}
                      className="contact-item"
                      onClick={() =>
                        openChat(c.phone)
                      }
                    >

                      <strong>
                        {c.phone}
                      </strong>

                    </div>

                  );

                })}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;