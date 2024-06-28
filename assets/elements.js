dragula([
    document.getElementById('widgetsCol')
])

// проверка для корректного отображения страницы при удалении всех виджетов
if(localStorage.getItem('widgetsCol') == 'undefined') {
    localStorage.widgetsCol = `<div></div>`
}
// полукостыль для корректного отображения
if(localStorage.getItem('widgetsCol')) {
    widgetsCol.innerHTML = localStorage.getItem('widgetsCol')
    const btnArr = document.querySelectorAll('.dropdown-settings-btn')
    btnArr.forEach(el => {
        el.classList.remove('show')
    })
    const ddmenuArr = document.querySelectorAll('.dropdown-menu')
    ddmenuArr.forEach(el => {
        el.classList.remove('show')
    })
}

// установка таба текущего дня в виджетах с неделями
const thisDayName = new Date().toString().substring(0, 3).toLocaleLowerCase()
const widgetsArr = document.querySelectorAll('.widget-everyWeekGoals')
widgetsArr.forEach(el => {

    const navWidgetLinkArr = el.querySelectorAll('.nav-widget-link')
    navWidgetLinkArr.forEach(el => {
        if(el.innerText.toLocaleLowerCase() == thisDayName) {
            el.classList.add('active')
            el.classList.add('nav-link-active')
        }
    })

    const navWidgetTabArr = el.querySelectorAll('.widget-tab-content')
    navWidgetTabArr.forEach(el => {
        const arr = el.querySelectorAll('div.tab-pane')
        arr.forEach(el => {
            if(el.getAttribute('data-active-day') == thisDayName) {
                el.classList.add('show')
                el.classList.add('active')
            }
        })
    })
})

// ОБЩИЕ ФУНКЦИИ

// название виджета
let inputWidgetValue = ''
// тип виджета для рендеринга
let inputWidgetValueId = ''
// окно создания нового виджета
const widgetDialog = document.querySelector('#widgetDialog')

// открытие окна добавления виджета
function addWidgetOpenDialog() {
    widgetDialog.showModal()
}

// очистка инпутов
function cleanWidgetCard() {
    const inputArr = document.querySelector('.widget-content').querySelectorAll('input')
    inputArr.forEach(el => {
        if(el.value) {
            el.value = ''
        }
    });
}

// сохранение текущей конфигурации страницы
function saveWidgets() {
    let widgetsCol = document.querySelector('#widgetsCol')
    if(widgetsCol == null) {
        widgetsCol = ''
    }
    localStorage.setItem('widgetsCol', widgetsCol.innerHTML)
}

// создание нового виджета
function createNewWidget() {
    const inputArr = document.querySelector('.widget-content').querySelectorAll('input')
    inputArr.forEach(el => {
        if(el.value) {
            inputWidgetValue = el.value
            inputWidgetValueId = el.id
        }
        return inputWidgetValue, inputWidgetValueId
    });

    renderWidget()
    cleanWidgetCard()
    widgetDialog.close()
}

// ширина виджета - на всю строку
function foolCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-12')
    col.classList.add('widget-col')

    saveWidgets()
}

// ширина виджета - на 3/4 строки
function threeQuartersCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-9')
    col.classList.add('widget-col')
    saveWidgets()
}

// ширина виджета - на половину строки
function halfCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-6')
    col.classList.add('widget-col')
    saveWidgets()
}

// ширина виджета - на четверть строки
function quarterCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-3')
    col.classList.add('widget-col')
    saveWidgets()
}

// переименование названия виджета
function renameWidget(el) {
    const btnBlock = el.closest('.card-header-widget__block-header')
    btnBlock.querySelector('.btn-rename').classList.add('hide-class')
    btnBlock.querySelector('.btn-block-widget').classList.remove('hide-class')
    const text = btnBlock.querySelector('p')
    text.classList.add('hide-class')
    let value = text.innerHTML
    const input = btnBlock.querySelector('input')
    input.classList.remove('hide-class')
    input.value = value

    if(window.reload()) {
        input.classList.add('hide-class')
    }

    saveWidgets()
}

// переименование названия виджета - подтвердить
function renameWidgetConfirm(el) {
    const btnBlock = el.closest('.card-header-widget__block-header')
    let text = btnBlock.querySelector('p')
    const input = btnBlock.querySelector('input')
    const newValue = input.value
    text.innerHTML = newValue
    text.classList.remove('hide-class')
    input.classList.add('hide-class')
    btnBlock.querySelector('.btn-rename').classList.remove('hide-class')
    btnBlock.querySelector('.btn-block-widget').classList.add('hide-class')

    saveWidgets()
}

// переименование названия виджета - отменить
function renameWidgetCancel(el) {
    const btnBlock = el.closest('.card-header-widget__block-header')
    btnBlock.querySelector('.btn-rename').classList.remove('hide-class')
    btnBlock.querySelector('.btn-block-widget').classList.add('hide-class')
    btnBlock.querySelector('input').classList.add('hide-class')
    btnBlock.querySelector('p').classList.remove('hide-class')

    saveWidgets()
}

// удаление виджета
function deleteWidget(el) {
    const widget = el.closest('.widget-col')
    widget.remove(widget)

    saveWidgets()
}

//  active nav-link-active

// рендер виджетов по их типу
function renderWidget() {
    let valueId = inputWidgetValueId
    let widget = ''
    switch (valueId) {
        case undefined:
            // рендерим пустой див если нет сохранённых виджетов чтобы корректно отображалась пустая страница
            widget = `<div></div>`
        case 'weekPlansTitleWidgetInput':
            const id = Date.now()
            widget = `<div class="col-12 widget-col">
                        <div class="widget-everyWeekGoals" style="padding-bottom: 1rem" id="">
                            <div class="card widget-card">
                                <div class="card-header card-header-widget card-header__text">
                                    <div class="card-header-widget__block-header">
                                        <p>${inputWidgetValue}</p>
                                        <input type="text" class="form-control hide-class widget-list__input-text-header">
                                        <button class="btn card-body__btn-widget-header btn-rename" type="button" onclick="renameWidget(this)"><i class="fa-solid fa-pencil"></i></button>
                                        <div class="btn-block-widget hide-class">
                                            <button class="btn card-body__btn-widget-header" type="button" onclick="renameWidgetConfirm(this)"><i class="fa-solid fa-check"></i></button>
                                            <button class="btn card-body__btn-widget-header" type="button" onclick="renameWidgetCancel(this)"><i class="fa-solid fa-xmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="dropdown dropstart dropdown-settings">
                                        <button class="btn dropdown-settings-btn" type="button" id="dropdownMenuButton${id}" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i></button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${id}"  id="tab${id}" role="tablist">
                                            <li><a class="dropdown-item" href="#" onclick="foolCol(this)">колонка</a></li>
                                            <li><a class="dropdown-item" href="#" onclick="threeQuartersCol(this)">3/4 колонки</a></li>
                                            <li><a class="dropdown-item" href="#" onclick="halfCol(this)">1/2 колонки</a></li>
                                            <li><a class="dropdown-item" href="#" onclick="deleteWidget(this)">удалить</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="card-body widget-card-body ">
                                    <div class="widget-card-body-header">
                                        <ul class="nav nav-tabs everyWeekGoals__list" id="tab${id}" role="tablist">
                                            <li class="nav-item " role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget-everyWeekGoals-mon-tab${id}" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-mon${id}"
                                                type="button" role="tab" aria-controls="widget-everyWeekGoals-mon${id}" aria-selected="true">MON</button>
                                            </li>
                                            <li class="nav-item " role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget-everyWeekGoals-tue-tab${id}" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-tue${id}"
                                                type="button" role="tab" aria-controls="widget-everyWeekGoals-tue${id}" aria-selected="false">TUE</button>
                                            </li>
                                            <li class="nav-item " role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget-everyWeekGoals-wed-tab${id}" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-wed${id}"
                                                type="button" role="tab" aria-controls="widget-everyWeekGoals-wed${id}" aria-selected="false">WED</button>
                                            </li>
                                            <li class="nav-item " role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget-everyWeekGoals-thu-tab${id}" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-thu${id}"
                                                type="button" role="tab" aria-controls="widget-everyWeekGoals-thu${id}" aria-selected="false">THU</button>
                                            </li>
                                            <li class="nav-item " role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget-everyWeekGoals-fri-tab${id}" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-fri${id}"
                                                type="button" role="tab" aria-controls="widget-everyWeekGoals-fri${id}" aria-selected="false">FRI</button>
                                            </li>
                                            <li class="nav-item " role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget-everyWeekGoals-sat-tab${id}" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-sat${id}"
                                                type="button" role="tab" aria-controls="widget-everyWeekGoals-sat${id}" aria-selected="false">SAT</button>
                                            </li>
                                            <li class="nav-item " role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget-everyWeekGoals-sun-tab${id}" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-sun${id}"
                                                type="button" role="tab" aria-controls="widget-everyWeekGoals-sun${id}" aria-selected="false">SUN</button>
                                            </li>
                                        </ul>
                                        <button class="btn add-card-button dropdown-settings-btn" type="button" onclick="addTaskToEveryWeekGoalsWidget(this)">+</button>
                                    </div>
                                    <div>
                                        <div class="tab-content widget-tab-content">
                                            <div class="tab-pane fade" id="widget-everyWeekGoals-mon${id}" data-active-day="mon" role="tabpanel" aria-labelledby="widget-everyWeekGoals-mon-tab${id}">
                                                <ul class="card-body__ul" data-day-name="monday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget-everyWeekGoals-tue${id}" data-active-day="tue" role="tabpanel" aria-labelledby="widget-everyWeekGoals-tue-tab${id}">
                                                <ul class="card-body__ul" data-day-name="tuesday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget-everyWeekGoals-wed${id}" data-active-day="wed" role="tabpanel" aria-labelledby="widget-everyWeekGoals-wed-tab${id}">
                                                <ul class="card-body__ul" data-day-name="wednesday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget-everyWeekGoals-thu${id}" data-active-day="thu" role="tabpanel" aria-labelledby="widget-everyWeekGoals-thu-tab${id}">
                                                <ul class="card-body__ul" data-day-name="thusday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget-everyWeekGoals-fri${id}" data-active-day="fri" role="tabpanel" aria-labelledby="widget-everyWeekGoals-fri-tab${id}">
                                                <ul class="card-body__ul" data-day-name="friday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget-everyWeekGoals-sat${id}" data-active-day="sat" role="tabpanel" aria-labelledby="widget-everyWeekGoals-sat-tab${id}">
                                                <ul class="card-body__ul" data-day-name="saturday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget-everyWeekGoals-sun${id}" data-active-day="sun" role="tabpanel" aria-labelledby="widget-everyWeekGoals-sun-tab${id}">
                                                <ul class="card-body__ul" data-day-name="sunday"></ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
            break
        case 'listTitleWidgetInput':
            widget = `<div class="col-12 widget-col">
                            <div class="widget-list" style="padding-bottom: 1rem">
                                <div class="card widget-card">
                                    <div class="card-header card-header-widget card-header__text">
                                        <div class="card-header-widget__block-header">
                                            <p>${inputWidgetValue}</p>
                                            <input type="text" class="form-control hide-class widget-list__input-text-header">
                                            <button class="btn card-body__btn-widget-header btn-rename" type="button" onclick="renameWidget(this)"><i class="fa-solid fa-pencil"></i></button>
                                            <div class="btn-block-widget hide-class">
                                                <button class="btn card-body__btn-widget-header" type="button" onclick="renameWidgetConfirm(this)"><i class="fa-solid fa-check"></i></button>
                                                <button class="btn card-body__btn-widget-header" type="button" onclick="renameWidgetCancel(this)"><i class="fa-solid fa-xmark"></i></button>
                                            </div>
                                        </div>
                                        <div class="dropdown dropstart dropdown-settings">
                                            <button class="btn dropdown-settings-btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i></button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1"  id="myTab" role="tablist">
                                                <li><a class="dropdown-item" href="#" onclick="foolCol(this)">колонка</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="threeQuartersCol(this)">3/4 колонки</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="halfCol(this)">1/2 колонки</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="quarterCol(this)">1/4 колонки</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="deleteWidget(this)">удалить</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="card-body widget-card-body">
                                        <div class="input-group widget-list__input-block">
                                            <input type="text" class="form-control widget-list__input-text" aria-label="Dollar amount (with dot and two decimal places)">
                                            <button type="button" class="input-group-text" onclick="addTaskToListWidget(this)">+</button>
                                            <div class="btn-block-widget">
                                                <button id="cleanTasksToRunningList" type="button" class="btn card-body__btn-task-running-list" onclick="deleteDoneTasksFromListWidget(this)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="удалить выполненные задачи"><i class="fa-solid fa-eraser"></i></button>
                                                <button id="deleteAllTasksToRunningList" type="button" class="btn card-body__btn-task-running-list" onclick="deleteAllTasksOnListWidget(this)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="удалить все задачи"><i class="fa-solid fa-ban"></i></button>
                                            </div>
                                        </div>
                                        <ul class="widget-list__list"></ul>
                                    </div>
                                </div>
                            </div>
                        </div>`
            break
        case 'trackerTitleWidgetInput':
            break
    }

    widgetsCol.insertAdjacentHTML('afterbegin', widget)

    saveWidgets()
}

// ФУНКЦИИ ДЛЯ ВИДЖЕТА СПИСОК

// добавление пункта списка
function addTaskToListWidget(el) {
    const widget = el.closest('.card')
    let taskValue = widget.querySelector('.widget-list__input-text').value
    const item = `<li class="widget-list__item">
                    <input type="checkbox" class="widget-list__item-checkbox" onclick="markTheCompletedTaskInListWidget(this)">
                    <p class="widget-list__item-text">${taskValue}</p>
                </li>`
    const list = widget.querySelector('.widget-list__list')
    list.insertAdjacentHTML('afterbegin', item)
    cleanWidgetCard()
    saveWidgets()
    window.location.reload();
}

// выделение пунктов списка
function markTheCompletedTaskInListWidget(el) {
    const li = el.closest('li')
    const value =  li.querySelector('p').innerHTML
    const item = `<li class="widget-list__item widget-list__item-text-done">
                    <p class="">${value}</p>
                </li>`
    const list = li.closest('ul')
    list.insertAdjacentHTML('beforeend', item)
    li.parentNode.removeChild(li);

    saveWidgets()
}

// удаление отмеченных пунктов
function deleteDoneTasksFromListWidget(el) {
    const listArr = el.closest('.card').querySelectorAll('.widget-list__item')
    listArr.forEach(el => {
        if(el.className == "widget-list__item widget-list__item-text-done") {
            el.parentNode.removeChild(el)
        }
    })

    saveWidgets()
}

// очистка виджета
function deleteAllTasksOnListWidget(el) {
    const listArr = el.closest('.card').querySelectorAll('.widget-list__item')
    listArr.forEach(el => {
        el.parentNode.removeChild(el)
    })

    saveWidgets()
}

// ФУНКЦИИ ДЛЯ ВИДЖЕТА НЕДЕЛЬНЫЙ ПЛАНЕР

// окно доавления контента в планер
const addTaskToEveryWeekGoalsWidgetDialog = document.querySelector('#everyWeekGoalWidgetDialog')
// виджет, с которым ведётся работа
let widget = null
// айдишник этого виджета
let weekGoalsWidgetDialogTaskId = null
// let taskToEveryWeekGoalItem = null

// выбор виджета для дальнейшей работы
function addTaskToEveryWeekGoalsWidget(el) {
    // const title = document.querySelector('#everyWeekGoalWidgetModalTitleEdit')
    // const button = document.querySelector('#editEveryWeekGoalBtn')
    // title.style.display = 'none';
    // button.style.display = 'none';
    addTaskToEveryWeekGoalsWidgetDialog.showModal()

    widget = el.closest('.widget-everyWeekGoals')
    weekGoalsWidgetDialogTaskId = Date.now()
    widget.id = weekGoalsWidgetDialogTaskId

    return widget
}

// выбор дня недели
function chooseWeekDay(el) {
    const chooseDayName = el.textContent
    const chooseDayNameID = el.getAttribute('data-day-name')
    const shooseWeekDayNameLabel = document.querySelector('#weekDayNameLabel')
    shooseWeekDayNameLabel.textContent = chooseDayName
    shooseWeekDayNameLabel.setAttribute('data-day-name', chooseDayNameID)
    shooseWeekDayNameLabel.style.color = '#313131'
}

// добавление контента в виджет
function addTaskToEveryWeekGoalWidget() {
    const dayName = document.querySelector('#everyWeekGoalWidgetDialog').querySelector('p').getAttribute('data-day-name')
    let taskValue = document.querySelector('#everyWeekGoalWidgetDialog').querySelector('.widget-list__input-text').value

    const item = `<li class="widget-list__item card-ul-item" data-task-id="">
                        <div class="task-item-block">
                            <input type="checkbox" class="widget-list__item-checkbox" onclick="markTheTaskOfEveryWeekGoalWidgetCompleted(this)">
                            <p class="widget-list__item-text">${taskValue}</p>
                        </div>
                        <div>
                            <!-- <span ><i class="fa-solid fa-pencil card-body__btn-task-running-list" style="font-size: 14px;" onclick="editEveryWeekGoalOpenDialog(this)"></i></span> -->
                            <span ><i class="fa-solid fa-trash card-body__btn-task-running-list" style="font-size: 14px;" onclick="deleteEveryWeekGoal(this)"></i></span>
                        </div>
                </li>`

    const ulArr = widget.querySelector('.tab-content').querySelectorAll('ul')
    ulArr.forEach(el => {
        if(el.getAttribute('data-day-name') == dayName) {
            el.insertAdjacentHTML('beforeend', item)
        }
    })

    taskValue = ''
    saveWidgets()
    
    addTaskToEveryWeekGoalsWidgetDialog.close()
    window.location.reload();
}

// TODO а оно вообще надо?
// function editEveryWeekGoalOpenDialog(el) {
//     const title = document.querySelector('#everyWeekGoalWidgetModalTitleAdd')
//     const button = document.querySelector('#addEveryWeekGoalBtn')
//     title.style.display = 'none';
//     button.style.display = 'none';

//     taskToEveryWeekGoalItem = el.closest('li')

//     const taskDay = el.closest('ul').getAttribute('data-day-name')
//     const taskLabel = document.querySelector('#weekDayNameLabel')
//     taskLabel.textContent = taskDay

//     const taskText = el.closest('.card-ul-item').querySelector('p').textContent
//     const taskInput = document.querySelector('#everyWeekGoalWidgetContent')
//     taskInput.value = taskText

//     addTaskToEveryWeekGoalsWidgetDialog.showModal()

//     return taskToEveryWeekGoalItem
// }

// function editTaskToEveryWeekGoalWidget() {
//     console.log('edit')
//     console.log('taskToEveryWeekGoalItem', taskToEveryWeekGoalItem)
//     const item = taskToEveryWeekGoalItem
//     const dayName = document.querySelector('#everyWeekGoalWidgetDialog').querySelector('p').getAttribute('data-day-name')
//     const taskValue = document.querySelector('#everyWeekGoalWidgetDialog').querySelector('.widget-list__input-text').value
//     item.querySelector('p').textContent = taskValue
// }

// удаление контента из списка
function deleteEveryWeekGoal(el) {
    el.closest('li').remove()
    saveWidgets()
    window.location.reload();
}