dragula([document.querySelector('#widgetsCol'), document.querySelector('.widget-col')        
])

if(localStorage.getItem('widgetsCol')) {
    widgetsCol.innerHTML = localStorage.getItem('widgetsCol')
}

let inputWidgetValue = ''
let inputWidgetValueId = ''

function addWidgetOpenDialog() {
    console.log('open')
    const widgetDialog = document.querySelector('#widgetDialog')
    widgetDialog.showModal()
}

function cleanWidgetCard() {
    console.log('clean')
    const inputArr = document.querySelector('.widget-content').querySelectorAll('input')
    inputArr.forEach(el => {
        if(el.value) {
            el.value = ''
        }
    });
}

function createNewWidget() {
    console.log('create')
    const inputArr = document.querySelector('.widget-content').querySelectorAll('input')
    inputArr.forEach(el => {
        if(el.value) {
            inputWidgetValue = el.value
            inputWidgetValueId = el.id
        }
        return inputWidgetValue, inputWidgetValueId
    });
    console.log('inputWidgetValue', inputWidgetValue)
    console.log('inputWidgetValueId', inputWidgetValueId)

    renderWidget()
}

function renderWidget() {
    console.log('render')

    let id = inputWidgetValueId
    let widget = ''
    switch (id) {
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
                                    <div class="card-body widget-everyWeekGoals__card-body">
                                        <div>
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
                                    <div class="card-header card-header__text">
                                        <p>${inputWidgetValue}</p>
                                    </div>
                                    <div class="card-body widget-list__card-body">
                                        <div class="input-group widget-list__input-block">
                                            <input type="text" class="form-control widget-list__input-text" aria-label="Dollar amount (with dot and two decimal places)">
                                            <span class="input-group-text">+</span>
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

    const widgetsCol = document.querySelector('#widgetsCol')
    widgetsCol.insertAdjacentHTML('afterbegin', widget)

    console.log('widgetsColwidgetsCol', widgetsCol)

    localStorage.setItem('widgetsCol', widgetsCol.innerHTML)
}

function toOneCol(el) {
    console.log('el', el)
    const col = el.closest('.widget-col')
    console.log('col', col)
    col.className = ''
    col.classList.add('col-12')
    col.classList.add('widget-col')
}

function toTwoCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-6')
    col.classList.add('widget-col')
}

function toThreeCol(el) {
    const col = el.closest('.widget-col')
    col.className = ''
    col.classList.add('col-4')
    col.classList.add('widget-col')
}

function deleteWidget() {
    console.log('delete widget')
}