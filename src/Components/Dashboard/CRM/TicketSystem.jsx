import "./TicketSystem.css";

function TicketSystem() {

  const tickets = [
    {
      id: "TKT-1001",
      customer: "Samsung India",
      issue: "WhatsApp API not connecting",
      priority: "High",
      status: "Open"
    },
    {
      id: "TKT-1002",
      customer: "ABC Retail",
      issue: "CRM login issue",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: "TKT-1003",
      customer: "Tech World",
      issue: "Broadcast failed",
      priority: "Low",
      status: "Resolved"
    }
  ];

  return (
    <div className="ticket-card">

      <div className="ticket-header">

        <h3>🎟 Customer Support Tickets</h3>

        <button className="new-ticket-btn">
          + New Ticket
        </button>

      </div>

      <div className="ticket-table">

        <div className="ticket-head">
          <span>ID</span>
          <span>Customer</span>
          <span>Priority</span>
          <span>Status</span>
        </div>

        {tickets.map((ticket) => (

          <div
            key={ticket.id}
            className="ticket-row"
          >

            <span>{ticket.id}</span>

            <span>
              {ticket.customer}
            </span>

            <span
              className={`priority ${ticket.priority.toLowerCase()}`}
            >
              {ticket.priority}
            </span>

            <span
              className={`status ${ticket.status.replace(" ", "-").toLowerCase()}`}
            >
              {ticket.status}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default TicketSystem;