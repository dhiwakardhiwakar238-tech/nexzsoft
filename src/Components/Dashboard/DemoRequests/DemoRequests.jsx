import "./DemoRequests.css";

function DemoRequests() {
  const demoRequests =
    JSON.parse(
      localStorage.getItem("demoRequests")
    ) || [];

  return (
    <div className="demo-page">
      <h1>📋 Demo Requests</h1>

      <div className="demo-table">

        <div className="demo-head">
          <span>Name</span>
          <span>Company</span>
          <span>Mobile</span>
          <span>Email</span>
        </div>

        {demoRequests.length === 0 ? (
          <p>No demo requests yet.</p>
        ) : (
          demoRequests.map((item, index) => (
            <div
              className="demo-row"
              key={index}
            >
              <span>{item.name}</span>
              <span>{item.company}</span>
              <span>{item.mobile}</span>
              <span>{item.email}</span>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default DemoRequests;