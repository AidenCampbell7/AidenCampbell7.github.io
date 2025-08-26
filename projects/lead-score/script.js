// Lead Scoring Simulator logic
// This script calculates a lead score based on user input and
// visualises the result using a simple bar chart.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");
  const resultEl = document.getElementById("result");
  const chartCanvas = document.getElementById("scoreChart");
  let scoreChart; // Chart.js instance

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Retrieve values from the form
    const size = parseInt(document.getElementById("companySize").value, 10);
    const budget = parseInt(document.getElementById("budget").value, 10);
    const timeframe = parseInt(document.getElementById("timeframe").value, 10);
    const interest = parseInt(document.getElementById("interest").value, 10);

    // Compute a weighted score. Interest is scaled so it contributes comparably.
    const totalScore = size + budget + timeframe + interest / 3;

    // Determine the qualitative category based on thresholds
    let category;
    if (totalScore >= 8) {
      category = "Hot";
    } else if (totalScore >= 5) {
      category = "Warm";
    } else {
      category = "Cold";
    }

    // Display the numeric score, category and formula to the user
    resultEl.innerHTML = `<strong>Lead Score:</strong> ${totalScore.toFixed(1)} (Category: ${category})<br />` +
      `<small>Calculated as: size (${size}) + budget (${budget}) + timeframe (${timeframe}) + interest (${interest})/3</small>`;

    // Prepare the bar chart data
    const data = {
      labels: ["Score"],
      datasets: [
        {
          label: "Lead Score",
          data: [totalScore],
          backgroundColor: ["rgba(0, 123, 255, 0.7)"],
          borderColor: ["rgba(0, 123, 255, 1)"],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          title: {
            display: true,
            text: "Score",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Lead Scoring Result",
        },
      },
    };

    // Destroy any existing chart before creating a new one
    if (scoreChart) {
      scoreChart.destroy();
    }
    scoreChart = new Chart(chartCanvas, {
      type: "bar",
      data,
      options,
    });
  });
});