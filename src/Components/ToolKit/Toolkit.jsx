
import React from "react";
import "./Toolkit.css";

const toolkitCategories = [
  {
    label: "GET STARTED",
    title: "Start with Nexzsoft",
    description:
      "Essential resources to understand the platform, set up your workspace, and start engaging with customers.",
    tools: [
      {
        type: "GUIDE",
        title: "Nexzsoft Getting Started Guide",
        description:
          "Learn the basics of your workspace, channels, inbox, automation, and customer engagement.",
        action: "Read Guide",
        href: "#",
      },
      {
        type: "TUTORIAL",
        title: "Set Up Your Workspace",
        description:
          "Follow the essential steps to configure your business and prepare Nexzsoft for your team.",
        action: "View Tutorial",
        href: "#",
      },
      {
        type: "RESOURCE",
        title: "Nexzsoft Help Center",
        description:
          "Find answers, product guidance, setup information, and practical solutions.",
        action: "Visit Help Center",
        href: "#",
      },
    ],
  },
  {
    label: "MESSAGING",
    title: "WhatsApp & Customer Messaging",
    description:
      "Resources to help you connect messaging channels and build better customer conversations.",
    tools: [
      {
        type: "GUIDE",
        title: "WhatsApp Business Setup",
        description:
          "Understand the steps involved in connecting your WhatsApp Business account with Nexzsoft.",
        action: "Read Guide",
        href: "#",
      },
      {
        type: "TUTORIAL",
        title: "WhatsApp Templates",
        description:
          "Learn how message templates work and how to create effective customer communication.",
        action: "View Tutorial",
        href: "#",
      },
      {
        type: "RESOURCE",
        title: "Meta Business Resources",
        description:
          "Useful official resources for WhatsApp Business Platform and Meta business products.",
        action: "Explore Resources",
        href: "#",
      },
    ],
  },
  {
    label: "AI & AUTOMATION",
    title: "Build smarter customer experiences",
    description:
      "Learn how AI, automation, workflows, and knowledge can help your business respond faster.",
    tools: [
      {
        type: "GUIDE",
        title: "AI Customer Support",
        description:
          "Understand how AI can answer customer questions and assist your support team.",
        action: "Read Guide",
        href: "#",
      },
      {
        type: "TUTORIAL",
        title: "Knowledge & AI Responses",
        description:
          "Learn how business information can be used to provide more relevant AI-powered responses.",
        action: "View Tutorial",
        href: "#",
      },
      {
        type: "GUIDE",
        title: "Workflow Automation",
        description:
          "Discover ways to automate repetitive customer communication and business processes.",
        action: "Explore Guide",
        href: "#",
      },
    ],
  },
];

const quickResources = [
  {
    number: "01",
    title: "Documentation",
    description:
      "Product documentation, configuration guides, and technical references.",
    action: "Open Documentation",
    href: "#",
  },
  {
    number: "02",
    title: "API & Developer Resources",
    description:
      "Resources for developers working with APIs, webhooks, and integrations.",
    action: "Explore Developer Resources",
    href: "#",
  },
  {
    number: "03",
    title: "Integration Guides",
    description:
      "Learn how Nexzsoft can work with your existing business tools and platforms.",
    action: "View Integrations",
    href: "#",
  },
  {
    number: "04",
    title: "FAQs",
    description:
      "Quick answers to common questions about Nexzsoft and customer engagement.",
    action: "View FAQs",
    href: "#",
  },
];

function Toolkit() {
  return (
    <main className="toolkit-page">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="toolkit-hero">
        <div className="toolkit-container">
          <div className="toolkit-hero-content">
            <span className="toolkit-eyebrow">
              NEXZSOFT TOOLKIT
            </span>

            <h1>
              Resources to help you
              <span> get more from Nexzsoft.</span>
            </h1>

            <p>
              Explore tutorials, guides, documentation, and useful resources
              designed to help you set up Nexzsoft, connect your channels,
              automate customer conversations, and build better experiences.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK RESOURCES
      ===================================================== */}
      <section className="toolkit-quick">
        <div className="toolkit-container">
          <div className="toolkit-section-heading">
            <span className="section-label">QUICK ACCESS</span>

            <h2>Everything you need, in one place.</h2>

            <p>
              Start with the resources that match what you're trying to
              accomplish.
            </p>
          </div>

          <div className="quick-grid">
            {quickResources.map((resource) => (
              <a
                href={resource.href}
                className="quick-card"
                key={resource.number}
              >
                <span className="quick-number">
                  {resource.number}
                </span>

                <h3>{resource.title}</h3>

                <p>{resource.description}</p>

                <span className="toolkit-link">
                  {resource.action}
                  <span>→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          TOOLKIT CATEGORIES
      ===================================================== */}
      {toolkitCategories.map((category) => (
        <section className="toolkit-category" key={category.title}>
          <div className="toolkit-container">
            <div className="category-header">
              <div>
                <span className="section-label">
                  {category.label}
                </span>

                <h2>{category.title}</h2>
              </div>

              <p>{category.description}</p>
            </div>

            <div className="resource-grid">
              {category.tools.map((tool) => (
                <a
                  href={tool.href}
                  className="resource-card"
                  key={tool.title}
                >
                  <div className="resource-top">
                    <span className="resource-type">
                      {tool.type}
                    </span>

                    <span className="resource-arrow">↗</span>
                  </div>

                  <h3>{tool.title}</h3>

                  <p>{tool.description}</p>

                  <span className="resource-action">
                    {tool.action}
                    <span>→</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* =====================================================
          EXTERNAL RESOURCES
      ===================================================== */}
      <section className="external-section">
        <div className="toolkit-container">
          <div className="external-inner">
            <div>
              <span className="section-label">
                USEFUL RESOURCES
              </span>

              <h2>
                Go beyond Nexzsoft.
              </h2>

              <p>
                We've collected useful resources from platforms and
                technologies that are commonly used alongside Nexzsoft.
              </p>
            </div>

            <div className="external-list">
              <a href="#" className="external-item">
                <div>
                  <strong>Meta Business</strong>
                  <span>
                    WhatsApp and Meta business resources
                  </span>
                </div>

                <span>↗</span>
              </a>

              <a href="#" className="external-item">
                <div>
                  <strong>WhatsApp Business Platform</strong>
                  <span>
                    Messaging platform documentation and guidance
                  </span>
                </div>

                <span>↗</span>
              </a>

              <a href="#" className="external-item">
                <div>
                  <strong>Developer Resources</strong>
                  <span>
                    APIs, webhooks, integrations, and technical resources
                  </span>
                </div>

                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="toolkit-cta">
        <div className="toolkit-container">
          <div className="toolkit-cta-inner">
            <div>
              <span className="section-label">
                NEED MORE HELP?
              </span>

              <h2>
                Can't find what you're looking for?
              </h2>

              <p>
                Our team can help you understand Nexzsoft, choose the right
                setup, or answer questions about your customer engagement
                requirements.
              </p>
            </div>

            <div className="toolkit-cta-actions">
              <a href="/contact" className="toolkit-primary-btn">
                Contact Support
                <span>→</span>
              </a>

              <a
                href="mailto:support@nexzsoft.com"
                className="toolkit-secondary-btn"
              >
                support@nexzsoft.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Toolkit;
