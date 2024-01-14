export function allowDrop(event) {
    event.preventDefault();
}

export function drag(event, data) {
    console.log(event.target.id)
    console.log(data)
    event.dataTransfer.setData("application/json", data);
}

export function drop(event, id) {
    event.preventDefault();
    const data = event.dataTransfer.getData("application/json");
    console.log(data)
    event.target.appendChild(document.getElementById(data));
}


export function addNewTask() {
    var taskName = document.getElementById('newTaskName').value;
    if (taskName.trim() === '') {
        alert('Please enter a task name.');
        return;
    }

    var taskId = 'task' + (document.querySelectorAll('.kanban-task').length + 1);

    var newTask = document.createElement('div');
    newTask.classList.add('kanban-task');
    newTask.setAttribute('draggable', true);
    newTask.setAttribute('ondragstart', 'drag(event)');
    newTask.id = taskId;

    var taskContent = document.createTextNode(taskName);
    newTask.appendChild(taskContent);

    var deleteButton = document.createElement('span');
    deleteButton.textContent = ' X';
    deleteButton.style.color = 'red';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.float = 'right';
    deleteButton.onclick = function() { deleteTask(taskId); };

    newTask.appendChild(deleteButton);

    document.querySelector('.kanban-column').appendChild(newTask);
    document.getElementById('newTaskName').value = ''; // Clear the input field after adding
}

export function deleteTask(taskId) {
    var task = document.getElementById(taskId);
    task.parentNode.removeChild(task);
}


