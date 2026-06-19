import "./Facebook.css";

function Facebook() {
  return (
    <div className="facebook-page">

      <div className="facebook-card">
        <h1>📘 Facebook Messenger</h1>

        <p>
          Connect your Facebook Page and manage
          Messenger conversations from Nexzsoft.
        </p>

        <button className="fb-btn">
          Connect Facebook Page
        </button>
      </div>

      <div className="facebook-stats">

        <div className="stat-card">
          <h3>Messages</h3>
          <span>125</span>
        </div>

        <div className="stat-card">
          <h3>Conversations</h3>
          <span>42</span>
        </div>

        <div className="stat-card">
          <h3>Response Rate</h3>
          <span>98%</span>
        </div>

      </div>

    </div>
  );
}

export default Facebook;