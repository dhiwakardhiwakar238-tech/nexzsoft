import "./Overview.css";

import "./Overview.css";

import AnalyticsCharts
  from "./Components/AnalyticsCharts";

import AIConversationIntelligence
  from "./Components/AIConversationIntelligence";

import CompetitorDetection
  from "./Components/CompetitorDetection";

import AIChurnPrediction
  from "./Components/AIChurnPrediction";

import AISalesCoach
  from "./Components/AISalesCoach";

function Overview() {
  return (
    <div className="overview">

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Contacts</h3>
          <h1>1,245</h1>
        </div>

        <div className="stat-card">
          <h3>Total Messages</h3>
          <h1>8,532</h1>
        </div>

        <div className="stat-card">
          <h3>Open Chats</h3>
          <h1>43</h1>
        </div>

        <div className="stat-card">
          <h3>AI Resolution</h3>
          <h1>92%</h1>
        </div>

      </div>

      <div className="recent-activity">

        <h2>Recent Activity</h2>

        <div className="activity-item">
          Customer A sent a WhatsApp message
        </div>

        <div className="activity-item">
          Facebook page connected
        </div>

        <div className="activity-item">
          New contact added
        </div>

      </div>

      <AnalyticsCharts />

      <AIConversationIntelligence />

      <CompetitorDetection />

      <AIChurnPrediction />

      <AISalesCoach />

    </div>
  );
}

export default Overview;