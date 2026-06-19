import "./Navbar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";

import DemoModal from "../DemoModal/DemoModal";

function Navbar({ openAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSalesMenu, setShowSalesMenu] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

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
          <Link to="/">Home</Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/pricing">
            Pricing
          </Link>

          <Link to="/resources">
            Resources
          </Link>

          {/* CONTACT SALES */}

          <div
            className="contact-sales"
            onMouseEnter={() => setShowSalesMenu(true)}
          >
            <button className="sales-btn">
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

          <Link to="/dashboard">
            Dashboard
          </Link>

          <button
            className="login-btn"
            onClick={openAuth}
          >
            Login
          </button>

          <button className="trial-btn">
            Free Trial
          </button>
        </nav>
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