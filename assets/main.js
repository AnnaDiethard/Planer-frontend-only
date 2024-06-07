let tasks = []
let doneTasks = []
let taskDate = ''
let dayOfWeek = ''

// рендер тудушника из LS
if (localStorage.getItem('tasksList')) {
	tasks = JSON.parse(localStorage.getItem('tasksList'))
	tasks.forEach((tasksItem) => renderTask(tasksItem))

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
function addNewTask() {
    const taskInputValue = document.querySelector("#addTaskInput").value
    const taskStatus = document.querySelector('input[type="radio"]:checked')?.closest('li').querySelector('span').id
    const iconClass = document.querySelector('input[type="radio"]:checked')?.closest('li').querySelector('i').classList.value
    const planningDate = Number(taskDate.replaceAll('-', ''))
    
    const newTask = {
        id: Date.now(),
        text: taskInputValue,
        status: taskStatus || '',
        icon: iconClass || '',
        // определяется в конфиге календаря
        date: planningDate || '',
        dayName: dayOfWeek
    }
    console.log('newTask', newTask)

    getTasksListFromLocalStorage()

    tasks.push(newTask)

    // тут сортируем массив по статусу задачи
    tasks.sort((a, b) => parseInt(a.status) - parseInt(b.status))

    saveTasksListInLocalStorage(tasks)

    renderTask(newTask)

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
    // window.location.reload();
}

// рендер экземпляра новой задачи
function renderTask(task) {
    const runningListCard = document.querySelector("#runningListCard")

    if(task.status === "4") {
        const taskHTML = `<li class="card-ul-item" id="${task.id}" style="display: flex; flex-direction: row; justify-content: space-between;">
                            <div>
                                <span class="runningList-icon-done"><i class="${task.icon} runningList-icon-done"></i></span>
                                <label class="form-check-label-done" for="flexCheckDefault">${task.text}</label>
                            </div>
                        </li>`
        runningListCard.insertAdjacentHTML('beforeend', taskHTML)
    } else if(task.date == '') {
        const taskHTML = `<li class="card-ul-item" id="${task.id}" style="display: flex; flex-direction: row; justify-content: space-between;">
                            <div>
                                <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                <span class="runningList-icon"><i class="${task.icon}"></i></span>
                                <label class="form-check-label" for="flexCheckDefault">${task.text}</label>
                            </div>
                            <span><i class="fa-solid fa-trash" style="font-size: 14px; color: gray;" onclick="deleteTasksFromRunningList(this)"></i></span>
                        </li>`
        runningListCard.insertAdjacentHTML('beforebegin', taskHTML)
    } else {
        const taskHTML = `<li class="card-ul-item" id="${task.id}" style="display: flex; flex-direction: row; justify-content: space-between;">
                            <div>
                                <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                <span class="runningList-icon"><i class="${task.icon}"></i></span>
                                <label class="form-check-label" for="flexCheckDefault">${task.text}</label>
                            </div>
                            <span><i class="fa-solid fa-trash" style="font-size: 14px; color: gray;" onclick="deleteTasksFromRunningList(this)"></i></span>
                        </li>`
        runningListCard.insertAdjacentHTML('beforebegin', taskHTML)
    }
}

// выделение выполненных задач
function markTheTaskCompleted(el) {
    getTasksListFromLocalStorage()
    const id = el.closest('li').id

    tasks.forEach((task) => {
        if(task.id == id) {
            task.status = '4'
        } 
    })

    saveTasksListInLocalStorage(tasks)
    window.location.reload();
}

// очистка списка от выполненных задач
function cleanTasksToRunningList() {
    getTasksListFromLocalStorage()

    tasks = tasks.filter(function(task) {
        return task.status != '4'
    })

    saveTasksListInLocalStorage(tasks)
    window.location.reload();
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
function deleteAllTasksToRunningList() {
    localStorage.removeItem('tasksList')
    localStorage.removeItem('doneTasksList')
    window.location.reload();
}
