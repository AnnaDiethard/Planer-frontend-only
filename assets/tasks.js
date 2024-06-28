// без этого не работают бутстраповские тултипы
[...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
  .forEach(el => new bootstrap.Tooltip(el))

// moment().calendar();
console.log('calendar', moment().calendar())

function alertWindow() {
    alert('функционал в разработке')
}

let tasks = []
let doneTasks = []
let taskDate = ''
let dayOfWeek = ''
let taskWeekNumber = ''
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

// открытие окна задачи (добавление)
function addTaskOpenDialog() {
    const title = document.querySelector('#modalTitleEdit')
    const button = document.querySelector('#editTaskBtn')
    title.style.display = 'none';
    button.style.display = 'none';

    const editBlockArr = document.querySelectorAll('.edit-card-choose-block')
    editBlockArr.forEach(el => {
        el.style.display = 'none'
    })

    taskDialog.showModal()
}

// открытие окна задачи (редактирование)
function editTaskOpenDialog(el) {
    const title = document.querySelector('#modalTitleAdd')
    const button = document.querySelector('#addTaskBtn')
    title.style.display = 'none';
    button.style.display = 'none';

    const getTaskId = el.closest('li').id
    taskDialog.taskId = getTaskId

    let task = {}
    
    tasks.filter((el) => {
        if(el.id == getTaskId) {
            task = el
        }
        return task
    })

    const taskDate = task?.date.toString()
    const taskCalendarDays = document.querySelector("#taskCalendar").querySelectorAll('.vanilla-calendar-day')
    let calendarDay = {}
    taskCalendarDays.forEach((el) => {
        if(el.querySelector('button').getAttribute('Data-calendar-day') == taskDate) {
            calendarDay = el
            calendarDay.querySelector('button').classList.add('vanilla-calendar-day__btn_selected')
            return calendarDay
        }
    })
    const deleteTaskDateCheckbox = document.querySelector('#deleteTaskDateCheckbox')
    if(deleteTaskDateCheckbox == 'checked') {
        taskDate = null
    }

    const taskText = task.text
    let taskInput = document.querySelector("#addTaskInput")
    taskInput.value = taskText

    const taskStatus = task?.status
    if(taskStatus != '') {
        const checkboxList = document.querySelector('#taskDialog').querySelectorAll('.task-status-icon')
        checkboxList.forEach((el) => {
            if(el.closest('li').querySelector('span').id == taskStatus) {
                el.checked = true
            }
        })
    }
    
    taskDialog.showModal()
}

// закрытие окна
function closeTaskDialog() {
    taskDialog.close()

    // обновление страницы нужно чтобы задача рендерилась где надо
    window.location.reload();
}

// сохранение новой задачи
function createNewTask() {
    const taskInputValue = document.querySelector("#addTaskInput").value
    const taskStatus = document.querySelector('input[type="radio"]:checked')?.closest('li').querySelector('span').id
    const iconClass = document.querySelector('input[type="radio"]:checked')?.closest('li').querySelector('i').classList.value
    
    const newTask = {
        id: Date.now(),
        text: taskInputValue,
        status: taskStatus || '',
        icon: iconClass || '',
        done: false,
        // определяется в конфиге календаря
        date: taskDate || '',
        dayName: dayOfWeek || '',
        weekNumber: taskWeekNumber || ''
    }
    console.log('newTask', newTask)

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

// сохранение отредактированной задачи
function editTask() {
    const id = document.querySelector('#taskDialog').taskId
    let changedTask = {}

    tasks.forEach((el) => {
        if(el.id == id) {
            changedTask = el
        }
        return changedTask
    })

    const taskIndex = tasks.indexOf(changedTask)

    const taskInputValue = document.querySelector("#addTaskInput").value
    const taskStatus = document.querySelector('#taskDialog').querySelector('input[type="radio"]:checked')?.closest('li')?.querySelector('span').id
    console.log('taskStatus', taskStatus)
    const iconClass = document.querySelector('#taskDialog').querySelector('input[type="radio"]:checked')?.closest('li')?.querySelector('i')?.classList.value
    console.log('iconClass', iconClass)
    // let taskStatus = null
    // let iconClass = null
    // if(document.querySelector('input[type="radio"]:checked')) {
    //     taskStatus = document.querySelector('input[type="radio"]:checked')?.closest('li')?.querySelector('span').id
    //     iconClass = document.querySelector('input[type="radio"]:checked')?.closest('li')?.querySelector('i').classList.value
    // } else {
    //     taskStatus = ''
    //     iconClass = ''
    // }

    changedTask.text = taskInputValue
    changedTask.status = taskStatus
    changedTask.icon = iconClass
    changedTask.date = taskDate
    changedTask.dayName = dayOfWeek
    changedTask.weekNumber = taskWeekNumber

    tasks[taskIndex] = changedTask
    saveTasksListInLocalStorage(tasks)

    // closeTaskDialog()
}

// проверка задач и разделение их на списки
function checkCorrectRenderTask() {
    const tasksRunningList = [];
    const tasksWeekPlaner = [];
    const tasksPlaner = [];

    tasks.forEach((task) => {
        // planning
        if(task.date == '' && task.status == '0') {
            tasksPlaner.push(task)
        }
        // runnungList
        if (task.icon) {
            tasksRunningList.push(task)
            // тут сортируем массив по статусу задачи
            tasksRunningList.sort((a, b) => parseInt(a.status) - parseInt(b.status))
        }
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

// рендер экземпляра новой задачи в Rl
function renderTaskToRunningList(task) {
    const runningListCard = document.querySelector("#runningListCard")

    if(task.done == true) {
        const taskHTML = `<li class="card-ul-item" id="${task.id}" >
                            <div class="task-item-block">
                                <span class="runningList-icon-done"><i class="${task.icon} runningList-icon-done"></i></span>
                                <p class="form-check-label-done" for="flexCheckDefault">${task.text}</p>
                            </div>
                        </li>`
        runningListCard.insertAdjacentHTML('beforeend', taskHTML)
    } else if(task.date) {
        const taskHTML = `<li class="card-ul-item" id="${task.id}">
                            <div class="card-ul-item-body">
                                <div class="task-item-block">
                                    <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <span class="runningList-icon"><i class="${task.icon}"></i></span>
                                    <div>
                                        <p class="form-check-label" for="flexCheckDefault">${task.text}</p>
                                        
                                    </div>
                                </div>
                                <div class="card-item-icons-block">
                                    <span ><i class="fa-solid fa-pencil card-body__btn-task-running-list" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span ><i class="fa-solid fa-trash card-body__btn-task-running-list" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </div>
                            <p class="form-date-label">дедлайн ${task.date}</p>
                        </li>`
        runningListCard.insertAdjacentHTML('beforebegin', taskHTML)
    } else {
        const taskHTML = `<li class="card-ul-item" id="${task.id}">
                                <div class="card-ul-item-body">
                                <div class="task-item-block">
                                    <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <span class="runningList-icon"><i class="${task.icon}"></i></span>
                                    <div>
                                        <p class="form-check-label" for="flexCheckDefault">${task.text}</p>
                                        
                                    </div>
                                </div>
                                <div class="card-item-icons-block">
                                    <span ><i class="fa-solid fa-pencil card-body__btn-task-running-list" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span ><i class="fa-solid fa-trash card-body__btn-task-running-list" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </div>
                        </li>`
        runningListCard.insertAdjacentHTML('beforebegin', taskHTML)
    }
}

// рендер экземпляра новой задачи в недельный планер
function renderTaskToWeekPlaner(task) {
    const taskDay = task.dayName
    const weekDayList = document.querySelector("[data-name=" + taskDay + "]")
    const nextWeekTasksList = document.querySelector('#nextWeekTasks')

    const getThisWeekNumber = JSON.parse(localStorage.getItem('weekPlanerWeekNumber'))
    let weekNumber = document.querySelector('#weekPlanerListCard').getAttribute('week-number')
    weekNumber = getThisWeekNumber

    if(weekNumber == task.weekNumber) {
        if(task.done == true) {
            const taskHTML = `<li class="card-ul-item" id="${task.id}">
                                <div class="task-item-block">
                                    <span class="runningList-icon-done"><i class="${task.icon} runningList-icon-done"></i></span>
                                    <p class="form-check-label-done" for="flexCheckDefault">${task.text}</p>
                                </div>
                            </li>`
                        weekDayList.insertAdjacentHTML('beforeend', taskHTML)
        } else {
            const taskHTML = `<li class="card-ul-item" id="${task.id}">
                                    <div class="card-ul-item-body">
                                    <div class="task-item-block">
                                        <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                        <span class="runningList-icon"><i class="${task.icon}"></i></span>
                                        <div>
                                            <p class="form-check-label" for="flexCheckDefault">${task.text}</p>
                                            
                                        </div>
                                    </div>
                                    <div class="card-item-icons-block">
                                        <span ><i class="fa-solid fa-pencil card-body__btn-task-running-list" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                        <span ><i class="fa-solid fa-trash card-body__btn-task-running-list" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                    </div>
                                </div>
                            </li>`
            weekDayList.insertAdjacentHTML('beforebegin', taskHTML)
            
        }
    } else {
        const taskHTML = `<li class="card-ul-item" id="${task.id}">
                            <div class="card-ul-item-body">
                                <div class="task-item-block">
                                    <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <span class="runningList-icon"><i class="${task.icon}"></i></span>
                                    <div>
                                        <p class="form-check-label" for="flexCheckDefault">${task.text}</p>
                                        
                                    </div>
                                </div>
                                <div class="card-item-icons-block">
                                    <span ><i class="fa-solid fa-pencil card-body__btn-task-running-list" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span ><i class="fa-solid fa-trash card-body__btn-task-running-list" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </div>
                            <p class="form-date-label">дедлайн ${task.date}</p>
                        </li>`
            nextWeekTasksList.insertAdjacentHTML('beforebegin', taskHTML)
    }
}

// рендер экземпляра новой задачи в список планов
function renderTaskToPlanningList(task) {
    const planningListCard = document.querySelector("#planningListCard")

    if(task.done == true) {
        const taskHTML = `<li class="card-ul-item" id="${task.id}">
                            <div class="task-item-block">
                                <span class="runningList-icon-done"><i class="${task.icon} runningList-icon-done"></i></span>
                                <p class="form-check-label-done" for="flexCheckDefault">${task.text}</p>
                            </div>
                        </li>`
            planningListCard.insertAdjacentHTML('beforeend', taskHTML)
    } else {
        const taskHTML = `<li class="card-ul-item" id="${task.id}">
                            <div class="card-ul-item-body">
                            <div class="task-item-block">
                                <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                <span class="runningList-icon"><i class="${task.icon}"></i></span>
                                <div>
                                    <p class="form-check-label" for="flexCheckDefault">${task.text}</p>
                                    
                                </div>
                            </div>
                            <div class="card-item-icons-block">
                                <span ><i class="fa-solid fa-pencil card-body__btn-task-running-list" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                <span ><i class="fa-solid fa-trash card-body__btn-task-running-list" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                            </div>
                        </div>
                    </li>`
        planningListCard.insertAdjacentHTML('beforebegin', taskHTML)
    }
}

// вычёркивание выполненных задач
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

// удаление всего списка задач
function deleteAllTasks() {
    localStorage.removeItem('tasksList')
    localStorage.removeItem('doneTasksList')
    window.location.reload();
}

function addCalendarDateOpenDialog() {
    alertWindow()
}