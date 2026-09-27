import React from "react";
import "./PartnerProgram.css";

const partnerBenefits = [
  {
    number: "01",
    title: "Recurring Revenue",
    description:
      "Build a recurring revenue stream by referring businesses that subscribe to Nexzsoft.",
  },
  {
    number: "02",
    title: "Simple to Start",
    description:
      "You don't need to build or maintain the technology. Introduce the opportunity and let Nexzsoft handle the platform.",
  },
  {
    number: "03",
    title: "Sales & Onboarding Support",
    description:
      "Our team can support product demonstrations, onboarding, implementation, and customer activation.",
  },
  {
    number: "04",
    title: "Grow With Your Customers",
    description:
      "As your referred businesses expand their use of Nexzsoft, your partner opportunity can grow with them.",
  },
];

const partnerTypes = [
  "Business Consultants",
  "Digital Agencies",
  "IT Service Providers",
  "Technology Partners",
  "System Integrators",
  "Freelancers",
  "Marketing Agencies",
  "Existing Nexzsoft Customers",
];

const platformFeatures = [
  "WhatsApp Business",
  "Instagram Messaging",
  "Facebook Messaging",
  "Shared Team Inbox",
  "AI Customer Support",
  "Campaign Broadcasting",
  "Workflow Automation",
  "CRM & Lead Management",
  "Analytics & Insights",
  "Web Chat",
  "Integrations",
  "API & Webhooks",
];

function PartnerProgramPage() {
  return (
    <main className="partner-page">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="partner-hero">
        <div className="partner-container">
          <div className="partner-hero-content">
            <span className="partner-eyebrow">
              NEXZSOFT PARTNER PROGRAM
            </span>

            <h1>
              Grow your business with
              <span> Nexzsoft.</span>
            </h1>

            <p>
              Help businesses modernize customer communication with AI,
              automation, and unified messaging — while building a recurring
              revenue opportunity for your own business.
            </p>

            <div className="partner-buttons">
              <a href="/contact" className="partner-primary-btn">
                Become a Partner
                <span>→</span>
              </a>

              <a href="/contact" className="partner-secondary-btn">
                Contact Sales
              </a>
            </div>

            <div className="partner-hero-note">
              <span>✦</span>
              <p>
                Built for consultants, agencies, technology providers, and
                professionals with business relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          VALUE PROPOSITION
      ===================================================== */}
      <section className="partner-value">
        <div className="partner-container">
          <div className="partner-value-grid">
            <div>
              <span className="section-label">WHY PARTNER</span>

              <h2>
                Turn your business
                <span> relationships into opportunity.</span>
              </h2>
            </div>

            <div>
              <p>
                Your customers already need better ways to communicate with
                their customers. Nexzsoft gives you a platform you can
                introduce without having to build the technology yourself.
              </p>

              <p>
                Together, we can help businesses move from fragmented
                conversations to intelligent, connected customer engagement.
              </p>
            </div>
          </div>

          <div className="partner-benefits">
            {partnerBenefits.map((benefit) => (
              <div className="partner-benefit" key={benefit.number}>
                <span className="benefit-number">{benefit.number}</span>

                <h3>{benefit.title}</h3>

                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="partner-process">
        <div className="partner-container">
          <div className="partner-section-heading">
            <span className="section-label">HOW IT WORKS</span>

            <h2>A simple path to partnership.</h2>

            <p>
              You bring the relationship. Nexzsoft brings the platform,
              expertise, and customer engagement technology.
            </p>
          </div>

          <div className="process-grid">
            <div className="process-step">
              <span>01</span>
              <h3>Join the program</h3>
              <p>
                Register your interest and connect with our partner team.
              </p>
            </div>

            <div className="process-step">
              <span>02</span>
              <h3>Identify opportunities</h3>
              <p>
                Introduce businesses that could benefit from Nexzsoft.
              </p>
            </div>

            <div className="process-step">
              <span>03</span>
              <h3>We help them get started</h3>
              <p>
                Our team supports the demonstration, onboarding, and
                implementation process.
              </p>
            </div>

            <div className="process-step">
              <span>04</span>
              <h3>Build recurring value</h3>
              <p>
                Earn recurring commissions from eligible active customer
                subscriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHO CAN JOIN
      ===================================================== */}
      <section className="partner-types">
        <div className="partner-container">
          <div className="partner-types-layout">
            <div>
              <span className="section-label">WHO CAN PARTNER</span>

              <h2>
                Built for people
                <span> who know businesses.</span>
              </h2>

              <p>
                You don't need to be a technology company. If you work closely
                with businesses and understand their challenges, you can
                create value with Nexzsoft.
              </p>
            </div>

            <div className="partner-type-grid">
              {partnerTypes.map((type) => (
                <div className="partner-type" key={type}>
                  <span>✓</span>
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          NEXZSOFT PLATFORM
      ===================================================== */}
      <section className="platform-section">
        <div className="partner-container">
          <div className="platform-header">
            <div>
              <span className="section-label">
                THE NEXZSOFT PLATFORM
              </span>

              <h2>Give your customers more than messaging.</h2>
            </div>

            <p>
              Nexzsoft brings customer conversations, AI, automation, team
              collaboration, and business workflows together in one platform.
            </p>
          </div>

          <div className="platform-grid">
            {platformFeatures.map((feature) => (
              <div className="platform-feature" key={feature}>
                <span>✓</span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          REVENUE
      ===================================================== */}
      <section className="partner-revenue">
        <div className="partner-container">
          <div className="revenue-card">
            <div className="revenue-content">
              <span className="section-label">PARTNER REVENUE</span>

              <h2>
                Build a recurring
                <span> revenue stream.</span>
              </h2>

              <p>
                Eligible partners can earn recurring commissions from
                qualifying customer subscriptions. Your exact commission
                structure and partner benefits will be shared during the
                onboarding process.
              </p>

              <a
                href="/contact"
                className="revenue-link"
              >
                Discuss the partner program
                <span>→</span>
              </a>
            </div>

            <div className="revenue-visual">
              <div className="revenue-stat">
                <span className="stat-label">CUSTOMERS</span>
                <strong>+</strong>
                <p>Grow your network</p>
              </div>

              <div className="revenue-stat">
                <span className="stat-label">REVENUE</span>
                <strong>↗</strong>
                <p>Build recurring value</p>
              </div>

              <div className="revenue-stat">
                <span className="stat-label">PARTNERSHIP</span>
                <strong>∞</strong>
                <p>Grow together</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="partner-cta" id="become-partner">
        <div className="partner-container">
          <div className="partner-cta-inner">
            <div>
              <span className="section-label">
                BECOME A NEXZSOFT PARTNER
              </span>

              <h2>
                Let's grow
                <span> together.</span>
              </h2>

              <p>
                Tell us about your business and how you work with customers.
                Our team will connect with you to discuss the right
                partnership model.
              </p>
            </div>

            <div className="partner-cta-actions">
              <a
                href="/contact"
                className="partner-cta-primary"
              >
                Become a Partner
                <span>→</span>
              </a>

              <a
                href="mailto:support@nexzsoft.com"
                className="partner-cta-secondary"
              >
                Email our team
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PartnerProgramPage;