let tasks = []

if (localStorage.getItem('tasksList')) {
	tasks = JSON.parse(localStorage.getItem('tasksList'))
	tasks.forEach((tasksItem) => renderNewTask(tasksItem))
}

function saveTasksListInLocalStorage(tasks) {
    localStorage.setItem('tasksList', JSON.stringify(tasks))
}

function getTasksListFromLocalStorage() {
    tasksList = JSON.parse(localStorage.getItem('tasksList'))

    return tasksList
}

function uncheckRunningListCardRadio() {
    var items = document.getElementsByTagName('input');

    for(var i = 0; i < items.length; i++) {
        if(items[i].type == 'radio') {
            items[i].checked = false;
        }
    } 
}

function addNewTaskToRunningList() {
    const taskId = Date.now()
    const taskInputValue = document.querySelector("#addTaskInput").value
    const taskCheckbox = document.querySelector('input[type="radio"]:checked').closest('li').querySelector('i').classList.value

    const newTask = {
        id: taskId,
        taskText: taskInputValue,
        status: taskCheckbox
    }

    getTasksListFromLocalStorage()

    tasks.push(newTask)
    saveTasksListInLocalStorage(tasks)

    renderNewTask(newTask)

    const addTaskInputValue = document.querySelector("#addTaskInput")
	addTaskInputValue.value = ""
    uncheckRunningListCardRadio()
}

function renderNewTask(task) {
    const runningListCard = document.querySelector("#runningListCard")
	const taskHTML = `<li class="card-ul-item" id="${task.id}">
                        <input class="form-check-input" type="checkbox">
                        <span class="runningList-icon"><i class="${task.status}"></i></span>
                        <label class="form-check-label" for="flexCheckDefault">${task.taskText}</label>
                    </li>`

    runningListCard.insertAdjacentHTML('beforeend', taskHTML)
}

function deleteAllBreakfatsCard() {
    localStorage.removeItem('tasksList')
    window.location.reload();
}






































// let tasks = []
// const tasksList = document.querySelector('#runningList-ul')

// function saveToLocalStorage() {
// 	localStorage.setItem('tasks', JSON.stringify(tasks))
// }

// function renderTaskList(task) {
//     let inputValue = document.querySelector('#addTaskInput').value
    
//     // шаблон объекта задачи
//     const runningListItem = `<li class="card-ul-item">
//         <input class="form-check-input" type="radio">
//         <span class="runningList-icon"><i class=""></i></span>
//         <label class="form-check-label" for="flexCheckDefault">${inputValue}</label>
//     </li>`

//     tasks.insertAdjacentHTML('beforeend', runningListItem)
// }

// if (localStorage.getItem('tasks')) {
// 	tasks = JSON.parse(localStorage.getItem('tasks'))
//     console.log('tasks', tasks)
//     tasks.forEach((task) => {
//         renderTaskList(task)
//     })
// }

// function addNewTaskToRunningList() {
//     let runningListUl = document.querySelector('#runningList-ul')
//     // let li = document.querySelector('input[type="radio"]:checked').closest('li');
//     // let taskStatus = li.querySelector('i').classList.value
//     let inputValue = document.querySelector('#addTaskInput').value
    
//     // шаблон объекта задачи
//     const runningListItem = `<li class="card-ul-item">
//         <input class="form-check-input" type="radio">
//         <span class="runningList-icon"><i class=""></i></span>
//         <label class="form-check-label" for="flexCheckDefault">${inputValue}</label>
//     </li>`

//     tasks.push(runningListItem)
//     saveToLocalStorage()
//     console.log('tasks', tasks)

//     runningListUl.insertAdjacentHTML('afterbegin', tasks)

//     //очистить все поля
//     console.log('inputValue1', inputValue)
//     inputValue = ""
//     console.log('inputValue2', inputValue)
// }

