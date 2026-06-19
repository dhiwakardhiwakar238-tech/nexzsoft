import "./DashboardShowcase.css";

function DashboardShowcase() {
  return (
    <section className="dashboard-section">

      <div className="dashboard-left">
        <span className="badge">
          AI Analytics Dashboard
        </span>

        <h2>
          Manage Everything
          From One Smart Platform
        </h2>

        <p>
          Track conversations, monitor team performance,
          automate workflows, and analyze growth metrics
          from a unified dashboard.
        </p>

        <div className="dashboard-features">
          <div>📊 Real-Time Analytics</div>
          <div>🤖 AI Automation</div>
          <div>💬 WhatsApp CRM</div>
          <div>🔒 Enterprise Security</div>
        </div>
      </div>

      <div className="dashboard-right">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200"
          alt="Dashboard"
        />
      </div>

    </section>
  );
}

export default DashboardShowcase;