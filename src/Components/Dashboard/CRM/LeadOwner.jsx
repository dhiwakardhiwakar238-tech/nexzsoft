import "./LeadOwner.css";

function LeadOwner() {

  const owner = {
    name: "John David",
    department: "Enterprise Sales",
    email: "john@nexzsoft.com",
    lastActivity: "2 Hours Ago",
  };

  return (
    <div className="owner-card">

      <h3>👨‍💼 Lead Owner</h3>

      <div className="owner-profile">

        <div className="owner-avatar">
          JD
        </div>

        <div>
          <h4>{owner.name}</h4>
          <p>{owner.department}</p>
        </div>

      </div>

      <div className="owner-info">
        <span>Email</span>
        <strong>{owner.email}</strong>
      </div>

      <div className="owner-info">
        <span>Last Activity</span>
        <strong>{owner.lastActivity}</strong>
      </div>

    </div>
  );
}

export default LeadOwner;