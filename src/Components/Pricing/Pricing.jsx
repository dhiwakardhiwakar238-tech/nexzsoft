
import "./Pricing.css";

function Pricing({ openAuth }) {
  const examples = [
    {
      meta: "₹500",
      nexzsoft: "₹89",
      note: "Minimum platform fee applies",
    },
    {
      meta: "₹1,000",
      nexzsoft: "₹89",
      note: "8% is below the minimum",
    },
    {
      meta: "₹2,000",
      nexzsoft: "₹160",
      note: "8% of Meta usage",
    },
    {
      meta: "₹5,000",
      nexzsoft: "₹400",
      note: "8% of Meta usage",
    },
  ];

  const features = [
    {
      title: "Shared Team Inbox",
      description:
        "Manage customer conversations from your connected channels in one workspace.",
    },
    {
      title: "AI-Powered Conversations",
      description:
        "Use AI to respond to customer questions and assist your team with everyday conversations.",
    },
    {
      title: "Automation & Workflows",
      description:
        "Automate repetitive customer interactions and create smarter conversation flows.",
    },
    {
      title: "Broadcast Campaigns",
      description:
        "Reach your customers with approved messaging campaigns and templates.",
    },
    {
      title: "Analytics & Insights",
      description:
        "Understand conversations, customer engagement, and communication performance.",
    },
    {
      title: "Business Integrations",
      description:
        "Connect your customer communication with the tools your business already uses.",
    },
  ];

  return (
    <main className="pricing-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="pricing-hero">
        <div className="pricing-container">

          <div className="pricing-hero-content">

            <span className="pricing-eyebrow">
              SIMPLE & TRANSPARENT PRICING
            </span>

            <h1>
              Pay for what you
              <span> actually use.</span>
            </h1>

            <p>
              No expensive plans. No paying for features you don't use.
              Nexzsoft pricing is designed to grow with your business —
              so you pay based on your actual messaging usage.
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          PRICING MODEL
      ===================================================== */}

      <section className="pricing-model">
        <div className="pricing-container">

          <div className="pricing-model-grid">

            {/* LEFT */}
            <div className="pricing-model-content">

              <span className="section-label">
                HOW PRICING WORKS
              </span>

              <h2>
                One simple formula.
                <br />
                <span>No complicated plans.</span>
              </h2>

              <p>
                Meta charges your business based on your WhatsApp
                messaging usage. Nexzsoft adds a simple platform fee
                based on that usage.
              </p>

              <div className="formula-box">
                <span>NEXZSOFT PLATFORM FEE</span>

                <strong>
                  MAXIMUM OF ₹89 OR 8% OF META USAGE
                </strong>
              </div>

              <p className="pricing-note">
                If 8% of your Meta usage is less than ₹89, your
                Nexzsoft platform fee remains ₹89. Once 8% exceeds
                ₹89, you simply pay the calculated 8%.
              </p>

            </div>


            {/* RIGHT */}
            <div className="pricing-highlight">

              <span className="highlight-label">
                YOUR MONTHLY COST
              </span>

              <div className="highlight-equation">

                <div>
                  <strong>Meta</strong>
                  <span>Your actual messaging usage</span>
                </div>

                <div className="equation-symbol">
                  +
                </div>

                <div>
                  <strong>Nexzsoft</strong>
                  <span>₹89 minimum or 8%</span>
                </div>

              </div>

              <div className="highlight-bottom">
                <span>
                  No fixed monthly subscription
                </span>

                <span>
                  No unused-plan charges
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          EXAMPLES
      ===================================================== */}

      <section className="pricing-examples">
        <div className="pricing-container">

          <div className="pricing-section-heading">

            <span className="section-label">
              SEE IT IN ACTION
            </span>

            <h2>
              The more you use,
              <span> the more you pay.</span>
            </h2>

            <p>
              Your Nexzsoft fee automatically follows your actual
              Meta messaging usage.
            </p>

          </div>


          <div className="pricing-table">

            <div className="pricing-table-header">
              <span>Meta Usage</span>
              <span>Nexzsoft Fee</span>
              <span>How It Works</span>
            </div>

            {examples.map((example, index) => (
              <div
                className="pricing-table-row"
                key={index}
              >
                <strong>{example.meta}</strong>

                <strong className="fee-value">
                  {example.nexzsoft}
                </strong>

                <span>{example.note}</span>
              </div>
            ))}

          </div>

        </div>
      </section>


      {/* =====================================================
          WHY THIS MODEL
      ===================================================== */}

      <section className="pricing-benefits">
        <div className="pricing-container">

          <div className="pricing-section-heading">

            <span className="section-label">
              BUILT FOR BUSINESS
            </span>

            <h2>
              Pricing that makes sense
              <span> as you grow.</span>
            </h2>

          </div>


          <div className="pricing-benefit-grid">

            <div className="pricing-benefit-card">
              <span>01</span>

              <h3>No expensive plans</h3>

              <p>
                You don't need to commit to a ₹299, ₹499, or ₹999
                subscription just to access customer communication
                tools.
              </p>
            </div>


            <div className="pricing-benefit-card">
              <span>02</span>

              <h3>No paying for unused capacity</h3>

              <p>
                If your messaging volume is low, your Nexzsoft fee
                stays at the minimum. You are not paying for
                unused message bundles or artificial limits.
              </p>
            </div>


            <div className="pricing-benefit-card">
              <span>03</span>

              <h3>Automatically scales with usage</h3>

              <p>
                As your customer conversations grow, your platform
                cost grows proportionally instead of forcing you
                into a higher fixed plan.
              </p>
            </div>


            <div className="pricing-benefit-card">
              <span>04</span>

              <h3>Simple to understand</h3>

              <p>
                Your pricing can be explained in one sentence:
                your Meta usage plus Nexzsoft's simple usage-based
                platform fee.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          INCLUDED FEATURES
      ===================================================== */}

      <section className="pricing-features">
        <div className="pricing-container">

          <div className="pricing-section-heading">

            <span className="section-label">
              INCLUDED WITH NEXZSOFT
            </span>

            <h2>
              Everything you need to
              <span> engage customers.</span>
            </h2>

            <p>
              Your usage-based pricing gives you access to the
              Nexzsoft platform without forcing your business into
              feature-based subscription tiers.
            </p>

          </div>


          <div className="pricing-feature-grid">

            {features.map((feature, index) => (
              <div
                className="pricing-feature-card"
                key={index}
              >
                <span className="feature-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </div>
            ))}

          </div>

        </div>
      </section>


      {/* =====================================================
          IMPORTANT NOTE
      ===================================================== */}

      <section className="pricing-note-section">
        <div className="pricing-container">

          <div className="pricing-note-box">

            <div className="pricing-note-icon">
              i
            </div>

            <div>
              <h3>
                About Meta messaging charges
              </h3>

              <p>
                Meta messaging charges are separate from Nexzsoft's
                platform fee and are determined by Meta based on
                applicable messaging categories, destination,
                pricing rules, and usage.
              </p>

              <p>
                Nexzsoft does not control Meta's messaging rates.
                Your Meta usage charges and Nexzsoft platform fee
                are shown separately for transparency.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="pricing-cta">
        <div className="pricing-container">

          <div className="pricing-cta-inner">

            <div>

              <span className="section-label">
                START WITHOUT THE COMMITMENT
              </span>

              <h2>
                Start small.
                <br />
                Scale when your business does.
              </h2>

              <p>
                Connect your business with Nexzsoft and pay based
                on your actual usage.
              </p>

            </div>


            <div className="pricing-cta-actions">

              <button
                type="button"
                onClick={openAuth}
                className="pricing-primary-btn"
              >
                Start Free
                <span>→</span>
              </button>

              <a
                href="/contact"
                className="pricing-secondary-btn"
              >
                Contact Sales
              </a>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Pricing;