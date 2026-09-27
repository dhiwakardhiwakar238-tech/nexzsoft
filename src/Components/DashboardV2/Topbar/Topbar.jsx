
import "./Topbar.css";
import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Moon,
  Settings,
  LogOut,
  MessageSquare,
  X,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearAuthStorage } from "../../../services/sessionManager";
import { getSocket } from "../../../services/socket";

function Topbar({ setActiveSidebar }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const navigate = useNavigate();

  const businessname =
    localStorage.getItem("businessName") || "Workspace";

  const name =
    localStorage.getItem("userName") || "User";

  /*
  =========================================================
  SOCKET.IO - INBOX NOTIFICATIONS
  =========================================================

  IMPORTANT:
  getSocket() returns the existing Socket.IO instance.

  Do NOT use:
  import socket from "../../../services/socket";

  because the default export is connectSocket(), not
  the actual Socket.IO instance.
  =========================================================
  */

  useEffect(() => {
    let socket = getSocket();

    /*
    ---------------------------------------------------------
    If DashboardV2 has already initialized the socket,
    attach immediately.
    ---------------------------------------------------------
    */

    if (socket) {
      const handleInboxNotification = (notification) => {
        setNotifications((prev) => [
          {
            ...notification,
            id:
              notification?.id ||
              notification?.notificationId ||
              `${Date.now()}-${Math.random()}`
          },
          ...prev
        ]);
      };

      socket.on(
        "inbox_notification",
        handleInboxNotification
      );

      return () => {
        socket.off(
          "inbox_notification",
          handleInboxNotification
        );
      };
    }

    /*
    ---------------------------------------------------------
    Socket is not initialized yet.

    The Dashboard normally initializes the shared socket.
    Since getSocket() may initially return null, retry briefly
    until the shared connection becomes available.

    This does NOT create a new Socket.IO connection.
    ---------------------------------------------------------
    */

    let retryCount = 0;
    const maxRetries = 50;

    const retryTimer = setInterval(() => {
      retryCount += 1;

      socket = getSocket();

      if (socket) {
        clearInterval(retryTimer);

        const handleInboxNotification = (notification) => {
          setNotifications((prev) => [
            {
              ...notification,
              id:
                notification?.id ||
                notification?.notificationId ||
                `${Date.now()}-${Math.random()}`
            },
            ...prev
          ]);
        };

        socket.on(
          "inbox_notification",
          handleInboxNotification
        );

        /*
        -------------------------------------------------------
        Store cleanup references on the socket object so the
        cleanup below can remove the exact same handler.
        -------------------------------------------------------
        */

        socket.__topbarInboxNotificationHandler =
          handleInboxNotification;
      }

      if (retryCount >= maxRetries) {
        clearInterval(retryTimer);

        if (!getSocket()) {
          console.warn(
            "⚠️ Topbar: Shared socket was not available."
          );
        }
      }
    }, 200);

    return () => {
      clearInterval(retryTimer);

      const currentSocket = getSocket();

      if (
        currentSocket &&
        currentSocket.__topbarInboxNotificationHandler
      ) {
        currentSocket.off(
          "inbox_notification",
          currentSocket.__topbarInboxNotificationHandler
        );

        delete currentSocket.__topbarInboxNotificationHandler;
      }
    };
  }, []);

  /*
  =========================================================
  CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  =========================================================
  */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
  =========================================================
  DISMISS NOTIFICATION
  =========================================================
  */

  const dismissNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification.id !== notificationId
      )
    );
  };

  /*
  =========================================================
  LOGOUT
  =========================================================
  */

  const handleLogout = () => {
    clearAuthStorage();

    setProfileOpen(false);
    setNotificationOpen(false);

    navigate("/");

    window.location.reload();
  };

  /*
  =========================================================
  FORMAT TIME
  =========================================================
  */

  const formatNotificationTime = (timestamp) => {
    if (!timestamp) return "Just now";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "Just now";
    }

    const now = new Date();

    const diffSeconds =
      Math.floor((now - date) / 1000);

    if (diffSeconds < 10) {
      return "Just now";
    }

    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    }

    const diffMinutes =
      Math.floor(diffSeconds / 60);

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }

    const diffHours =
      Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    return date.toLocaleDateString();
  };

  return (
    <div className="topbar-v10">

      {/* =====================================================
          LEFT
      ===================================================== */}

      <div className="topbar-left">
        <h2>
          Hello {name}, Welcome Back!
        </h2>
      </div>

      {/* =====================================================
          RIGHT
      ===================================================== */}

      <div className="topbar-right">

        {/* THEME */}

        <button
          className="icon-btn"
          title="Theme"
          type="button"
        >
          <Moon size={20} />
        </button>

        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <div
          className="notification-wrapper"
          ref={notificationRef}
        >
          <button
            className={`icon-btn notification ${
              notificationOpen
                ? "notification-active"
                : ""
            }`}
            title="Notifications"
            type="button"
            onClick={() =>
              setNotificationOpen(
                (prev) => !prev
              )
            }
          >
            <Bell size={20} />

            {notifications.length > 0 && (
              <span className="notification-badge">
                {notifications.length > 99
                  ? "99+"
                  : notifications.length}
              </span>
            )}
          </button>

          {/* =================================================
              NOTIFICATION PANEL
          ================================================= */}

          {notificationOpen && (
            <div className="notification-panel">

              {/* HEADER */}

              <div className="notification-panel-header">
                <div>
                  <h3>Notifications</h3>

                  <span>
                    {notifications.length === 0
                      ? "You're all caught up"
                      : `${notifications.length} new ${
                          notifications.length === 1
                            ? "notification"
                            : "notifications"
                        }`}
                  </span>
                </div>

                <button
                  className="notification-close-panel"
                  type="button"
                  onClick={() =>
                    setNotificationOpen(false)
                  }
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>
              </div>

              {/* CONTENT */}

              <div className="notification-list">

                {notifications.length === 0 ? (

                  <div className="notification-empty">

                    <div className="notification-empty-icon">
                      <CheckCircle2 size={24} />
                    </div>

                    <strong>
                      All caught up
                    </strong>

                    <span>
                      New inbox activity will
                      appear here.
                    </span>

                  </div>

                ) : (

                  notifications.map(
                    (notification) => (

                      <div
                        className="notification-item"
                        key={notification.id}
                      >

                        <div className="notification-item-icon">
                          <MessageSquare size={18} />
                        </div>

                        <div className="notification-item-content">

                          <div className="notification-item-top">

                            <strong>
                              {notification.title ||
                                "New WhatsApp message"}
                            </strong>

                            <button
                              type="button"
                              className="notification-dismiss"
                              title="Dismiss"
                              aria-label="Dismiss notification"
                              onClick={() =>
                                dismissNotification(
                                  notification.id
                                )
                              }
                            >
                              <X size={15} />
                            </button>

                          </div>

                          {notification.customerName && (
                            <div className="notification-customer">
                              {notification.customerName}
                            </div>
                          )}

                          <p>
                            {notification.message}
                          </p>

                          <span className="notification-time">
                            {formatNotificationTime(
                              notification.timestamp
                            )}
                          </span>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>
          )}

        </div>

        {/* SETTINGS */}

        <button
          className="icon-btn"
          title="Settings"
          onClick={() =>
            setActiveSidebar("settings")
          }
          type="button"
        >
          <Settings size={20} />
        </button>

        {/* ===================================================
            PROFILE
        =================================================== */}

        <div
          className="profile-wrapper"
          ref={profileRef}
        >

          <button
            className={`profile ${
              profileOpen
                ? "profile-active"
                : ""
            }`}
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
            type="button"
          >

            <img
              src={`https://ui-avatars.com/api/?background=4F46E5&color=fff&name=${encodeURIComponent(
                name
              )}`}
              alt={name}
            />

            <div className="profile-info">
              <h4>{name}</h4>
              <p>Admin</p>
            </div>

            <span
              className={`profile-arrow ${
                profileOpen
                  ? "open"
                  : ""
              }`}
            >
              ▾
            </span>

          </button>

          {/* PROFILE DROPDOWN */}

          {profileOpen && (
            <div className="profile-dropdown">

              <div className="dropdown-profile">

                <img
                  src={`https://ui-avatars.com/api/?background=4F46E5&color=fff&name=${encodeURIComponent(
                    name
                  )}`}
                  alt={name}
                />

                <div>
                  <strong>{name}</strong>
                  <span>{businessname}</span>
                </div>

              </div>

              <div className="dropdown-divider" />

              <div className="dropdown-role">
                <span>Role</span>
                <strong>Admin</strong>
              </div>

              <div className="dropdown-role">
                <span>Membership</span>
                <strong>Free Trial</strong>
              </div>

              <div className="dropdown-divider" />

              <button
                className="logout-btn"
                onClick={handleLogout}
                type="button"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Topbar;
