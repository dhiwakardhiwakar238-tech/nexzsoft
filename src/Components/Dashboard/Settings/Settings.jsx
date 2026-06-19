import "./Settings.css";

function Settings() {
  return (
    <div className="settings-page">

      <h1>⚙️ Settings</h1>

      <div className="settings-card">

        <label>Company Name</label>
        <input type="text" placeholder="Nexzsoft" />

        <label>Email</label>
        <input type="email" placeholder="admin@nexzsoft.com" />

        <button>
          Save Settings
        </button>

      </div>

    </div>
  );
}

export default Settings;