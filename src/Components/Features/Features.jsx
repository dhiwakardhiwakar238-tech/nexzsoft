import "./Features.css";
import nexz_robo from "../../assets/nexz_robo_1.png";

function Features() {
  const features = [
    {
      number: "01",
      icon: "✦",
      title: "AI Conversation Engine",
      description:
        "Enable intelligent, context-aware conversations with advanced AI that understands intent, delivers accurate personalized responses, and engages customers naturally.",
      tag: "INTELLIGENCE",
    },
    {
      number: "02",
      icon: "◈",
      title: "Omnichannel Hub",
      description:
        "Manage customer interactions across WhatsApp, Facebook, Instagram, and more from one unified workspace for faster responses and seamless team collaboration.",
      tag: "UNIFIED COMMUNICATION",
    },
    {
      number: "03",
      icon: "↗",
      title: "Workflow Automation",
      description:
        "Automate repetitive tasks, manage broadcast templates, and streamline business workflows to deliver consistent customer experiences at scale.",
      tag: "AUTOMATION",
    },
    {
      number: "04",
      icon: "⌁",
      title: "Advanced Analytics",
      description:
        "Track customer engagement, sentiment, and operational performance with actionable insights that help teams improve satisfaction and business outcomes.",
      tag: "INSIGHTS",
    },
  ];

  const metrics = [
    {
      value: "24/7",
      title: "Support",
      description: "Customer assistance when your business needs it",
    },
    {
      value: "100%",
      title: "Instant AI First Response",
      description: "Every customer gets an immediate first interaction",
    },
    {
      value: "80%",
      title: "AI-Resolved Conversations",
      description: "Routine conversations handled automatically",
    },
    {
      value: "70%",
      title: "Reduction in Agent Workload",
      description: "Less repetitive work for your support teams",
    },
    {
      value: "3×",
      title: "More AI-Handled Interactions",
      description: "Scale conversations without scaling headcount",
    },
    {
      value: "5×",
      title: "Productivity",
      description: "Help teams accomplish more with automation",
    },
    {
      value: "3×",
      title: "More Customer Engagement",
      description: "Create more opportunities to connect and convert",
    },
    {
      value: "95%",
      title: "Customer Satisfaction",
      description: "Deliver faster and more consistent experiences",
    },
    {
      value: "40%",
      title: "Increase in Lead Conversion",
      description: "Turn more conversations into business opportunities",
    },
    {
      value: "90%",
      title: "Routine Queries Resolved by AI",
      description: "Automate common customer questions efficiently",
    },
  ];

  return (
    <section className="features-section">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="features-container">
        <div className="why-value-section">
          <div className="why-value-left">
            
            <div className="features-intro">

              <div className="features-eyebrow">
                <span className="eyebrow-line"></span>
                PLATFORM CAPABILITIES
              </div>

              <h2>
                Everything you need to build
                <b>
                <span> better customer conversations.</span>
                </b>
              </h2>

              <p>
                Nexzsoft brings AI, customer communication, automation,
                collaboration, and analytics together in one intelligent
                platform built for modern businesses.
              </p>

            </div>
          </div>

          <div className="why-visual">
          
            <div className="why-image-card">

              {/*<img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200"
                alt="Nexzsoft customer engagement platform"
              />*/}

              <img
                src={nexz_robo}
                alt="Nexzsoft customer engagement platform"
              />

            </div>
            
          </div>


        </div>

        {/* =====================================================
            FEATURE CARDS
        ===================================================== */}

        <div className="features-grid">

          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>

              <div className="feature-card-top">

                <span className="feature-number">
                  {feature.number}
                </span>

                <span className="feature-icon">
                  {feature.icon}
                </span>

              </div>

              <div className="feature-tag">
                {feature.tag}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>

              <div className="feature-arrow">
                <span>Explore capability</span>
                <strong>→</strong>
              </div>

            </article>
          ))}

        </div>


        {/* =====================================================
            BUILT TO SCALE
        ===================================================== */}

        <div className="scale-section">

          <div className="scale-header">

            <div className="scale-heading">

              <div className="features-eyebrow">
                <span className="eyebrow-line"></span>
                BUILT TO SCALE
              </div>

              <h2>
                Designed for where your
                <span> business is going.</span>
              </h2>

            </div>

            <p>
              Whether you're a startup, a growing business, or a global
              enterprise, Nexzsoft adapts to your evolving needs—helping
              you deliver exceptional customer experiences, improve
              operational efficiency, and grow with confidence.
            </p>

          </div>


          {/* =====================================================
              METRICS
          ===================================================== */}

          <div className="metrics-grid">

            {metrics.map((metric, index) => (
              <div className="metric-card" key={index}>

                <div className="metric-value">
                  {metric.value}
                </div>

                <h3>
                  {metric.title}
                </h3>

                <p>
                  {metric.description}
                </p>

              </div>
            ))}

          </div>

        </div>


        {/* =====================================================
            BOTTOM STATEMENT
        ===================================================== */}

        <div className="features-bottom">

          <div className="bottom-line"></div>

          <p>
            One platform. Intelligent conversations.
            <strong> Measurable business growth.</strong>
          </p>

          <div className="bottom-line"></div>

        </div>

      </div>

    </section>
  );
}

export default Features;