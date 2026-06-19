import "./AnalyticsCharts.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

function AnalyticsCharts() {

  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 6000 },
    { month: "Mar", revenue: 8000 },
    { month: "Apr", revenue: 7000 },
    { month: "May", revenue: 12000 },
    { month: "Jun", revenue: 15000 },
  ];

  const leadsData = [
    { stage: "New", count: 120 },
    { stage: "Contacted", count: 90 },
    { stage: "Qualified", count: 65 },
    { stage: "Proposal", count: 40 },
    { stage: "Won", count: 22 },
  ];

  return (
    <div className="analytics-wrapper">

      <div className="chart-card">

        <h3>📈 Revenue Trend</h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

      <div className="chart-card">

        <h3>🎯 Lead Funnel</h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={leadsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="count"
              fill="#2563eb"
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default AnalyticsCharts;