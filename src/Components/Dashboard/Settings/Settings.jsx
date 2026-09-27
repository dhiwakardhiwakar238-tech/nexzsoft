import "./Settings.css";
import { useEffect, useState } from "react";

import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../../../services/api";

function Settings() {
  const [user, setUser] = useState({
    name: "",
    business_name: "",
    email: "",
    whatsapp_number: "",
  });

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const userId =
        localStorage.getItem(
          "userId"
        );


      if (!userId) return;

      const data =
        await getUserProfile(
          userId
        );

      setUser(data);
    };

    loadUser();


  }, []);

  const handleSave =
    async () => {
      const userId =
        localStorage.getItem(
          "userId"
        );


      const result =
        await updateUserProfile(
          userId,
          user
        );

      if (result?.message) {
        alert(
          "Profile updated successfully!"
        );
      } else {
        alert(
          "Update failed"
        );
      }
    };


  const handlePasswordChange =
    async () => {
      const userId =
        localStorage.getItem(
          "userId"
        );


      if (
        !currentPassword ||
        !newPassword
      ) {
        alert(
          "Fill all password fields"
        );
        return;
      }

      const result =
        await changePassword(
          userId,
          currentPassword,
          newPassword
        );

      alert(
        result.message
      );

      setCurrentPassword(
        ""
      );
      setNewPassword("");
    };


  return (<div className="settings-page"> <h1>⚙️ Settings</h1>


    <div className="settings-card">
      <label>
        Full Name
      </label>
      <input
        type="text"
        value={
          user.name || ""
        }
        onChange={(e) =>
          setUser({
            ...user,
            name:
              e.target
                .value,
          })
        }
      />

      <label>
        Company Name
      </label>
      <input
        type="text"
        value={
          user.business_name ||
          ""
        }
        onChange={(e) =>
          setUser({
            ...user,
            business_name:
              e.target
                .value,
          })
        }
      />

      <label>
        Email
      </label>
      <input
        type="email"
        value={
          user.email || ""
        }
        onChange={(e) =>
          setUser({
            ...user,
            email:
              e.target
                .value,
          })
        }
      />

      <label>
        WhatsApp
      </label>
      <input
        type="text"
        value={
          user.whatsapp_number ||
          ""
        }
        onChange={(e) =>
          setUser({
            ...user,
            whatsapp_number:
              e.target
                .value,
          })
        }
      />

      <button
        onClick={
          handleSave
        }
      >
        Save Settings
      </button>

      <hr
        style={{
          margin:
            "30px 0",
        }}
      />

      <h2>
        🔒 Change
        Password
      </h2>

      <label>
        Current Password
      </label>
      <input
        type="password"
        value={
          currentPassword
        }
        onChange={(e) =>
          setCurrentPassword(
            e.target
              .value
          )
        }
      />

      <label>
        New Password
      </label>
      <input
        type="password"
        value={
          newPassword
        }
        onChange={(e) =>
          setNewPassword(
            e.target
              .value
          )
        }
      />

      <button
        onClick={
          handlePasswordChange
        }
      >
        Change
        Password
      </button>
    </div>
  </div>


  );
}

export default Settings;
