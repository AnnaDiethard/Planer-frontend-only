// без этого не работают бутстраповские тултипы
[...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
  .forEach(el => new bootstrap.Tooltip(el))

// moment().calendar();
moment.locale('ru')
console.log('calendar', moment().calendar())

function alertWindow() {
    alert('функционал в разработке')
}

let taskTemplate = ''
let taskDateTemplate = ''
let doneTaskTemplate = ''
 
// сброс номера недели задачи при смене недели на следующую
const getThisWeekNumber = JSON.parse(localStorage.getItem('weekPlanerWeekNumber'))
let thisWeekNumber = document.querySelector('#weekPlanerListCard').getAttribute('week-number')
thisWeekNumber = getThisWeekNumber
const getTasksForCheckWeekNumber = JSON.parse(localStorage.getItem('tasksList'))
if(getTasksForCheckWeekNumber != null) {
    getTasksForCheckWeekNumber.forEach(el => {
        if(el.weekNumber != '' && el.weekNumber < thisWeekNumber) {
            el.weekNumber = ""
            el.date = ""
            el.dayName = ""
            el.expired = true
        }
    })
}
localStorage.setItem('tasksList', JSON.stringify(getTasksForCheckWeekNumber))

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

// установка активного таба задач
let getActiveTaskTabItem = sessionStorage.getItem('saveActiveTaskTabItem')

if(getActiveTaskTabItem == null) {
    const baseTaskBtn = document.querySelector('#week-planer-tab')
    baseTaskBtn.classList.add('active')
    baseTaskBtn.classList.add('nav-link-active')
    const baseTaskTab = document.querySelector('#week-planer')
    baseTaskTab.classList.add('show')
    baseTaskTab.classList.add('active')
} else {
    const tasksTabContentBtnItems = document.querySelector('#tasksTab').querySelectorAll('.nav-link')
    tasksTabContentBtnItems.forEach(el => {
        if(getActiveTaskTabItem.includes(el.id)) {
            el.classList.add('active')
            el.classList.add('nav-link-active')
        }
    })
    const tasksTabContentBlockItems = document.querySelector('#tasksTabContent').querySelectorAll('.tab-pane')
    tasksTabContentBlockItems.forEach(el => {
        if(getActiveTaskTabItem.includes(el.id)) {
            el.classList.add('show')
            el.classList.add('active')
        }
    })
}

// сохранение в течении сессии выбранного таба задач
function saveActiveTaskTab(el) {
    const saveActiveTaskTabId = el.id
    getActiveTaskTabItem = saveActiveTaskTabId
    sessionStorage.setItem('saveActiveTaskTabItem', JSON.stringify(getActiveTaskTabItem))
}

// устнановка глобальных переменных
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
    if(tasks != null) {
        checkCorrectRenderTask()
    } else {
        tasks = []
    }
    
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

// открытие/скрытие поиска TODO: переписать чтобы можно было переиспользовать
function openSearchBlock() {
    const searchTasksBlock = document.querySelector('#searchTasksBlock')
    if(searchTasksBlock.classList.contains('hide-class')) {
        searchTasksBlock.classList.remove('hide-class')
    } else {
        searchTasksBlock.classList.add('hide-class')
    }
}

// поиск по задачам (по тексту) TODO: переписать чтобы можно было переиспользовать
function searchTasks() {
    search()

    const searchTasksInputValue = document.querySelector('#searchTasksInput').value
    tasks.forEach(el => {
        if(el.text.includes(searchTasksInputValue) || el.description.includes(searchTasksInputValue)) {
            renderTaskForSearch(el)
        }
    })
}

// поиск по цвету текста
function chooseSearchTextColor(el) {
    const color = el.getAttribute('data-color')

    search()

    tasks.forEach(el => {
        if(el.color.includes(color)) {
            renderTaskForSearch(el)
        }
    })
}

// очистка строки поиска по кнопке TODO: переписать чтобы можно было переиспользовать
function cleanSearchInput() {
    const searchTasksInput = document.querySelector('#searchTasksInput')
    searchTasksInput.value = ''
    const searchListCardItems = document.querySelector("#search").querySelectorAll('li')
    searchListCardItems.forEach(el => {
        el.remove()
    })
    window.location.reload()
}

// очистка строки поиска при выборе табов с задачами TODO: переписать чтобы можно было переиспользовать
const tasksTabItems = document.querySelector('#tasksTab').querySelectorAll('.nav-link')
tasksTabItems.forEach(el => {
    el.addEventListener('click', () => {
        cleanSearchInput()
    })
})

// рендер поисковика по задачам - в планерах
function search() {
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
    
}

// рендер задачи для поиска - в планерах
function renderTaskForSearch(task) {
    const searchListCard = document.querySelector("#searchListCard")

    if(task.done == true) {
        const taskHTML = `<li class="card-list__item" id="${task.id}" >
                            <div class="card-list__item-block">
                                <p class="form-check-label_done" for="flexCheckDefault">${task.text}</p>
                            </div>
                        </li>`
        searchListCard.insertAdjacentHTML('beforeend', taskHTML)
    } else if(task.date && task.storypoints == '') {
        const taskHTML = `<li class="task-list__item" id="${task.id}">
                            <div class="task-list__task-block">
                                <div class="task-list__task-block-info">
                                    <input class="task-list__form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <div class="task-list__task-block-settings">
                                        <span class="task-list__status-icon"><i class="${task.icon}"></i></span>
                                    </div>
                                    <p class="form-check-label task-text__text ${task.color}" for="flexCheckDefault">${task.text}</p>
                                </div>
                                <div class="task-list__icon-block">
                                    <span class="icon-secondary"><i class="fa-solid fa-info button-icon-accent" style="font-size: 16px; padding-right: 5px"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent " style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-trash" style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </div>
                            <p class="form-date-label">дедлайн ${task.date}</p>
                            <p class="task-text__label hide-class">${task.description}</p>
                        </li>`
                        
        searchListCard.insertAdjacentHTML('beforebegin', taskHTML)
    } else if(task.storypoints && task.date == '') {
        const taskHTML = `<li class="task-list__item" id="${task.id}">
                            <div class="task-list__task-block">
                                <div class="task-list__task-block-info">
                                    <input class="task-list__form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <div class="task-list__task-block-settings">
                                        <span class="task-list__status-icon"><i class="${task.icon}"></i></span>
                                        <button class="task-list__storypoints">${task.storypoints}</button>
                                    </div>
                                    <p class="form-check-label task-text__text ${task.color}" for="flexCheckDefault">${task.text}</p>
                                </div>
                                <div class="task-list__icon-block">
                                    <span class="icon-secondary"><i class="fa-solid fa-info button-icon-accent" style="font-size: 16px; padding-right: 5px"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent " style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-trash " style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </div>
                            <p class="task-text__label hide-class">${task.description}</p>
                        </li>`
        searchListCard.insertAdjacentHTML('beforebegin', taskHTML)
    } else if(task.date && task.storypoints) {
        const taskHTML = `<li class="task-list__item" id="${task.id}">
                            <div class="task-list__task-block">
                                <div class="task-list__task-block-info">
                                    <input class="task-list__form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <div class="task-list__task-block-settings">
                                        <span class="task-list__status-icon"><i class="${task.icon}"></i></span>
                                        <button class="task-list__storypoints">${task.storypoints}</button>
                                    </div>
                                    <p class="form-check-label task-text__text ${task.color}" for="flexCheckDefault">${task.text}</p>
                                </div>
                                <div class="task-list__icon-block">
                                    <span class="icon-secondary"><i class="fa-solid fa-info button-icon-accent" style="font-size: 16px; padding-right: 5px"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent " style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-trash " style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </div>
                            <p class="form-date-label">дедлайн ${task.date}</p>
                            <p class="task-text__label hide-class">${task.description}</p>
                        </li>`
        searchListCard.insertAdjacentHTML('beforebegin', taskHTML)
    } else {
        const taskHTML = `<li class="task-list__item" id="${task.id}">
                            <div class="task-list__task-block">
                                <div class="task-list__task-block-info">
                                    <input class="task-list__form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                    <div class="task-list__task-block-settings">
                                        <span class="task-list__status-icon"><i class="${task.icon}"></i></span>
                                    </div>
                                    <p class="form-check-label task-text__text ${task.color}" for="flexCheckDefault">${task.text}</p>
                                </div>
                                <div class="task-list__icon-block">
                                    <span class="icon-secondary"><i class="fa-solid fa-info button-icon-accent" style="font-size: 16px; padding-right: 5px"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent " style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                    <span class="icon-secondary"><i class="fa-solid fa-trash " style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                                </div>
                            </div>
                            <p class="task-text__label hide-class">${task.description}</p>
                        </li>`
        searchListCard.insertAdjacentHTML('beforebegin', taskHTML)
    }
}

// всплывающий блок с информацией по задачам дневной карточки
const weekPlanerCardHeaders = document.querySelector('#weekPlanerListCard').querySelectorAll('.card-header__text')
weekPlanerCardHeaders.forEach(el => {
    const tableBlock = el.closest('.card').querySelector('.table-block')
    // console.log('tableBlock', tableBlock)
    

    el.addEventListener('mouseover', function handleMouseOver() {
        const card = el.closest('.card')
        const allTasksArr = card.querySelectorAll('li')
        const allTasksSum = allTasksArr.length
        let allStorypointsSum = 0
        allTasksArr.forEach(el => {
            let storypoints = '' 
            if(el.querySelector('.task-list__storypoints')) {
                storypoints = el.querySelector('.task-list__storypoints').innerText
            } else {
                storypoints = 0
            }
            storypoints = Number(storypoints)
            allStorypointsSum = allStorypointsSum + storypoints
        })

        const doneTasksArr = card.querySelector('.card-body').querySelectorAll('.day-card-list__item-block')
        const doneTasksSum = doneTasksArr.length
        let doneStorypointsSum = 0
        doneTasksArr.forEach(el => {
            let storypoints = '' 
            if(el.querySelector('.task-list__storypoints')) {
                storypoints = el.querySelector('.task-list__storypoints').innerText
            } else {
                storypoints = 0
            }
            storypoints = Number(storypoints)
            doneStorypointsSum = doneStorypointsSum + storypoints
        })

        const tasksInProgressArr = card.querySelector('.card-body').querySelectorAll('.task-list__task-block')
        const tasksInProgressSum = tasksInProgressArr.length
        let storypointsInProgressSum = 0
        tasksInProgressArr.forEach(el => {
            let storypoints = '' 
            if(el.querySelector('.task-list__storypoints')) {
                storypoints = el.querySelector('.task-list__storypoints').innerText
            } else {
                storypoints = 0
            }
            storypoints = Number(storypoints)
            storypointsInProgressSum = storypointsInProgressSum + storypoints
        })

        labelHTML = `<table class="table">
                    <tr class="table-row">
                        <td class="table-row-item">количество задач</td>
                        <td class="table-row-item">${allTasksSum}</td>
                    </tr>
                    <tr class="table-row">
                        <td class="table-row-item">общий вес</td>
                        <td class="table-row-item">${allStorypointsSum}</td>
                    </tr>
                    <tr class="table-row">
                        <td class="table-row-item">закрытые задачи</td>
                        <td class="table-row-item">${doneTasksSum}</td>
                    </tr>
                    <tr class="table-row">
                        <td class="table-row-item">закрытые сторипоинты</td>
                        <td class="table-row-item">${doneStorypointsSum}</td>
                    </tr>
                    <tr class="table-row">
                        <td class="table-row-item">задачи в процессе</td>
                        <td class="table-row-item">${tasksInProgressSum}</td>
                    </tr>
                    <tr class="table-row">
                        <td class="table-row-item">сторипоинты в процессе</td>
                        <td class="table-row-item">${storypointsInProgressSum}</td>
                    </tr>
                </table>`
        tableBlock.insertAdjacentHTML('beforebegin', labelHTML)
        tableBlock.classList.add('show-class')
    })
    el.addEventListener('mouseout', function handleMouseOut() {
        const table = el.closest('.card').querySelector('.table')
        table.remove()
    })
})

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

    // выбор номера недели (без выбора дня)
    let taskCalendarDaysArr = ''
    taskCalendarDaysArr = document.querySelector("#taskCalendar").querySelectorAll('.vanilla-calendar-week-number')
    let arrowBtnArr = document.querySelector("#taskCalendar").querySelectorAll('.vanilla-calendar-arrow')
    arrowBtnArr.forEach(el => {
        el.addEventListener('click', () => {
            // этот кринж нужен чтобы корректно подцеплять номера недель
            setTimeout(() => {
                taskCalendarDaysArr = document.querySelector("#taskCalendar").querySelectorAll('.vanilla-calendar-week-number')
            }, 100);
            
        })
    })
    taskCalendarDaysArr.forEach(el => {
        el.addEventListener('click', () => {
            taskCalendarDaysArr.forEach(el => {
                el.classList.remove('vanilla-calendar-week-number-check')
            })
            el.classList.add('vanilla-calendar-week-number-check')
            checkWeekNumber = el.innerHTML
            const cardEditCheckNumberBlock = document.querySelector('#cardEditCheckNumberBlock')
            if(checkWeekNumber >= getThisWeekNumber) {
                taskWeekNumber = checkWeekNumber
                cardEditCheckNumberBlock.classList.add('hide-class')
            } else {
                cardEditCheckNumberBlock.classList.remove('hide-class')
            }
            
        })
    })

    taskDialog.showModal()
}

// открытие окна задачи (редактирование)
function editTaskOpenDialog(el) {
    // cleanTaskForm()

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

    console.log('task', task)

    // выбор номера недели (без выбора дня)
    let taskCalendarDaysArr = ''
    taskCalendarDaysArr = document.querySelector("#taskCalendar").querySelectorAll('.vanilla-calendar-week-number')
    let arrowBtnArr = document.querySelector("#taskCalendar").querySelectorAll('.vanilla-calendar-arrow')
    arrowBtnArr.forEach(el => {
        el.addEventListener('click', () => {
            // этот кринж нужен чтобы корректно подцеплять номера недель
            setTimeout(() => {
                taskCalendarDaysArr = document.querySelector("#taskCalendar").querySelectorAll('.vanilla-calendar-week-number')
            }, 100);
            
        })
    })
    taskCalendarDaysArr.forEach(el => {
        el.addEventListener('click', () => {
            checkWeekNumber = el.innerHTML
            const cardEditCheckNumberBlock = document.querySelector('#cardEditCheckNumberBlock')
            if(checkWeekNumber >= getThisWeekNumber) {
                taskWeekNumber = checkWeekNumber
                cardEditCheckNumberBlock.classList.add('hide-class')
            } else {
                cardEditCheckNumberBlock.classList.remove('hide-class')
            }
            
        })
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
    let taskInputText = document.querySelector("#addTaskInputText")
    taskInputText.value = taskText

    const taskDescription = task.description
    let taskInputDescription = document.querySelector("#addTaskInputDescription")
    taskInputDescription.value = taskDescription

    let taskStatus = task?.status
    if(taskStatus != '') {
        const btnList = document.querySelector('#checkedIconBlock').querySelectorAll('.btn-outline-light')
        btnList.forEach((el) => {
            if(el.id == taskStatus) {
                el.classList.add('active')
            }
        })
    }

    let storypointsNumber = task?.storypoints
    if(storypointsNumber != '') {
        const btnList = document.querySelector('#checkedStorypointsBlock').querySelectorAll('.btn-outline-light')
        btnList.forEach(el => {
            if(el.innerHTML == storypointsNumber) {
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

// переменные для создания задачи
let taskStatus = ''
let iconClass = ''
let taskStorypoints = ''

// выбор иконки
function chooseIcon(el) {
    console.log('el', el.id)
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

// выбор сторипоинтов
function chooseStorypoints(el) {
    let storypoints = el.innerHTML
    taskStorypoints = Number(storypoints)

    const btnArr = el.closest('.storypoints-input').querySelectorAll('.btn-outline-light')
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
    dropdownBtn.closest('.dropdown').querySelector('ul').classList.remove('show')
}

// очистка дропдауна выбора цвета текста задачи
function cleanTaskTextColorDropdownClass() {
    dropdownBtn.classList = ''
    dropdownBtn.classList.add('btn')
    dropdownBtn.classList.add('btn-secondary')
    dropdownBtn.classList.add('dropdown-toggle')
}

// создание новой задачи
function createNewTask() {
    const taskInputValueText = document.querySelector("#addTaskInputText").value
    const taskInputValueDescription = document.querySelector("#addTaskInputDescription").value

    if(taskInputValueText == '') {
        const errorText = document.querySelector('#errorText')
        errorText.classList.remove('hide-class')
    } else {
        const newTask = {
            id: Date.now(),
            text: taskInputValueText,
            description: taskInputValueDescription,
            status: taskStatus || '',
            storypoints: taskStorypoints || '',
            icon: iconClass || '',
            color: textColor || 'base-text-color',
            done: false,
            doneDate: '',
            expired: false,
            // определяется в конфиге календаря
            date: 'дедлайн' && taskDate || '',
            dayName: dayOfWeek || '',
            weekNumber: taskWeekNumber || ''
        }

        console.log('newTask', newTask)
    
        tasks.push(newTask)
        saveTasksListInLocalStorage(tasks)
    
        checkCorrectRenderTask()
    }
}

// очистка элементов формы создания задачи
function cleanTaskForm() {
    const addTaskInputValueText = document.querySelector("#addTaskInputText")
    addTaskInputValueText.value = ""
    const addTaskInputDescription = document.querySelector("#addTaskInputDescription")
    addTaskInputDescription.value = ""
    taskStatus = ''
    iconClass = ''
    taskDate = ''
    textColor = 'base-text-color'

    const checkedIconBtn = document.querySelector('#checkedIconBlock').querySelectorAll('.btn-outline-light')
    checkedIconBtn.forEach(el => {
        if(el.classList.contains('active')) {
            el.classList.remove('active')
        }
    })

    const checkedStorypointsBtn = document.querySelector('#checkedStorypointsBlock').querySelectorAll('.btn-outline-light')
    checkedStorypointsBtn.forEach(el => {
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

    const taskInputValueText = document.querySelector("#addTaskInputText").value
    const taskInputValueDescription = document.querySelector("#addTaskInputDescription").value

    if(taskInputValueText == '') {
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

        const btnIconList = document.querySelector('#checkedIconBlock').querySelectorAll('.btn-outline-light')
        btnIconList.forEach((el) => {
            if(el.classList.contains('active')) {
                taskStatus = el.id
                iconClass = el.querySelector('i').classList.value
            }
        })

        const btnStorypointsList = document.querySelector('#checkedStorypointsBlock').querySelectorAll('.btn-outline-light')
        btnStorypointsList.forEach((el) => {
            if(el.classList.contains('active')) {
                taskStorypoints = el.innerHTML
            }
        })

        const cardEditStatusDelete = document.querySelector('#cardEditStatusDelete')
        if(cardEditStatusDelete.checked) {
            taskStatus = ''
            iconClass = ''
        }

        const dropdownBtn = document.querySelector('#taskTextColorDropdown')
        textColor = dropdownBtn.getAttribute('data-color')

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

        let date = ''
        if(document.querySelector('input[type="checkbox"]:checked')) {
            date = ''
            weekDay = ''
            weekNumber = ''
        } else if (taskDate == '') {
            date = changedTask.date
        } else {
            date = taskDate
        }

        changedTask.text = taskInputValueText
        changedTask.description = taskInputValueDescription
        changedTask.storypoints = taskStorypoints
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

// проверка задач, разделение их на списки и рендер в карточки
function checkCorrectRenderTask() {
    const tasksRunningList = []
    const tasksWeekDaysPlaner = []
    const tasksThisWeekList = []
    const tasksExpiredList = []
    const tasksNextWeekList = []
    const tasksPlaner = []

    const getThisWeekNumber = JSON.parse(localStorage.getItem('weekPlanerWeekNumber'))

    tasks.forEach((task) => {
        // planning
        if(task.weekNumber == '' && task.status == '') {
            tasksPlaner.push(task)
        }
        // runnungList
        if (task.icon) {
            tasksRunningList.push(task)
            // тут сортируем массив по статусу задачи
            tasksRunningList.sort((a, b) => parseInt(a.status) - parseInt(b.status))
        }
        // weekPlaner
        if(getThisWeekNumber == task.weekNumber && task.date) {
            tasksWeekDaysPlaner.push(task)
            // тут сортируем массив по статусу задачи
            tasksWeekDaysPlaner.sort((a, b) => parseInt(a.status) - parseInt(b.status))
        }
        // expiredList
        if (task.expired == true) {
            tasksExpiredList.push(task)
            // тут сортируем массив по статусу задачи
            tasksExpiredList.sort((a, b) => parseInt(a.status) - parseInt(b.status))
        }
        // thisWeekList
        if (getThisWeekNumber == task.weekNumber && task.date == '') {
            tasksThisWeekList.push(task)
            // тут сортируем массив по статусу задачи
            tasksThisWeekList.sort((a, b) => parseInt(a.status) - parseInt(b.status))
        }
        // nextWeekList
        if (getThisWeekNumber < task.weekNumber) {
            tasksNextWeekList.push(task)
            // тут сортируем массив по статусу задачи
            tasksNextWeekList.sort((a, b) => parseInt(a.status) - parseInt(b.status))
        }
    })

    tasksRunningList.forEach((task) => {
        renderTask(task)
        
        const runningListCard = document.querySelector("#runningListCard")
        if(task.done) {
            runningListCard.insertAdjacentHTML('beforeend', doneTaskTemplate)
        } else if(task.date) {
            runningListCard.insertAdjacentHTML('beforebegin', taskTemplate)
        } else { 
            runningListCard.insertAdjacentHTML('beforebegin', taskDateTemplate)
        }
    })

    tasksWeekDaysPlaner.forEach((task) => {
        renderTask(task)

        let weekDayList = ''
        if(task.dayName) {
            const taskDay = task.dayName
            weekDayList = document.querySelector("[data-name=" + taskDay + "]")
        }

        if(task.done) {
            weekDayList.insertAdjacentHTML('beforeend', doneTaskTemplate)
        } else { 
            weekDayList.insertAdjacentHTML('beforebegin', taskDateTemplate)
        }
    })

    tasksExpiredList.forEach((task) => {
        renderTask(task)

        const expiredTasksList = document.querySelector('#expiredTasks')
        if(task.done) {
            expiredTasksList.insertAdjacentHTML('beforeend', doneTaskTemplate)
        } else { 
            expiredTasksList.insertAdjacentHTML('beforebegin', taskDateTemplate)
        }
    })
    tasksThisWeekList.forEach((task) => {
        renderTask(task)

        const thisWeekTasksList = document.querySelector('#thisWeekTasks')
        if(task.done) {
            thisWeekTasksList.insertAdjacentHTML('beforeend', doneTaskTemplate)
        } else { 
            thisWeekTasksList.insertAdjacentHTML('beforebegin', taskDateTemplate)
        }
    })
    tasksNextWeekList.forEach((task) => {
        renderTask(task)

        const nextWeekTasksList = document.querySelector('#nextWeekTasks')
        if(task.done) {
            nextWeekTasksList.insertAdjacentHTML('beforeend', doneTaskTemplate)
        } else { 
            nextWeekTasksList.insertAdjacentHTML('beforebegin', taskDateTemplate)
        }
    })
    tasksPlaner.forEach((task) => {
        renderTask(task)

        const planningListCard = document.querySelector("#planningListCard")
        if(task.done) {
            planningListCard.insertAdjacentHTML('beforeend', doneTaskTemplate)
        } else { 
            planningListCard.insertAdjacentHTML('beforebegin', taskDateTemplate)
        }
    })
}

// рендер задач по карточкам
function renderTask(task) {
    // темплейты задач
    // выполненная задача
    doneTaskTemplate = `<li class="done-list__item" id="${task.id}">
                            <p class="form-check-label_done" for="flexCheckDefault">${task.text}</p>
                            <span class="remove-icon icon-secondary"><i class="fa-solid fa-rotate-right widget-btn-block__button" style="font-size: 14px;" onclick="removeDoneTask(this)"></i></span>
                        </li>`
    // в RL с датой
    taskTemplate = `<li class="task-list__item" id="${task.id}">
                        <div class="task-list__task-block">
                            <div class="task-list__task-block-info">
                                <input class="task-list__form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                <div class="task-list__task-block-settings">
                                    <span class="task-list__status-icon"><i class="${task.icon}"></i></span>
                                    <span class="task-list__storypoints">${task.storypoints}</span>
                                </div>
                                <p class="form-check-label task-text__text ${task.color}" for="flexCheckDefault">${task.text}</p>
                            </div>  
                            <div class="task-list__icon-block">
                                <span class="icon-secondary"><i class="fa-solid fa-info button-icon-accent" style="font-size: 16px; padding-right: 5px"></i></span>
                                <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent " style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                <span class="icon-secondary"><i class="fa-solid fa-trash " style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                            </div>
                        </div>
                        <p class="form-date-label">дедлайн ${task.date}</p>
                        <p class="task-text__label hide-class">${task.description}</p>
                    </li>`
    // без даты
    taskDateTemplate = `<li class="task-list__item" id="${task.id}">
                        <div class="task-list__task-block">
                            <div class="task-list__task-block-info">
                                <input class="task-list__form-check-input" type="checkbox" onclick="markTheTaskCompleted(this)">
                                <div class="task-list__task-block-settings">
                                    <span class="task-list__status-icon"><i class="${task.icon}"></i></span>
                                    <button class="task-list__storypoints">${task.storypoints}</button>
                                </div>
                                <p class="form-check-label task-text__text ${task.color}" for="flexCheckDefault">${task.text}</p>
                            </div>
                            <div class="task-list__icon-block">
                                <span class="icon-secondary"><i class="fa-solid fa-info button-icon-accent" style="font-size: 16px; padding-right: 5px"></i></span>
                                <span class="icon-secondary"><i class="fa-solid fa-pencil  button-icon-accent " style="font-size: 14px;" onclick="editTaskOpenDialog(this)"></i></span>
                                <span class="icon-secondary"><i class="fa-solid fa-trash " style="font-size: 14px;" onclick="deleteTask(this)"></i></span>
                            </div>
                        </div>
                        <p class="task-text__label hide-class">${task.description}</p>
                    </li>`

    return doneTaskTemplate, taskTemplate, taskDateTemplate
}

// показ/скрытие описания задачи при наведении на иконку
const taskTextLabelArr = document.querySelectorAll('.fa-info')
taskTextLabelArr.forEach(el => {
    el.addEventListener('mouseover', function () {
        el.closest('li').querySelector('.task-text__label').classList.remove('hide-class')
      })
})
taskTextLabelArr.forEach(el => {
    el.addEventListener('mouseout', function () {
        el.closest('li').querySelector('.task-text__label').classList.add('hide-class')
      })
})

// вычёркивание выполненных задач
function markTheTaskCompleted(el) {
    getTasksListFromLocalStorage()
    const id = el.closest('li').id

    tasks.forEach((task) => {
        if(task.id == id) {
            task.done = true,
            task.doneDate = moment().format('L')
            console.log('task', task)
        } 
    })

    saveTasksListInLocalStorage(tasks)
    window.location.reload();
}

// отмена выделения выполненных задач
function removeDoneTask(el) {
    const taskId = el.closest('li').id
    tasks.forEach(el => {
        if(taskId == el.id) {
            el.done = false
            el.doneDate = ''
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

function addCalendarDateOpenDialog() {
    alertWindow()
}