import "./Subscription.css";

function Subscription() {
  return (
    <div className="subscription-page">

      <h1>💳 Subscription Plans</h1>

      <div className="plans-grid">

        <div className="plan-card">
          <h2>Free</h2>
          <h1>₹0</h1>

          <ul>
            <li>100 Messages</li>
            <li>Basic Analytics</li>
            <li>1 User</li>
          </ul>

          <button>Current Plan</button>
        </div>

        <div className="plan-card featured">
          <h2>Pro</h2>
          <h1>₹999/mo</h1>

          <ul>
            <li>10,000 Messages</li>
            <li>Advanced Analytics</li>
            <li>5 Users</li>
          </ul>

          <button>Upgrade</button>
        </div>

        <div className="plan-card">
          <h2>Enterprise</h2>
          <h1>Custom</h1>

          <ul>
            <li>Unlimited Messages</li>
            <li>API Access</li>
            <li>Unlimited Users</li>
          </ul>

          <button>Contact Sales</button>
        </div>

      </div>

    </div>
  );
}

export default Subscription;