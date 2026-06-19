import "./Customer360.css";

function Customer360() {

  return (
    <div className="customer360-card">

      <h3>🏢 Customer 360 View</h3>

      <div className="customer360-grid">

        <div className="customer-box">
          <span>Total Interactions</span>
          <h2>128</h2>
        </div>

        <div className="customer-box">
          <span>WhatsApp Messages</span>
          <h2>94</h2>
        </div>

        <div className="customer-box">
          <span>Meetings</span>
          <h2>12</h2>
        </div>

        <div className="customer-box">
          <span>Revenue Generated</span>
          <h2>₹ 4.2L</h2>
        </div>

      </div>

      <div className="customer-health">

        <h4>Customer Health Score</h4>

        <div className="health-bar">
          <div
            className="health-fill"
            style={{ width: "87%" }}
          />
        </div>

        <p>87% Healthy Relationship</p>

      </div>

    </div>
  );
}

export default Customer360;