import "./Features.css";

function Features() {
  const features = [
    {
      title: "AI Conversation Engine",
      desc: "Deliver intelligent and automated conversations using AI.",
      icon: "🤖",
    },
    {
      title: "Conversation Hub",
      desc: "Manage all customer interactions in one place.",
      icon: "💬",
    },
    {
      title: "Smart Controls",
      desc: "Configure workflows and automations effortlessly.",
      icon: "⚡",
    },
    {
      title: "Analytics",
      desc: "Track engagement and improve customer experience.",
      icon: "📊",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-header">
        <h2>Everything You Need to Grow</h2>
        <p>
          Powerful tools designed to help businesses engage,
          automate, and scale faster.
        </p>
      </div>

      <div className="features-grid">
        {features.map((item, index) => (
          <div className="feature-card" key={index}>
            <div className="icon">{item.icon}</div>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;