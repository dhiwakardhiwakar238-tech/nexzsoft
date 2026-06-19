import "./AISalesCopilot.css";

function AISalesCopilot() {

  const insights = {
    score: 87,
    nextAction: "Call customer within 24 hours",
    offer: "Enterprise Plan",
    risk: "Proposal pending for 5 days",
  };

  return (
    <div className="copilot-card">

      <div className="copilot-header">

        <h3>🤖 AI Sales Copilot</h3>

        <span className="ai-badge">
          AI Active
        </span>

      </div>

      <div className="copilot-grid">

        <div className="copilot-box">
          <span>Win Probability</span>
          <h2>{insights.score}%</h2>
        </div>

        <div className="copilot-box">
          <span>Recommended Offer</span>
          <h2>{insights.offer}</h2>
        </div>

      </div>

      <div className="insight-card">
        <h4>🎯 Suggested Next Action</h4>
        <p>{insights.nextAction}</p>
      </div>

      <div className="insight-card risk">
        <h4>⚠ Risk Detection</h4>
        <p>{insights.risk}</p>
      </div>

      <div className="insight-card">
        <h4>💡 AI Recommendation</h4>
        <p>
          Customer has high engagement.
          Schedule demo immediately and
          send pricing proposal.
        </p>
      </div>

    </div>
  );
}

export default AISalesCopilot;