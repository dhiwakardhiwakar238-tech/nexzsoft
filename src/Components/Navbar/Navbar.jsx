import "./Navbar.css";
import logo from "../../assets/logo_nx.png";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  ChevronDown,
  Sparkles,
  Layers3,
  BookOpen,
  Users,
  Wrench,
  Phone,
  MessageCircle,
  Mail,
  CalendarDays,
  Menu,
  X,
  ArrowRight,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import DemoModal from "../DemoModal/DemoModal";

function Navbar({ openAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");

  const closeMenu = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(
      activeDropdown === menu ? null : menu
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    navigate("/");
    window.location.reload();
  };

  const handleDemo = () => {
    setShowDemoModal(true);
    closeMenu();
  };

  return (
    <>
      <header className="nx-navbar">

        <div className="nx-navbar-inner">

          {/* =========================
              BRAND
          ========================= */}

          <div className="nx-brand">
            <Link to="/" onClick={closeMenu}>
              <img
                src={logo}
                alt="Nexzsoft"
                className="nx-logo"
              />
            </Link>
          </div>


          {/* =========================
              DESKTOP / MOBILE NAV
          ========================= */}

          <nav
            className={`nx-nav ${
              menuOpen ? "nx-nav-open" : ""
            }`}
          >

            <Link
              to="/"
              className="nx-nav-link"
              onClick={closeMenu}
            >
              Home
            </Link>


            {/* SOLUTIONS */}

            <div className="nx-nav-dropdown">

              <button
                className="nx-nav-link nx-dropdown-trigger"
                onClick={() => toggleDropdown("solutions")}
              >
                Solutions
                <ChevronDown
                  size={15}
                  className={
                    activeDropdown === "solutions"
                      ? "nx-chevron-open"
                      : ""
                  }
                />
              </button>

              <div
                className={`nx-dropdown nx-solutions-dropdown ${
                  activeDropdown === "solutions"
                    ? "nx-dropdown-mobile-open"
                    : ""
                }`}
              >

                <div className="nx-dropdown-intro">
                  <span>PLATFORM</span>
                  <strong>
                    Intelligent customer engagement
                  </strong>
                </div>

                <Link
                  to="/solutions"
                  onClick={closeMenu}
                  className="nx-dropdown-item"
                >
                  <div className="nx-dropdown-icon blue">
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <strong>AI Customer Engagement</strong>
                    <span>
                      Automate and personalize customer conversations.
                    </span>
                  </div>
                </Link>

                {/*<Link
                  to="/solutions/omnichannel"
                  onClick={closeMenu}
                  className="nx-dropdown-item"
                >
                  <div className="nx-dropdown-icon purple">
                    <Layers3 size={18} />
                  </div>

                  <div>
                    <strong>Omnichannel Inbox</strong>
                    <span>
                      Manage conversations across multiple channels.
                    </span>
                  </div>
                </Link>

                <Link
                  to="/solutions/automation"
                  onClick={closeMenu}
                  className="nx-dropdown-item"
                >
                  <div className="nx-dropdown-icon green">
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <strong>Workflow Automation</strong>
                    <span>
                      Build smarter workflows with less manual work.
                    </span>
                  </div>
                </Link>*/}

              </div>
            </div>


            {/* PRICING */}

            <Link
              to="/pricing"
              className="nx-nav-link"
              onClick={closeMenu}
            >
              Pricing
            </Link>


            {/* RESOURCES */}

            <div className="nx-nav-dropdown">

              <button
                className="nx-nav-link nx-dropdown-trigger"
                onClick={() => toggleDropdown("resources")}
              >
                Resources

                <ChevronDown
                  size={15}
                  className={
                    activeDropdown === "resources"
                      ? "nx-chevron-open"
                      : ""
                  }
                />
              </button>

              <div
                className={`nx-dropdown nx-resources-dropdown ${
                  activeDropdown === "resources"
                    ? "nx-dropdown-mobile-open"
                    : ""
                }`}
              >

                <div className="nx-resource-grid">

                  <Link
                    to="/about"
                    onClick={closeMenu}
                    className="nx-resource-item"
                  >
                    <BookOpen size={18} />
                    <div>
                      <strong>About Nexzsoft</strong>
                      <span>Learn about our platform.</span>
                    </div>
                  </Link>

                  <Link
                    to="/partner-program"
                    onClick={closeMenu}
                    className="nx-resource-item"
                  >
                    <Users size={18} />
                    <div>
                      <strong>Partner Program</strong>
                      <span>Grow with Nexzsoft.</span>
                    </div>
                  </Link>

                  <Link
                    to="/toolkit"
                    onClick={closeMenu}
                    className="nx-resource-item"
                  >
                    <Wrench size={18} />
                    <div>
                      <strong>Toolkit</strong>
                      <span>Useful business resources.</span>
                    </div>
                  </Link>

                  <Link
                    to="/blogs"
                    onClick={closeMenu}
                    className="nx-resource-item"
                  >
                    <BookOpen size={18} />
                    <div>
                      <strong>Blog</strong>
                      <span>Insights and ideas.</span>
                    </div>
                  </Link>

                  <Link
                    to="/careers"
                    onClick={closeMenu}
                    className="nx-resource-item"
                  >
                    <Users size={18} />
                    <div>
                      <strong>Careers</strong>
                      <span>Build the future with us.</span>
                    </div>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={closeMenu}
                    className="nx-resource-item"
                  >
                    <Phone size={18} />
                    <div>
                      <strong>Contact Us</strong>
                      <span>Talk to the Nexzsoft team.</span>
                    </div>
                  </Link>

                </div>

              </div>

            </div>


            {/* CONTACT SALES */}

            <div className="nx-nav-dropdown">

              <button
                className="nx-nav-link nx-dropdown-trigger"
                onClick={() => toggleDropdown("sales")}
              >
                Contact Sales

                <ChevronDown
                  size={15}
                  className={
                    activeDropdown === "sales"
                      ? "nx-chevron-open"
                      : ""
                  }
                />
              </button>

              <div
                className={`nx-dropdown nx-sales-dropdown ${
                  activeDropdown === "sales"
                    ? "nx-dropdown-mobile-open"
                    : ""
                }`}
              >

                <button
                  className="nx-sales-item"
                  onClick={() =>
                    window.open(
                      "https://wa.me/917904009090",
                      "_blank"
                    )
                  }
                >
                  <MessageCircle size={18} />

                  <div>
                    <strong>WhatsApp</strong>
                    <span>Chat with our team</span>
                  </div>

                  <ArrowRight size={15} />
                </button>


                <button
                  className="nx-sales-item"
                  onClick={() =>
                    (window.location.href =
                      "mailto:support@nexzsoft.com")
                  }
                >
                  <Mail size={18} />

                  <div>
                    <strong>Email Sales</strong>
                    <span>support@nexzsoft.com</span>
                  </div>

                  <ArrowRight size={15} />
                </button>


                <button
                  className="nx-sales-item"
                  onClick={() =>
                    (window.location.href =
                      "tel:+917904009090")
                  }
                >
                  <Phone size={18} />

                  <div>
                    <strong>Call Sales</strong>
                    <span>Speak with our team</span>
                  </div>

                  <ArrowRight size={15} />
                </button>


                <button
                  className="nx-sales-item"
                  onClick={handleDemo}
                >
                  <CalendarDays size={18} />

                  <div>
                    <strong>Request a Demo</strong>
                    <span>See Nexzsoft in action</span>
                  </div>

                  <ArrowRight size={15} />
                </button>

              </div>

            </div>

          </nav>


          {/* =========================
              RIGHT ACTIONS
          ========================= */}

          <div className="nx-actions">

            {userId ? (
              <>
                <Link
                  to="/dashboard"
                  className="nx-dashboard"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <button
                  className="nx-login-btn"
                  onClick={handleLogout}
                >
                  {/*<LogOut size={16} />*/}
                  Logout
                </button>
              </>
            ) : (
              <button
                className="nx-login-btn"
                onClick={openAuth}
              >
                Login
              </button>
            )}

            <Link
              className="nx-start-btn"
              onClick={openAuth}
            >
              Start Free
              <ArrowRight size={16} />
            </Link>

          </div>


          {/* MOBILE MENU BUTTON */}

          <button
            className="nx-mobile-toggle"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setActiveDropdown(null);
            }}
            aria-label="Toggle navigation"
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
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
