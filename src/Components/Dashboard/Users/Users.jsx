import { useState } from "react";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin",
      email: "admin@nexzsoft.com",
      role: "Admin",
    },
  ]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Agent");

  const addUser = () => {
    if (!name || !email) return;

    const newUser = {
      id: Date.now(),
      name,
      email,
      role,
    };

    setUsers([...users, newUser]);

    setName("");
    setEmail("");
    setRole("Agent");
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="users-page">

      <h1>👥 User Management</h1>

      <div className="user-form">

        <input
          type="text"
          placeholder="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Admin</option>
          <option>Agent</option>
        </select>

        <button onClick={addUser}>
          Add User
        </button>

      </div>

      <div className="users-table">

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteUser(user.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Users;