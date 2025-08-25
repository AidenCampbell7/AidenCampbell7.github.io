// Sales Forecast Dashboard logic

// Sample monthly sales data (in units) for a fictional product
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const salesData = [120, 135, 150, 145, 160, 170, 180, 175, 190, 200, 210, 220];

// Perform simple linear regression to estimate future sales
const n = salesData.length;
const xValues = Array.from({ length: n }, (_, i) => i + 1);

const sumX = xValues.reduce((acc, x) => acc + x, 0);
const sumY = salesData.reduce((acc, y) => acc + y, 0);
const sumXY = xValues.reduce((acc, x, i) => acc + x * salesData[i], 0);
const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);

// Calculate the slope (b) and intercept (a) for y = a + b * x
const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
const a = (sumY - b * sumX) / n;

// Forecast next 6 months
const forecastMonths = ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'];
const xForecast = Array.from({ length: forecastMonths.length }, (_, i) => n + i + 1);
const forecastValues = xForecast.map((x) => a + b * x);

// Combined labels for chart
const labels = months.concat(forecastMonths);

// Data arrays: actual sales data followed by forecast values
const actualData = salesData;
const forecastData = Array(n).fill(null).concat(forecastValues);

// Render chart using Chart.js
const ctx = document.getElementById('salesChart').getContext('2d');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [
      {
        label: 'Actual Sales',
        data: actualData,
        borderColor: '#1f78b4',
        backgroundColor: 'rgba(31, 120, 180, 0.2)',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Forecasted Sales',
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
        text: 'Monthly Sales and Forecast'
      },
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Sales (Units)'
        },
        beginAtZero: false
      }
    }
  }
});
