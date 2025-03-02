"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
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
import "./globals.css";

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

// Fetching crypto data from CoinCap API
const fetchCryptoData = async () => {
  const { data } = await axios.get("https://api.coincap.io/v2/assets");

  const coins = ["bitcoin", "ethereum", "cardano", "ripple", "litecoin"];
  const filteredData = data.data.filter((coin) => coins.includes(coin.id));

  return filteredData.reduce((acc, coin) => {
    acc[coin.id] = { usd: coin.priceUsd };
    return acc;
  }, {});
};

// Fetch historical data for a specific coinId
const fetchCoinHistory = async (coinId) => {
  const { data } = await axios.get(
    `https://api.coincap.io/v2/assets/${coinId}/history?interval=d1`
  );
  return data.data; // Return historical data for the coin
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("bitcoin"); // Default coin to display chart for Bitcoin
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);
  const { data, isLoading, error, refetch } = useQuery(
    "cryptoPrices",
    fetchCryptoData,
    {
      refetchOnWindowFocus: false,
    }
  );

  const [coinHistory, setCoinHistory] = useState(null);
  const [chartError, setChartError] = useState(null);
  const [isChartLoading, setIsChartLoading] = useState(true);

  // Fetching historical data whenever selectedCoin changes
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsChartLoading(true);
        const historyData = await fetchCoinHistory(selectedCoin);
        setCoinHistory(historyData);
        setChartError(null);
      } catch (err) {
        setChartError("Error loading chart data.");
      } finally {
        setIsChartLoading(false);
      }
    };

    fetchHistory();
  }, [selectedCoin]);

  // Handle search input change and update filtered data
  const handleSearch = (e) => {
    setSearch(e.target.value);
    // Select the first match when typing
    const filteredCoins = Object.keys(data).filter((coin) =>
      coin.toLowerCase().includes(e.target.value.toLowerCase())
    );
    if (filteredCoins.length > 0) {
      setSelectedCoin(filteredCoins[0]); // Automatically update the chart with the first filtered coin
    }
  };

  const filteredData = data
    ? Object.keys(data).filter((coin) =>
        coin.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Prepare the chart data
  const chartData = {
    labels: coinHistory
      ? coinHistory.map((item) => new Date(item.time).toLocaleDateString())
      : [],
    datasets: [
      {
        label: `${selectedCoin.toUpperCase()} Price (USD)`,
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

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshLoading(true);
    await refetch();
    setIsRefreshLoading(false); // Set loading state to false once refetch is complete
  };

  if (isLoading) {
    return (
      <div className="container">
        <h1>Crypto Price Tracker</h1>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search Cryptos"
          className="search-input"
        />
        <button onClick={handleRefresh} className="refresh-btn">
          {isRefreshLoading ? "Refreshing..." : "Refresh"}
        </button>

        {/* Loading state while fetching the data */}
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">
          Error loading data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Crypto Price Tracker</h1>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search Cryptos"
        className="search-input"
      />
      <button onClick={handleRefresh} className="refresh-btn">
        {isRefreshLoading ? "Refreshing..." : "Refresh"}
      </button>
      <div className="crypto-list">
        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading crypto cards...</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((coin) => (
            <div
              key={coin}
              className="crypto-item"
              onClick={() => setSelectedCoin(coin)} // Change the selected coin on click
            >
              <h2>{coin.toUpperCase()}</h2>
              <p>Price: ${parseFloat(data[coin].usd).toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>No matching results</p>
        )}
      </div>

      {/* Display the chart below the crypto cards */}
      <div className="chart-container">
        {isChartLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading chart...</p>
          </div>
        ) : chartError ? (
          <div className="error-container">
            <p className="error-message">{chartError}</p>
          </div>
        ) : (
          <div>
            <h2>{selectedCoin.toUpperCase()} Price Chart</h2>
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
}
