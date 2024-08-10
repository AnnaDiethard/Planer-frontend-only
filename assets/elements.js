// без этого не работают бутстраповские тултипы
[...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
  .forEach(el => new bootstrap.Tooltip(el))

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
const widgetsArr = document.querySelectorAll('.widget__every-week-goals')
widgetsArr.forEach(el => {

    const navWidgetLinkArr = el.querySelectorAll('.nav-link')
    navWidgetLinkArr.forEach(el => {
        el.classList.remove('active')
        // thisDayName определяется в скрипте tasks
        if(el.innerText.toLocaleLowerCase() == thisDayName) {
            el.classList.add('active')
            el.classList.add('nav-widget-active-link')
        }
    })

    const navWidgetTabArr = el.querySelectorAll('.widget-tab-content')
    navWidgetTabArr.forEach(el => {
        const arr = el.querySelectorAll('div.tab-pane')
        arr.forEach(el => {
            el.classList.remove('show')
            el.classList.remove('active')
            if(el.getAttribute('data-active-day') == thisDayName) {
                el.classList.add('show')
                el.classList.add('active')
                
            }
        })
    })
})

// костыль для починки переключения табов в недельном виджете когда у бутстрапа отлетает кукуха
widgetsArr.forEach(el => {
    const navWidgetLinkArr = el.querySelectorAll('.nav-link')
    navWidgetLinkArr.forEach(el => {
        el.addEventListener('click', () => {
            navWidgetLinkArr.forEach(s => {
                s.classList.remove('active')
            })
            el.classList.add('active')
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
    const input = widgetDialog.querySelector('#weekPlansTitleWidgetInput')
    input.value = ''
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
const addNewWidgetBtn = document.querySelector('#addNewWidgetBtn')
addNewWidgetBtn.addEventListener('click', (el) => {
    el.preventDefault()
    
    const input = document.querySelector('#widgetDialog').querySelector('input')

    if(input.value == '') {
        const errorText = document.querySelector('#widgetDialog').querySelector('#errorText')
        errorText.classList.remove('hide-class')
    } else {
        inputWidgetValue = input.value
        inputWidgetValueId = chooseWidgetName

        renderWidget()
        cleanWidgetCard()
        widgetDialog.close()
    }
})

// отображение поля ввода после выбора тип виджета
const widgetDropdownLinkArr = document.querySelectorAll('.widget-dropdown-link')
let chooseWidgetName = ''
widgetDropdownLinkArr.forEach(el => {
    el.addEventListener('click', (el) => {
        const inputForm = document.querySelector('#widgetDialog').querySelector('.input-form')
        inputForm.classList.remove('hide-class')
        chooseWidgetName = el.srcElement.innerText
    })
})

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
    const btnBlock = el.closest('.card-widget__block-header')
    const renameWidgetConfirm = btnBlock.querySelector('#renameWidgetConfirm')
    renameWidgetConfirm.disabled = false
    btnBlock.querySelector('.btn-rename').classList.add('hide-class')
    btnBlock.querySelector('.widget-btn-block').classList.remove('hide-class')
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
    const btnBlock = el.closest('.card-widget__block-header')
    let text = btnBlock.querySelector('p')
    const input = btnBlock.querySelector('input')

    if(input.value == '') {
        el.disabled = true
    } else {
        const newValue = input.value
        text.innerHTML = newValue
        text.classList.remove('hide-class')
        input.classList.add('hide-class')
        btnBlock.querySelector('.btn-rename').classList.remove('hide-class')
        btnBlock.querySelector('.widget-btn-block').classList.add('hide-class')

        saveWidgets()
    }
}

// переименование названия виджета - отменить
function renameWidgetCancel(el) {
    const btnBlock = el.closest('.card-widget__block-header')
    const renameWidgetConfirm = btnBlock.querySelector('#renameWidgetConfirm')
    renameWidgetConfirm.disabled = false
    btnBlock.querySelector('.btn-rename').classList.remove('hide-class')
    btnBlock.querySelector('.widget-btn-block').classList.add('hide-class')
    btnBlock.querySelector('input').classList.add('hide-class')
    btnBlock.querySelector('p').classList.remove('hide-class')

    saveWidgets()
}

// удаление виджета
function deleteWidget(el) {
    openValidationDialog()
    openValidationDialogBtn.addEventListener('click', () => {
        const widget = el.closest('.widget-col')
        widget.remove(widget)

        saveWidgets()
    })
}

// рендер виджетов по их типу
function renderWidget() {
    let valueId = inputWidgetValueId
    let widget = ''
    switch (valueId) {
        case undefined:
            // рендерим пустой див если нет сохранённых виджетов чтобы корректно отображалась пустая страница
            widget = `<div></div>`
        case 'week planer':
            const id = Date.now()
            widget = `<div class="col-12 widget-col">
                        <div style="padding-bottom: 1rem" class="widget__every-week-goals">
                            <div class="card widget-card border__widget-card shadow-class">
                                <div class="card-header block-between widget-card-header card-header__text">
                                    <div class="card-widget__block-header block-between">
                                        <p>${inputWidgetValue}</p>
                                        <input type="text" class="form-control hide-class widget-list__input-text-header">
                                        <button class="btn card-body__widget-header-btn btn-rename" type="button" onclick="renameWidget(this)" title="rename"><i class="fa-solid fa-pencil button-icon-accent "></i></button>
                                        <div class="widget-btn-block hide-class">
                                            <button id="renameWidgetConfirm" class="btn card-body__widget-header-btn" type="button" onclick="renameWidgetConfirm(this)"><i class="fa-solid fa-check"></i></button>
                                            <button class="btn card-body__widget-header-btn" type="button" onclick="renameWidgetCancel(this)"><i class="fa-solid fa-xmark"></i></button>
                                        </div>
                                    </div>
                                    <div class="dropdown dropstart dropdown-settings">
                                        <button class="btn dropdown-settings-btn" type="button" id="dropdownMenuButton${id}" data-bs-toggle="dropdown" aria-expanded="false" title="settings"><i class="fa-solid fa-ellipsis"></i></button>
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
                                        <ul class="nav nav-tabs widget-every-week-goal__nav" id="tab${id}" role="tablist">
                                            <li class="nav-item" role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget__every-week-goals-mon-tab${id}" data-bs-toggle="tab" data-bs-target="#widget__every-week-goals-mon${id}"
                                                type="button" role="tab" aria-controls="widget__every-week-goals-mon${id}" aria-selected="true">MON</button>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget__every-week-goals-tue-tab${id}" data-bs-toggle="tab" data-bs-target="#widget__every-week-goals-tue${id}"
                                                type="button" role="tab" aria-controls="widget__every-week-goals-tue${id}" aria-selected="false">TUE</button>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget__every-week-goals-wed-tab${id}" data-bs-toggle="tab" data-bs-target="#widget__every-week-goals-wed${id}"
                                                type="button" role="tab" aria-controls="widget__every-week-goals-wed${id}" aria-selected="false">WED</button>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget__every-week-goals-thu-tab${id}" data-bs-toggle="tab" data-bs-target="#widget__every-week-goals-thu${id}"
                                                type="button" role="tab" aria-controls="widget__every-week-goals-thu${id}" aria-selected="false">THU</button>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget__every-week-goals-fri-tab${id}" data-bs-toggle="tab" data-bs-target="#widget__every-week-goals-fri${id}"
                                                type="button" role="tab" aria-controls="widget__every-week-goals-fri${id}" aria-selected="false">FRI</button>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget__every-week-goals-sat-tab${id}" data-bs-toggle="tab" data-bs-target="#widget__every-week-goals-sat${id}"
                                                type="button" role="tab" aria-controls="widget__every-week-goals-sat${id}" aria-selected="false">SAT</button>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <button class="nav-link nav-widget-link" id="widget__every-week-goals-sun-tab${id}" data-bs-toggle="tab" data-bs-target="#widget__every-week-goals-sun${id}"
                                                type="button" role="tab" aria-controls="widget__every-week-goals-sun${id}" aria-selected="false">SUN</button>
                                            </li>
                                        </ul>
                                        <button class="btn card-body__icon-button" type="button" onclick="addTaskToEveryWeekGoalsWidget(this)" title="add"><i class="fa-solid fa-plus button-icon-accent"></i></button>
                                        <button class="btn card-body__icon-button" type="button" onclick="reloadTasksInEveryWeekGoalsWidget(this)" title="remove selection"><i class="icon-secondary fa-solid fa-rotate-right widget-btn-block__button"></i></button>
                                        <button class="btn card-body__icon-button" type="button" onclick="deleteTasksFromEveryWeekGoalsWidget(this)" title="delete all content"><i class="icon-secondary fa-solid fa-ban widget-btn-block__button"></i></button>
                                    </div>
                                    <div>
                                        <div class="tab-content widget-tab-content">
                                            <div class="tab-pane fade" id="widget__every-week-goals-mon${id}" data-active-day="mon" role="tabpanel" aria-labelledby="widget__every-week-goals-mon-tab${id}">
                                                <ul class="card-body__list" data-day-name="monday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget__every-week-goals-tue${id}" data-active-day="tue" role="tabpanel" aria-labelledby="widget__every-week-goals-tue-tab${id}">
                                                <ul class="card-body__list" data-day-name="tuesday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget__every-week-goals-wed${id}" data-active-day="wed" role="tabpanel" aria-labelledby="widget__every-week-goals-wed-tab${id}">
                                                <ul class="card-body__list" data-day-name="wednesday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget__every-week-goals-thu${id}" data-active-day="thu" role="tabpanel" aria-labelledby="widget__every-week-goals-thu-tab${id}">
                                                <ul class="card-body__list" data-day-name="thusday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget__every-week-goals-fri${id}" data-active-day="fri" role="tabpanel" aria-labelledby="widget__every-week-goals-fri-tab${id}">
                                                <ul class="card-body__list" data-day-name="friday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget__every-week-goals-sat${id}" data-active-day="sat" role="tabpanel" aria-labelledby="widget__every-week-goals-sat-tab${id}">
                                                <ul class="card-body__list" data-day-name="saturday"></ul>
                                            </div>
                                            <div class="tab-pane fade" id="widget__every-week-goals-sun${id}" data-active-day="sun" role="tabpanel" aria-labelledby="widget__every-week-goals-sun-tab${id}">
                                                <ul class="card-body__list" data-day-name="sunday"></ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
            break
        case 'list':
            widget = `<div class="col-12 widget-col">
                            <div class="widget-list" style="padding-bottom: 1rem">
                                <div class="card widget-card border__widget-card shadow-class">
                                    <div class="card-header block-between widget-card-header card-header__text">
                                        <div class="card-widget__block-header block-between">
                                            <p>${inputWidgetValue}</p>
                                            <input type="text" class="form-control hide-class widget-list__input-text-header">
                                            <button class="btn card-body__widget-header-btn btn-rename" type="button" onclick="renameWidget(this)" title="rename"><i class="fa-solid fa-pencil button-icon-accent "></i></button>
                                            <div class="widget-btn-block hide-class">
                                                <button id="renameWidgetConfirm" class="btn card-body__widget-header-btn" type="button" onclick="renameWidgetConfirm(this)"><i class="button-icon-accent fa-solid fa-check"></i></button>
                                                <button class="btn card-body__widget-header-btn" type="button" onclick="renameWidgetCancel(this)"><i class="fa-solid fa-xmark"></i></button>
                                            </div>
                                        </div>
                                        <div class="dropdown dropstart dropdown-settings">
                                            <button class="btn dropdown-settings-btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" title="settings"><i class="fa-solid fa-ellipsis"></i></button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1"  id="myTab" role="tablist">
                                                <li><a class="dropdown-item" href="#" onclick="foolCol(this)">колонка</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="threeQuartersCol(this)">3/4 колонки</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="halfCol(this)">1/2 колонки</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="quarterCol(this)">1/4 колонки</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="deleteWidget(this)">удалить</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="card-body widget-card-body widget-list-card-body">
                                        <div class="input-group widget-list__input-block">
                                            <input type="text" class="form-control widget-list__input-text">
                                            <button type="button" class="input-group-text button-dark" onclick="addTaskToListWidget(this)">+</button>
                                            <div class="widget-btn-block">
                                                <button id="cleanTasksToRunningList" type="button" class="btn widget-btn-block__button icon-secondary" onclick="deleteDoneTasksFromListWidget(this)" title="delete done"><i class="fa-solid fa-eraser"></i></button>
                                                <button id="deleteAllTasksToRunningList" type="button" class="btn widget-btn-block__button icon-secondary" onclick="deleteAllTasksOnListWidget(this)" title="delete all"><i class="fa-solid fa-ban"></i></button>
                                            </div>
                                        </div>
                                        
                                        <ul class="widget-list__list"></ul>
                                    </div>
                                </div>
                            </div>
                        </div>`
            break
            case 'link list':
                widget = `<div class="col-12 widget-col">
                                <div class="widget-link-list" style="padding-bottom: 1rem">
                                    <div class="card widget-card border__widget-card shadow-class">
                                        <div class="card-header block-between widget-card-header card-header__text">
                                            <div class="card-widget__block-header block-between">
                                                <p>${inputWidgetValue}</p>
                                                <input type="text" class="form-control hide-class widget-list__input-text-header">
                                                <button class="btn card-body__widget-header-btn btn-rename" type="button" onclick="renameWidget(this)" title="rename"><i class="fa-solid fa-pencil button-icon-accent "></i></button>
                                                <div class="widget-btn-block hide-class">
                                                    <button id="renameWidgetConfirm" class="btn card-body__widget-header-btn" type="button" onclick="renameWidgetConfirm(this)"><i class="fa-solid fa-check"></i></button>
                                                    <button class="btn card-body__widget-header-btn" type="button" onclick="renameWidgetCancel(this)"><i class="fa-solid fa-xmark"></i></button>
                                                </div>
                                            </div>
                                            <div class="dropdown dropstart dropdown-settings">
                                                <button class="btn dropdown-settings-btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" title="settings"><i class="fa-solid fa-ellipsis"></i></button>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1"  id="myTab" role="tablist">
                                                    <li><a class="dropdown-item" href="#" onclick="foolCol(this)">колонка</a></li>
                                                    <li><a class="dropdown-item" href="#" onclick="threeQuartersCol(this)">3/4 колонки</a></li>
                                                    <li><a class="dropdown-item" href="#" onclick="halfCol(this)">1/2 колонки</a></li>
                                                    <li><a class="dropdown-item" href="#" onclick="quarterCol(this)">1/4 колонки</a></li>
                                                    <li><a class="dropdown-item" href="#" onclick="deleteWidget(this)">удалить</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="card-body widget-card-body widget-link-list-card-body">
                                            <div class="widget-link-list__input-block ">
                                                <div style="width: 100%; padding-left: 1rem">
                                                    <div class="block-between">
                                                        <p style="width: 3rem">text</p>
                                                        <input type="text" class="form-control widget-link-list__input-text" id="linkListWidgetContentText">
                                                    </div>
                                                    <div class="block-between">
                                                        <p style="width: 3rem">url</p>
                                                        <input type="text" class="form-control widget-link-list__input-text" id="linkListWidgetContentUrl">
                                                    </div>
                                                </div>
                                                <button type="button" class="input-group-text button-dark" style="height: 5rem" onclick="addLinkToLinkListWidget(this)">+</button>
                                                <button id="deleteAllTasksToRunningList" type="button" class="btn widget-btn-block__button icon-secondary" onclick="deleteAllTasksOnListWidget(this)" title="delete all"><i class="fa-solid fa-ban"></i></button>
                                            </div>
                                            <div class="widget-btn-block">
                                                
                                            </div>
                                            <ul class="widget-link-list__list"></ul>
                                        </.div>
                                    </div>
                                </div>
                            </div>`
                break
    }

    widgetsCol.insertAdjacentHTML('beforeend', widget)

    saveWidgets()
}

// ФУНКЦИИ ДЛЯ ВИДЖЕТА СПИСОК

// добавление пункта списка
function addTaskToListWidget(el) {
    const widget = el.closest('.card')
    let taskValue = widget.querySelector('.widget-list__input-text').value

    if(taskValue) {
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
    openValidationDialog()
    openValidationDialogBtn.addEventListener('click', () => {
        const listArr = el.closest('.card').querySelectorAll('.widget-list__item')
        listArr.forEach(el => {
            el.parentNode.removeChild(el)
        })

        saveWidgets()
    })
}

// ФУНКЦИИ ДЛЯ ВИДЖЕТА СПИСОК ССЫЛОК

// добавление пункта списка
function addLinkToLinkListWidget(el) {
    const widget = el.closest('.card')
    let linkValue = widget.querySelector('#linkListWidgetContentText').value
    let linkUrl = widget.querySelector('#linkListWidgetContentUrl').value

    if(linkValue && linkUrl) {
        const item = `<li class="widget-list__item-link">
                        <a href="${linkUrl}" class="widget-list__item-link">${linkValue}</a>
                        <span onclick="deleteLink(this)"><i class="fa-solid fa-trash widget-btn-block__button" style="font-size: 14px;"></i></span>
                    </li>`
        const list = widget.querySelector('.widget-link-list__list')
        list.insertAdjacentHTML('beforeend', item)
        cleanWidgetCard()
        saveWidgets()
        window.location.reload();
    }
}

// Удаление ссылки
function deleteLink(el) {
    el.closest('li').remove()
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
    addTaskToEveryWeekGoalsWidgetDialog.showModal()

    widget = el.closest('.widget__every-week-goals')
    weekGoalsWidgetDialogTaskId = Date.now()
    widget.id = weekGoalsWidgetDialogTaskId

    return widget
}

// выбор дня недели
let chooseDayNameIDArr = []
function chooseWeekDay(el) {
    const chooseDayNameID = el.getAttribute('data-day-name')

    if(el.classList.contains('btn-outline-dark')) {
        el.classList.remove('btn-outline-dark')
        chooseDayNameIDArr.forEach(el => {
            if(el == chooseDayNameID) {
                chooseDayNameIDArr = chooseDayNameIDArr.filter(item => item !== el)
            }
        })
    } else {
        chooseDayNameIDArr.push(chooseDayNameID)
        el.classList.add('btn-outline-dark')
    }  

    return chooseDayNameIDArr
}

// добавление контента в виджет
function addTaskToEveryWeekGoalWidget() {
    const dayNames = chooseDayNameIDArr
    let taskValueText = document.querySelector('#everyWeekGoalWidgetDialog').querySelector('#everyWeekGoalWidgetContentText').value
    let taskValueUrl = document.querySelector('#everyWeekGoalWidgetDialog').querySelector('#everyWeekGoalWidgetContentUrl').value
    let item = ''
    if(taskValueUrl == '') {
        item = `<li class="widget-every-week-goal__item " data-task-id="">
                        <div class="block-between">
                            <input type="checkbox" class="widget-list__every-week-goal-checkbox" onclick="markTheTaskOfEveryWeekGoalWidgetCompleted(this)">
                            <p class="widget-list__item-text">${taskValueText}</p>
                        </div>
                        <div>
                            <span class="remove-icon icon-secondary hide-class"><i class="fa-solid fa-rotate-right widget-btn-block__button" style="font-size: 14px;" onclick="removeEveryWeekGoal(this)"></i></span>
                            <span ><i class="fa-solid fa-trash widget-btn-block__button icon-secondary" style="font-size: 14px;" onclick="deleteEveryWeekGoal(this)"></i></span>
                        </div>
                </li>`
    } else {
        item = `<li class="widget-every-week-goal__item " data-task-id="">
                        <div class="block-between">
                            <input type="checkbox" class="widget-list__every-week-goal-checkbox" onclick="markTheTaskOfEveryWeekGoalWidgetCompleted(this)">
                            <a class="widget-list__item-link" href="${taskValueUrl}">${taskValueText}</a>
                        </div>
                        <div>
                            <span class="remove-icon icon-secondary hide-class"><i class="fa-solid fa-rotate-right widget-btn-block__button" style="font-size: 14px;" onclick="removeEveryWeekGoal(this)"></i></span>
                            <span ><i class="fa-solid fa-trash widget-btn-block__button icon-secondary" style="font-size: 14px;" onclick="deleteEveryWeekGoal(this)"></i></span>
                        </div>
                </li>`
    }

    if(taskValueText == '' || dayNames == '') {
        const errorText = document.querySelector('#everyWeekGoalWidgetDialog').querySelector('#errorText')
        errorText.classList.remove('hide-class')
    } else {
        const ulArr = widget.querySelector('.tab-content').querySelectorAll('ul')
        ulArr.forEach(el => {
            dayNames.forEach(e => {
                if(e = el.getAttribute('data-day-name') == e) {
                    el.insertAdjacentHTML('beforeend', item)
                }
            })
        })

        taskValueText = ''
        saveWidgets()
        
        addTaskToEveryWeekGoalsWidgetDialog.close()
        window.location.reload();
    }
}

// выделение элемента недельного виджета как выполненного
function markTheTaskOfEveryWeekGoalWidgetCompleted(el) {
    const item = el.closest('li')
    item.classList.add('light-text-class')
    item.querySelector('.hide-class').classList.remove('hide-class')
    item.querySelector('input').classList.add('hide-class')
    
    saveWidgets()
}

// отмена выделения у выбранного элемента недельного планера
function removeEveryWeekGoal(el) {
    el.classList.add('hide-class')
    const item = el.closest('li')
    item.classList.remove('light-text-class')
    item.querySelector('input').classList.remove('hide-class')

    saveWidgets()
}

// сброс всех отмеченных задач в недельном виджете
function reloadTasksInEveryWeekGoalsWidget(el) {
    openValidationDialog()
    openValidationDialogBtn.addEventListener('click', () => {
        const items = el.closest('.card-body').querySelectorAll('.widget-every-week-goal__item')
        items.forEach(el => {
            if(el.classList.contains('light-text-class')) {
                el.classList.remove('light-text-class')
                el.querySelector('input').classList.remove('hide-class')
                el.querySelector('.remove-icon').classList.add('hide-class')
            }
        })

        saveWidgets()
    })
}

// удаление всего контента из виджета
function deleteTasksFromEveryWeekGoalsWidget(el) {
    openValidationDialog()
    openValidationDialogBtn.addEventListener('click', () => {
        const items = el.closest('.card-body').querySelectorAll('.widget-every-week-goal__item')
        items.forEach(el => {
            el.remove()
        })

        saveWidgets()
    })
}

// удаление контента из списка
function deleteEveryWeekGoal(el) {
    el.closest('li').remove()
    saveWidgets()
    window.location.reload();
}