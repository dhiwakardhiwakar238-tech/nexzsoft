import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-glow"></div>

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>Nexzsoft</h2>

          <p>
            Empowering businesses with AI, Automation,
            Customer Engagement, and Digital Transformation.
          </p>

          <div className="footer-badges">
            <span>AI Powered</span>
            <span>Secure</span>
            <span>24/7 Support</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/resources">Resources</Link>
        </div>

        {/* Legal */}
        <div className="footer-column">
          <h3>Legal</h3>

          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
          <Link to="/refund-policy">Refund Policy</Link>
          <Link to="/security-policy">Security Policy</Link>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact</h3>

          <p>📧 info@nexzsoft.com</p>
          <p>📞 +91 9876543210</p>
          <p>📍 Chennai, Tamil Nadu, India</p>

          <div className="social-links">
            <a href="#">LinkedIn</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Nexzsoft. All Rights Reserved.
        </p>

        <p>
          Built with Innovation • Powered by AI
        </p>
      </div>

    </footer>
  );
}

export default Footer;