import "./DealValue.css";

function DealValue() {

  const dealValue = 250000;
  const probability = 80;

  const expectedRevenue =
    (dealValue * probability) / 100;

  return (
    <div className="deal-card">

      <h3>💰 Deal Forecast</h3>

      <div className="deal-grid">

        <div className="deal-box">
          <span>Deal Value</span>
          <h2>
            ₹ {dealValue.toLocaleString()}
          </h2>
        </div>

        <div className="deal-box">
          <span>Win Probability</span>
          <h2>{probability}%</h2>
        </div>

        <div className="deal-box">
          <span>Expected Revenue</span>
          <h2>
            ₹ {expectedRevenue.toLocaleString()}
          </h2>
        </div>

      </div>

    </div>
  );
}

export default DealValue;