import "./WhyChooseUs.css";
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
} from "react-icons/fa";

function WhyChooseUs() {
  const items = [
    {
      icon: <FaBolt />,
      title: "Instant Customer Response",
      desc: "Never keep your customers waiting.",
    },
    {
      icon: <FaRobot />,
      title: "Smarter AI Conversations",
      desc: "Stop overwhelming your support teams with routine queries.",
    },
    {
      icon: <FaComments />,
      title: "Unified Customer Engagement",
      desc: "Never switch between multiple communication platforms.",
    },
    {
      icon: <FaCogs />,
      title: "Intelligent Automation",
      desc: "Eliminate repetitive work and focus on high-value tasks.",
    },
    {
      icon: <FaChartLine />,
      title: "Actionable Insights",
      desc: "Stop guessing what your customers need.",
    },
    {
      icon: <FaBullseye />,
      title: "Better Lead Conversion",
      desc: "Never miss an opportunity to convert interested customers.",
    },
    {
      icon: <FaHandshake />,
      title: "Stronger Customer Relationships",
      desc: "Turn every customer interaction into lasting trust.",
    },
    {
      icon: <FaUsers />,
      title: "Reduced Agent Workload",
      desc: "Let your team focus on complex conversations instead of repetitive ones.",
    },
    {
      icon: <FaHeadset />,
      title: "Always-On Customer Support",
      desc: "Be available even when your business isn't.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Enterprise-Grade Security",
      desc: "Never compromise the security of your business and customer data.",
    },
  ];

  return (
    <section className="why-choose-us">
      <div className="container">

        <h2>Why Choose Nexzsoft?</h2>

        <p className="subtitle">
          Manage Everything From One Smart Platform
        </p>

        <p className="intro">
          Nexzsoft is an AI-powered, unified customer engagement platform that
          helps businesses deliver exceptional customer experiences across
          WhatsApp, Facebook, Instagram, and more. Built on transparency,
          reliable execution, and end-to-end solutions, we empower your teams,
          simplify customer engagement, and streamline business operations.
        </p>

        <p className="intro">
          Nexzsoft brings the power of AI to businesses of every size, helping
          them deliver faster, smarter, and more meaningful customer
          interactions.
        </p>

        <div className="why-grid">
          {items.map((item, index) => (
            <div className="why-card" key={index}>
              <div className="icon">{item.icon}</div>
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