import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* Company */}
        <div className="footer-col">
          <h2>Nexzsoft</h2>

          <p>
            AI-powered customer engagement platform
            for modern businesses.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/solutions">Solutions</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About Us</a>
        </div>

        {/* Resources */}
        <div className="footer-col">
          <h3>Resources</h3>

          <a href="/toolkit">Tool Kit</a>
          <a href="/support">Support</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h3>Contact</h3>

          <p>📧 info@nexzsoft.com</p>
          <p>📞 +91 9876543210</p>
          <p>📍 Chennai, India</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Nexzsoft. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;