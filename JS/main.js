const elements = {
    input: document.querySelector('.todo-input'),
    button: document.querySelector('.todo-btn'),
    list: document.querySelector('.todo-list'),
    themes: {
        standard: document.querySelector('.standard-theme'),
        light: document.querySelector('.light-theme'),
        darker: document.querySelector('.darker-theme')
    }
};

elements.button.addEventListener('click', handleAdd);
elements.list.addEventListener('click', handleAction);
document.addEventListener("DOMContentLoaded", loadTodos);
Object.keys(elements.themes).forEach(theme => 
    elements.themes[theme].addEventListener('click', () => applyTheme(theme))
);

let currentTheme = localStorage.getItem('savedTheme') || 'standard';
applyTheme(currentTheme);

function handleAdd(event) {
    event.preventDefault();
    if (!elements.input.value.trim()) return alert("Enter a task!");
    
    createTodo(elements.input.value);
    storeTodo(elements.input.value);
    elements.input.value = '';
}

function handleAction(event) {
    const target = event.target.closest('button');
    if (!target) return;
    
    const todo = target.parentElement;
    if (target.classList.contains('delete-btn')) {
        todo.classList.add("fall");
        removeStored(todo);
        todo.addEventListener('transitionend', () => todo.remove());
    } else if (target.classList.contains('check-btn')) {
        todo.classList.toggle("completed");
    }
}

function createTodo(text) {
    const div = document.createElement("div");
    div.className = `todo ${currentTheme}-todo`;
    
    const li = document.createElement('li');
    li.innerText = text;
    li.className = 'todo-item';
    div.appendChild(li);
    
    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = '<i class="fas fa-check"></i>';
    checkBtn.className = `check-btn ${currentTheme}-button`;
    div.appendChild(checkBtn);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = `delete-btn ${currentTheme}-button`;
    div.appendChild(deleteBtn);
    
    elements.list.appendChild(div);
}

function storeTodo(todo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    (JSON.parse(localStorage.getItem('todos')) || []).forEach(createTodo);
}

function removeStored(todo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    localStorage.setItem('todos', JSON.stringify(todos.filter(t => t !== todo.children[0].innerText)));
}

function applyTheme(theme) {
    localStorage.setItem('savedTheme', theme);
    currentTheme = theme;
    document.body.className = theme;
    document.getElementById('title').classList.toggle('darker-title', theme === 'darker');
    elements.input.className = `${theme}-input`;
    
    document.querySelectorAll('.todo').forEach(todo => {
        todo.className = `todo ${theme}-todo${todo.classList.contains('completed') ? ' completed' : ''}`;
    });
    
    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('check-btn')) {
            button.className = `check-btn ${theme}-button`;
        } else if (button.classList.contains('delete-btn')) {
            button.className = `delete-btn ${theme}-button`;
        } else if (button.classList.contains('todo-btn')) {
            button.className = `todo-btn ${theme}-button`;
        }
    });
}
