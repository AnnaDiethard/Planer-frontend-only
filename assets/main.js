let tasks = []

// рендер тудушника из LS
if (localStorage.getItem('tasksList')) {
	tasks = JSON.parse(localStorage.getItem('tasksList'))
	tasks.forEach((tasksItem) => renderNewTask(tasksItem))
}

// сохранение задач в LS
function saveTasksListInLocalStorage(tasks) {
    localStorage.setItem('tasksList', JSON.stringify(tasks))
}

// получение задач из LS
function getTasksListFromLocalStorage() {
    tasksList = JSON.parse(localStorage.getItem('tasksList'))

    return tasksList
}

// добавление новой задачи
function addNewTaskToRunningList() {
    const taskInputValue = document.querySelector("#addTaskInput").value
    const taskStatus = document.querySelector('input[type="radio"]:checked').closest('li').querySelector('span').id
    const iconClass = document.querySelector('input[type="radio"]:checked').closest('li').querySelector('i').classList.value

    const newTask = {
        id: Date.now(),
        text: taskInputValue,
        status: taskStatus,
        icon: iconClass
    }

    getTasksListFromLocalStorage()

    tasks.push(newTask)

    // тут сортируем массив по статусу задачи
    tasks.sort((a, b) => parseInt(a.status) - parseInt(b.status))

    saveTasksListInLocalStorage(tasks)

    renderNewTask(newTask)

    // очистка элементов формы
    const addTaskInputValue = document.querySelector("#addTaskInput")
	addTaskInputValue.value = ""

    const checkedRadioBtn = document.getElementsByTagName('input');
    for(var i = 0; i < checkedRadioBtn.length; i++) {
        if(checkedRadioBtn[i].type == 'radio') {
            checkedRadioBtn[i].checked = false;
        }
    } 

    // обновление страницы нужно чтобы задача рендерилась где надо
    window.location.reload();
}

// рендер экземпляра задачи
function renderNewTask(task) {
    const runningListCard = document.querySelector("#runningListCard")
	const taskHTML = `<li class="card-ul-item" id="${task.id}" style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div>
                            <input class="form-check-input" type="checkbox">
                            <span class="runningList-icon"><i class="${task.icon}"></i></span>
                            <label class="form-check-label" for="flexCheckDefault">${task.text}</label>
                        </div>
                        <span><i class="fa-solid fa-trash" style="font-size: 14px; color: gray;" onclick="deleteTasksFromRunningList(this)"></i></span>
                    </li>`

    runningListCard.insertAdjacentHTML('beforeend', taskHTML)
}

// удаление выбранной задачи
function deleteTasksFromRunningList(el) {
    const deletedTasks = el.closest('li')
    const id = deletedTasks.id

    deletedTasks.remove()

    tasks = tasks.filter(function(task) {
        return task.id != id
    })

    saveTasksListInLocalStorage(tasks)
}

// очистка всего списка задач
function deleteAllTaskToRunningList() {
    localStorage.removeItem('tasksList')
    window.location.reload();
}