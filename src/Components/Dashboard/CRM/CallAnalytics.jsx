import "./CallAnalytics.css";

function CallAnalytics() {

  const calls = [
    {
      customer: "Samsung India",
      duration: "12m 32s",
      sentiment: "Positive",
      summary:
        "Customer interested in Enterprise Plan and requested pricing.",
      action:
        "Send proposal before Friday"
    },
    {
      customer: "ABC Retail",
      duration: "8m 11s",
      sentiment: "Neutral",
      summary:
        "Requested product comparison.",
      action:
        "Schedule demo next week"
    }
  ];

  return (
    <div className="call-card">

      <div className="call-header">
        <h3>📞 AI Call Analytics</h3>
      </div>

      {calls.map((call, index) => (

        <div
          key={index}
          className="call-item"
        >

          <div className="call-top">

            <h4>{call.customer}</h4>

            <span className="duration">
              {call.duration}
            </span>

          </div>

          <div className="call-sentiment">

            Sentiment:
            <span
              className={
                call.sentiment === "Positive"
                  ? "positive"
                  : "neutral"
              }
            >
              {" "}
              {call.sentiment}
            </span>

          </div>

          <div className="call-summary">

            <strong>AI Summary</strong>

            <p>{call.summary}</p>

          </div>

          <div className="next-action">

            <strong>Next Action</strong>

            <p>{call.action}</p>

          </div>

          <div className="call-actions">

            <button>
              ▶ Play Recording
            </button>

            <button>
              📄 Transcript
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}

export default CallAnalytics;