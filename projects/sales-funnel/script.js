// JavaScript for Sales Funnel Analyzer

function analyseFunnel() {
  const leads = parseFloat(document.getElementById("leads").value) || 0;
  const qualified = parseFloat(document.getElementById("qualified").value) || 0;
  const proposals = parseFloat(document.getElementById("proposals").value) || 0;
  const deals = parseFloat(document.getElementById("deals").value) || 0;
  const dealValue = parseFloat(document.getElementById("dealValue").value) || 0;

  // Compute conversion rates (avoid division by zero)
  const convQualified = leads > 0 ? (qualified / leads) * 100 : 0;
  const convProposal = qualified > 0 ? (proposals / qualified) * 100 : 0;
  const convDeal = proposals > 0 ? (deals / proposals) * 100 : 0;

  // Determine biggest drop-off stage (lowest conversion rate)
  const rates = [convQualified, convProposal, convDeal];
  const stages = ["Qualified", "Proposals", "Deals"];
  let minIndex = 0;
  rates.forEach((rate, idx) => {
    if (rate < rates[minIndex]) {
      minIndex = idx;
    }
  });
  const biggestDropStage = stages[minIndex];
  const minRate = rates[minIndex];

  // Estimated revenue
  const estimatedRevenue = deals * dealValue;

  // Create or update chart
  const ctx = document.getElementById("funnelChart").getContext("2d");
  // Destroy existing chart if present
  if (window.funnelChart) {
    window.funnelChart.destroy();
  }
  window.funnelChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Leads", "Qualified", "Proposals", "Deals"],
      datasets: [
        {
          label: "Count",
          data: [leads, qualified, proposals, deals],
          backgroundColor: [
            "rgba(0, 123, 255, 0.7)",
            "rgba(0, 123, 255, 0.6)",
            "rgba(0, 123, 255, 0.5)",
            "rgba(0, 123, 255, 0.4)"
          ],
          borderColor: "rgba(0, 123, 255, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Sales Funnel"
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed.x}`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of opportunities"
          }
        },
        y: {
          title: {
            display: true,
            text: "Funnel Stage"
          }
        }
      }
    }
  });

  // Display summary
  const summaryDiv = document.getElementById("summary");
  summaryDiv.innerHTML = `
    <p><strong>Conversion rates:</strong> Qualified: ${convQualified.toFixed(
      1
    )}% &nbsp;|&nbsp; Proposals: ${convProposal.toFixed(
      1
    )}% &nbsp;|&nbsp; Deals: ${convDeal.toFixed(1)}%</p>
    <p><strong>Estimated revenue:</strong> $${estimatedRevenue.toLocaleString()}</p>
    <p><strong>Biggest drop‑off stage:</strong> ${biggestDropStage} (only ${minRate.toFixed(
      1
    )}% conversion). Improving this stage will have the greatest impact on revenue.</p>
  `;
}

// Event listener for analyse button
document.getElementById("analyzeBtn").addEventListener("click", analyseFunnel);

// Initial chart on page load
window.addEventListener("DOMContentLoaded", analyseFunnel);