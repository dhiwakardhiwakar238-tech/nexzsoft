import { useState, useEffect } from "react";

import "./DashboardV2.css";

import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import DashboardHome from "./DashboardHome/DashboardHome";

import Inbox from "./Inbox/Inbox";
import Broadcast from "./Broadcast/Broadcast";
import Contacts from "./Contacts/Contacts";
//import Automation from "./Automation/Automation";
import Analytics from "./Analytics/Analytics";
import KnowledgeBase from "./KnowledgeBase/KnowledgeBase";

import Settings from "./Settings/Settings";

// NEW COMPONENT
import WhatsAppConnect from "./WhatsApp/WhatsAppConnect";

import {
    getCustomers,
    getConversations,
    markConversationRead,
    getMessages,
    sendWhatsAppMessage,
} from "../../services/api";

function DashboardV2() {

    const [whatsAppTab, setWhatsAppTab] = useState("overview");

    const [dashboardPage, setDashboardPage] = useState("dashboard");

    const [expandedPanel, setExpandedPanel] = useState(null);

    const [activeSidebar, setActiveSidebar] = useState("dashboard");

    const [customers, setCustomers] = useState([]);
    const [conversations, setConversations] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);

    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        const tenantId =
            localStorage.getItem("tenantId");

        const customers =
            await getCustomers(tenantId);

        const conversations =
            await getConversations(tenantId);

            console.log("Converssation ID", conversations.id);

        console.log(
            "CUSTOMERS =",
            customers
        );

        console.log(
            "CONVERSATIONS =",
            conversations
        );

        setCustomers(customers);
        setConversations(conversations);

    };


    const openChat = async (phone) => {

        setSelectedCustomer(phone);

        setWhatsAppTab("inbox");

        const conversation = conversations.find(
            c => c.customer_number === phone
        );

        if (!conversation) {

            setSelectedConversation(null);
            setChat([]);

            return;

        }

        await markConversationRead(conversation.id);

        const updatedConversations =
            await getConversations(
                localStorage.getItem("tenantId")
            );

        setConversations(updatedConversations);

        setSelectedConversation(conversation.id);

        const messages =
            await getMessages(conversation.id);

        const formatted =
            messages.map(msg => ({

                sender: msg.sender,
                text: msg.message,
                created_at: msg.created_at,
                status: msg.status

            }));

        setChat(formatted);

    };


    const sendMessage = async () => {

        if (!message.trim()) return;

        const tenantId =
            localStorage.getItem("tenantId");

        const msgText = message;

        setMessage("");

        const tempMessage = {
            sender: "assistant",
            text: msgText,
            created_at: new Date(),
            status: "sent"
        };

        setChat(prev => [
            ...prev,
            tempMessage
        ]);

        console.log("Sending message to", selectedCustomer, tenantId, msgText, selectedConversation);

        await sendWhatsAppMessage(

            tenantId,

            selectedCustomer,

            msgText,

            selectedConversation

        );

        await openChat(selectedCustomer);

    };


    return (

        <div className="dashboard">

            <Sidebar
                activeSidebar={activeSidebar}
                setActiveSidebar={setActiveSidebar}
            />

            <div className="dashboard-content">

                <Topbar />

                <div className="dashboard-main">

                    {activeSidebar === "dashboard" && (
                        <DashboardHome />
                    )}

                    {activeSidebar === "whatsapp" && (
                        <>

                            <div className="whatsapp-tabs">

                                <button
                                    className={
                                        whatsAppTab === "overview"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setWhatsAppTab("overview")
                                    }
                                >
                                    Overview
                                </button>


                                <button
                                    className={
                                        whatsAppTab === "inbox"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setWhatsAppTab("inbox")
                                    }
                                >
                                    Inbox
                                </button>


                                <button
                                    className={
                                        whatsAppTab === "broadcast"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setWhatsAppTab("broadcast")
                                    }
                                >
                                    Broadcast
                                </button>

                                {/*
                                <button
                                    className={
                                        whatsAppTab === "automation"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setWhatsAppTab("automation")
                                    }
                                >
                                    Automation
                                </button>*/}


                                <button
                                    className={
                                        whatsAppTab === "contacts"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setWhatsAppTab("contacts")
                                    }
                                >
                                    Subscribers
                                </button>

                            </div>


                            {/* OVERVIEW */}

                            <div
                                style={{
                                    display:
                                        whatsAppTab === "overview"
                                            ? "block"
                                            : "none",
                                    width: "100%",
                                    height: "100%"
                                }}
                            >
                                <WhatsAppConnect/>
                            </div>


                            {/* INBOX */}

                            <div
                                style={{
                                    display:
                                        whatsAppTab === "inbox"
                                            ? "block"
                                            : "none",
                                    width: "100%",
                                    height: "100%"
                                }}
                            >

                                <Inbox
                                    customers={customers}
                                    conversations={conversations}
                                    selectedCustomer={selectedCustomer}
                                    setSelectedCustomer={setSelectedCustomer}
                                    chat={chat}
                                    openChat={openChat}
                                    message={message}
                                    setMessage={setMessage}
                                    sendMessage={sendMessage}
                                />

                            </div>


                            {/* BROADCAST */}

                            <div
                                style={{
                                    display:
                                        whatsAppTab === "broadcast"
                                            ? "block"
                                            : "none"
                                }}
                            >
                                <Broadcast />
                            </div>


                            {/* AUTOMATION 

                            <div
                                style={{
                                    display:
                                        whatsAppTab === "automation"
                                            ? "block"
                                            : "none"
                                }}
                            >
                                <Automation />
                            </div> */}


                            {/* CONTACTS */}

                            <div
                                style={{
                                    display:
                                        whatsAppTab === "contacts"
                                            ? "block"
                                            : "none"
                                }}
                            >
                                <Contacts
                                    customers={customers}
                                    conversations={conversations}
                                    openChat={openChat}
                                />
                            </div>

                        </>
                    )}


                    {activeSidebar === "analytics" && (
                        <Analytics />
                    )}

                    {activeSidebar === "knowledgebase" && (
                        <KnowledgeBase />
                    )}

                    {activeSidebar === "crm" && (
                        <h2>CRM Module Coming Soon</h2>
                    )}

                    {/*activeSidebar === "automation" && (
                        <h2>Automation Module Coming Soon</h2>
                    )*/}

                    {/*activeSidebar === "contacts" && (
                       <h2>Contacts Module Coming Soon</h2>
                    )*/}

                    {activeSidebar === "settings" && (

                        <Settings />

                    )}

                </div>

            </div>

        </div>

    );

}

export default DashboardV2;