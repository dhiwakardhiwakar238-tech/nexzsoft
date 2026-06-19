import "./LeadTasks.css";

function LeadTasks() {

  const tasks = [
    {
      title: "Follow-up Call",
      due: "Today 4:00 PM",
      status: "Pending"
    },
    {
      title: "Send Proposal",
      due: "Tomorrow",
      status: "Pending"
    },
    {
      title: "Demo Meeting",
      due: "25 June 2026",
      status: "Scheduled"
    }
  ];

  return (
    <div className="tasks-card">

      <h3>📅 Tasks & Follow Ups</h3>

      {tasks.map((task, index) => (
        <div
          key={index}
          className="task-item"
        >
          <div>
            <h4>{task.title}</h4>
            <p>{task.due}</p>
          </div>

          <span className="task-status">
            {task.status}
          </span>
        </div>
      ))}

    </div>
  );
}

export default LeadTasks;