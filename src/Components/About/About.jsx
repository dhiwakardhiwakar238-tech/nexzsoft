import "./About.css";

function About() {
  return (
    <section className="about-section">
      <div className="about-left">
        <h2>About Nexzsoft</h2>

        <p>
          Nexzsoft is an AI-powered customer engagement platform
          designed to unify conversations across WhatsApp,
          Facebook, Instagram, and more.
        </p>

        <p>
          Our intelligent automation helps businesses improve
          customer satisfaction, reduce response time, and
          scale operations efficiently.
        </p>

        <div className="about-cards">
          <div className="about-card">
            <h3>🎯 Mission</h3>
            <p>
              Deliver seamless AI-powered customer experiences.
            </p>
          </div>

          <div className="about-card">
            <h3>🚀 Vision</h3>
            <p>
              Transform business communication through AI.
            </p>
          </div>
        </div>
      </div>

      <div className="about-right">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=900"
          alt="About Nexzsoft"
        />
      </div>
    </section>
  );
}

export default About;