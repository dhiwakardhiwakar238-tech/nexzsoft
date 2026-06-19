import "./WhyChooseUs.css";

function WhyChooseUs() {
  const items = [
    {
      title: "Enterprise Security",
      desc: "Your business data is protected with modern security practices and monitoring.",
    },
    {
      title: "AI Powered Automation",
      desc: "Automate repetitive tasks and improve productivity using smart workflows.",
    },
    {
      title: "Scalable Solutions",
      desc: "Built to grow with your business, from startup to enterprise level.",
    },
    {
      title: "24/7 Support",
      desc: "Our team is available whenever you need assistance.",
    },
  ];

  return (
    <section className="why-choose-us">
      <div className="container">
        <h2>Why Choose Nexzsoft?</h2>
        <p className="subtitle">
          We help businesses streamline operations, improve customer engagement,
          and accelerate growth through technology.
        </p>

        <div className="why-grid">
          {items.map((item, index) => (
            <div className="why-card" key={index}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;