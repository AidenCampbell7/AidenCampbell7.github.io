// Feature Prioritization Tool using RICE scoring
//
// Users can add features with estimates for reach, impact, confidence and
// effort.  The tool calculates a RICE score for each feature, displays
// them in a sortable table and plots the scores on a bar chart.  This
// demonstrates how product managers can make data‑driven prioritisation
// decisions.

const form = document.getElementById('featureForm');
const tableBody = document.querySelector('#featureTable tbody');
const chartCtx = document.getElementById('riceChart').getContext('2d');

// Array to store feature objects
let features = [];
let riceChart;

function updateDisplay() {
  // Sort features by descending RICE score
  features.sort((a, b) => b.score - a.score);
  // Update table
  tableBody.innerHTML = '';
  features.forEach(feat => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${feat.name}</td><td>${feat.reach}</td><td>${feat.impact}</td><td>${feat.confidence}</td><td>${feat.effort}</td><td>${feat.score.toFixed(1)}</td>`;
    tableBody.appendChild(tr);
  });
  // Prepare data for chart
  const labels = features.map(f => f.name);
  const data = features.map(f => f.score);
  // Destroy existing chart if present
  if (riceChart) riceChart.destroy();
  riceChart = new Chart(chartCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'RICE Score',
          data: data,
          backgroundColor: 'rgba(0, 123, 255, 0.7)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Feature Prioritisation (RICE Scores)'
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Score'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Feature'
          }
        }
      }
    }
  });
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  // Read form values
  const name = document.getElementById('featureName').value.trim();
  const reach = parseFloat(document.getElementById('reach').value);
  const impact = parseFloat(document.getElementById('impact').value);
  const confidence = parseFloat(document.getElementById('confidence').value);
  const effort = parseFloat(document.getElementById('effort').value);
  if (!name) return;
  // Compute RICE score
  const score = (reach * impact * confidence) / effort;
  features.push({ name, reach, impact, confidence, effort, score });
  // Reset name field for next entry
  document.getElementById('featureName').value = '';
  // Update table and chart
  updateDisplay();
});

// Initial call to set up an empty chart
updateDisplay();
