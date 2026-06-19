import "./Features.css";

function Features() {
  return (
    <section className="features-section">

      <div className="features-header">
        <span>⚡ Platform Features</span>

        <h2>
          Everything You Need
          To Scale Faster
        </h2>

        <p>
          AI-powered automation, customer engagement,
          analytics, and omnichannel communication
          in one platform.
        </p>
      </div>

      <div className="dashboard-preview">

        <div className="dashboard-card">
          <div className="dashboard-top">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>

          <div className="dashboard-content">

            <div className="metric-card">
              <h3>10M+</h3>
              <p>Messages Sent</p>
            </div>

            <div className="metric-card">
              <h3>99.9%</h3>
              <p>Uptime</p>
            </div>

            <div className="metric-card">
              <h3>500+</h3>
              <p>Businesses</p>
            </div>

            <div className="metric-card">
              <h3>24/7</h3>
              <p>Support</p>
            </div>

          </div>
        </div>

      </div>

      <div className="features-grid">

        <div className="feature-card">
          <div className="icon">🤖</div>
          <h3>AI Conversation Engine</h3>
          <p>
            Intelligent conversations powered by
            advanced AI models.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">💬</div>
          <h3>Omnichannel Hub</h3>
          <p>
            Manage WhatsApp, Instagram, Facebook,
            and more from one place.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">⚡</div>
          <h3>Workflow Automation</h3>
          <p>
            Automate repetitive tasks and customer
            journeys.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">📊</div>
          <h3>Advanced Analytics</h3>
          <p>
            Gain insights and improve customer
            engagement.
          </p>
        </div>

      </div>

    </section>
  );
}

export default Features;