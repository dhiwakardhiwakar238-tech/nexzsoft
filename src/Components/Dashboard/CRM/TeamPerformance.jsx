import "./TeamPerformance.css";

function TeamPerformance() {

  const team = [
    {
      name: "John David",
      deals: 18,
      revenue: "₹ 8.5L"
    },
    {
      name: "Priya Sharma",
      deals: 15,
      revenue: "₹ 6.2L"
    },
    {
      name: "Rahul Kumar",
      deals: 11,
      revenue: "₹ 4.8L"
    },
    {
      name: "Arun Raj",
      deals: 8,
      revenue: "₹ 3.1L"
    }
  ];

  return (
    <div className="team-performance">

      <h2>🏆 Team Performance</h2>

      <div className="team-cards">

        <div className="team-stat">
          <span>Total Revenue</span>
          <h1>₹ 22.6L</h1>
        </div>

        <div className="team-stat">
          <span>Deals Closed</span>
          <h1>52</h1>
        </div>

        <div className="team-stat">
          <span>Conversion Rate</span>
          <h1>38%</h1>
        </div>

        <div className="team-stat">
          <span>Active Reps</span>
          <h1>12</h1>
        </div>

      </div>

      <div className="leaderboard">

        <h3>🥇 Sales Leaderboard</h3>

        {team.map((user, index) => (

          <div
            key={index}
            className="leader-row"
          >

            <div className="leader-rank">
              #{index + 1}
            </div>

            <div className="leader-info">
              <h4>{user.name}</h4>
              <p>
                {user.deals} Deals Closed
              </p>
            </div>

            <div className="leader-revenue">
              {user.revenue}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default TeamPerformance;