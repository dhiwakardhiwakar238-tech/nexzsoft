import "./Analytics.css";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

const data = [
    { day: "Mon", messages: 120 },
    { day: "Tue", messages: 180 },
    { day: "Wed", messages: 140 },
    { day: "Thu", messages: 240 },
    { day: "Fri", messages: 310 },
    { day: "Sat", messages: 280 },
    { day: "Sun", messages: 360 }
];

function Analytics() {

    return (

        <div className="analytics-card">

            <div className="analytics-header">

                <h3>Messages Overview</h3>

                <span>Last 7 Days</span>

            </div>

            <div className="chart-area">

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >

                    <LineChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="day" />

                        <YAxis />

                        <Tooltip />

                        <Line

                            type="monotone"

                            dataKey="messages"

                            stroke="#22c55e"

                            strokeWidth={3}

                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default Analytics;