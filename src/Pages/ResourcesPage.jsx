import { Link } from "react-router-dom";
import "./ResourcesPage.css";

function ResourcesPage() {
  const resources = [
    {
      title: "Privacy Policy",
      desc: "Read our privacy and data protection policy.",
      link: "/privacy-policy",
    },
    {
      title: "Terms & Conditions",
      desc: "Understand our service terms and conditions.",
      link: "/terms",
    },
    {
      title: "API Documentation",
      desc: "Explore Nexzsoft APIs and integrations.",
      link: "/api-docs",
    },
    {
      title: "Release Notes",
      desc: "Track new features and platform updates.",
      link: "/release-notes",
    },
  ];

  return (
    <div className="resources-page">
      <h1>Resources Hub</h1>

      <div className="resources-grid">
        {resources.map((item, index) => (
          <div
            key={index}
            className="resource-card"
          >
            <h2>{item.title}</h2>

            <p>{item.desc}</p>

            <Link
              to={item.link}
              className="resource-btn"
            >
              Open
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourcesPage;