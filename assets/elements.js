dragula([document.querySelector('#widgetsCol'), document.querySelector('.widget-col')        
])

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
    const widgetsCol = document.querySelector('#widgetsCol')
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

function toOneCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-12')
    col.classList.add('widget-col')

    saveWidgets()
}

function toTwoCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-6')
    col.classList.add('widget-col')
    saveWidgets()
}

function toThreeCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-3')
    col.classList.add('widget-col')
    saveWidgets()
}

function deleteWidget() {
    console.log('delete widget')
}

function addTaskToListWidget(el) {
    const widget = el.closest('.card')
    let taskValue = widget.querySelector('input').value
    const item = `<li class="widget-list__item">
                    <input type="checkbox" class="widget-list__item-checkbox" onclick="markTheTaskCompleted(this)">
                    <p class="widget-list__item-text">${taskValue}</p>
                </li>`
    const list = widget.querySelector('.widget-list__list')
    list.insertAdjacentHTML('beforeend', item)
    taskValue = ''
    saveWidgets()
    window.location.reload();
}

function markTheTaskCompleted(el) {
    console.log('mark')
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
    console.log(listArr)
    listArr.forEach(el => {
        if(el.className == "widget-list__item widget-list__item-text-done") {
            el.parentNode.removeChild(el)
        }
    })

    saveWidgets()
}

function deleteAllTasksOnListWidget(el) {
    const listArr = el.closest('.card').querySelectorAll('.widget-list__item')
    console.log(listArr)
    listArr.forEach(el => {
        el.parentNode.removeChild(el)
    })

    saveWidgets()
}

function renderWidget() {
    let valueId = inputWidgetValueId
    let widget = ''
    switch (valueId) {
        case 'weekPlansTitleWidgetInput':
            id = 'weekPlansTitleWidgetInput'
            widget = `<div class="col-12 widget-col">
                            <div class="widget-everyWeekGoals" style="padding-bottom: 1rem">
                                <div class="card widget-card">
                                    <div class="card-header card-header-widget card-header__text">
                                        <p>${inputWidgetValue}</p>
                                        <div class="dropdown dropstart dropdown-settings">
                                            <button class="btn dropdown-settings-btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i></button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1"  id="myTab" role="tablist">
                                                <li><a class="dropdown-item" href="#" onclick="toOneCol(this)">100% ширины</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="toTwoCol(this)">50% ширины</a></li>
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
                                            <button class="btn add-card-button dropdown-settings-btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">+</button>
                                        </div>
                                        <div>
                                            <div class="tab-content" id="myTabsContent">
                                                <div class="tab-pane fade show active" id="widget-everyWeekGoals-mon" role="tabpanel" aria-labelledby="widget-everyWeekGoals-mon-tab">
                                                    <ul class="card-body__ul" id="runningListCard">
                                                        <li><p>mon</p></li>
                                                    </ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-tue" role="tabpanel" aria-labelledby="widget-everyWeekGoals-tue-tab">
                                                    <ul class="card-body__ul" id="weekPlanerListCard">
                                                        <li><p>tue</p></li>
                                                    </ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-wed" role="tabpanel" aria-labelledby="widget-everyWeekGoals-wed-tab">
                                                    <div id="planningListCard"></div>
                                                    <ul class="card-body__ul" id="planningListCard">
                                                        <li><p>wed</p></li>
                                                    </ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-thu" role="tabpanel" aria-labelledby="widget-everyWeekGoals-thu-tab">
                                                    <div id="planningListCard"></div>
                                                    <ul class="card-body__ul" id="planningListCard">
                                                        <li><p>thu</p></li>
                                                    </ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-fri" role="tabpanel" aria-labelledby="widget-everyWeekGoals-fri-tab">
                                                    <div id="planningListCard"></div>
                                                    <ul class="card-body__ul" id="planningListCard">
                                                        <li><p>fri</p></li>
                                                    </ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-sat" role="tabpanel" aria-labelledby="widget-everyWeekGoals-sat-tab">
                                                    <div id="planningListCard"></div>
                                                    <ul class="card-body__ul" id="planningListCard">
                                                        <li><p>sat</p></li>
                                                    </ul>
                                                </div>
                                                <div class="tab-pane fade" id="widget-everyWeekGoals-sun" role="tabpanel" aria-labelledby="widget-everyWeekGoals-sun-tab">
                                                    <div id="planningListCard"></div>
                                                    <ul class="card-body__ul" id="planningListCard">
                                                        <li><p>sun</p></li>
                                                    </ul>
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
                                        <p>${inputWidgetValue}</p>
                                        <div class="dropdown dropstart dropdown-settings">
                                            <button class="btn dropdown-settings-btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i></button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1"  id="myTab" role="tablist">
                                                <li><a class="dropdown-item" href="#" onclick="toOneCol(this)">100% ширины</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="toTwoCol(this)">50% ширины</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="toThreeCol(this)">25% ширины</a></li>
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