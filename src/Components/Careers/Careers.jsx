
import toast from "react-hot-toast";

import React, { useState } from "react";
import "./Careers.css";
import { saleslead } from "../../services/api";
import { getErrorMessage } from "../../config/apiConfig";

const opportunities = [
  {
    title: "AI & Machine Learning",
    description:
      "Build intelligent customer experiences using LLMs, RAG, AI agents, and automation.",
    tag: "AI",
  },
  {
    title: "Software Engineering",
    description:
      "Design reliable, scalable products that power customer communication for growing businesses.",
    tag: "Engineering",
  },
  {
    title: "Product & Design",
    description:
      "Create intuitive enterprise experiences that make complex communication workflows simple.",
    tag: "Product",
  },
  {
    title: "Customer Success",
    description:
      "Help businesses get measurable value from Nexzsoft and build long-term customer relationships.",
    tag: "Customer Success",
  },
];

export default function Careers() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      message: "Career application submitted from the Nexzsoft Careers page.",
      source: "career",
    };

    setSubmitting(true);

    try {
      const response = await saleslead(data);

      console.log("Career application saved:", response);

      setSubmitted(true);
      event.target.reset();
    } catch (error) {
      console.error("Failed to save career application:", error);

      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="careers-page">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="careers-hero">
        <div className="careers-container">
          <div className="careers-hero-content">
            <span className="careers-eyebrow">CAREERS AT NEXZSOFT</span>

            <h1>
              Build the future of
              <span> customer engagement.</span>
            </h1>

            <p>
              We're building technology that helps businesses communicate
              smarter, respond faster, and create better customer experiences
              with AI.
            </p>

            <a href="#opportunities" className="careers-hero-link">
              Explore opportunities <span>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY NEXZSOFT
      ===================================================== */}
      <section className="careers-intro">
        <div className="careers-container">
          <div className="careers-intro-grid">
            <div>
              <span className="section-label">WHY NEXZSOFT</span>

              <h2>
                Work on problems that
                <span> matter to businesses.</span>
              </h2>
            </div>

            <div className="careers-intro-copy">
              <p>
                Customer communication is changing rapidly. Businesses need
                more than another messaging tool—they need intelligent systems
                that understand conversations, automate repetitive work, and
                help teams deliver exceptional customer experiences.
              </p>

              <p>
                At Nexzsoft, you'll work on products at the intersection of
                AI, automation, communication, and SaaS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          VALUES
      ===================================================== */}
      <section className="careers-values">
        <div className="careers-container">
          <div className="section-heading">
            <span className="section-label">HOW WE WORK</span>
            <h2>Build with purpose.</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-number">01</div>
              <h3>Customer first</h3>
              <p>
                We start with the customer problem and work backwards to build
                solutions that create real business value.
              </p>
            </div>

            <div className="value-card">
              <div className="value-number">02</div>
              <h3>Think boldly</h3>
              <p>
                We challenge assumptions, explore new technology, and look for
                better ways to solve difficult problems.
              </p>
            </div>

            <div className="value-card">
              <div className="value-number">03</div>
              <h3>Own the outcome</h3>
              <p>
                We take responsibility from idea to execution and measure
                ourselves by the impact we create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OPPORTUNITIES
      ===================================================== */}
      <section className="opportunities-section" id="opportunities">
        <div className="careers-container">
          <div className="opportunities-header">
            <div>
              <span className="section-label">OPPORTUNITIES</span>
              <h2>Find your place at Nexzsoft.</h2>
            </div>

            <p>
              We're always interested in meeting talented people who want to
              build meaningful technology.
            </p>
          </div>

          <div className="opportunities-list">
            {opportunities.map((opportunity) => (
              <div className="opportunity-card" key={opportunity.title}>
                <div className="opportunity-main">
                  <span className="opportunity-tag">
                    {opportunity.tag}
                  </span>

                  <h3>{opportunity.title}</h3>

                  <p>{opportunity.description}</p>
                </div>

                <span className="opportunity-arrow">↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          APPLICATION FORM
      ===================================================== */}
      <section className="career-application">
        <div className="careers-container">
          <div className="application-card">
            <div className="application-content">
              <span className="section-label">JOIN OUR TEAM</span>

              <h2>
                Don't see the right opportunity?
              </h2>

              <p>
                Tell us a little about yourself. If your skills and interests
                align with what we're building, our team will get in touch.
              </p>

              <div className="application-note">
                <span>✦</span>
                <p>
                  We review every application and keep your information
                  confidential.
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>

                <h3>Application received</h3>

                <p>
                  Thank you for your interest in Nexzsoft. Our team will
                  review your details and contact you if there's a suitable
                  opportunity.
                </p>
              </div>
            ) : (
              <form
                className="career-form"
                onSubmit={handleSubmit}
              >
                <div className="form-field">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="whatsapp">WhatsApp number</label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="application-submit"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit application"}
                  <span>→</span>
                </button>

                <p className="form-disclaimer">
                  By submitting this form, you agree that Nexzsoft may contact
                  you regarding career opportunities.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}