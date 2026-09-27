import "./PricingPreview.css";
import { useNavigate } from "react-router-dom";

function PricingPreview() {
  const navigate = useNavigate();
  return (
    <section className="pricing-preview">

      <div className="pricing-preview-glow pricing-preview-glow-one"></div>
      <div className="pricing-preview-glow pricing-preview-glow-two"></div>

      <div className="pricing-preview-container">

        {/* LEFT CONTENT */}
        <div className="pricing-preview-content">

          <span className="pricing-eyebrow">
            SIMPLE & TRANSPARENT PRICING
          </span>

          <h2>
            Pay for what you
            <span> actually use.</span>
          </h2>

          <p className="pricing-preview-description">
            No expensive plans. No paying for features you don't use.
            Nexzsoft pricing is designed to grow with your business —
            so you pay based on your actual messaging usage.
          </p>

          <div className="pricing-preview-actions">

            <button
              className="pricing-primary-btn"
              onClick={() => navigate("/pricing")}
            >
              
              View Pricing
              <span>→</span>
            </button>

          </div>

        </div>


        {/* RIGHT — PRICING MODEL */}
        <div className="pricing-preview-model">

          <div className="pricing-model-card">

            <div className="pricing-model-top">

              <div>
                <span className="pricing-model-label">
                  YOUR USAGE
                </span>

                <h3>Pay as you grow</h3>
              </div>

              <div className="pricing-model-icon">
                ₹
              </div>

            </div>


            <div className="pricing-calculation">

              <div className="calculation-row">

                <div>
                  <span>Meta messaging cost</span>
                  <strong>₹1,000</strong>
                </div>

                <span className="calculation-symbol">
                  +
                </span>

                <div>
                  <span>Nexzsoft fee</span>
                  <strong>₹99</strong>
                </div>

              </div>


              <div className="calculation-line"></div>


              <div className="calculation-result">

                <span>
                  Your Nexzsoft charge
                </span>

                <strong>
                  ₹99
                </strong>

              </div>

            </div>


            <div className="pricing-rule">

              <div className="rule-icon">
                ✓
              </div>

              <div>
                <strong>
                  Minimum ₹99/month
                </strong>

                <p>
                  % of your Meta messaging cost once
                  the calculated fee exceeds ₹99.
                </p>
              </div>

            </div>


            <div className="pricing-benefits">

              <div>
                <span>✓</span>
                No expensive fixed plans
              </div>

              <div>
                <span>✓</span>
                No charge for unused messaging
              </div>

              <div>
                <span>✓</span>
                Pricing grows with your usage
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* BOTTOM MESSAGE */}
      <div className="pricing-preview-bottom">

        <span>
          Simple pricing.
        </span>

        <span>
          Transparent usage.
        </span>

        <span>
          No unnecessary commitments.
        </span>

      </div>

    </section>
  );
}

export default PricingPreview;
