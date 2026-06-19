import "./Analytics.css";

function Analytics() {
  return (
    <div className="analytics-page">

      <h1>📈 Analytics</h1>

      <div className="analytics-grid">

        <div className="analytics-card">
          <h3>Total Messages</h3>
          <h1>8,532</h1>
        </div>

        <div className="analytics-card">
          <h3>Contacts</h3>
          <h1>1,245</h1>
        </div>

        <div className="analytics-card">
          <h3>Open Chats</h3>
          <h1>43</h1>
        </div>

        <div className="analytics-card">
          <h3>AI Resolution</h3>
          <h1>92%</h1>
        </div>

      </div>

    </div>
  );
}

export default Analytics;