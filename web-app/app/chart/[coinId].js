"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
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
import { useRouter } from "next/navigation"; // To get the coinId from the URL

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Fetch historical data for a specific coinId
const fetchCoinHistory = async (coinId) => {
  const { data } = await axios.get(
    `https://api.coincap.io/v2/assets/${coinId}/history?interval=d1`
  );
  return data.data; // Ensure the correct historical data is returned
};

export default function CoinChartPage() {
  const router = useRouter();
  const { coinId } = router.query; // Get the coinId from the URL

  const [coinHistory, setCoinHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coinId) return;

    const fetchHistory = async () => {
      try {
        const historyData = await fetchCoinHistory(coinId);
        setCoinHistory(historyData);
        setIsLoading(false);
      } catch (err) {
        setError("Error loading chart data.");
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [coinId]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Prepare the chart data
  const chartData = {
    labels: coinHistory
      ? coinHistory.map((item) => new Date(item.time).toLocaleDateString())
      : [],
    datasets: [
      {
        label: `${coinId.toUpperCase()} Price (USD)`,
        data: coinHistory
          ? coinHistory.map((item) => parseFloat(item.priceUsd))
          : [],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="container">
      <h1>{coinId.toUpperCase()} Price Chart</h1>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
