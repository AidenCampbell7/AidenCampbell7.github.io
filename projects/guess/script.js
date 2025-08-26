document.addEventListener('DOMContentLoaded', () => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  const input = document.getElementById('guessInput');
  const button = document.getElementById('guessBtn');
  const feedback = document.getElementById('feedback');
  const progressBar = document.getElementById('progressBar');
  const attemptsLabel = document.getElementById('attempts');
  let attempts = 0;
  const maxAttempts = 10;

  function updateProgress() {
    const percent = Math.min((attempts / maxAttempts) * 100, 100);
    progressBar.style.setProperty('--progress', `${percent}%`);
    // update bar width via pseudo-element by adjusting style property
    progressBar.querySelector('::after');
  }

  function updateAttemptsLabel() {
    attemptsLabel.textContent = `${attempts} / ${maxAttempts} attempts`;
  }

  function getHint(guess) {
    const diff = Math.abs(randomNumber - guess);
    if (diff === 0) return 'Correct!';
    if (diff <= 3) return 'Extremely hot!';
    if (diff <= 7) return 'Hot!';
    if (diff <= 15) return 'Warm';
    if (diff <= 25) return 'Cold';
    return 'Very cold';
  }

  button.addEventListener('click', () => {
    const guess = parseInt(input.value, 10);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      feedback.textContent = 'Please enter a number between 1 and 100.';
      return;
    }
    attempts++;
    updateAttemptsLabel();
    // update progress bar width
    const width = Math.min((attempts / maxAttempts) * 100, 100);
    progressBar.style.setProperty('width', `${width}%`);
    if (guess === randomNumber) {
      feedback.textContent = `🎉 Correct! You guessed the number in ${attempts} attempts.`;
      button.disabled = true;
    } else {
      const hint = getHint(guess);
      if (guess < randomNumber) {
        feedback.textContent = `${hint}. Try a higher number.`;
      } else {
        feedback.textContent = `${hint}. Try a lower number.`;
      }
      if (attempts === maxAttempts) {
        feedback.textContent = `Out of attempts! The number was ${randomNumber}.`;
        button.disabled = true;
      }
    }
    input.value = '';
  });
  // initialise label
  updateAttemptsLabel();
});