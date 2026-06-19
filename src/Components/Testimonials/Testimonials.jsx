import "./Testimonials.css";

function Testimonials() {
  const reviews = [
    {
      name: "Arun Kumar",
      company: "Tech Solutions",
      review:
        "Nexzsoft transformed our customer engagement. We saw a 40% increase in leads within weeks.",
    },
    {
      name: "Priya Sharma",
      company: "Digital Hub",
      review:
        "The automation tools saved our team hours every day. Highly recommended.",
    },
    {
      name: "Rahul Verma",
      company: "Growth Labs",
      review:
        "Excellent support and powerful AI features. The platform is easy to use and scalable.",
    },
  ];

  return (
    <section className="testimonials">
      <div className="testimonials-container">

        <div className="section-header">
          <span>⭐ Testimonials</span>
          <h2>What Our Clients Say</h2>
          <p>
            Trusted by businesses looking to scale with AI
            and automation.
          </p>
        </div>

        <div className="testimonial-grid">
          {reviews.map((item, index) => (
            <div className="testimonial-card" key={index}>
              <p className="review-text">
                "{item.review}"
              </p>

              <div className="review-user">
                <h4>{item.name}</h4>
                <span>{item.company}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;