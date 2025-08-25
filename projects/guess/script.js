document.addEventListener('DOMContentLoaded', function () {
  // Generate a random number between 1 and 100
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  const input = document.getElementById('guessInput');
  const button = document.getElementById('guessBtn');
  const feedback = document.getElementById('feedback');
  let attempts = 0;

  button.addEventListener('click', function () {
    const guess = parseInt(input.value, 10);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      feedback.textContent = 'Please enter a number between 1 and 100.';
      return;
    }
    attempts++;
    if (guess === randomNumber) {
      feedback.textContent = `Congratulations! You guessed the number in ${attempts} attempts.`;
      button.disabled = true;
    } else if (guess < randomNumber) {
      feedback.textContent = 'Too low! Try again.';
    } else {
      feedback.textContent = 'Too high! Try again.';
    }
  });
});
