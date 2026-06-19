import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsChart() {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],

    datasets: [
      {
        label: "Messages",
        data: [120, 250, 180, 400, 350, 500],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },

      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default AnalyticsChart;