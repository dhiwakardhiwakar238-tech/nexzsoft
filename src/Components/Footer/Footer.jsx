import { Link } from "react-router-dom";
import {
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaTelegramPlane,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowUp
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">

      {/* ==================================================
          BACKGROUND EFFECT
      ================================================== */}

      <div className="footer-glow"></div>
      <div className="footer-glow footer-glow-secondary"></div>


      {/* ==================================================
          MAIN FOOTER
      ================================================== */}

      <div className="footer-container">


        {/* ==================================================
            BRAND
        ================================================== */}

        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            Nexzsoft
          </Link>

          <p className="footer-description">
            Nexzsoft helps businesses simplify customer engagement,
            automation, communication, and digital operations through
            intelligent technology built for modern businesses.
          </p>


          {/* Trust Badges */}

          <div className="footer-badges">

            <span>AI Powered</span>

            <span>Secure Platform</span>

            <span>Business Ready</span>

          </div>


          {/* Social Media */}

          <div className="footer-social-section">

            <span className="footer-social-title">
              Follow Nexzsoft
            </span>

            <div className="footer-social-links">

              <a
                href="https://www.linkedin.com/company/nexzsoft"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nexzsoft on LinkedIn"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="https://www.instagram.com/nexzsoft"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nexzsoft on Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.youtube.com/@nexzsoft"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nexzsoft on YouTube"
              >
                <FaYoutube />
              </a>

              <a
                href="https://www.facebook.com/nexzsoft"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nexzsoft on Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://t.me/nexzsoft"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nexzsoft on Telegram"
              >
                <FaTelegramPlane />
              </a>

            </div>

          </div>

        </div>



        {/* ==================================================
            COMPANY
        ================================================== */}

        <div className="footer-column">

          <h3>Company</h3>

          <Link to="/">Home</Link>

          <Link to="/about">About Nexzsoft</Link>

          <Link to="/pricing">Pricing</Link>

          <Link to="/resources">Resources</Link>

        </div>



        {/* ==================================================
            PLATFORM
        ================================================== */}

        <div className="footer-column">

          <h3>Platform</h3>

          <Link to="/contacts">Customer Management</Link>

          <Link to="/broadcast">Broadcast & Messaging</Link>

          <Link to="/templates">Message Templates</Link>

          <Link to="/automation">Automation</Link>

        </div>



        {/* ==================================================
            LEGAL
        ================================================== */}

        <div className="footer-column">

          <h3>Legal & Security</h3>

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms & Conditions
          </Link>

          <Link to="/cookiespolicy">
            Cookie Policy
          </Link>

          <Link to="/securitypolicy">
            Security Policy
          </Link>

        </div>



        {/* ==================================================
            CONTACT
        ================================================== */}

        <div className="footer-column footer-contact">

          <h3>Contact Nexzsoft</h3>


          <a
            href="mailto:support@nexzsoft.com"
            className="footer-contact-item"
          >

            <span className="footer-contact-icon">
              <FaEnvelope />
            </span>

            <span>
              support@nexzsoft.com
            </span>

          </a>


          <a
            href="tel:+917904009090"
            className="footer-contact-item"
          >

            <span className="footer-contact-icon">
              <FaPhoneAlt />
            </span>

            <span>
              +91 79040 09090
            </span>

          </a>


          <div className="footer-contact-item">

            <span className="footer-contact-icon">
              <FaMapMarkerAlt />
            </span>

            <span>
              Chennai, Tamil Nadu, India
            </span>

          </div>


          <p className="footer-contact-note">
            Have a question, partnership request, or
            business requirement? Our team is here to help.
          </p>

        </div>

      </div>



      {/* ==================================================
          FOOTER CTA
      ================================================== */}

      <div className="footer-cta">

        <div>

          <h3>
            Build smarter. Connect better. Grow faster.
          </h3>

          <p>
            Explore Nexzsoft and discover technology designed
            around the way your business works.
          </p>

        </div>


        <Link
          to="/"
          className="footer-cta-button"
        >
          Explore Nexzsoft
        </Link>

      </div>



      {/* ==================================================
          BOTTOM BAR
      ================================================== */}

      <div className="footer-bottom">

        <div className="footer-copyright">

          © {currentYear} Nexzsoft Private Limited.
          All Rights Reserved.

        </div>


        <div className="footer-bottom-links">

          <Link to="/privacy-policy">
            Privacy
          </Link>

          <Link to="/terms">
            Terms
          </Link>

          <Link to="/cookiespolicy">
            Cookies
          </Link>

          <Link to="/securitypolicy">
            Security
          </Link>

        </div>


        <div className="footer-powered">

          Built with Innovation
          <span>•</span>
          Powered by AI

        </div>


        <a
          href="#top"
          className="footer-back-top"
          aria-label="Back to top"
        >
          <FaArrowUp />
        </a>

      </div>

    </footer>
  );
}

export default Footer;