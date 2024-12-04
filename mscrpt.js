const inputField = document.getElementsByClassName("app__controls-input")[0];
const submitButton = document.getElementsByClassName("app__controls-button")[0];
const taskList = document.getElementsByClassName("app__list")[0];

let taskIdCounter = 1;
let tasks = [];

// Загрузка данных из localStorage
if (localStorage.getItem('tasks') !== null) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

// Определение следующего ID задачи
tasks.forEach((task) => {
    if (task.id >= taskIdCounter) {
        taskIdCounter = task.id + 1;
    }
});

// Обработчик события на кнопку добавления задачи
submitButton.addEventListener('click', () => {
    const inputText = inputField.value.trim();
    if (inputText === "") return;

    tasks.push({
        id: taskIdCounter++,
        text: inputText,
        isCompleted: false
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskList();
    inputField.value = "";
});

// Функция для обновления списка задач
function updateTaskList() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

// Инициализация отображения задач
updateTaskList();

// Функция для создания элемента задачи
function createTaskElement(taskData) {
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('app__list-item');

    const checkbox = document.createElement('input');
    checkbox.classList.add('app__list-checkbox');
    checkbox.type = 'checkbox';
    checkbox.dataset.id = taskData.id; // Используем dataset для хранения id

    if (taskData.isCompleted) {
        taskContainer.classList.add('app__list-item_done');
        checkbox.checked = true;
    }

    const taskDescription = document.createElement('p');
    taskDescription.classList.add('app__list-text');
    taskDescription.innerText = taskData.text;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('app__list-btn');

    const trashIcon = document.createElement('img');
    trashIcon.src = 'VEC.png';

    deleteButton.appendChild(trashIcon);
    
    // Добавление элементов в контейнер задачи
    taskContainer.appendChild(checkbox);
    taskContainer.appendChild(taskDescription);
    taskContainer.appendChild(deleteButton);

    // Обработчик события на кнопку удаления задачи
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(taskContainer);
        tasks = tasks.filter(t => t.id !== taskData.id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

    // Обработчик изменения состояния чекбокса
    checkbox.addEventListener('change', (event) => {
        const index = tasks.findIndex(t => t.id === parseInt(checkbox.dataset.id));
        tasks[index].isCompleted = event.target.checked;

        if (event.target.checked) {
            taskContainer.classList.add('app__list-item_done');
        } else {
            taskContainer.classList.remove('app__list-item_done');
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

    return taskContainer;
}