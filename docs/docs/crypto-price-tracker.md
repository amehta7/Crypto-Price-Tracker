# Crypto Price Tracker Documentation

This documentation explains the **Crypto Price Tracker** project, including the setup guide, API integration, state management using React Query, and challenges faced during the development process.

## Table of Contents

- [Project Setup Guide](#project-setup-guide)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Challenges & Solutions](#challenges-solutions)

## Project Setup Guide

To set up the **Crypto Price Tracker** project, follow the instructions below.

### Web Application Setup

1. **Clone the Repository:**

   Clone the repository from GitHub to your local machine:

   git clone https://github.com/amehta7/Crypto-Price-Tracker.git

2. **Install Dependencies:**

   Navigate to the project directory and install the required dependencies:

   cd web-app
   npm install

3. **Start the Development Server:**

   Once the dependencies are installed, start the development server:

   npm run dev

   The app will be available at http://localhost:3000

## API Integration

#### Overview of the API

The Crypto Price Tracker application uses the CoinCap API to fetch real-time cryptocurrency prices and historical data for selected cryptocurrencies.

- API Endpoints Used
  Real-Time Data:

### 1. Endpoint: GET https://api.coincap.io/v2/assets

- This returns the list of cryptocurrencies along with their real-time prices.

### 2. Endpoint: GET https://api.coincap.io/v2/assets/{coinId}/history?interval=d1

- This endpoint returns historical data for a specific cryptocurrency, which is used to plot the price trend over time.

I use Axios for making API requests.
React Query is used to manage the state and caching of API data.

## State Management

#### Why React Query?

- I chose React Query for managing API calls and state because it simplifies data fetching, caching, and synchronization. It also handles loading, error, and success states efficiently without needing manual state management.

#### Automatic Caching:

- React Query caches data automatically to avoid unnecessary refetches.
- Background Data Syncing: It refetches data in the background to keep the app up-to-date.
- Error Handling: React Query makes it easy to handle loading, error, and success states.

#### Why Not Context API or Zustand?

- While Context API is good for passing global state through the component tree, React Query is more efficient for handling API data. It provides built-in caching, background updates, and is purpose-built for data fetching, making it more suited for this project.

## Challenges & Solutions

#### Challenge 1: Handling Real-Time Data Updates

- Problem: Keeping the data updated in real-time without making redundant API calls was a challenge.
- Solution: Using React Query’s caching and background refetching capabilities. React Query caches the data and ensures that I don’t make unnecessary requests while keeping the data fresh.

#### Challenge 2: Chart Display with Historical Data

- Problem: Formatting historical data for the chart and ensuring that the chart displays correctly was complex.
- Solution: I used Chart.js to plot the historical price data. I processed the historical data into the correct format (dates and prices) to feed into the chart component.

#### Challenge 3: Displaying Loading State While Refetching Data

- Problem: Ensuring a smooth user experience while showing loading states when refreshing data.
- Solution: I implemented loading spinners in key areas such as the search bar, refresh button, and chart to indicate to the user that the data is being refetched.

#### Challenge 4: Managing State for Multiple API Calls

- Problem: I needed to manage two types of API calls — one for real-time data and one for historical data.
- Solution: Using React Query, we efficiently handled both API calls and managed their states (loading, error, data) independently without unnecessary re-renders.

```

```
