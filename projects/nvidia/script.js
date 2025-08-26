// script.js for NVIDIA Growth Analysis
//
// This file defines the datasets and configuration for two Chart.js charts:
// 1) A line chart showing NVIDIA's annual revenue and simple projections
// through 2027.
// 2) A line chart illustrating an approximate trajectory of NVIDIA's stock
// price alongside future projections.  The stock data is illustrative and
// does not represent real‑time prices.

// Revenue data (billions of USD) and forecast values
const revenueYears = [
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026 (proj)',
  '2027 (proj)'
];
const revenueActual = [16.675, 26.914, 26.974, 60.922, 130.497];
// For forecasted values, we leave the actual portion undefined (null) so the
// dashed line starts only at the projection years.
const revenueForecast = [null, null, null, null, null, 200, 280];

const revCtx = document.getElementById('revenueChart').getContext('2d');
new Chart(revCtx, {
  type: 'line',
  data: {
    labels: revenueYears,
    datasets: [
      {
        label: 'Actual Revenue',
        data: [...revenueActual, null, null],
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.3
      },
      {
        label: 'Projected Revenue',
        data: revenueForecast,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderDash: [5, 5],
        tension: 0.3,
        spanGaps: true
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'NVIDIA Annual Revenue and Forecast (Billions of USD)'
      },
      legend: {
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (Billion USD)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    }
  }
});

// Stock price data (USD) – approximate values and projections
const stockYears = [
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026 (proj)',
  '2027 (proj)'
];
const stockPrices = [200, 300, 430, 900, 700, 900, 1000];
const stockCtx = document.getElementById('stockChart').getContext('2d');
new Chart(stockCtx, {
  type: 'line',
  data: {
    labels: stockYears,
    datasets: [
      {
        label: 'Stock Price (approx.)',
        data: stockPrices,
        borderColor: 'rgba(40, 167, 69, 1)',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'NVIDIA Stock Price (Illustrative)'
      },
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (USD)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    }
  }
});