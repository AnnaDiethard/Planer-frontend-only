// без этого не работают бутстраповские тултипы
[...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
  .forEach(el => new bootstrap.Tooltip(el))

// moment().calendar();
console.log('calendar', moment().calendar())

function alertWindow() {
    alert('функционал в разработке')
}

// определение текущего дня недели
const thisDayName = new Date().toString().substring(0, 3).toLocaleLowerCase()
// открытие карточки текущего дня в недельном планере
const weekPlanerListCardArr = document.querySelector('#weekPlanerListCard').querySelectorAll('.card-body__list')
weekPlanerListCardArr.forEach(el => {
    if(el?.getAttribute('data-name') == thisDayName) {
        el.closest('div').classList.remove('hide-class')
        el.closest('.card').querySelector('#weekDayCardHeaderBtnClose').classList.remove('hide-class')
        el.closest('.card').querySelector('#weekDayCardHeaderBtnOpen').classList.add('hide-class')
        el.closest('.card_day-card').classList.remove('border-bottom-right-radius')
    }
})

let tasks = []
let doneTasks = []
let taskDate = ''
let dayOfWeek = ''
let taskWeekNumber = ''
const taskDialog = document.querySelector('#taskDialog')
const openValidationDialogBtn = document.querySelector('#validationDialogConfirm')

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

const validationDialog = document.querySelector('#validationDialog')
// окно валидации для подтверждения действия
function openValidationDialog() {
    validationDialog.showModal()
}

function validationDialogCancel() {
    window.location.reload()
}

function validationDialogConfirm() {
    validationDialog.close()
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
    cleanTaskForm()

    const titleAdd = document.querySelector('#modalTitleAdd')
    const buttonAdd = document.querySelector('#addTaskBtn')
    const buttonAddMore = document.querySelector('#addMoreTaskBtn')
    titleAdd.classList.add('hide-class')
    buttonAdd.classList.add('hide-class')
    buttonAddMore.classList.add('hide-class')

    const titleEdit = document.querySelector('#modalTitleEdit')
    const buttonEdit = document.querySelector('#editTaskBtn')
    titleEdit.classList.remove('hide-class')
    buttonEdit.classList.remove('hide-class')

    const cardEditStatusBlock = document.querySelector('#cardEditStatusBlock')
    cardEditStatusBlock.classList.remove('hide-class')
    const cardEditDateBlock = document.querySelector('#cardEditDateBlock')
    cardEditDateBlock.classList.remove('hide-class')

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

    const taskText = task.text
    let taskInput = document.querySelector("#addTaskInput")
    taskInput.value = taskText

    const taskStorypoints = task.storypoints
    let storypointsInput = document.querySelector("#storypointsTaskInput")
    storypointsInput.value = taskStorypoints

    let taskStatus = task?.status
    if(taskStatus != '') {
        const btnList = document.querySelector('#taskDialog').querySelectorAll('.btn-outline-light')
        btnList.forEach((el) => {
            if(el.id == taskStatus) {
                el.classList.add('active')
            }
        })
    }

    const colorBtn = document.querySelector('#taskTextColorDropdown')
    const taskTextColor = task?.color
    colorBtn.classList.add(taskTextColor)
    colorBtn.setAttribute('data-color', taskTextColor)
    
    taskDialog.showModal()
}

// закрытие окна
function closeTaskDialog() {
    taskDialog.close()

    // обновление страницы нужно чтобы задача рендерилась где надо
    window.location.reload();
}

// сохранение новой задачи
const addNewTaskButton = document.querySelector('#addTaskBtn')
addNewTaskButton.addEventListener('click', () => {
    createNewTask()
    cleanTaskForm()
    closeTaskDialog()
})

// сохранение новой (следующей) задачи
const addMoreNewTaskButton = document.querySelector('#addMoreTaskBtn')
addMoreNewTaskButton.addEventListener('click', () => {
    createNewTask()
    cleanTaskForm()
})

// создание новой задачи
let taskStatus = ''
let iconClass = ''

function chooseIcon(el) {
    taskStatus = el.id
    iconClass = el.querySelector('i').classList.value
    const btnArr = el.closest('.modal-dialog__btn-block').querySelectorAll('.btn-outline-light')
    btnArr.forEach(el => {
        if(el.classList.contains('active')) {
            el.classList.remove('active')
        }
    })
    el.classList.add('active')
}

// установка цвета текста задачи
let textColor = ''
const dropdownBtn = document.querySelector('#taskTextColorDropdown')
function chooseTaskTextColor(el) {
    cleanTaskTextColorDropdownClass()
    
    const colorClass = el.getAttribute('data-color')
    textColor = colorClass
    dropdownBtn.classList.add(colorClass)
    dropdownBtn.setAttribute('data-color', textColor)
}

function cleanTaskTextColorDropdownClass() {
    dropdownBtn.classList = ''
    dropdownBtn.classList.add('btn')
    dropdownBtn.classList.add('btn-secondary')
    dropdownBtn.classList.add('dropdown-toggle')
}

function createNewTask() {
    const taskInputValue = document.querySelector("#addTaskInput").value
    let storypointsInputValuee = document.querySelector("#storypointsTaskInput").value
    console.log('storypointsInputValuee', storypointsInputValuee)
    let storypointsInputValue = Number(storypointsInputValuee); 
    console.log('storypointsInputValue', storypointsInputValue)

    if(taskInputValue == '') {
        const errorText = document.querySelector('#errorText')
        errorText.classList.remove('hide-class')
    } else {
        const newTask = {
            id: Date.now(),
            text: taskInputValue,
            status: taskStatus || '',
            storypoints: storypointsInputValue,
            icon: iconClass || '',
            color: textColor || 'base-text-color',
            done: false,
            // определяется в конфиге календаря
            date: taskDate || '',
            dayName: dayOfWeek || '',
            weekNumber: taskWeekNumber || ''
        }
    
        tasks.push(newTask)
        saveTasksListInLocalStorage(tasks)
    
        checkCorrectRenderTask()
    }
}

// очистка элементов формы создания задачи
function cleanTaskForm() {
    const addTaskInputValue = document.querySelector("#addTaskInput")
    addTaskInputValue.value = ""
    const storypointsTaskInputValue = document.querySelector("#storypointsTaskInput")
    storypointsTaskInputValue.value = ""
    taskStatus = ''
    iconClass = ''
    taskDate = ''
    textColor = 'base-text-color'

    const checkedBtn = document.querySelector('#taskDialog').querySelectorAll('.btn-outline-light')
    checkedBtn.forEach(el => {
        if(el.classList.contains('active')) {
            el.classList.remove('active')
        }
    })
    
    const taskCalendarBtnArr = document.querySelector('#taskCalendar').querySelectorAll('button')
    taskCalendarBtnArr.forEach(el => {
        if(el.classList.contains('vanilla-calendar-day__btn_selected')) {
            el.classList.remove('vanilla-calendar-day__btn_selected')
        }
    })

    cleanTaskTextColorDropdownClass()
}

// сохранение отредактированной задачи
const editTaskBtn = document.querySelector('#editTaskBtn')
editTaskBtn.addEventListener('click', (el) => {
    el.preventDefault()

    const taskInputValue = document.querySelector("#addTaskInput").value
    const storypointsInputValue = document.querySelector("#storypointsTaskInput").value
    storypointsInputValue.replace(/^"(.+(?="$))"$/, '$1')

    if(taskInputValue == '') {
        const errorText = document.querySelector('#errorText')
        errorText.classList.remove('hide-class')
    } else {
        const id = document.querySelector('#taskDialog').taskId
        let changedTask = {}

        tasks.forEach((el) => {
            if(el.id == id) {
                changedTask = el
            }
            return changedTask
        })

        const taskIndex = tasks.indexOf(changedTask)

        const btnList = document.querySelector('#taskDialog').querySelectorAll('.btn-outline-light')
        btnList.forEach((el) => {
            if(el.classList.contains('active')) {
                taskStatus = el.id
                iconClass = el.querySelector('i').classList.value
            } else {
                taskStatus = taskStatus
                iconClass = iconClass
            }
        })

        const dropdownBtn = document.querySelector('#taskTextColorDropdown')
        textColor = dropdownBtn.getAttribute('data-color')

        let date = ''
        if(document.querySelector('input[type="checkbox"]:checked')) {
            date = ''
        } else if (taskDate == '') {
            date = changedTask.date
        } else {
            date = taskDate
        }

        let weekDay = ''
        if(dayOfWeek == '') {
            weekDay = changedTask.dayName
        } else {
            weekDay = dayOfWeek
        }

        let weekNumber = ''
        if(taskWeekNumber == '') {
            weekNumber = changedTask.weekNumber
        } else {
            weekNumber = taskWeekNumber
        }

        changedTask.text = taskInputValue
        changedTask.storypoints = storypointsInputValue
        changedTask.status = taskStatus
        changedTask.color = textColor
        changedTask.icon = iconClass
        changedTask.date = date
        changedTask.dayName = weekDay
        changedTask.weekNumber = weekNumber

        tasks[taskIndex] = changedTask
        saveTasksListInLocalStorage(tasks)

        closeTaskDialog()
    }
})

// проверка задач и разделение их на списки
function checkCorrectRenderTask() {
    const tasksRunningList = [];
    const tasksWeekPlaner = [];
    const tasksPlaner = [];

    tasks.forEach((task) => {
        // planning
        if(task.date == '' && task.status == '') {
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
            // тут сортируем массив по статусу задачи
            tasksWeekPlaner.sort((a, b) => parseInt(a.status) - parseInt(b.status))
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
        const taskHTML = `<li class="done-list__item" id="${task.id}" >
                            <p class="form-check-label_done" for="flexCheckDefault">${task.text}</p>
                        </li>`
        runningListCard.insertAdjacentHTML('beforeend', taskHTML)
    } else if(task.date && task.storypoints == '') {
        const taskHTML = `<li class="running-list__item" id="${task.id}">
                            <div class="running-list__task-block">
                                <div class="running-list__task-block-info">
                                    <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <div class="running-list__task-block-settings">
                                        <span class="running-list__status-icon"><i class="${task.icon}"></i></span>
                                    </div>
                                    <p class="form-check-label ${task.color}" for="flexCheckDefault">${task.text}</p>
                                </div>
                                <p class="form-date-label">дедлайн ${task.date}</p>
                            </div>
                            <div class="task-list__icon-block">
                                <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent task-icon" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                <span class="icon-secondary"><i class="fa-solid fa-trash task-icon" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                            </div>
                        </li>`
        runningListCard.insertAdjacentHTML('beforebegin', taskHTML)
    } else if(task.storypoints && task.date == '') {
        const taskHTML = `<li class="running-list__item" id="${task.id}">
                            <div class="running-list__task-block">
                                <div class="running-list__task-block-info">
                                    <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <div class="running-list__task-block-settings">
                                        <span class="running-list__status-icon"><i class="${task.icon}"></i></span>
                                        <button class="running-list__storypoints">${task.storypoints}</button>
                                    </div>
                                    <p class="form-check-label ${task.color}" for="flexCheckDefault">${task.text}</p>
                                </div>
                            </div>
                            <div class="task-list__icon-block">
                                <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent task-icon" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                <span class="icon-secondary"><i class="fa-solid fa-trash task-icon" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                            </div>
                        </li>`
        runningListCard.insertAdjacentHTML('beforebegin', taskHTML)
    } else if(task.date && task.storypoints) {
        const taskHTML = `<li class="running-list__item" id="${task.id}">
                            <div class="running-list__task-block">
                                <div class="running-list__task-block-info">
                                    <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <div class="running-list__task-block-settings">
                                        <span class="running-list__status-icon"><i class="${task.icon}"></i></span>
                                        <button class="running-list__storypoints">${task.storypoints}</button>
                                    </div>
                                    <p class="form-check-label ${task.color}" for="flexCheckDefault">${task.text}</p>
                                </div>
                                <p class="form-date-label">дедлайн ${task.date}</p>
                            </div>
                            <div class="task-list__icon-block">
                                <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent task-icon" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                <span class="icon-secondary"><i class="fa-solid fa-trash task-icon" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                            </div>
                        </li>`
        runningListCard.insertAdjacentHTML('beforebegin', taskHTML)
    } else {
        const taskHTML = `<li class="running-list__item" id="${task.id}">
                            <div class="running-list__task-block">
                                <div class="running-list__task-block-info">
                                    <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <div class="running-list__task-block-settings">
                                        <span class="running-list__status-icon"><i class="${task.icon}"></i></span>
                                        <button class="running-list__storypoints">${task.storypoints}</button>
                                    </div>
                                    <p class="form-check-label ${task.color}" for="flexCheckDefault">${task.text}</p>
                                </div>
                            </div>
                            <div class="task-list__icon-block">
                                <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent task-icon" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                <span class="icon-secondary"><i class="fa-solid fa-trash task-icon" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
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
            const taskHTML = `<li class="day-card-list__item-block" id="${task.id}">
                                <p class="form-check-label_done" for="flexCheckDefault">${task.text}</p>
                            </li>`
                        weekDayList.insertAdjacentHTML('beforeend', taskHTML)
        } else if(task.storypoints) {
            const taskHTML = `<li class="running-list__item" id="${task.id}">
                                <div class="running-list__task-block">
                                    <div class="running-list__task-block-info">
                                        <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                        <div class="running-list__task-block-settings">
                                            <span class="running-list__status-icon"><i class="${task.icon}"></i></span>
                                            <button class="running-list__storypoints">${task.storypoints}</button>
                                        </div>
                                        <p class="form-check-label ${task.color}" for="flexCheckDefault">${task.text}</p>
                                    </div>
                                </div>
                                <div class="task-list__icon-block">
                                    <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent task-icon" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-trash task-icon" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </li>`
            weekDayList.insertAdjacentHTML('beforebegin', taskHTML)
        } else {
            const taskHTML = `<li class="running-list__item" id="${task.id}">
                                <div class="running-list__task-block">
                                    <div class="running-list__task-block-info">
                                        <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                        <div class="running-list__task-block-settings">
                                            <span class="running-list__status-icon"><i class="${task.icon}"></i></span>
                                        </div>
                                        <p class="form-check-label ${task.color}" for="flexCheckDefault">${task.text}</p>
                                    </div>
                                </div>
                                <div class="task-list__icon-block">
                                    <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent task-icon" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-trash task-icon" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </li>`
            weekDayList.insertAdjacentHTML('beforebegin', taskHTML)
        }
    } else {
        if(task.done == true) {
            const taskHTML = `<li class="day-card-list__item" id="${task.id}">
                                <p class="form-check-label_done" for="flexCheckDefault">${task.text}</p>
                            </li>`
            nextWeekTasksList.insertAdjacentHTML('beforeend', taskHTML)
        } else if(task.storypoints) {
            const taskHTML = `<li class="running-list__item" id="${task.id}">
                                <div class="running-list__task-block">
                                    <div class="running-list__task-block-info">
                                        <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                        <div class="running-list__task-block-settings">
                                            <span class="running-list__status-icon"><i class="${task.icon}"></i></span>
                                            <button class="running-list__storypoints">${task.storypoints}</button>
                                        </div>
                                        <p class="form-check-label ${task.color}" for="flexCheckDefault">${task.text}</p>
                                    </div>
                                </div>
                                <div class="task-list__icon-block">
                                    <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent task-icon" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-trash task-icon" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </li>`
            nextWeekTasksList.insertAdjacentHTML('beforebegin', taskHTML)
        } else {
            const taskHTML = `<li class="running-list__item" id="${task.id}">
                                <div class="running-list__task-block">
                                    <div class="running-list__task-block-info">
                                        <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                        <div class="running-list__task-block-settings">
                                            <span class="running-list__status-icon"><i class="${task.icon}"></i></span>
                                        </div>
                                        <p class="form-check-label ${task.color}" for="flexCheckDefault">${task.text}</p>
                                    </div>
                                </div>
                                <div class="task-list__icon-block">
                                    <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent task-icon" style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-trash task-icon" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </li>`
            nextWeekTasksList.insertAdjacentHTML('beforebegin', taskHTML)
        }
    }
}

// рендер экземпляра новой задачи в список планов
function renderTaskToPlanningList(task) {
    const planningListCard = document.querySelector("#planningListCard")

    if(task.done == true) {
        const taskHTML = `<li class="done-list__item" id="${task.id}">
                            <p class="form-check-label_done" for="flexCheckDefault">${task.text}</p>
                        </li>`
            planningListCard.insertAdjacentHTML('beforeend', taskHTML)
    } else {
        const taskHTML = `<li class="plan-list__item" id="${task.id}">
                            <div class="plan-list__task-block">
                                <div class="plan-list__task-block-info">
                                    <input class="form-check-input plan-list__form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <p class="form-check-label ${task.color}" for="flexCheckDefault">${task.text}</p>
                                </div>
                                <div class="task-list__icon-block">
                                    <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent " style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-trash " style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
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
    openValidationDialog()
    openValidationDialogBtn.addEventListener('click', () => {
        getTasksListFromLocalStorage()

        tasks = tasks.filter(function(task) {
            return task.done == false
        })

        saveTasksListInLocalStorage(tasks)
        window.location.reload();
    })
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
    openValidationDialog()
    openValidationDialogBtn.addEventListener('click', () => {
        localStorage.removeItem('tasksList')
        localStorage.removeItem('doneTasksList')
        window.location.reload();
    })
}

// разворачивание карточки недельного планера
function expandWeekDayCard(el) {
    const btn = el.closest('div').querySelector('#weekDayCardHeaderBtnClose')
    el.classList.add('hide-class')
    btn.classList.remove('hide-class')
    el.closest('.card_day-card').querySelector('.card-body').classList.remove('hide-class')
    el.closest('.card_day-card').classList.remove('border-bottom-right-radius')
}

// сворачивание карточки недельного планера
function rollUpWeekDayCard(el) {
    const btn = el.closest('div').querySelector('#weekDayCardHeaderBtnOpen')
    el.classList.add('hide-class')
    btn.classList.remove('hide-class')
    el.closest('.card_day-card').querySelector('.card-body').classList.add('hide-class')
    el.closest('.card_day-card').classList.add('border-bottom-right-radius')
}

// поиск по задачам

function searchTasks() {
    const searchListCardItems = document.querySelector("#search").querySelectorAll('li')
    searchListCardItems.forEach(el => {
        el.remove()
    })

    const tasksTabContentItems = document.querySelector('#tasksTabContent').querySelectorAll('.tab-pane')
    tasksTabContentItems.forEach(el => {
        if(el.classList.contains('active')) {
            el.classList.remove('show')
            el.classList.remove('active')
        }
    })
    const tasksNavContentItems = document.querySelector('#tasksTab').querySelectorAll('.nav-link')
    tasksNavContentItems.forEach(el => {
        if(el.classList.contains('active')) {
            el.classList.remove('active')
        }
    })

    const searchListCard = document.querySelector('#search')
    searchListCard.classList.add('show')
    searchListCard.classList.add('active')
    const searchTasksInputValue = document.querySelector('#searchTasksInput').value

    tasks.forEach(el => {
        if(el.text.includes(searchTasksInputValue)) {
            renderTaskForSearch(el)
        }
    })
}

// рендер задачи для поиска
function renderTaskForSearch(task) {
    const searchListCard = document.querySelector("#searchListCard")

    if(task.done == true) {
        const taskHTML = `<li class="card-list__item" id="${task.id}" >
                            <div class="card-list__item-block">
                                <p class="form-check-label_done" for="flexCheckDefault">${task.text}</p>
                            </div>
                        </li>`
        searchListCard.insertAdjacentHTML('beforeend', taskHTML)
    } else if(task.date) {
        const taskHTML = `<li class="card-list__item" id="${task.id}">
                            <div class="block-between">
                                <div class="card-list__item-block">
                                    <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <span class="status-icon"><i class="${task.icon}"></i></span>
                                    <div>
                                        <p class="form-check-label" for="flexCheckDefault">${task.text}</p>
                                        
                                    </div>
                                </div>
                                <div class="card-item-icons-block">
                                    <span class="card-item-icon"><i class="fa-solid fa-pencil  button-icon-accent " style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span class="card-item-icon"><i class="fa-solid fa-trash " style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </div>
                            <p class="form-date-label">дедлайн ${task.date}</p>
                        </li>`
        searchListCard.insertAdjacentHTML('beforebegin', taskHTML)
    } else {
        const taskHTML = `<li class="card-list__item" id="${task.id}">
                                <div class="block-between">
                                    <div class="card-list__item-block">
                                        <input class="form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                        <span class="status-icon"><i class="${task.icon}"></i></span>
                                        <div>
                                            <p class="form-check-label" for="flexCheckDefault">${task.text}</p>
                                            
                                        </div>
                                    </div>
                                    <div class="card-item-icons-block">
                                        <span class="card-item-icon"><i class="fa-solid fa-pencil  button-icon-accent " style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                        <span class="card-item-icon"><i class="fa-solid fa-trash " style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                    </div>
                                </div>
                            </li>`
        searchListCard.insertAdjacentHTML('beforebegin', taskHTML)
    } 
}

// очистка строки поиска по кнопке
function cleanSearchInput() {
    const searchTasksInput = document.querySelector('#searchTasksInput')
    searchTasksInput.value = ''
}

// очистка строки поиска при выборе табов с задачами
const tasksTabItems = document.querySelector('#tasksTab').querySelectorAll('.nav-link')
tasksTabItems.forEach(el => {
    el.addEventListener('click', () => {
        cleanSearchInput()
    })
})

function addCalendarDateOpenDialog() {
    alertWindow()
}