document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('taskInput');
  const addBtn = document.getElementById('addTaskBtn');
  const list = document.getElementById('taskList');

  function addTask() {
    const taskText = input.value.trim();
    if (taskText === '') {
      return;
    }
    const li = document.createElement('li');
    li.textContent = taskText;
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.classList.add('delete-btn');
    delBtn.onclick = function () {
      list.removeChild(li);
    };
    // Mark completed
    li.addEventListener('click', function (e) {
      // Prevent toggling completed when clicking delete button
      if (e.target === delBtn) return;
      li.classList.toggle('completed');
    });
    li.appendChild(delBtn);
    list.appendChild(li);
    input.value = '';
  }

  addBtn.addEventListener('click', addTask);

  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addTask();
    }
  });
});