import "./Notifications.css";

function Notifications() {

  const notifications = [
    {
      id: 1,
      title: "New Demo Request",
      desc: "ABC Company requested a demo."
    },
    {
      id: 2,
      title: "New User Registered",
      desc: "John created an account."
    },
    {
      id: 3,
      title: "Subscription Expired",
      desc: "Starter Plan expired."
    }
  ];

  return (
    <div className="notifications-page">

      <h1>🔔 Notifications</h1>

      <div className="notification-list">

        {notifications.map((item) => (
          <div
            key={item.id}
            className="notification-card"
          >
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Notifications;