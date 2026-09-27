import "./StatsCards.css";

import {
  RiUser3Fill,
  RiMessage2Fill,
  RiRobot2Fill,
  RiMoneyDollarCircleFill,
} from "react-icons/ri";

function StatsCards() {

  const cards = [

    {
      title: "Customers",
      value: "1,248",
      icon: <RiUser3Fill />,
      color: "#22C55E"
    },

    {
      title: "Conversations",
      value: "8,946",
      icon: <RiMessage2Fill />,
      color: "#3B82F6"
    },

    {
      title: "AI Replies",
      value: "24,115",
      icon: <RiRobot2Fill />,
      color: "#A855F7"
    },

    {
      title: "Revenue",
      value: "₹1,24,500",
      icon: <RiMoneyDollarCircleFill />,
      color: "#F59E0B"
    }

  ];

  return (

    <div className="stats-grid">

      {cards.map((card, index) => (

        <div
          className="stats-card"
          key={index}
        >

          <div
            className="stats-icon"
            style={{
              background: card.color
            }}
          >

            {card.icon}

          </div>

          <div>

            <h5>{card.title}</h5>

            <h2>{card.value}</h2>

          </div>

        </div>

      ))}

    </div>

  );

}

export default StatsCards;