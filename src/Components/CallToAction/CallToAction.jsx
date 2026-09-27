import { Link } from "react-router-dom";
import "./CallToAction.css";

function CallToAction() {
  return (
    <section className="cta">
      <div className="cta-container">

        <span className="cta-eyebrow">
          READY TO GET STARTED?
        </span>

        <h2>
          Transform your customer
          <span> engagement with Nexzsoft.</span>
        </h2>

        <p>
          Transform every customer interaction into a meaningful business opportunity with intelligent engagement that builds trust, strengthens loyalty, and drives sustainable growth.
          Respond faster, automate smarter, and turn every customer conversation into an opportunity for growth.
        </p>

        <div className="cta-buttons">
          <Link to="/contact" className="cta-btn primary">
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