import "./AIChurnPrediction.css";

function AIChurnPrediction() {

  const customers = [
    {
      company: "Samsung India",
      risk: 87,
      reason: "No login for 14 days",
      action: "Schedule Customer Success Call"
    },

    {
      company: "ABC Retail",
      risk: 72,
      reason: "Low chatbot usage",
      action: "Offer onboarding session"
    },

    {
      company: "Tech World",
      risk: 41,
      reason: "Reduced engagement",
      action: "Send product update"
    }
  ];

  return (
    <div className="churn-card">

      <h2>
        ⚠️ AI Churn Prediction Engine
      </h2>

      {customers.map((customer, index) => (

        <div
          key={index}
          className="churn-item"
        >

          <div className="churn-header">

            <h3>{customer.company}</h3>

            <span
              className={
                customer.risk > 80
                  ? "risk-high"
                  : customer.risk > 60
                  ? "risk-medium"
                  : "risk-low"
              }
            >
              {customer.risk}% Risk
            </span>

          </div>

          <p>
            <strong>Reason:</strong>{" "}
            {customer.reason}
          </p>

          <p>
            <strong>Recommended:</strong>{" "}
            {customer.action}
          </p>

        </div>

      ))}

    </div>
  );
}

export default AIChurnPrediction;