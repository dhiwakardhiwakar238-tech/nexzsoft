import "./Navbar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

function Navbar({ openAuth }) {
  return (
    <header className="header">

      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <img
            src={logo}
            alt="Nexzsoft Logo"
            className="logo-img"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="nav-menu">

        <Link to="/">Home</Link>

        <Link to="/solutions">
          Solutions
        </Link>

        <Link to="/pricing">
          Pricing
        </Link>

        {/* Resources Hub Dropdown */}
        <div className="dropdown">
          <button className="dropbtn">
            Resources Hub ▼
          </button>

          <div className="dropdown-content">

            <Link to="/about">
              About Us
            </Link>

            <Link to="/partner">
              Become a Partner
            </Link>

            <Link to="/toolkit">
              Tool Kit
            </Link>

            <Link to="/support">
              Support
            </Link>

          </div>
        </div>

        <Link to="/contact-sales">
          Contact Sales
        </Link>

        <button
          className="login-btn"
          onClick={openAuth}
        >
          Login / Signup
        </button>

      </nav>
    </header>
  );
}

export default Navbar;