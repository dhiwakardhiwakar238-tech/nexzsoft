import "./Pricing.css";

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      features: [
        "1 WhatsApp Number",
        "Basic AI Chatbot",
        "1000 Messages / Month",
        "Email Support",
      ],
    },
    {
      name: "Professional",
      price: "$99",
      popular: true,
      features: [
        "5 WhatsApp Numbers",
        "Advanced AI",
        "Unlimited Messages",
        "Analytics Dashboard",
        "Priority Support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited Channels",
        "Custom AI Training",
        "API Access",
        "Dedicated Manager",
      ],
    },
  ];

  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h2>Simple & Transparent Pricing</h2>
        <p>
          Choose the plan that fits your business needs.
        </p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`pricing-card ${
              plan.popular ? "popular" : ""
            }`}
          >
            {plan.popular && (
              <span className="badge">
                Most Popular
              </span>
            )}

            <h3>{plan.name}</h3>

            <div className="price">
              {plan.price}
              {plan.price !== "Custom" && (
                <span>/month</span>
              )}
            </div>

            <ul>
              {plan.features.map((item, i) => (
                <li key={i}>✔ {item}</li>
              ))}
            </ul>

            <button className="plan-btn">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;