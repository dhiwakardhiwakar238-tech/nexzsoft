import "./Topbar.css";

function Topbar({ logout }) {
  return (
    <div className="topbar">

      <div className="topbar-left">
        <h1>Nexzsoft Dashboard</h1>
        <p>Manage all customer conversations</p>
      </div>

      <div className="topbar-right">

        <div className="status-badge">
          🟢 Online
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Topbar;