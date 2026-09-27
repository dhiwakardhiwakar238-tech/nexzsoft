import toast from "react-hot-toast";


import React, { useState } from "react";
import "./ContactUs.css";
import { saleslead } from "../../services/api";
import { getErrorMessage } from "../../config/apiConfig";

export default function ContactUs({ openAuth }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Connect this to your backend/API
    const formData = new FormData(event.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      message: formData.get("message"),
      source: "website",
    };

    setSubmitting(true)

    try { 
      const response = await saleslead(data); 
    
      console.log("Sales lead saved:", response); 
    
      setSubmitted(true); 

    } catch (error) { 
    
      console.error("Failed to save sales lead:", error); 
    
      toast.error(getErrorMessage(error)); 
    
    } finally {
      setSubmitting(false)
    }
  };

  return (
    <main className="contact-page">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="contact-hero">
        <div className="contact-container">
          <div className="contact-hero-content">
            <span className="contact-eyebrow">CONTACT NEXZSOFT</span>

            <h1>
              Let's build better
              <span> customer experiences.</span>
            </h1>

            <p>
              Have a question, need help with Nexzsoft, or want to explore
              how AI-powered customer engagement can work for your business?
              We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CONTENT
      ===================================================== */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-layout">
            {/* LEFT */}
            <div className="contact-info">
              <span className="section-label">GET IN TOUCH</span>

              <h2>
                We're ready
                <br />
                to help.
              </h2>

              <p>
                Whether you're evaluating Nexzsoft, need assistance with your
                account, or simply want to learn more, send us a message and
                our team will get back to you.
              </p>

              {/* Email */}
              <a
                href="mailto:support@nexzsoft.com"
                className="contact-email-card"
              >
                <div className="email-icon">
                  @
                </div>

                <div>
                  <span>Email us</span>
                  <strong>support@nexzsoft.com</strong>
                </div>

                <span className="email-arrow">↗</span>
              </a>

              {/* Support note */}
              <div className="contact-note">
                <span className="note-icon">✦</span>

                <div>
                  <strong>Need product support?</strong>
                  <p>
                    Our support team can help with account setup,
                    integrations, WhatsApp configuration, and product
                    questions.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT - FORM */}
            <div className="contact-form-wrapper">
              {submitted ? (
                <div className="contact-success">
                  <div className="success-icon">✓</div>

                  <h3>Thanks for reaching out.</h3>

                  <p>
                    We've received your message. A member of the Nexzsoft
                    team will review it and get back to you shortly.
                  </p>

                  <button
                    className="success-back-btn"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                >
                  <div className="form-heading">
                    <span className="section-label">SEND A MESSAGE</span>

                    <h3>How can we help?</h3>

                    <p>
                      Share a few details and we'll connect with you.
                    </p>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-name">
                      Full name
                    </label>

                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="contact-email">
                        Email address
                      </label>

                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="contact-whatsapp">
                        WhatsApp number
                      </label>

                      <input
                        id="contact-whatsapp"
                        name="whatsapp"
                        type="tel"
                        placeholder="+91 79040 09090"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-message">
                      How can we help?
                    </label>

                    <textarea
                      id="contact-message"
                      name="message"
                      rows="6"
                      placeholder="Tell us about your question, requirement, or how we can help..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="contact-submit"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send message"}
                    <span>→</span>
                  </button>

                  <p className="form-disclaimer">
                    By submitting this form, you agree that Nexzsoft may
                    contact you regarding your request.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}
      <section className="contact-bottom">
        <div className="contact-container">
          <div className="contact-bottom-inner">
            <div>
              <span className="section-label">
                NEXZSOFT
              </span>

              <h2>
                Turn every conversation into an opportunity.
              </h2>

              <p>
                Bring AI, automation, WhatsApp, social channels, and human
                support together in one customer engagement platform.
              </p>
            </div>

            <button
              type="button"
              className="contact-cta"
              onClick={openAuth}
            >
              Start Free
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}