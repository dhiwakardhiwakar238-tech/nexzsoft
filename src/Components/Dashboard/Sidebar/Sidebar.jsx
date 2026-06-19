import "./Sidebar.css";

function Sidebar({ activeSidebar, setActiveSidebar }) {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>Nexzsoft</h2>
            </div>

            <ul className="sidebar-menu">

                <li
                    className={activeSidebar === "dashboard" ? "active" : ""}
                    onClick={() => setActiveSidebar("dashboard")}
                >
                    📊 Dashboard
                </li>

                <li
                    className={activeSidebar === "whatsapp" ? "active" : ""}
                    onClick={() => setActiveSidebar("whatsapp")}
                >
                    🟢 WhatsApp
                </li>

                <li
                    className={activeSidebar === "facebook" ? "active" : ""}
                    onClick={() => setActiveSidebar("facebook")}
                >
                    📘 Facebook
                </li>

                <li
                    className={activeSidebar === "instagram" ? "active" : ""}
                    onClick={() => setActiveSidebar("instagram")}
                >
                    📸 Instagram
                </li>

                <li
                    className={activeSidebar === "telegram" ? "active" : ""}
                    onClick={() => setActiveSidebar("telegram")}
                >
                    ✈️ Telegram
                </li>

                <li
                    className={activeSidebar === "webchat" ? "active" : ""}
                    onClick={() => setActiveSidebar("webchat")}
                >
                    🌐 Web Chat
                </li>

                <li
                    className={activeSidebar === "wechat" ? "active" : ""}
                    onClick={() => setActiveSidebar("wechat")}
                >
                    💬 WeChat
                </li>

                <li
                    className={activeSidebar === "contacts" ? "active" : ""}
                    onClick={() => setActiveSidebar("contacts")}
                >
                    👥 Contacts
                </li>

                <li
                    className={activeSidebar === "broadcast" ? "active" : ""}
                    onClick={() => setActiveSidebar("broadcast")}
                >
                    📢 Broadcast
                </li>

                <li
                    className={activeSidebar === "automation" ? "active" : ""}
                    onClick={() => setActiveSidebar("automation")}
                >
                    ⚙️ Automation
                </li>

                <li
                    className={activeSidebar === "analytics" ? "active" : ""}
                    onClick={() => setActiveSidebar("analytics")}
                >
                    📈 Analytics
                </li>

                <li
                    className={activeSidebar === "aicontrol" ? "active" : ""}
                    onClick={() => setActiveSidebar("aicontrol")}
                >
                    🤖 AI Control
                </li>

                <li
                    className={activeSidebar === "settings" ? "active" : ""}
                    onClick={() => setActiveSidebar("settings")}
                >
                    ⚙️ Settings
                </li>


                <li
                    className={
                        activeSidebar === "users"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveSidebar("users")
                    }
                >
                    👥 Users
                </li>



                <li
                    className={
                        activeSidebar === "subscription"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveSidebar("subscription")
                    }
                >
                    💳 Subscription
                </li>

                <li
                    className={
                        activeSidebar === "demorequests"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveSidebar("demorequests")
                    }
                >
                    📋 Demo Requests
                </li>


                <li
                    className={
                        activeSidebar === "notifications"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveSidebar("notifications")
                    }
                >
                    🔔 Notifications
                </li>

                <li
                    className={
                        activeSidebar === "tickets"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveSidebar("tickets")
                    }
                >
                    🎫 Support Tickets
                </li>

                <li
                    className={
                        activeSidebar === "crm"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveSidebar("crm")
                    }
                >
                    👥 CRM
                </li>


            </ul>

        </aside>
    );
}

export default Sidebar;