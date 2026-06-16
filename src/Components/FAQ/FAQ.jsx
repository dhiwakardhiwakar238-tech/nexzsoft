import "./FAQ.css";

function FAQ() {
  const faqs = [
    {
      q: "What is Nexzsoft?",
      a: "Nexzsoft is an AI-powered customer engagement platform that unifies conversations across multiple channels.",
    },
    {
      q: "Which channels are supported?",
      a: "WhatsApp, Facebook, Instagram, Telegram, and more.",
    },
    {
      q: "Can I train the AI with my data?",
      a: "Yes. You can upload documents and build your own knowledge base.",
    },
    {
      q: "Does Nexzsoft support analytics?",
      a: "Yes. Real-time analytics and reporting are included.",
    },
  ];

  return (
    <section className="faq-section">
      <div className="faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>
          Find answers to common questions about Nexzsoft.
        </p>
      </div>

      <div className="faq-container">
        {faqs.map((item, index) => (
          <div className="faq-card" key={index}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;