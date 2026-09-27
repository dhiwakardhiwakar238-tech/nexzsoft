import "./WhyChooseUs.css";
import chatwindow from "../../assets/nexz_robo_why.png";

import {
  FaBolt,
  FaRobot,
  FaComments,
  FaCogs,
  FaChartLine,
  FaBullseye,
  FaHandshake,
  FaUsers,
  FaHeadset,
  FaShieldAlt,
  FaExpandArrowsAlt,
  FaArrowUp,
} from "react-icons/fa";

function WhyChooseUs() {
  const items = [
    {
      icon: FaBolt,
      number: "01",
      title: "Instant Customer Response",
      desc: "Never keep your customers waiting. Respond instantly to customer questions and requests with AI-powered conversations.",
    },
    {
      icon: FaRobot,
      number: "02",
      title: "Smarter AI Conversations",
      desc: "Let AI handle routine customer queries intelligently while your team focuses on conversations that need human attention.",
    },
    {
      icon: FaComments,
      number: "03",
      title: "Unified Customer Engagement",
      desc: "Bring WhatsApp, Instagram, Facebook, and other communication channels together in one powerful workspace.",
    },
    {
      icon: FaCogs,
      number: "04",
      title: "Intelligent Automation",
      desc: "Automate repetitive tasks, customer journeys, workflows, and engagement processes without adding operational complexity.",
    },
    {
      icon: FaChartLine,
      number: "05",
      title: "Actionable Insights",
      desc: "Understand customer engagement, conversations, performance, and trends so your business can make better decisions.",
    },
    {
      icon: FaBullseye,
      number: "06",
      title: "Better Lead Conversion",
      desc: "Capture, engage, and follow up with prospects faster so valuable customer opportunities do not get lost.",
    },
    {
      icon: FaHandshake,
      number: "07",
      title: "Stronger Customer Relationships",
      desc: "Turn everyday conversations into meaningful customer experiences that build trust and long-term relationships.",
    },
    {
      icon: FaUsers,
      number: "08",
      title: "Reduced Agent Workload",
      desc: "Reduce repetitive work for your support teams and allow agents to focus on complex and high-value conversations.",
    },
    {
      icon: FaHeadset,
      number: "09",
      title: "Always-On Customer Support",
      desc: "Give customers access to fast, intelligent assistance around the clock—even when your team is unavailable.",
    },
    {
      icon: FaShieldAlt,
      number: "10",
      title: "Enterprise-Grade Security",
      desc: "Protect your business operations and customer conversations with security and reliability designed for modern businesses.",
    },
  ];

  return (
    <section className="why-choose-us">
      <div className="why-container">

        {/* HEADER */}
        <div className="why-header">
          <div className="why-eyebrow">
            <span className="why-eyebrow-dot"></span>
            WHY NEXZSOFT
          </div>

          <h2>
            More than automation.
            <span> A smarter way to engage.</span>
          </h2>

          <p className="why-subtitle">
            Nexzsoft brings AI, automation, customer conversations, and
            business insights together in one unified platform—helping
            businesses respond faster, operate smarter, and grow with
            confidence.
          </p>
        </div>

        {/* VALUE + PRODUCT VISUAL */}
        <div className="why-value-section">

          {/* LEFT */}
          <div className="why-value-left">
            <span className="why-value-label">
              BUILT FOR BUSINESS OUTCOMES
            </span>

            <h3>
              Turn every customer conversation
              <span> into an opportunity.</span>
            </h3>

            <p>
              Nexzsoft is designed around what matters most to your business:
              faster responses, better customer experiences, lower operational
              effort, and measurable growth.
            </p>

            <p>
              Instead of managing disconnected tools and communication
              channels, your teams get one intelligent platform to manage,
              automate, understand, and improve every customer interaction.
            </p>

            <div className="why-value-mini">
              <div className="mini-item">
                <span className="mini-icon">
                  <FaRobot />
                </span>
                <div>
                  <strong>AI-first engagement</strong>
                  <small>
                    Intelligent conversations across customer channels.
                  </small>
                </div>
              </div>

              <div className="mini-item">
                <span className="mini-icon">
                  <FaCogs />
                </span>
                <div>
                  <strong>Built for automation</strong>
                  <small>
                    Reduce repetitive work and improve team efficiency.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — PRODUCT VISUAL */}
          <div className="why-visual">

            <div className="why-image-card">

              {/*<img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200"
                alt="Nexzsoft customer engagement platform"
              />*/}

              <img
                src={chatwindow}
                alt="Nexzsoft customer engagement platform"
              />

              {/*<div className="why-image-overlay">

                <div className="live-indicator">
                  <span></span>
                  AI ENGINE ACTIVE
                </div>

                <div className="conversation-preview">

                  <div className="conversation-icon">
                    <FaRobot />
                  </div>

                  <div className="conversation-content">
                    <small>AI ASSISTANT</small>
                    <strong>Customer query resolved</strong>
                  </div>

                  <FaArrowUp className="success-arrow" />

                </div>

              </div>*/}
            </div>

            {/* FLOATING STAT */}
            <div className="why-floating-stat">

              <div className="stat-icon">
                <FaExpandArrowsAlt />
              </div>

              <div>
                <strong>Built to scale</strong>
                <span>As your business grows</span>
              </div>

            </div>

          </div>
        </div>

        {/* BENEFITS */}
        <div className="why-grid">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div className="why-card" key={item.number}>

                <div className="why-card-top">

                  <div className="why-icon">
                    <Icon />
                  </div>

                  <span className="why-number">
                    {item.number}
                  </span>

                </div>

                <div className="why-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>

                <div className="why-card-line"></div>

              </div>
            );
          })}

        </div>

        {/* BOTTOM STATEMENT */}
        <div className="why-bottom">

          <div className="why-bottom-mark">
            N
          </div>

          <div>
            <h3>
              One platform. Smarter conversations.
              <span> Better customer experiences.</span>
            </h3>

            <p>
              Nexzsoft brings conversations, AI, automation, and customer
              insights together so your business can respond faster, operate
              more efficiently, and build stronger customer relationships.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;
