import "./Testimonials.css";

import {
  FaQuoteLeft,
  FaStar,
  FaArrowRight,
  FaChartLine,
  FaRobot,
} from "react-icons/fa";

function Testimonials() {
  const reviews = [
    {
      name: "Arun Kumar",
      role: "Business Owner",
      company: "Tech Solutions",
      review:
        "Nexzsoft transformed the way we manage customer conversations. AI handles routine questions instantly while our team focuses on customers who need personal attention.",
      metric: "+40%",
      metricText: "Lead engagement",
    },
    {
      name: "Priya Sharma",
      role: "Operations Manager",
      company: "Digital Hub",
      review:
        "The biggest difference for us is the amount of manual work we've eliminated. Our team can manage significantly more conversations without increasing operational effort.",
      metric: "70%",
      metricText: "Less repetitive work",
    },
    {
      name: "Rahul Verma",
      role: "Growth Lead",
      company: "Growth Labs",
      review:
        "Nexzsoft gives us a much clearer view of our customer conversations. The combination of AI, automation, and analytics makes the platform extremely valuable for our growth.",
      metric: "3×",
      metricText: "More engagement",
    },
  ];

  return (
    <section className="testimonials">

      <div className="testimonials-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="testimonial-header">

          <div className="testimonial-eyebrow">
            <span className="eyebrow-dot"></span>
            CUSTOMER STORIES
          </div>

          <h2>
            Built to make every
            <span> conversation count.</span>
          </h2>

          <p>
            Businesses use Nexzsoft to respond faster, automate routine
            conversations, reduce operational effort, and create better
            customer experiences at scale.
          </p>

        </div>


        {/* =====================================================
            FEATURED TRUST VISUAL
        ===================================================== */}

        <div className="testimonial-feature">

          {/* LEFT — PRODUCT VISUAL */}

          <div className="testimonial-visual">

            <div className="visual-glow"></div>

            <div className="product-image">

              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200"
                alt="Business team using customer engagement technology"
              />

              <div className="visual-overlay"></div>

            </div>


            {/* AI STATUS */}

            <div className="ai-status">

              <div className="ai-status-icon">
                <FaRobot />
              </div>

              <div>
                <span>AI ENGINE</span>
                <strong>Handling conversations</strong>
              </div>

              <div className="status-live">
                <span></span>
                LIVE
              </div>

            </div>


            {/* PERFORMANCE CARD */}

            <div className="performance-card">

              <div className="performance-icon">
                <FaChartLine />
              </div>

              <div className="performance-content">
                <span>Customer engagement</span>
                <strong>+32.8%</strong>
              </div>

              <FaArrowRight className="performance-arrow" />

            </div>

          </div>


          {/* RIGHT — FEATURED MESSAGE */}

          <div className="testimonial-feature-content">

            <div className="quote-icon">
              <FaQuoteLeft />
            </div>

            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <blockquote>
              "Nexzsoft has changed the way we think about customer
              engagement. Instead of simply adding another support tool,
              we now have one intelligent platform that helps us
              understand, automate, and improve every conversation."
            </blockquote>

            <div className="featured-author">

              <div className="author-avatar">
                NK
              </div>

              <div>
                <strong>Business Customer</strong>
                <span>Growing Business</span>
              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            TESTIMONIAL CARDS
        ===================================================== */}

        <div className="testimonial-grid">

          {reviews.map((item, index) => (

            <article
              className="testimonial-card"
              key={index}
            >

              <div className="card-top">

                <div className="card-stars">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

                <FaQuoteLeft className="card-quote" />

              </div>


              <p className="review-text">
                {item.review}
              </p>


              {/* RESULT */}

              <div className="review-result">

                <strong>
                  {item.metric}
                </strong>

                <span>
                  {item.metricText}
                </span>

              </div>


              {/* USER */}

              <div className="review-user">

                <div className="review-avatar">
                  {item.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>

                <div className="review-user-info">

                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    {item.role} · {item.company}
                  </span>

                </div>

              </div>

            </article>

          ))}

        </div>


        {/* =====================================================
            TRUST FOOTER
        ===================================================== */}

        <div className="testimonial-trust">

          <div className="trust-line"></div>

          <div className="trust-content">

            <span className="trust-icon">
              <FaRobot />
            </span>

            <p>
              Smarter conversations.
              <strong> Better customer experiences.</strong>
            </p>

          </div>

          <div className="trust-line"></div>

        </div>

      </div>

    </section>
  );
}

export default Testimonials;