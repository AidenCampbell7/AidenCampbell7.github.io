// Dataset of customers with age and annual revenue (in thousands of USD)
const customers = [
  { id: 1, age: 23, revenue: 50 },
  { id: 2, age: 45, revenue: 200 },
  { id: 3, age: 36, revenue: 150 },
  { id: 4, age: 28, revenue: 70 },
  { id: 5, age: 52, revenue: 300 },
  { id: 6, age: 40, revenue: 180 },
  { id: 7, age: 30, revenue: 90 },
  { id: 8, age: 42, revenue: 220 },
  { id: 9, age: 27, revenue: 65 },
  { id: 10, age: 50, revenue: 250 },
  { id: 11, age: 33, revenue: 110 },
  { id: 12, age: 38, revenue: 160 },
  { id: 13, age: 24, revenue: 55 },
  { id: 14, age: 46, revenue: 210 },
  { id: 15, age: 29, revenue: 80 },
  { id: 16, age: 31, revenue: 95 },
  { id: 17, age: 48, revenue: 260 },
  { id: 18, age: 26, revenue: 60 },
  { id: 19, age: 35, revenue: 130 },
  { id: 20, age: 44, revenue: 190 },
  { id: 21, age: 37, revenue: 140 },
  { id: 22, age: 32, revenue: 100 },
  { id: 23, age: 41, revenue: 170 },
  { id: 24, age: 39, revenue: 155 },
  { id: 25, age: 47, revenue: 240 },
  { id: 26, age: 34, revenue: 115 },
  { id: 27, age: 25, revenue: 52 },
  { id: 28, age: 43, revenue: 205 },
  { id: 29, age: 49, revenue: 270 },
  { id: 30, age: 28, revenue: 75 }
];

/**
 * Run the K-means algorithm on a 2D dataset.
 * @param {Array} data - Array of objects with properties age and revenue.
 * @param {number} k - Number of clusters to form.
 * @param {number} maxIter - Maximum number of iterations.
 * @returns {Object} { assignments: Array, centroids: Array }
 */
function kMeans(data, k, maxIter = 20) {
  // Initialize centroids by choosing random data points
  const centroids = [];
  const usedIndices = new Set();
  while (centroids.length < k) {
    const idx = Math.floor(Math.random() * data.length);
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      centroids.push({
        age: data[idx].age,
        revenue: data[idx].revenue
      });
    }
  }
  // Array to hold cluster assignment for each data point
  const assignments = new Array(data.length).fill(-1);
  let changed = true;
  let iter = 0;
  while (changed && iter < maxIter) {
    changed = false;
    iter++;
    // Assignment step: assign each point to nearest centroid
    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      let bestCluster = 0;
      let bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        const centroid = centroids[c];
        const dist = Math.hypot(point.age - centroid.age, point.revenue - centroid.revenue);
        if (dist < bestDist) {
          bestDist = dist;
          bestCluster = c;
        }
      }
      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }
    // Update step: recompute centroids as mean of assigned points
    const sums = new Array(k).fill(null).map(() => ({ age: 0, revenue: 0, count: 0 }));
    for (let i = 0; i < data.length; i++) {
      const cluster = assignments[i];
      const point = data[i];
      sums[cluster].age += point.age;
      sums[cluster].revenue += point.revenue;
      sums[cluster].count++;
    }
    for (let c = 0; c < k; c++) {
      if (sums[c].count > 0) {
        centroids[c].age = sums[c].age / sums[c].count;
        centroids[c].revenue = sums[c].revenue / sums[c].count;
      }
    }
  }
  return { assignments, centroids };
}

// Colors palette for up to five clusters
const palette = [
  'rgba(54, 162, 235, 0.7)',
  'rgba(255, 99, 132, 0.7)',
  'rgba(255, 206, 86, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)'
];

let chartInstance = null;

/**
 * Render the scatter plot and summary based on cluster assignments.
 * @param {number} k - number of clusters
 */
function renderClusters(k) {
  const { assignments, centroids } = kMeans(customers, k);
  // Prepare datasets for Chart.js
  const clusterDatasets = [];
  for (let c = 0; c < k; c++) {
    clusterDatasets.push({
      label: `Cluster ${c + 1}`,
      data: [],
      pointBackgroundColor: palette[c],
      pointRadius: 6
    });
  }
  for (let i = 0; i < customers.length; i++) {
    const cluster = assignments[i];
    const pt = customers[i];
    clusterDatasets[cluster].data.push({ x: pt.age, y: pt.revenue });
  }
  // Destroy existing chart if any
  if (chartInstance) {
    chartInstance.destroy();
  }
  const ctx = document.getElementById('segmentationChart').getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: clusterDatasets
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Age'
          },
          beginAtZero: true
        },
        y: {
          title: {
            display: true,
            text: 'Annual Revenue (k USD)'
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: `Customer Segmentation into ${k} Clusters`
        }
      }
    }
  });
  // Build summary information
  const summaryContainer = document.getElementById('summary');
  let html = `<h3>Cluster Summary</h3>`;
  html += '<ul>';
  for (let c = 0; c < k; c++) {
    const members = customers.filter((_, idx) => assignments[idx] === c);
    const size = members.length;
    const avgAge = (members.reduce((acc, p) => acc + p.age, 0) / size).toFixed(1);
    const avgRev = (members.reduce((acc, p) => acc + p.revenue, 0) / size).toFixed(1);
    html += `<li><strong>Cluster ${c + 1}:</strong> ${size} customers | Avg age: ${avgAge} | Avg revenue: $${avgRev}k</li>`;
  }
  html += '</ul>';
  summaryContainer.innerHTML = html;
}

// Event listener for the clustering button
document.getElementById('clusterBtn').addEventListener('click', () => {
  const kInput = document.getElementById('numClusters');
  let k = parseInt(kInput.value, 10);
  if (isNaN(k) || k < 2 || k > 5) {
    alert('Please enter a valid number of clusters between 2 and 5.');
    return;
  }
  renderClusters(k);
});

// Run default clustering on page load
window.addEventListener('DOMContentLoaded', () => {
  renderClusters(parseInt(document.getElementById('numClusters').value, 10));
});