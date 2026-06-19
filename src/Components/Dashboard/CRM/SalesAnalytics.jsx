import "./SalesAnalytics.css";

function SalesAnalytics() {

  return (
    <div className="sales-analytics">

      <h2>📊 Sales Analytics</h2>

      <div className="analytics-grid">

        <div className="analytics-box">
          <span>Revenue This Month</span>
          <h1>₹ 12.4L</h1>
        </div>

        <div className="analytics-box">
          <span>Deals Closed</span>
          <h1>28</h1>
        </div>

        <div className="analytics-box">
          <span>Conversion Rate</span>
          <h1>34%</h1>
        </div>

        <div className="analytics-box">
          <span>Avg Deal Size</span>
          <h1>₹ 1.85L</h1>
        </div>

      </div>

      <div className="chart-section">

        <div className="chart-card">
          <h3>📈 Revenue Trend</h3>

          <div className="fake-chart">

            <div style={{height:"50%"}}></div>
            <div style={{height:"70%"}}></div>
            <div style={{height:"45%"}}></div>
            <div style={{height:"90%"}}></div>
            <div style={{height:"80%"}}></div>
            <div style={{height:"100%"}}></div>

          </div>

        </div>

        <div className="chart-card">
          <h3>🎯 Lead Sources</h3>

          <div className="source-item">
            WhatsApp - 45%
          </div>

          <div className="source-item">
            Website - 25%
          </div>

          <div className="source-item">
            Facebook - 18%
          </div>

          <div className="source-item">
            Referral - 12%
          </div>

        </div>

      </div>

    </div>
  );
}

export default SalesAnalytics;