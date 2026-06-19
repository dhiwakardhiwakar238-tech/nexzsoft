import "./Trusted.css";

function Trusted() {
  const companies = [
    "Google",
    "Microsoft",
    "Meta",
    "Amazon",
    "OpenAI",
    "WhatsApp",
    "Stripe",
    "Netflix",
  ];

  return (
    <section className="trusted-section">

      <div className="trusted-header">
        <span>TRUSTED WORLDWIDE</span>

        <h2>
          Trusted By Thousands Of
          Growing Businesses
        </h2>

        <p>
          Helping businesses automate customer engagement,
          increase conversions, and scale globally.
        </p>
      </div>

      <div className="logo-slider">

        <div className="logo-track">

          {companies.map((company, index) => (
            <div
              className="company-card"
              key={index}
            >
              {company}
            </div>
          ))}

          {companies.map((company, index) => (
            <div
              className="company-card"
              key={`copy-${index}`}
            >
              {company}
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Trusted;