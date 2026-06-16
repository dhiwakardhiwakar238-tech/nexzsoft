import "./Trusted.css";

function Trusted() {
  const companies = [
    "Google",
    "Meta",
    "OpenAI",
    "Microsoft",
    "WhatsApp",
    "Amazon",
  ];

  return (
    <section className="trusted-section">
      <h2>Trusted by 10,000+ Businesses</h2>

      <div className="trusted-grid">
        {companies.map((company, index) => (
          <div className="company-card" key={index}>
            {company}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Trusted;