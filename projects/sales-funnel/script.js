document.getElementById('analyseBtn').addEventListener('click', analyzeFunnel);

function analyzeFunnel() {
  const leads = parseInt(document.getElementById('leads').value);
  const contact = parseInt(document.getElementById('contact').value);
  const demo = parseInt(document.getElementById('demo').value);
  const negotiation = parseInt(document.getElementById('negotiation').value);
  const closed = parseInt(document.getElementById('closed').value);
  const dealValue = parseFloat(document.getElementById('dealValue').value);

  function pct(n, d) { return d ? (n / d * 100).toFixed(1) : 0; }

  const rates = [
    pct(contact, leads),
    pct(demo, contact),
    pct(negotiation, demo),
    pct(closed, negotiation)
  ];

  const revenue = (closed * dealValue).toFixed(2);

  const result = document.getElementById('results');
  result.innerHTML = `
    <h3>Results</h3>
    <p>Contact rate: ${rates[0]}%</p>
    <p>Demo rate: ${rates[1]}%</p>
    <p>Negotiation rate: ${rates[2]}%</p>
    <p>Close rate: ${rates[3]}%</p>
    <p>Estimated revenue: $${revenue}</p>`;

  const ctx = document.getElementById('funnelChart').getContext('2d');
  if (window.funnelChart) {
    window.funnelChart.destroy();
  }
  window.funnelChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Contact','Demo','Negotiation','Closed'],
      datasets: [{
        label: 'Conversion Rate (%)',
        data: rates,
        backgroundColor: ['#007bff','#28a745','#ffc107','#dc3545']
      }]
    },
    options: {
      indexAxis:'y',
      scales: {
        x: { title: { display: true, text: 'Conversion Rate (%)' }, beginAtZero: true },
        y: { title: { display: false } }
      },
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Funnel Conversion Rates' }
      }
    }
  });
}
