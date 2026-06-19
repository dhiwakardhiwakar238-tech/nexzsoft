import "./AISalesCoach.css";

function AISalesCoach() {

  const reviews = [
    {
      agent: "Arun Kumar",
      score: 82,
      issue: "Customer asked pricing but proposal not shared.",
      action: "Send proposal immediately."
    },

    {
      agent: "Priya",
      score: 91,
      issue: "Handled objections effectively.",
      action: "Schedule demo call."
    },

    {
      agent: "Rahul",
      score: 68,
      issue: "Follow-up delayed by 3 days.",
      action: "Reconnect customer today."
    }
  ];

  return (
    <div className="sales-coach-card">

      <h2>
        🧠 AI Sales Coach
      </h2>

      {reviews.map((item,index) => (

        <div
          key={index}
          className="sales-review"
        >

          <div className="sales-header">

            <h3>{item.agent}</h3>

            <span
              className={
                item.score > 85
                  ? "score-high"
                  : item.score > 70
                  ? "score-medium"
                  : "score-low"
              }
            >
              {item.score}/100
            </span>

          </div>

          <p>
            <strong>Issue:</strong>{" "}
            {item.issue}
          </p>

          <p>
            <strong>Suggested Action:</strong>{" "}
            {item.action}
          </p>

        </div>

      ))}

    </div>
  );
}

export default AISalesCoach;