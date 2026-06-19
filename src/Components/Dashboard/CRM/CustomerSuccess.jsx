import "./CustomerSuccess.css";

function CustomerSuccess() {

  const customers = [
    {
      company: "Samsung India",
      health: 92,
      renewal: "95%",
      churn: "5%",
      manager: "John David",
      revenue: "₹ 8.5L"
    },
    {
      company: "ABC Retail",
      health: 68,
      renewal: "72%",
      churn: "28%",
      manager: "Priya Sharma",
      revenue: "₹ 3.2L"
    }
  ];

  return (
    <div className="csm-card">

      <h3>
        🏢 Customer Success Management
      </h3>

      {customers.map((customer,index) => (

        <div
          key={index}
          className="customer-health-card"
        >

          <div className="customer-top">

            <h4>{customer.company}</h4>

            <div className="health-score">
              {customer.health}
            </div>

          </div>

          <div className="csm-grid">

            <div>
              <span>Renewal Chance</span>
              <h5>{customer.renewal}</h5>
            </div>

            <div>
              <span>Churn Risk</span>
              <h5>{customer.churn}</h5>
            </div>

            <div>
              <span>Account Manager</span>
              <h5>{customer.manager}</h5>
            </div>

            <div>
              <span>Revenue</span>
              <h5>{customer.revenue}</h5>
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}

export default CustomerSuccess;