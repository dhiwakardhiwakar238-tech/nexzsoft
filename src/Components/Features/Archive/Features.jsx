import "./Features.css";

function Features() {
  return (
    <section className="features-section">

      <div className="features-header">
        <span>⚡ Platform Features</span>


      </div>


      <div className="features-grid">

        <div className="feature-card">
          <div className="icon">🤖</div>
          <h3>AI Conversation Engine</h3>
          <p>
            Enable intelligent, context-aware conversations with advanced AI that understands intent, delivers accurate, personalized responses, and engages customers naturally.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">💬</div>
          <h3>Omnichannel Hub</h3>
          <p>
            Omnichannel Hub
            Manage customer interactions across WhatsApp, Facebook, Instagram, and more from a single, powerful, unified workspace for efficient collaboration and faster response times.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">⚡</div>
          <h3>Workflow Automation</h3>
          <p>
            Workflow Automation
            Simplify operations by automating repetitive tasks, managing broadcast templates, and streamlining business workflows to deliver seamless customer experiences.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">📊</div>
          <h3>Advanced Analytics</h3>
          <p>
            Advanced Analytics
            Track customer engagement, sentiment, and performance with real-time insights to improve satisfaction and deliver exceptional customer experiences.
          </p>
        </div>

      </div>



      <div className="dashboard-preview">

        <div className="features-header">

          <span>⚡  Built to Scale</span>

        </div>
        <div className="built">
          <p>
            Whether you're a startup, a growing business, or a global enterprise,
            Nexzsoft adapts to your evolving needs—helping  you deliver exceptional customer  experiences,
            improve operational efficiency, and grow with confidence at every stage. </p>

        </div>
        <div className="scale-grid">

          <div className="scale-card">
            <h3>24/7</h3>
            <p>Support</p>
          </div>

          <div className="scale-card">
            <h3>100%</h3>
            <p>Instant AI First Response</p>
          </div>

          <div className="scale-card">
            <h3>80%</h3>
            <p>AI-Resolved Conversations</p>
          </div>

          <div className="scale-card">
            <h3>70%</h3>
            <p>Reduction in Agent Workload</p>
          </div>

          <div className="scale-card">
            <h3>3×</h3>
            <p>More AI-Handled Interactions</p>
          </div>

          <div className="scale-card">
            <h3>5×</h3>
            <p>Productivity</p>
          </div>

          <div className="scale-card">
            <h3>3×</h3>
            <p>More Customer Engagement</p>
          </div>

          <div className="scale-card">
            <h3>95%</h3>
            <p>Customer Satisfaction</p>
          </div>

          <div className="scale-card">
            <h3>40%</h3>
            <p>Increase in Lead Conversion</p>
          </div>


          <div className="scale-card">
            <h3>90%</h3>
            <p>Routine Queries Resolved by AI</p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Features;