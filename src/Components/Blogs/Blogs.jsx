import React, { useMemo, useState } from "react";
import "./Blogs.css";

const blogs = [
  {
    id: 1,
    category: "AI & Automation",
    date: "Aug 06, 2026",
    readTime: "6 min read",
    title: "How AI Is Changing Customer Conversations for Modern Businesses",
    excerpt:
      "Customers expect fast, relevant answers across every channel. Discover how AI-powered customer engagement can help businesses automate conversations without losing the human touch.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: 2,
    category: "WhatsApp",
    date: "Jul 28, 2026",
    readTime: "5 min read",
    title: "Why WhatsApp Is Becoming a Core Customer Engagement Channel",
    excerpt:
      "From customer support to campaigns and sales, WhatsApp is becoming one of the most important communication channels for growing businesses.",
    image:
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    category: "Customer Experience",
    date: "Jul 20, 2026",
    readTime: "7 min read",
    title: "From Shared Inbox to AI: Building a Better Customer Support Experience",
    excerpt:
      "Learn how businesses can bring conversations, automation, human support, and customer context together in one unified workspace.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    category: "Business Growth",
    date: "Jul 12, 2026",
    readTime: "6 min read",
    title: "Turning Customer Conversations Into Business Opportunities",
    excerpt:
      "Every customer message can represent a question, a purchase opportunity, a support request, or a relationship waiting to grow.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    category: "AI & Automation",
    date: "Jul 04, 2026",
    readTime: "8 min read",
    title: "What Is RAG and Why Does It Matter for Business AI?",
    excerpt:
      "Generic AI knows a lot. Business AI needs to know your business. Learn how Retrieval-Augmented Generation can make AI responses more relevant and grounded.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    category: "Omnichannel",
    date: "Jun 25, 2026",
    readTime: "5 min read",
    title: "The Future of Customer Engagement Is Unified",
    excerpt:
      "Customers move between WhatsApp, Instagram, Facebook, and other channels. Businesses need one connected experience instead of disconnected conversations.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80",
  },
];

const categories = [
  "All",
  "AI & Automation",
  "WhatsApp",
  "Customer Experience",
  "Business Growth",
  "Omnichannel",
];

export default function Blogs({ openAuth }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBlogs = useMemo(() => {
    if (activeCategory === "All") return blogs;

    return blogs.filter((blog) => blog.category === activeCategory);
  }, [activeCategory]);

  const featuredBlog = blogs.find((blog) => blog.featured);

  return (
    <main className="blogs-page">
      {/* Hero */}
      <section className="blogs-hero">
        <div className="blogs-container">
          <div className="blogs-hero-content">
            <span className="blogs-eyebrow">NEXZSOFT INSIGHTS</span>

            <h1>
              Ideas for building
              <span> better customer experiences.</span>
            </h1>

            <p>
              Practical insights on AI, customer engagement, WhatsApp
              automation, omnichannel communication, and the future of
              connected businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="featured-section">
        <div className="blogs-container">
          <div className="section-heading">
            <div>
              <span className="section-label">FEATURED</span>
              <h2>What we're thinking about</h2>
            </div>
          </div>

          <article className="featured-card">
            <div className="featured-image">
              <img src={featuredBlog.image} alt={featuredBlog.title} />
            </div>

            <div className="featured-content">
              <div className="article-meta">
                <span>{featuredBlog.category}</span>
                <span>•</span>
                <span>{featuredBlog.date}</span>
                <span>•</span>
                <span>{featuredBlog.readTime}</span>
              </div>

              <h3>{featuredBlog.title}</h3>

              <p>{featuredBlog.excerpt}</p>

              {/*<button className="read-link">
                Read article <span>→</span>
              </button>*/}
            </div>
          </article>
        </div>
      </section>

      {/* Articles */}
      <section className="articles-section">
        <div className="blogs-container">
          <div className="articles-header">
            <div>
              <span className="section-label">LATEST INSIGHTS</span>
              <h2>Explore our latest articles</h2>
            </div>

            <p>
              Ideas and practical knowledge to help your business build,
              automate, and scale customer relationships.
            </p>
          </div>

          {/* Categories */}
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category ? "active" : ""
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="blogs-grid">
            {filteredBlogs
              .filter((blog) => !blog.featured)
              .map((blog) => (
                <article className="blog-card" key={blog.id}>
                  <div className="blog-card-image">
                    <img src={blog.image} alt={blog.title} />
                  </div>

                  <div className="blog-card-content">
                    <div className="article-meta">
                      <span>{blog.category}</span>
                      <span>•</span>
                      <span>{blog.date}</span>
                    </div>

                    <h3>{blog.title}</h3>

                    <p>{blog.excerpt}</p>

                    {/*<button className="card-read-link">
                      Read article <span>→</span>
                    </button>*/}
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="blogs-cta">
        <div className="blogs-container">
          <div className="blogs-cta-inner">
            <div>
              <span className="section-label">BUILD WITH NEXZSOFT</span>
              <h2>
                Ready to make every customer conversation count?
              </h2>
              <p>
                Bring conversations, automation, AI, and customer engagement
                together in one platform.
              </p>
            </div>

            <div className="cta-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={openAuth}
              >
                Start Free
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  window.location.href = "/contact";
                }}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}