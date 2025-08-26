document.addEventListener('DOMContentLoaded', function() {
  // Sample customer reviews
  const reviews = [
    'I love this product! It works great and is exactly what I needed.',
    'The service was poor and I am very disappointed.',
    'Excellent quality and fantastic customer support.',
    'Not bad, but it could be better.',
    'This is the worst purchase I have ever made.',
    'Amazing experience! I am very happy with the results.',
    'It’s okay, nothing special but it does the job.',
    'Terrible quality and horrible customer service.',
    'Very satisfied with my purchase. Highly recommend!',
    'The product arrived late and was damaged. Bad experience.'
  ];

  // Define simple positive and negative keywords
  const positiveWords = ['love', 'great', 'excellent', 'amazing', 'fantastic', 'happy', 'satisfied', 'recommend'];
  const negativeWords = ['poor', 'disappointed', 'bad', 'terrible', 'worst', 'horrible', 'late', 'damaged'];

  // Function to analyze sentiment of a review
  function analyzeSentiment(text) {
    const words = text.toLowerCase().split(/[^a-z]+/);
    let score = 0;
    words.forEach(word => {
      if (positiveWords.includes(word)) score++;
      if (negativeWords.includes(word)) score--;
    });
    if (score > 0) {
      return 'Positive';
    } else if (score < 0) {
      return 'Negative';
    } else {
      return 'Neutral';
    }
  }

  // Analyze all reviews and count sentiment categories
  const counts = {
    Positive: 0,
    Neutral: 0,
    Negative: 0
  };

  const tableBody = document.querySelector('#reviews-table tbody');

  reviews.forEach(review => {
    const sentiment = analyzeSentiment(review);
    counts[sentiment]++;

    // Populate table row
    const row = document.createElement('tr');
    const reviewCell = document.createElement('td');
    reviewCell.textContent = review;
    const sentimentCell = document.createElement('td');
    sentimentCell.textContent = sentiment;
    // Color code sentiment for clarity
    if (sentiment === 'Positive') {
      sentimentCell.style.color = '#4caf50';
    } else if (sentiment === 'Negative') {
      sentimentCell.style.color = '#f44336';
    } else {
      sentimentCell.style.color = '#ffc107';
    }
    row.appendChild(reviewCell);
    row.appendChild(sentimentCell);
    tableBody.appendChild(row);
  });

  // Create bar chart to display sentiment distribution
  const ctx = document.getElementById('sentimentChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        label: 'Number of Reviews',
        data: [counts['Positive'], counts['Neutral'], counts['Negative']],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',   // green
          'rgba(255, 193, 7, 0.7)',   // amber
          'rgba(244, 67, 54, 0.7)'    // red
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(244, 67, 54, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Sentiment Distribution'
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Sentiment'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count'
          },
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
});