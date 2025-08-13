document.addEventListener('DOMContentLoaded', () => {
  const API_URL = window.API_URL;

  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskTitle');
  const taskList = document.getElementById('taskList');
  const btnPending = document.getElementById('btnPending');
  const btnCompleted = document.getElementById('btnCompleted');
  const btnConclude = document.getElementById('btnConclude');
  const btnDeleteSelected = document.getElementById('btnDeleteSelected');

  let tasks = [];
  let filter = 'all';
  const selectedTasks = new Set();

  async function fetchTasks() {
    try {
      const response = await fetch(`https://apifetchs753951.xyz/tasks`);
      tasks = await response.json();
      renderTasks();
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  }

  function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filter === 'all') {
      filteredTasks = tasks.filter(t => t.status === false);
    } else if (filter === 'completed') {
      filteredTasks = tasks.filter(t => t.status === true);
    }

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `
        <div id="empty-state" class="empty-state">
          <i class="fas fa-tasks icon"></i>
          <h3 class="empty-title">Nenhuma tarefa adicionada</h3>
          <p class="empty-subtitle">Adicione tarefas para começar</p>
        </div>
      `;
      return;
    }

    filteredTasks.forEach(task => {
      const div = document.createElement('div');
      div.className = `task-item ${task.status ? 'completed' : ''}`;
      div.innerHTML = `
        <div class="task-item">
          <label class="task-label">
            <input 
              type="checkbox" 
              class="task-checkbox" 
              data-id="${task.id}" 
              ${task.status ? 'checked disabled' : (selectedTasks.has(task.id) ? 'checked' : '')}
            />
            <span class="task-title ${task.status ? 'completed' : ''}">
              ${task.title}
            </span>
          </label>
        </div>
      `;
      taskList.appendChild(div);
    });
  }

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;
    if (title.length > 21) {
      return alert(`A tarefa não pode ter mais que 21 caracteres!!!`);
    }

    try {
      const res = await fetch(`https://apifetchs753951.xyz/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status: false })
      });

      if (!res.ok) throw new Error('Erro ao adicionar tarefa');

      const newTask = await res.json();
      tasks.push(newTask);
      taskInput.value = '';
      renderTasks();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  });

  taskList.addEventListener('change', (e) => {
    if (e.target.classList.contains('task-checkbox')) {
      const taskIdStr = e.target.dataset.id;
      const taskId = Number(taskIdStr);

      if (isNaN(taskId)) {
        console.error('ID inválido no checkbox:', taskIdStr);
        return;
      }

      if (e.target.checked) {
        selectedTasks.add(taskId);
      } else {
        selectedTasks.delete(taskId);
      }
    }
  });

  btnConclude.addEventListener('click', async () => {
    try {
      for (const id of selectedTasks) {
        
        await fetch(`https://apifetchs753951.xyz/tasks`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id, status: true })
        });
      }

      selectedTasks.clear();
      await fetchTasks();
    } catch (error) {
      console.error('Erro ao concluir tarefas:', error);
    }
  });

  btnDeleteSelected.addEventListener('click', async () => {
    try {
      const selectedTasksArray = Array.from(selectedTasks);
      const pendingTasks = selectedTasksArray.filter(id => {
        const task = tasks.find(t => t.id === id);
        return !task.status;
      });

      const completedTasks = selectedTasksArray.filter(id => {
        const task = tasks.find(t => t.id === id);
        return task.status;
      });

      if (completedTasks.length > 0) {
        return alert(`⚠️ ${completedTasks.length} tarefa(s) concluída(s) não podem ser excluídas!\nElas serão preservadas como histórico.`);
      }

      if (pendingTasks.length === 0) {
        alert('Nenhuma tarefa não concluída selecionada!');
        return;
      }

      if (!confirm(`Deseja excluir ${pendingTasks.length} tarefa(s) pendente(s)?`)) {
        return;
      }

      for (const id of selectedTasks) {
        await fetch(`https://apifetchs753951.xyz/tasks/${id}`, {
          method: 'DELETE'
        });
      }

      selectedTasks.clear();
      await fetchTasks();
    } catch (error) {
      console.error('Erro ao deletar tarefas:', error);
    }
  });

  btnPending.addEventListener('click', () => {
    filter = 'all';
    updateFilterUI(btnPending);
    renderTasks();
  });

  btnCompleted.addEventListener('click', () => {
    filter = 'completed';
    updateFilterUI(btnCompleted);
    renderTasks();
  });

  function updateFilterUI(activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  fetchTasks();
});