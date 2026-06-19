import "./SecuritySection.css";

function SecuritySection() {
  const features = [
    "SSL/TLS Encryption",
    "Secure Authentication",
    "Role Based Access Control",
    "Data Protection Practices",
    "Continuous Monitoring",
    "Privacy Focused Infrastructure",
  ];

  return (
    <section className="security-section">
      <div className="container">
        <h2>Security & Compliance</h2>

        <p>
          Security is at the core of everything we build. Our systems are
          designed to protect your business and customer information.
        </p>

        <div className="security-grid">
          {features.map((feature, index) => (
            <div key={index} className="security-item">
              ✓ {feature}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SecuritySection;