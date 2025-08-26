// Helper to create a draggable lead card
function createCard(name) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('draggable', 'true');
  card.textContent = name;
  // Add drag event listeners
  card.addEventListener('dragstart', () => {
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });
  return card;
}

// Initialise drag and drop on all lists
function initDragAndDrop() {
  const lists = document.querySelectorAll('.list');
  lists.forEach((list) => {
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      if (dragging) {
        list.appendChild(dragging);
      }
    });
  });
}

// Handle adding a new lead
document.getElementById('addLeadForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const leadName = document.getElementById('leadName');
  const name = leadName.value.trim();
  if (!name) return;
  const card = createCard(name);
  document.getElementById('newList').appendChild(card);
  leadName.value = '';
});

// Initialise the board
initDragAndDrop();