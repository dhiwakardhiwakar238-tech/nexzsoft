import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      {/* Left Side */}
      <div className="hero-left">
        <h1>
          AI-Powered Customer
          <span> Engagement Platform</span>
        </h1>

        <p>
          Deliver intelligent, personalized conversations
          across WhatsApp, Instagram, Facebook, and more.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Get Started
          </button>

          <button className="secondary-btn">
            Connect WhatsApp
          </button>
        </div>

        <div className="trusted">
          Trusted by modern businesses 🚀
        </div>
      </div>

      {/* Right Side */}
      <div className="hero-right">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800"
          alt="AI Platform"
        />
      </div>

    </section>
  );
}

export default Hero;