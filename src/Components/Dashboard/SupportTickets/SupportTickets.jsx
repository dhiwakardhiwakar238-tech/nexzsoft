import "./SupportTickets.css";

function SupportTickets() {

  const tickets = [
    {
      id: "#TK001",
      user: "John",
      issue: "WhatsApp not connecting",
      status: "Open"
    },
    {
      id: "#TK002",
      user: "David",
      issue: "Broadcast failed",
      status: "Pending"
    },
    {
      id: "#TK003",
      user: "Sarah",
      issue: "Subscription issue",
      status: "Resolved"
    }
  ];

  return (
    <div className="tickets-page">

      <h1>🎫 Support Tickets</h1>

      <div className="ticket-table">

        <div className="ticket-head">
          <span>ID</span>
          <span>User</span>
          <span>Issue</span>
          <span>Status</span>
        </div>

        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="ticket-row"
          >
            <span>{ticket.id}</span>
            <span>{ticket.user}</span>
            <span>{ticket.issue}</span>
            <span>{ticket.status}</span>
          </div>
        ))}

      </div>

    </div>
  );
}

export default SupportTickets;