import "./CustomerProfileDrawer.css";

function CustomerProfileDrawer({
  customer,
  closeDrawer
}) {

  if (!customer) return null;

  return (
    <div className="profile-overlay">

      <div className="profile-drawer">

        <button
          className="close-btn"
          onClick={closeDrawer}
        >
          ✖
        </button>

        <h2>{customer.name}</h2>

        <div className="profile-card">
          <h4>Company</h4>
          <p>{customer.company}</p>
        </div>

        <div className="profile-card">
          <h4>Email</h4>
          <p>{customer.email}</p>
        </div>

        <div className="profile-card">
          <h4>Phone</h4>
          <p>{customer.phone}</p>
        </div>

        <div className="profile-card">
          <h4>Lead Score</h4>
          <p>92 / 100</p>
        </div>

        <div className="profile-card">
          <h4>Churn Risk</h4>
          <p>18%</p>
        </div>

        <div className="profile-card">
          <h4>Revenue</h4>
          <p>₹1,25,000</p>
        </div>

        <div className="profile-card">
          <h4>Last Activity</h4>
          <p>2 hours ago</p>
        </div>

      </div>

    </div>
  );
}

export default CustomerProfileDrawer;