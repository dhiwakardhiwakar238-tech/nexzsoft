import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./FAQ.css";

const faqsData = [
  {
    q: "What is Nexzsoft?",
    a: "Nexzsoft is a business communication, customer engagement, AI, and automation platform designed to help businesses manage customer conversations, automate repetitive work, organize customer interactions, and build better customer experiences from one unified platform.",
    category: "General",
  },

  {
    q: "What problem does Nexzsoft solve?",
    a: "Businesses often manage customer conversations across different channels, teams, tools, and systems. Nexzsoft brings customer communication, automation, AI assistance, contact management, campaigns, workflows, and business integrations together so teams can manage customer engagement more efficiently.",
    category: "General",
  },

  {
    q: "Who is Nexzsoft built for?",
    a: "Nexzsoft is designed for businesses of different sizes and industries, including retail stores, e-commerce businesses, restaurants, clinics, salons, educational institutions, real estate companies, service businesses, agencies, and growing enterprises.",
    category: "General",
  },

  {
    q: "Is Nexzsoft only for WhatsApp?",
    a: "No. Nexzsoft is being built as an omnichannel customer engagement platform. WhatsApp Business Platform is one of the communication channels supported by Nexzsoft today, while additional channels such as Facebook Messenger, Instagram, Telegram, RCS, website chat, and other integrations are part of the platform's expanding ecosystem.",
    category: "Channels",
  },

  {
    q: "Which communication channels does Nexzsoft support?",
    a: "Nexzsoft is designed to support multiple customer communication channels through a unified platform. WhatsApp Business Platform is currently available, with additional channels and integrations such as Facebook Messenger, Instagram, Telegram, RCS, website chat, and other business communication systems being progressively added.",
    category: "Channels",
  },

  {
    q: "Can I connect my existing WhatsApp Business number?",
    a: "Yes. Businesses can connect an eligible WhatsApp Business Platform number through Nexzsoft's supported onboarding and integration process. Availability and onboarding requirements may depend on Meta and WhatsApp Business Platform requirements.",
    category: "Channels",
  },

  {
    q: "Will all my customer conversations be available in one place?",
    a: "Nexzsoft is designed around a unified customer engagement experience where conversations from supported communication channels can be managed from a centralized workspace. As additional channels become available, businesses can progressively manage more of their customer communication from one platform.",
    category: "Channels",
  },

  {
    q: "Can multiple employees manage customer conversations?",
    a: "Yes. Nexzsoft is designed for teams. Businesses can provide authorized team members with access to customer conversations, assign conversations, collaborate internally, add notes, and manage customer interactions without requiring everyone to use the same account.",
    category: "Teams",
  },

  {
    q: "What is the Nexzsoft AI assistant?",
    a: "The Nexzsoft AI assistant helps businesses respond to customers, answer frequently asked questions, understand customer requests, provide relevant information, assist with lead conversations, and handle repetitive customer interactions. Human agents can remain involved whenever their attention is required.",
    category: "AI & Automation",
  },

  {
    q: "Can I use my own business information with the AI?",
    a: "Yes. Nexzsoft can use business-provided information such as FAQs, product information, policies, service details, documents, and other approved knowledge sources to help the AI provide responses that are relevant to the business.",
    category: "AI & Automation",
  },

  {
    q: "How does Nexzsoft use my business knowledge?",
    a: "Nexzsoft can use retrieval-based AI techniques, including Retrieval-Augmented Generation (RAG), to retrieve relevant information from approved business knowledge sources when generating responses. This allows the AI to use current business information without requiring the underlying AI model to be retrained for every business.",
    category: "AI & Automation",
  },

  {
    q: "Can I automate customer conversations?",
    a: "Yes. Nexzsoft is designed to help businesses automate repetitive customer interactions such as greetings, frequently asked questions, lead collection, customer routing, follow-ups, notifications, appointment-related interactions, and other business workflows.",
    category: "AI & Automation",
  },

  {
    q: "Can AI conversations be transferred to a human?",
    a: "Yes. Nexzsoft is designed to support human handover when a conversation requires human judgment, specialized assistance, sales involvement, customer support, or other intervention.",
    category: "AI & Automation",
  },

  {
    q: "Can Nexzsoft send customer campaigns and broadcasts?",
    a: "Yes. Nexzsoft supports business communication campaigns through supported channels and applicable platform rules. For WhatsApp, businesses can use eligible and approved WhatsApp message templates for appropriate customer communications.",
    category: "Campaigns",
  },

  {
    q: "Can I schedule campaigns?",
    a: "Nexzsoft is designed to support scheduled business communications, allowing businesses to plan customer notifications, campaigns, reminders, follow-ups, and other communications according to their operational requirements and the rules of the connected communication platform.",
    category: "Campaigns",
  },

  {
    q: "Can Nexzsoft manage customer contacts?",
    a: "Yes. Nexzsoft provides customer and contact management capabilities so businesses can organize customer information, maintain contact records, use labels or segments, and use customer data as part of supported communication and automation workflows.",
    category: "Customers",
  },

  {
    q: "Can I organize customers into groups or segments?",
    a: "Yes. Businesses can organize customers using supported labels, segmentation, and audience-management capabilities. This helps businesses target relevant customer groups for communication, campaigns, automation, and follow-up activities.",
    category: "Customers",
  },

  {
    q: "Can Nexzsoft integrate with other business systems?",
    a: "Yes. Nexzsoft is designed with integrations in mind and can connect with external systems through APIs, webhooks, and supported integrations. Depending on the integration, this can include CRM systems, ERP platforms, e-commerce systems, payment services, websites, and other business applications.",
    category: "Integrations",
  },

  {
    q: "Can Nexzsoft be used by agencies or businesses with multiple brands?",
    a: "Yes. Nexzsoft is designed to support businesses that manage multiple brands, business units, branches, or customer environments. Its multi-tenant architecture allows business data and access to be logically separated between organizations.",
    category: "Teams",
  },

  {
    q: "Do I need technical knowledge to use Nexzsoft?",
    a: "No. Nexzsoft is designed to make customer engagement, AI assistance, and automation accessible to business teams without requiring them to be software developers. Advanced integrations may require technical configuration depending on the system being connected.",
    category: "General",
  },

  {
    q: "Is Nexzsoft suitable for small businesses as well as enterprises?",
    a: "Yes. Nexzsoft is designed to scale with businesses. A small business can use it to organize customer conversations and automate repetitive tasks, while larger organizations can use team management, integrations, automation, AI, campaigns, and centralized customer engagement capabilities.",
    category: "General",
  },

  {
    q: "How secure is Nexzsoft?",
    a: "Security is a core consideration in the design of Nexzsoft. The platform uses appropriate technical and organizational safeguards such as authenticated access, controlled permissions, secure communications, tenant-level data separation, and security monitoring practices. Security measures may evolve as the platform and infrastructure develop.",
    category: "Security",
  },

  {
    q: "Does Nexzsoft sell customer or business data?",
    a: "No. Nexzsoft does not sell, rent, or trade customer personal information or business data for advertising or unrelated commercial purposes. Information is processed to provide, secure, maintain, and improve the Services and as otherwise described in our Privacy Policy.",
    category: "Security",
  },

  {
    q: "How does Nexzsoft handle third-party platforms?",
    a: "Nexzsoft may connect with third-party platforms and services to provide specific functionality. These connections operate according to the permissions granted by the business and the applicable policies, terms, APIs, and requirements of the connected provider.",
    category: "Integrations",
  },

  {
    q: "Is Nexzsoft responsible for third-party platform policies?",
    a: "Businesses using Nexzsoft with third-party platforms remain responsible for complying with the applicable policies, terms, messaging requirements, consent requirements, and usage rules of those platforms. Nexzsoft provides tools to help businesses manage their communication workflows but does not override third-party platform requirements.",
    category: "Security",
  },

  {
    q: "Can Nexzsoft replace my customer support team?",
    a: "Nexzsoft is designed to assist and augment customer support teams rather than require businesses to eliminate human support. AI and automation can handle repetitive interactions while human agents can take over conversations that require judgment, empathy, specialized knowledge, or human decision-making.",
    category: "AI & Automation",
  },

  {
    q: "Can Nexzsoft help generate leads?",
    a: "Yes. Nexzsoft can help businesses engage prospects, answer questions, collect relevant information, qualify conversations, route leads, and support follow-up workflows through supported communication and automation features.",
    category: "AI & Automation",
  },

  {
    q: "Can Nexzsoft help with customer retention and follow-ups?",
    a: "Yes. Businesses can use customer data, campaigns, automation, reminders, and follow-up workflows to maintain ongoing customer engagement and improve retention activities.",
    category: "Campaigns",
  },

  {
    q: "Does Nexzsoft provide analytics?",
    a: "Nexzsoft is designed to provide business insights through analytics and reporting capabilities covering areas such as customer conversations, engagement, campaigns, team activity, automation, and other operational metrics available within the platform.",
    category: "Analytics",
  },

  {
    q: "How quickly can I get started with Nexzsoft?",
    a: "The time required depends on the business, communication channels, integrations, and configuration required. Basic onboarding can be straightforward, while advanced AI knowledge bases, workflows, integrations, and business configurations may require additional setup.",
    category: "Getting Started",
  },

  {
    q: "Does Nexzsoft offer a free trial?",
    a: "Trial availability, features, limits, and eligibility may vary depending on the plan and offering available at the time. Please refer to the current pricing or contact our team for the latest information.",
    category: "Getting Started",
  },

  {
    q: "What support does Nexzsoft provide?",
    a: "Nexzsoft provides support through available documentation, onboarding assistance, customer support channels, product guidance, and other support options depending on the customer's plan and requirements.",
    category: "Getting Started",
  },

  {
    q: "Where can I learn more about Nexzsoft?",
    a: "You can explore the Nexzsoft website, product information, resources, documentation, and contact our team to understand how Nexzsoft can fit your business communication, customer engagement, AI, and automation requirements.",
    category: "Getting Started",
  },
];

const categories = [
  "All",
  "General",
  "AI & Automation",
  "Channels",
  "Customers",
  "Teams",
  "Campaigns",
  "Integrations",
  "Security",
  "Analytics",
  "Getting Started",
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs =
    activeCategory === "All"
      ? faqsData
      : faqsData.filter(
          (item) => item.category === activeCategory
        );

  return (
    <section className="faq-section">

      <div className="faq-header">

        <div className="faq-badge">
          <span>⚡ Got Questions?</span>
        </div>

        <h2>
          Frequently Asked Questions
        </h2>

        <p>
          Everything you need to understand Nexzsoft,
          from customer engagement and AI to automation,
          integrations, and the future of omnichannel communication.
        </p>

        <div className="category-pills">

          {categories.map((cat) => (

            <button
              key={cat}
              type="button"
              className={`pill ${
                activeCategory === cat ? "active" : ""
              }`}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
            >
              {cat}
            </button>

          ))}

        </div>

      </div>

      <div className="faq-scroll-wrapper">

        <div className="faq-container">

          {filteredFaqs.map((item, index) => {

            const isOpen = openIndex === index;

            return (

              <div
                className={`faq-card ${
                  isOpen ? "open" : ""
                }`}
                key={`${item.category}-${item.q}`}
                onClick={() => toggleAccordion(index)}
              >

                <div className="faq-question">

                  <h3>
                    {item.q}
                  </h3>

                  <div className="icon-wrapper">

                    <ChevronDown
                      size={20}
                      className={`chevron ${
                        isOpen ? "rotated" : ""
                      }`}
                    />

                  </div>

                </div>

                <div className="faq-answer">

                  <div className="faq-answer-inner">

                    <p>
                      {item.a}
                    </p>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}

export default FAQ;