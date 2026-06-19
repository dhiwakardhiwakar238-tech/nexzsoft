import "./AILeadScore.css";

function AILeadScore() {

  const score = 87;

  let status = "Hot Opportunity";
  let color = "#22c55e";

  if (score < 70) {
    status = "Warm Lead";
    color = "#f59e0b";
  }

  if (score < 40) {
    status = "Cold Lead";
    color = "#ef4444";
  }

  return (
    <div className="ai-score-card">

      <h3>🤖 AI Lead Intelligence</h3>

      <div
        className="score-circle"
        style={{
          borderColor: color
        }}
      >
        {score}
      </div>

      <h2 style={{ color }}>
        {status}
      </h2>

      <div className="insights">

        <div className="insight-item">
          ✅ Opened pricing page 5 times
        </div>

        <div className="insight-item">
          ✅ Requested demo
        </div>

        <div className="insight-item">
          ✅ WhatsApp engagement high
        </div>

        <div className="insight-item">
          ⚠️ Proposal pending
        </div>

      </div>

    </div>
  );
}

export default AILeadScore;