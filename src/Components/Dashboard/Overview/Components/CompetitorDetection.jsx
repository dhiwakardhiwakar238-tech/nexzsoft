import "./CompetitorDetection.css";

function CompetitorDetection() {

  const competitors = [
    {
      customer: "Samsung India",
      competitor: "Zoho",
      threat: "Medium",
      recommendation: "Show AI Automation Features"
    },

    {
      customer: "ABC Retail",
      competitor: "HubSpot",
      threat: "High",
      recommendation: "Share Pricing Comparison"
    },

    {
      customer: "Tech World",
      competitor: "Salesforce",
      threat: "Low",
      recommendation: "Highlight Faster Deployment"
    }
  ];

  return (
    <div className="competitor-card">

      <h2>⚔️ Competitor Detection AI</h2>

      {competitors.map((item,index) => (

        <div
          key={index}
          className="competitor-item"
        >

          <div className="competitor-header">

            <h3>{item.customer}</h3>

            <span className="threat-badge">
              {item.threat} Threat
            </span>

          </div>

          <p>
            Competitor Mentioned:
            <strong> {item.competitor}</strong>
          </p>

          <p>
            Recommended Response:
            <strong> {item.recommendation}</strong>
          </p>

        </div>

      ))}

    </div>
  );
}

export default CompetitorDetection;