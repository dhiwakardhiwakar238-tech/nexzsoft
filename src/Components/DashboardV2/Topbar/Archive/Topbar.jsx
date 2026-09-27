import "./Topbar.css";
import { useState, useEffect, useRef } from "react";
import { Bell, Moon, Settings, Sparkles, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearAuthStorage } from "../../../services/sessionManager";

function Topbar({ setActiveSidebar }) {
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const navigate = useNavigate();

  const businessname =
    localStorage.getItem("businessName") || "Workspace";

  const name =
    localStorage.getItem("userName") || "User";

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
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

  const handleLogout = () => {
    // Clear authentication/session information
    clearAuthStorage();

    setProfileOpen(false);

    navigate("/");

    // Ensures the application refreshes with the logged-out state
    window.location.reload();
  };

  return (
    <div className="topbar-v10">

      {/* LEFT */}
      <div className="topbar-left">
        <h2>
          Hello {name}, Welcome Back!
        </h2>
      </div>

      {/* RIGHT */}
      <div className="topbar-right">

        {/* <button
          className="icon-btn"
          title="AI Assistant"
        >
          <Sparkles size={20} />
        </button>*/}

        <button
          className="icon-btn"
          title="Theme"
        >
          <Moon size={20} />
        </button>

        <button
          className="icon-btn notification"
          title="Notifications"
        >
          <Bell size={20} />
          <span>4</span>
        </button>

        <button
          className="icon-btn"
          title="Settings"
          onClick={() => setActiveSidebar("settings")} 
          type="button"
        >
          <Settings size={20} />
        </button>

        {/* PROFILE */}
        <div
          className="profile-wrapper"
          ref={profileRef}
        >

          <button
            className={`profile ${
              profileOpen ? "profile-active" : ""
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
                profileOpen ? "open" : ""
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

              <div className="dropdown-divider"></div>

              <div className="dropdown-role">
                <span>Role</span>
                <strong>Admin</strong>
              </div>

              <div className="dropdown-role">
                <span>Memership</span>
                <strong>Free Trial</strong>
              </div>

              <div className="dropdown-divider"></div>

              <button
                className="logout-btn"
                onClick={handleLogout}
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
