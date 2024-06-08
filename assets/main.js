[...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
  .forEach(el => new bootstrap.Tooltip(el))

let tasks = []
let doneTasks = []
let taskDate = ''
let dayOfWeek = ''
const taskDialog = document.querySelector('#taskDialog')

// рендер тудушника из LS
if (localStorage.getItem('tasksList')) {
	tasks = JSON.parse(localStorage.getItem('tasksList'))
    checkCorrectRenderTask()
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

function addTaskOpenDialog() {
    const title = document.querySelector('#modalTitleEdit')
    const button = document.querySelector('#editTaskBtn')
    title.style.display = 'none';
    button.style.display = 'none';
    taskDialog.showModal()
}

function editTaskOpenDialog(el) {
    const title = document.querySelector('#modalTitleAdd')
    const button = document.querySelector('#addTaskBtn')
    title.style.display = 'none';
    button.style.display = 'none';
    taskDialog.showModal()
}

function closeTaskDialog() {
    taskDialog.close()

    // обновление страницы нужно чтобы задача рендерилась где надо
    window.location.reload();
}

// добавление новой задачи
function createNewTask() {
    const taskInputValue = document.querySelector("#addTaskInput").value
    const taskStatus = document.querySelector('input[type="radio"]:checked')?.closest('li').querySelector('span').id
    const iconClass = document.querySelector('input[type="radio"]:checked')?.closest('li').querySelector('i').classList.value
    const planningDate = Number(taskDate.replaceAll('-', ''))
    
    const newTask = {
        id: Date.now(),
        text: taskInputValue,
        status: taskStatus || '',
        icon: iconClass || '',
        done: false,
        // определяется в конфиге календаря
        date: planningDate || '',
        dayName: dayOfWeek
    }
    console.log('newTask', newTask)

    // getTasksListFromLocalStorage()
    tasks.push(newTask)
    saveTasksListInLocalStorage(tasks)

    checkCorrectRenderTask()

    // очистка элементов формы
    const addTaskInputValue = document.querySelector("#addTaskInput")
	addTaskInputValue.value = ""
    const checkedRadioBtn = document.getElementsByTagName('input');
    for(var i = 0; i < checkedRadioBtn.length; i++) {
        if(checkedRadioBtn[i].type == 'radio') {
            checkedRadioBtn[i].checked = false;
        }
    } 

    closeTaskDialog()
}

function editTask() {
    console.log(234)


}

function checkCorrectRenderTask() {
    const tasksRunningList = [];
    const tasksWeekPlaner = [];
    const tasksPlaner = [];

    tasks.forEach((task) => {
        // planning
        if(task.date == '' && task.status == '') {
            tasksPlaner.push(task)
        } else
        // runnungList
        if (task.date == '' && task.status) {
            tasksRunningList.push(task)
            // тут сортируем массив по статусу задачи
            tasksRunningList.sort((a, b) => parseInt(a.status) - parseInt(b.status))
        } else 
        // weekPlaner
        if(task.date) {
            tasksWeekPlaner.push(task)
        }
    })

    tasksRunningList.forEach((task) => {
        renderTaskToRunningList(task)
    })
    tasksWeekPlaner.forEach((task) => {
        renderTaskToWeekPlaner(task)
    })
    tasksPlaner.forEach((task) => {
        renderTaskToPlanningList(task)
    })
}

// рендер экземпляра новой задачи
function renderTaskToRunningList(task) {
    const runningListCard = document.querySelector("#runningListCard")

    if(task.done == true) {
        const taskHTML = `<li class="card-ul-item" id="${task.id}" style="display: flex; flex-direction: row; justify-content: space-between;">
                            <div>
                                <span class="runningList-icon-done"><i class="${task.icon} runningList-icon-done"></i></span>
                                <label class="form-check-label-done" for="flexCheckDefault">${task.text}</label>
                            </div>
                        </li>`
        runningListCard.insertAdjacentHTML('beforeend', taskHTML)
    } 
    else {
        const taskHTML = `<li class="card-ul-item" id="${task.id}" style="display: flex; flex-direction: row; justify-content: space-between;">
                            <div>
                                <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                <span class="runningList-icon"><i class="${task.icon}"></i></span>
                                <label class="form-check-label" for="flexCheckDefault">${task.text}</label>
                            </div>
                            <div>
                                <span ><i class="fa-solid fa-pencil card-body__btn-task-running-list" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                <span ><i class="fa-solid fa-trash card-body__btn-task-running-list" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                            </div>
                        </li>`
        runningListCard.insertAdjacentHTML('beforebegin', taskHTML)
    }
}

function renderTaskToWeekPlaner(task) {
    const weekPlanerListCard = document.querySelector("#weekPlanerListCard")

    if(task.done == true) {
        const taskHTML = `<li class="card-ul-item" id="${task.id}" style="display: flex; flex-direction: row; justify-content: space-between;">
                            <div>
                                <span class="runningList-icon-done"><i class="${task.icon} runningList-icon-done"></i></span>
                                <label class="form-check-label-done" for="flexCheckDefault">${task.text}</label>
                            </div>
                        </li>`
            weekPlanerListCard.insertAdjacentHTML('beforeend', taskHTML)
    } else {
        const taskHTML = `<li class="card-ul-item" id="${task.id}" style="display: flex; flex-direction: row; justify-content: space-between;">
                        <div>
                            <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                            <span class="runningList-icon"><i class="${task.icon}"></i></span>
                            <label class="form-check-label" for="flexCheckDefault">${task.text}</label>
                        </div>
                        <div>
                            <span style="padding-left: 0.5rem"><i class="fa-solid fa-pencil card-body__btn-task-running-list" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                            <span style="padding-left: 0.5rem"><i class="fa-solid fa-trash card-body__btn-task-running-list" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                        </div>
                    </li>`
            weekPlanerListCard.insertAdjacentHTML('beforebegin', taskHTML)
    }
}

function renderTaskToPlanningList(task) {
    const planningListCard = document.querySelector("#planningListCard")

    if(task.done == true) {
        const taskHTML = `<li class="card-ul-item" id="${task.id}" style="display: flex; flex-direction: row; justify-content: space-between;">
                            <div>
                                <span class="runningList-icon-done"><i class="${task.icon} runningList-icon-done"></i></span>
                                <label class="form-check-label-done" for="flexCheckDefault">${task.text}</label>
                            </div>
                        </li>`
            planningListCard.insertAdjacentHTML('beforeend', taskHTML)
    } else {
        const taskHTML = `<li class="card-ul-item" id="${task.id}" style="display: flex; flex-direction: row; justify-content: space-between;">
                            <div>
                                <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                <span class="runningList-icon"><i class="${task.icon}"></i></span>
                                <label class="form-check-label" for="flexCheckDefault">${task.text}</label>
                            </div>
                            <div>
                                <span style="padding-left: 0.5rem"><i class="fa-solid fa-pencil card-body__btn-task-running-list" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                <span style="padding-left: 0.5rem"><i class="fa-solid fa-trash card-body__btn-task-running-list" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                            </div>
                        </li>`
        planningListCard.insertAdjacentHTML('beforebegin', taskHTML)
    }
}

// выделение выполненных задач
function markTheTaskCompleted(el) {
    getTasksListFromLocalStorage()
    const id = el.closest('li').id

    tasks.forEach((task) => {
        if(task.id == id) {
            task.done = true
        } 
    })

    saveTasksListInLocalStorage(tasks)
    window.location.reload();
}

// очистка списка от выполненных задач
function deleteDoneTasks() {
    getTasksListFromLocalStorage()

    tasks = tasks.filter(function(task) {
        return task.done == false
    })

    saveTasksListInLocalStorage(tasks)
    window.location.reload();
}

// удаление выбранной задачи
function deleteTask(el) {
    const deletedTasks = el.closest('li')
    const id = deletedTasks.id

    deletedTasks.remove()

    tasks = tasks.filter(function(task) {
        return task.id != id
    })
    saveTasksListInLocalStorage(tasks)
}

// очистка всего списка задач
function deleteAllTasks() {
    localStorage.removeItem('tasksList')
    localStorage.removeItem('doneTasksList')
    window.location.reload();
}

function addCalendarDateOpenDialog() {
    const dialog = document.querySelector('#calendarDateDialog')
    dialog.showModal()
}