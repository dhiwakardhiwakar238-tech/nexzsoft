import "./RevenueIntelligence.css";

function RevenueIntelligence() {

  const metrics = [
    {
      title: "MRR",
      value: "₹ 12.4L"
    },
    {
      title: "ARR",
      value: "₹ 1.48Cr"
    },
    {
      title: "Churn Revenue",
      value: "₹ 42K"
    },
    {
      title: "Expansion Revenue",
      value: "₹ 2.1L"
    }
  ];

  return (
    <div className="revenue-card">

      <h3>
        💰 Revenue Intelligence
      </h3>

      <div className="revenue-grid">

        {metrics.map((item,index) => (

          <div
            key={index}
            className="revenue-box"
          >

            <span>{item.title}</span>

            <h2>{item.value}</h2>

          </div>

        ))}

      </div>

      <div className="forecast-card">

        <h4>
          📈 Forecast Revenue
        </h4>

        <h1>
          ₹ 18.5L
        </h1>

        <p>
          Expected next 30 days pipeline revenue
        </p>

      </div>

    </div>
  );
}

export default RevenueIntelligence;