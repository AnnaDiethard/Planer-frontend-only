dragula([
    document.getElementById('widgetsCol')
])

// проверка для корректного отображения страницы при удалении всех виджетов
if(localStorage.getItem('widgetsCol') == 'undefined') {
    localStorage.widgetsCol = `<div></div>`
}

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

// общие для виджетов функции
let inputWidgetValue = ''
let inputWidgetValueId = ''
const widgetDialog = document.querySelector('#widgetDialog')

function addWidgetOpenDialog() {
    widgetDialog.showModal()
}

function addWidgetCloseDialog() {
    widgetDialog.close()
}

function cleanWidgetCard() {
    const inputArr = document.querySelector('.widget-content').querySelectorAll('input')
    inputArr.forEach(el => {
        if(el.value) {
            el.value = ''
        }
    });
}

function saveWidgets() {
    let widgetsCol = document.querySelector('#widgetsCol')
    if(widgetsCol == null) {
        widgetsCol = ''
    }
    localStorage.setItem('widgetsCol', widgetsCol.innerHTML)
}

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
    addWidgetCloseDialog()
}

function foolCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-12')
    col.classList.add('widget-col')

    saveWidgets()
}

function threeQuartersCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-9')
    col.classList.add('widget-col')
    saveWidgets()
}

function halfCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-6')
    col.classList.add('widget-col')
    saveWidgets()
}

function quarterCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-3')
    col.classList.add('widget-col')
    saveWidgets()
}

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

function renameWidgetCancel(el) {
    const btnBlock = el.closest('.card-header-widget__block-header')
    btnBlock.querySelector('.btn-rename').classList.remove('hide-class')
    btnBlock.querySelector('.btn-block-widget').classList.add('hide-class')
    btnBlock.querySelector('input').classList.add('hide-class')
    btnBlock.querySelector('p').classList.remove('hide-class')

    saveWidgets()
}

function deleteWidget(el) {
    const widget = el.closest('.widget-col')
    widget.remove(widget)

    saveWidgets()
}

function renderWidget() {
    let valueId = inputWidgetValueId
    let widget = ''
    switch (valueId) {
        case undefined:
            widget = `<div></div>`
        case 'weekPlansTitleWidgetInput':
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
                                            <button class="btn dropdown-settings-btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i></button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1"  id="myTab" role="tablist">
                                                <li><a class="dropdown-item" href="#" onclick="foolCol(this)">колонка</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="threeQuartersCol(this)">3/4 колонки</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="halfCol(this)">1/2 колонки</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="deleteWidget(this)">удалить</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="card-body widget-list__card-body ">
                                        <div class="widget-card-body-header">
                                            <ul class="nav nav-tabs everyWeekGoals__list" id="myTab" role="tablist">
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link active nav-link-active" id="widget-everyWeekGoals-mon-tab" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-mon"
                                                    type="button" role="tab" aria-controls="widget-everyWeekGoals-mon" aria-selected="true">MON</button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link" id="widget-everyWeekGoals-tue-tab" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-tue"
                                                    type="button" role="tab" aria-controls="widget-everyWeekGoals-tue" aria-selected="false">TUE</button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link" id="widget-everyWeekGoals-wed-tab" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-wed"
                                                    type="button" role="tab" aria-controls="widget-everyWeekGoals-wed" aria-selected="false">WED</button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link" id="widget-everyWeekGoals-thu-tab" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-thu"
                                                    type="button" role="tab" aria-controls="widget-everyWeekGoals-thu" aria-selected="false">THU</button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link" id="widget-everyWeekGoals-fri-tab" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-fri"
                                                    type="button" role="tab" aria-controls="widget-everyWeekGoals-fri" aria-selected="false">FRI</button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link" id="widget-everyWeekGoals-sat-tab" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-sat"
                                                    type="button" role="tab" aria-controls="widget-everyWeekGoals-sat" aria-selected="false">SAT</button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link" id="widget-everyWeekGoals-sun-tab" data-bs-toggle="tab" data-bs-target="#widget-everyWeekGoals-sun"
                                                    type="button" role="tab" aria-controls="widget-everyWeekGoals-sun" aria-selected="false">SUN</button>
                                                </li>
                                            </ul>
                                            <button class="btn add-card-button dropdown-settings-btn" type="button" onclick="addTaskToEveryWeekGoalsWidget(this)">+</button>
                                        </div>
                                        <div>
                                            <div class="tab-content" id="myTabsContent">
                                                <div class="tab-pane fade show active" id="widget-everyWeekGoals-mon" role="tabpanel" aria-labelledby="widget-everyWeekGoals-mon-tab">
                                                    <ul class="card-body__ul" data-day-name="monday"</ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-tue" role="tabpanel" aria-labelledby="widget-everyWeekGoals-tue-tab">
                                                    <ul class="card-body__ul" data-day-name="tuesday"</ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-wed" role="tabpanel" aria-labelledby="widget-everyWeekGoals-wed-tab">
                                                    <ul class="card-body__ul" data-day-name="wednesday"></ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-thu" role="tabpanel" aria-labelledby="widget-everyWeekGoals-thu-tab">
                                                    <ul class="card-body__ul" data-day-name="thusday"></ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-fri" role="tabpanel" aria-labelledby="widget-everyWeekGoals-fri-tab">
                                                    <ul class="card-body__ul" data-day-name="friday"></ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-sat" role="tabpanel" aria-labelledby="widget-everyWeekGoals-sat-tab">
                                                    <ul class="card-body__ul" data-day-name="saturday"></ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-sun" role="tabpanel" aria-labelledby="widget-everyWeekGoals-sun-tab">
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
                                    <div class="card-body widget-list__card-body">
                                        <div class="input-group widget-list__input-block">
                                            <input type="text" class="form-control widget-list__input-text" aria-label="Dollar amount (with dot and two decimal places)">
                                            <button type="button" class="input-group-text" onclick="addTaskToListWidget(this)">+</button>
                                            <div class="btn-block-widget">
                                                <button id="cleanTasksToRunningList" type="button" class="btn card-body__btn-task-running-list" onclick="deleteDoneTasksOnListWidget(this)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="удалить выполненные задачи"><i class="fa-solid fa-eraser"></i></button>
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

// функции для виджета список
function addTaskToListWidget(el) {
    const widget = el.closest('.card')
    let taskValue = widget.querySelector('.widget-list__input-text').value
    const item = `<li class="widget-list__item">
                    <input type="checkbox" class="widget-list__item-checkbox" onclick="markTheTaskOfListWidgetCompleted(this)">
                    <p class="widget-list__item-text">${taskValue}</p>
                </li>`
    const list = widget.querySelector('.widget-list__list')
    list.insertAdjacentHTML('beforeend', item)
    taskValue = ''
    saveWidgets()
    window.location.reload();
}

function markTheTaskOfListWidgetCompleted(el) {
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

function deleteDoneTasksOnListWidget(el) {
    const listArr = el.closest('.card').querySelectorAll('.widget-list__item')
    listArr.forEach(el => {
        if(el.className == "widget-list__item widget-list__item-text-done") {
            el.parentNode.removeChild(el)
        }
    })

    saveWidgets()
}

function deleteAllTasksOnListWidget(el) {
    const listArr = el.closest('.card').querySelectorAll('.widget-list__item')
    listArr.forEach(el => {
        el.parentNode.removeChild(el)
    })

    saveWidgets()
}

// функции для виджета недельный планер
const addTaskToEveryWeekGoalsWidgetDialog = document.querySelector('#everyWeekGoalWidgetDialog')
let weekGoalsWidgetDialogTaskId = null
let widget = null
let taskToEveryWeekGoalItem = null

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

function chooseWeekDay(el) {
    const chooseDayName = el.textContent
    const chooseDayNameID = el.getAttribute('data-day-name')
    const shooseWeekDayNameLabel = document.querySelector('#weekDayNameLabel')
    shooseWeekDayNameLabel.textContent = chooseDayName
    shooseWeekDayNameLabel.setAttribute('data-day-name', chooseDayNameID)
    shooseWeekDayNameLabel.style.color = '#313131'
}

function addTaskToEveryWeekGoalWidget() {
    const dayName = document.querySelector('#everyWeekGoalWidgetDialog').querySelector('p').getAttribute('data-day-name')
    console.log('dayName', dayName)
    let taskValue = document.querySelector('#everyWeekGoalWidgetDialog').querySelector('.widget-list__input-text').value
    console.log('taskValue', taskValue)
    console.log('widget', widget)

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
    console.log('ulArr', ulArr)
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

function deleteEveryWeekGoal(el) {
    el.closest('li').remove()
    saveWidgets()
    window.reload()
}