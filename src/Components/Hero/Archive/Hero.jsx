import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-glow"></div>

      <div className="hero-left">

        <div className="hero-badge">
          🚀 Trusted by Growing Businesses
        </div>

        <h1>
          AI-Powered
          <span> Customer Engagement</span>
          <br />
          For Modern Businesses
        </h1>

        <p>
        Transform customer engagement with AI-powered conversations across WhatsApp, Instagram, Facebook, and more - all in one platform that delivers exceptional customer experiences and drives measurable business growth.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Get Started Free
          </button>

          <button className="secondary-btn">
            Watch Demo
          </button>
        </div>

        <div className="hero-stats">
          <div>
            <h3>500+</h3>
            <p>Businesses</p>
          </div>

          <div>
            <h3>99.9%</h3>
            <p>Uptime</p>
          </div>

          <div>
            <h3>24/7</h3>
            <p>Support</p>
          </div>
        </div>

      </div>

      <div className="hero-right">

        <div className="glass-card">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200"
            alt="AI Dashboard"
          />
        </div>

      </div>

    </section>
  );
}

export default Hero;