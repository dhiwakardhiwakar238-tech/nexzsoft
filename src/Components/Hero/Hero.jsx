import "./Hero.css";
import chatwindow from "../../assets/Nexz_chatwindow.png";
import {
  FaChartLine,
  FaRobot,
} from "react-icons/fa";

function Hero({openAuth}) {
  return (
    <div className="hero">

      <div className="hero-glow"></div>

      {/* LEFT */}
      <div className="hero-left">
        <span className="why-value-label">
          TRUSTED BY GROWING BUSINESSES
        </span>

        <h1>
          AI-Powered <span>Customer Engagement</span> Platform.
        </h1>

        <p>
          Transform customer engagement through AI-powered conversations across WhatsApp, Instagram, Facebook, and more - all in one platform that delivers exceptional customer experiences and drives measurable business growth.
        </p>

        <div className="hero-buttons">
          <button 
            className="primary-btn"
            onClick={openAuth}
          >
              Get Started Free
          </button>

          {/*<button className="secondary-btn">
              Watch Demo
          </button>*/}
        </div>
      </div>

      {/* RIGHT — PRODUCT VISUAL */}
      <div className="why-visual">

        <div className="why-image-card">

          {/*<img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200"
            alt="Nexzsoft customer engagement platform"
          />*/}

          <img
            src={chatwindow}
            alt="Nexzsoft customer engagement platform"
          />

          <div className="why-image-overlay">

            <div className="live-indicator">
              <span></span>
              AI ENGINE ACTIVE
            </div>

            <div className="conversation-preview">

              <div className="conversation-icon">
                {<FaRobot />}
              </div>

              <div className="conversation-content">
                <small>AI ASSISTANT</small>
                <strong>Customer query resolved</strong>
              </div>

              {/*<FaArrowUp className="success-arrow" />*/}

            </div>

          </div>
        </div>

        {/* FLOATING STAT */}
        <div className="why-floating-stat">

          <div className="stat-icon">
            {<FaChartLine />}
          </div>

          <div>
            <strong>24/7</strong>
            <span>Intelligent assistance</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Hero;
