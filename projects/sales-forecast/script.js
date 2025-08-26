// Sales Forecast Dashboard logic

// Annual revenue data for SoundHound AI (USD millions)
const years = [2021, 2022, 2023, 2024];
const revenueData = [21, 31, 46, 85];

// Perform simple linear regression to estimate future revenue
const n = revenueData.length;
const xValues = Array.from({ length: n }, (_, i) => i + 1);
const sumX = xValues.reduce((acc, x) => acc + x, 0);
const sumY = revenueData.reduce((acc, y) => acc + y, 0);
const sumXY = xValues.reduce((acc, x, i) => acc + x * revenueData[i], 0);
const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);
const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
const a = (sumY - b * sumX) / n;

// Forecast revenue for the next two years (2025 and 2026)
const forecastYears = [2025, 2026];
const xForecast = Array.from({ length: forecastYears.length }, (_, i) => n + i + 1);
const forecastValues = xForecast.map((x) => a + b * x);

// Combined labels for chart
const labels = years.concat(forecastYears);

// Data arrays: actual revenue followed by forecast values
const actualData = revenueData;
const forecastData = Array(n).fill(null).concat(forecastValues);

// Render chart using Chart.js
const ctx = document.getElementById('salesChart').getContext('2d');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [
      {
        label: 'Actual Revenue',
        data: actualData,
        borderColor: '#1f78b4',
        backgroundColor: 'rgba(31, 120, 180, 0.2)',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Forecasted Revenue',
        data: forecastData,
        borderColor: '#33a02c',
        backgroundColor: 'rgba(51, 160, 44, 0.2)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.1
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'SoundHound AI Revenue & Forecast'
      },
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (USD millions)'
        },
        beginAtZero: false
      }
    }
  }
});