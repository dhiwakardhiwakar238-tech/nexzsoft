import toast from "react-hot-toast";
import { useState } from "react";
import "./DemoModal.css";

import {
  X,
  Sparkles,
  Building2,
  User,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

function DemoModal({ closeModal }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    mobile: "",
    email: "",
    requirement: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitDemo = () => {
    const oldData =
      JSON.parse(
        localStorage.getItem("demoRequests")
      ) || [];

    oldData.push(form);

    localStorage.setItem(
      "demoRequests",
      JSON.stringify(oldData)
    );

    toast.success("Demo Request Submitted!");

    closeModal();
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <div className="demo-modal">

        {/* =========================================
            CLOSE
        ========================================= */}

        <button
          className="close-btn"
          onClick={closeModal}
          type="button"
          aria-label="Close"
        >
          <X size={19} />
        </button>


        {/* =========================================
            HEADER
        ========================================= */}

        <div className="demo-header">

          <div className="demo-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <span className="demo-eyebrow">
              NEXZSOFT
            </span>

            <h2>
              Request a Demo
            </h2>
          </div>

        </div>


        <p className="demo-description">
          See how Nexzsoft can help your business
          automate customer conversations, improve
          engagement, and scale customer support with AI.
        </p>


        {/* =========================================
            FORM
        ========================================= */}

        <div className="demo-form">

          {/* Name */}

          <div className="demo-field">

            <label htmlFor="demo-name">
              Full Name
            </label>

            <div className="input-wrapper">

              <User size={17} />

              <input
                id="demo-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* Company */}

          <div className="demo-field">

            <label htmlFor="demo-company">
              Company Name
            </label>

            <div className="input-wrapper">

              <Building2 size={17} />

              <input
                id="demo-company"
                type="text"
                name="company"
                placeholder="Enter your company name"
                value={form.company}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* Mobile + Email */}

          <div className="demo-row">

            <div className="demo-field">

              <label htmlFor="demo-mobile">
                Mobile Number
              </label>

              <div className="input-wrapper">

                <Phone size={17} />

                <input
                  id="demo-mobile"
                  type="text"
                  name="mobile"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.mobile}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="demo-field">

              <label htmlFor="demo-email">
                Business Email
              </label>

              <div className="input-wrapper">

                <Mail size={17} />

                <input
                  id="demo-email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>


          {/* Requirement */}

          <div className="demo-field">

            <label htmlFor="demo-requirement">
              How can we help?
            </label>

            <div className="textarea-wrapper">

              <MessageSquare size={17} />

              <textarea
                id="demo-requirement"
                name="requirement"
                placeholder="Tell us briefly about your business requirements..."
                rows="4"
                value={form.requirement}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* Submit */}

          <button
            className="demo-submit"
            onClick={submitDemo}
            type="button"
          >
            <span>Request Demo</span>

            <ArrowRight size={18} />
          </button>


          {/* Trust */}

          <div className="demo-trust">

            <ShieldCheck size={16} />

            <span>
              Your information is kept confidential.
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}

export default DemoModal;