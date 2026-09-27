import "./Solutions.css";
import {
  FaWhatsapp,
  FaFacebookMessenger,
  FaInstagram,
  FaGlobe,
  FaCheckCircle,
  FaTelegramPlane
} from "react-icons/fa";

import { MdSms } from "react-icons/md";

const solutions = [
  {
    title: "WhatsApp Business",
    icon: <FaWhatsapp/>,
    description:
      "Deliver intelligent customer engagement through the official WhatsApp Business Platform.",
    features: [
      "Collaborative Inbox",
      "AI-Powered Conversations",
      "Broadcast Campaigns",
      "WhatsApp Flows",
      "Workflow Automation",
      "Subscriber Management",
      "Enterprise-grade Analytics"
    ]
  },
  {
    title: "Facebook Messenger",
    icon: <FaFacebookMessenger />,
    description:
      "Transform your Facebook presence with AI-powered engagement to deliver smarter experiences.",
    features: [
        "Automated Publishing",
        "Messenger & Comments",
        "Business Leads",
        "Lead Management",
        "Workflow Automation",
        "Performance Insights"
    ]
  },
  {
    title: "Instagram Messaging",
    icon: <FaInstagram />,
    description:
      "Convert Instagram posts and conversations into business opportunities through AI engagement.",
    features: [
      "DM Management",
      "Story Replies",
      "Auto Post & Reel Publishing",
      "Comment Moderation",
      "Audience Engagement",
      "Customer Profile",
      "Business Insights"
    ]
  },
  {
    title: "Website Live Chat",
    icon: <FaGlobe />,
    description:
      "Provide real-time customer support on your website using live chat, AI chatbots, proactive engagement, and visitor insights.",
    features: [
      "Live Chat",
      "AI Chatbot",
      "Visitor Tracking",
      "File Sharing",
      "CRM Sync",
      "Chat History"
    ]
  },
  {
    title: "Telegram Business",
    icon: <FaTelegramPlane />,
    description:
      "Support customers through Telegram with secure messaging, automation, shared inbox, and business workflow integrations.",
    features: [
      "Telegram Inbox",
      "Bot Support",
      "Automation",
      "Shared Workspace",
      "Notifications",
      "Analytics"
    ]
  },
  {
    title: "RCS Business Messaging",
    icon: <MdSms />,
    description:
      "Deliver rich, interactive messaging experiences with branded communications, multimedia content, and customer engagement at scale.",
    features: [
      "Rich Cards",
      "Interactive Buttons",
      "Media Messages",
      "Verified Business",
      "Delivery Reports",
      "Insights"
    ]
  }
];

export default function Solutions() {
  return (
    <section className="solutions">
      <div className="solutions-grid">
        {solutions.map((item) => (
          <div className="solution-card" key={item.title}>

            <div className="card-top">
              <div className="icon">{item.icon}</div>
            </div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>

            <div className="feature-title">
              Key Features
            </div>

            <ul>
              {item.features.map((feature) => (
                <li key={feature}>
                  <span><FaCheckCircle / ></span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="coming-soon-btn">
              <button>
                Learn More →
              </button>

              <span className="tooltip">
                Coming Soon
              </span>
            </div>

          </div>
        ))}
      </div>
      
    </section>
  );
}