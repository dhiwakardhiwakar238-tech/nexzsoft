import "./LeadTimeline.css";

function LeadTimeline() {

  const activities = [
    {
      date: "Today",
      action: "Demo Scheduled"
    },
    {
      date: "Yesterday",
      action: "Sales Call Completed"
    },
    {
      date: "2 Days Ago",
      action: "Proposal Sent"
    },
    {
      date: "5 Days Ago",
      action: "WhatsApp Chat Started"
    }
  ];

  return (
    <div className="timeline-card">

      <h3>📈 Activity Timeline</h3>

      {activities.map((item, index) => (
        <div
          key={index}
          className="timeline-item"
        >
          <div className="timeline-dot"></div>

          <div>
            <strong>{item.action}</strong>
            <p>{item.date}</p>
          </div>
        </div>
      ))}

    </div>
  );
}

export default LeadTimeline;