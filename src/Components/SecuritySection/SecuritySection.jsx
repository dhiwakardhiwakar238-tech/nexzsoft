import "./SecuritySection.css";
import {
  FaPlug,
  FaStore,
  FaComments,
  FaChartLine,
} from "react-icons/fa";

function SecuritySection() {
  const steps = [
    {
      icon: <FaPlug />,
      number: "01",
      title: "Connect Your Channels",
      desc: "Bring WhatsApp, Facebook, Instagram, and your other communication channels into one platform.",
    },
    {
      icon: <FaStore />,
      number: "02",
      title: "Set Up Your Business",
      desc: "Customize your workspace, configure your AI assistant, and tailor the platform to your business needs.",
    },
    {
      icon: <FaComments />,
      number: "03",
      title: "Engage Your Customers",
      desc: "Respond faster, automate routine conversations, and provide seamless customer support from one place.",
    },
    {
      icon: <FaChartLine />,
      number: "04",
      title: "Measure & Improve",
      desc: "Track customer engagement, identify opportunities, and continuously enhance customer experiences with actionable insights.",
    },
  ];

  return (
    <section className="security-section">
      <div className="container">

        <h2>How It Works</h2>

        <p className="subtitle">
          Get Started in Minutes
        </p>

        <p className="intro">
          A simple process designed to help businesses of every size engage
          customers faster and grow with confidence.
        </p>

        <div className="security-grid">
          {steps.map((step, index) => (
            <div className="security-card" key={index}>

              <div className="step-number">{step.number}</div>

              <div className="step-icon">
                {step.icon}
              </div>

              <h3>{step.title}</h3>

              <p>{step.desc}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default SecuritySection;