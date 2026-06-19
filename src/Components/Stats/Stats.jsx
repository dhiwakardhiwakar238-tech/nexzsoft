import "./Stats.css";

function Stats() {
  return (
    <section className="stats">
      <div className="container stats-grid">

        <div className="stat-card">
          <h2>99.9%</h2>
          <p>Service Reliability</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Customer Support</p>
        </div>

        <div className="stat-card">
          <h2>100%</h2>
          <p>Secure Infrastructure</p>
        </div>

        <div className="stat-card">
          <h2>500+</h2>
          <p>Projects Delivered</p>
        </div>

      </div>
    </section>
  );
}

export default Stats;