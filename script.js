// ADD TASKS MODAL =====================================================
const modalWrapper = document.querySelector('.modal-wrapper')
const modalTitle = document.querySelector('.modal-title')
const modalSubtitle = document.querySelector('.modal-subtitle')
const modalBody = document.querySelector('.modal-body')

const tasksListJSON = localStorage.getItem('tasks')

let tasksList = !tasksListJSON ? [] : JSON.parse(tasksListJSON)

const addTaskModal = {
    modalTitle: 'Adicionar tarefa',
    modalSubtitle: 'Coloque o nome da tarefa para criar uma tarefa pendente!',
    modalBody: `<input id="task-name" class="addTasksInput" placeholder="Digite o nome da atividade: ">`
}

function makeTask(taskName, taskId, taskStatus = 'Pendente') {
    if(taskStatus === 'Pendente') {
        taskStatus = `<span class="pendent">Pendente</span>`
    } else {
        taskStatus = `<span class="complete">Completo</span>`
    }
    
    return {
        taskId: taskId,
        taskName: taskName,
        taskStatus: taskStatus,
    }
}

function openAddTaskModal() {
    modalTitle.innerHTML = addTaskModal.modalTitle
    modalSubtitle.innerHTML = addTaskModal.modalSubtitle
    modalBody.innerHTML = addTaskModal.modalBody
    
    modalWrapper.classList.add('shown')
}

function closeAddTaskModal() {
    modalWrapper.classList.remove('shown')
}

function saveNewTask() {
    const taskName = document.getElementById('task-name').value;
    const task = makeTask(taskName, tasksList.length)
    insertTask(task, (tasksList.length + 1))
    tasksList.push(task)
    saveTasks()
    closeAddTaskModal()
}

function insertTask(task, taskId) {
    const checkSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="rgb(0, 0, 0)" class="check-btn"><path d="M20 12.194v9.806h-20v-20h18.272l-1.951 2h-14.321v16h16v-5.768l2-2.038zm.904-10.027l-9.404 9.639-4.405-4.176-3.095 3.097 7.5 7.273 12.5-12.737-3.096-3.096z"/></svg>`
    const deleteSVG = ` <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="#ff1e1e" class="delete-btn">
    <path
        d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z" />
    </svg> `

    const tr = document.createElement('tr')
    tr.classList.add('task')
    tr.innerHTML = `
    <td class="task-id">${taskId}</td>
    <td class="task-name">${task.taskName}</td>
    <td class="task-status">${task.taskStatus}</td>
    <td class="edit-icon">${checkSVG}</td>
    <td class="delete-icon">${deleteSVG}</td>
    `

    const tasksTableBody = document.querySelector('.tasks-table tbody')
    tasksTableBody.appendChild(tr)
}

function saveTasks() {
    const stringifiedTasks = JSON.stringify(tasksList)
    localStorage.setItem('tasks', stringifiedTasks)
}

function renderSavedTasks() {
    tasksList.forEach((task, pos) => {
        insertTask(task, (pos + 1))
    })
}

document.addEventListener('keyup', event => {
    if(event.key === 'Enter' && document.querySelector('#task-name').value) {
        saveNewTask()
        insertTask()
    }
    
})

window.addEventListener('load', renderSavedTasks)

// DELETE TASKS ================================================

function deleteRemovedTasks(id) {
    tasksList.splice((id-1), 1)
    
    saveTasks()
}

document.addEventListener('click', event => {  
    const el = event.target
    if(el.classList.contains('delete-btn')) {
        const parent = el.parentNode
        const tr = parent.parentNode
        const id = Number(tr.querySelector('.task-id').innerHTML)
        deleteRemovedTasks(id)
        tr.remove()

        location.reload()
    }
})

// SET TASKS AS DONE ============================================ 

document.addEventListener('click', event => {  
    const el = event.target
    if(el.classList.contains('check-btn')) {
        const parent = el.parentNode
        const tr = parent.parentNode
        const id = Number(tr.querySelector('.task-id').innerHTML)
        const taskName = tasksList[(id-1)].taskName
        const taskId = id - 1
        const taskStatus = 'Completa'

        deleteRemovedTasks(id)
        tr.remove()

        const checkedTask = makeTask(taskName, taskId, 'Completa')
        insertTask(checkedTask, taskId + 1)
        tasksList.push(checkedTask)
        saveTasks()

        location.reload()
    }
})