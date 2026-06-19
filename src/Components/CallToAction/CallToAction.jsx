import { Link } from "react-router-dom";
import "./CallToAction.css";

function CallToAction() {
  return (
    <section className="cta">
      <div className="container">
        <h2>Ready to Transform Your Business?</h2>

        <p>
          Discover how Nexzsoft can help automate processes, improve customer
          engagement, and accelerate growth.
        </p>

        <div className="cta-buttons">
          <Link to="/contact-sales" className="cta-btn">
            Contact Sales
          </Link>

          <Link to="/pricing" className="cta-btn secondary">
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;