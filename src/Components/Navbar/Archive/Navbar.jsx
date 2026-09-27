import "./Navbar.css";
import logo from "../../assets/logo_nx.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import DemoModal from "../DemoModal/DemoModal";

function Navbar({ openAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSalesMenu, setShowSalesMenu] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showResourcesMenu, setShowResourcesMenu] =
    useState(false);

  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");
  console.log("Navbar userId:", userId);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <header className="header">

        <div className="logo">
          <Link to="/">
            <img
              src={logo}
              alt="Nexzsoft"
              className="logo-img"
            />
          </Link>
        </div>

        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        <nav
          className={`nav-menu ${menuOpen ? "active" : ""}`}
        >
          <Link to="/" className="nav-item">Home</Link>

          

          <Link to="/solutions" className="nav-item">
            Solutions
          </Link>

          <Link to="/pricing" className="nav-item">
            Pricing
          </Link>

          <div
            className="resources-menu"
            onMouseEnter={() => setShowResourcesMenu(true)}
          >
            <button className="resources-btn" className="nav-item">
              Resources ▼
            </button>

            {showResourcesMenu && (
              <div
                className="resources-dropdown"
                onMouseLeave={() =>
                  setShowResourcesMenu(false)
                }
              >
                <Link
                  className="resource-item"
                  to="/about"
                >
                  About
                </Link>

                <Link
                  className="resource-item"
                  to="/partner-program"
                >
                  Partner Program
                </Link>

                <Link
                  className="resource-item"
                  to="/toolkit"
                >
                  Toolkit
                </Link>

                <Link
                  className="resource-item"
                  to="/contact"
                >
                  Contact Us
                </Link>

                <Link
                  className="resource-item"
                  to="/careers"
                >
                  Careers
                </Link>

                <Link
                  className="resource-item"
                  to="/blogs"
                >
                  Blogs
                </Link>
              </div>
            )}
          </div>

          {/* CONTACT SALES */}

          <div
            className="contact-sales"
            onMouseEnter={() => setShowSalesMenu(true)}
          >
            <button className="sales-btn" className="nav-item">
              Contact Sales ▼
            </button>

            {showSalesMenu && (
              <div
                className="sales-dropdown"
                onMouseLeave={() =>
                  setShowSalesMenu(false)
                }
              >
                <div
                  className="sales-item"
                  onClick={() =>
                    window.open(
                      "https://wa.me/919876543210",
                      "_blank"
                    )
                  }
                >
                  💬 WhatsApp Chat
                </div>

                <div
                  className="sales-item"
                  onClick={() =>
                    window.location.href =
                    "mailto:sales@nexzsoft.com"
                  }
                >
                  📧 Email Us
                </div>

                <div
                  className="sales-item"
                  onClick={() =>
                    window.location.href =
                    "tel:+919876543210"
                  }
                >
                  📞 Call Us
                </div>

                <div
                  className="sales-item"
                  onClick={() => {
                    setShowDemoModal(true);
                    setShowSalesMenu(false);
                  }}
                >
                  🚀 Request a Demo
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="nav-actions">

          {userId ? (
            <>
              <Link to="/dashboard" className="dashboard-link">
                Dashboard
              </Link>

              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-btn"
              onClick={openAuth}
            >
              Login
            </button>
          )}

          <button className="trial-btn">
            Free Trial
          </button>
        </div>
      </header>

      {/* DEMO MODAL */}

      {showDemoModal && (
        <DemoModal
          closeModal={() =>
            setShowDemoModal(false)
          }
        />
      )}
    </>
  );
}

export default Navbar;