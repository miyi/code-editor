export function allowDrop(event) {
    event.preventDefault();
}

export function drag(event, index, list) {
    // console.log(event.target.id)
    console.log("7", index, list)
    console.log("8", list[index])
    event.dataTransfer.setData("index", index)
    event.dataTransfer.setData("list", list)
}

export function drop(event, list) {
    event.preventDefault();
    const index = event.dataTransfer.getData("index");
    const prevList = event.dataTransfer.getData("list");
    console.log("17", index, prevList)
    list.push(prevList[index]);
    console.log("19", list)
    delete prevList[index];
}


export function addNewTask(example) {
    var taskName = document.getElementById('newTaskName').value;
    if (taskName.trim() === '') {
        alert('Please enter a task name.');
        return;
    }
    console.log(example.todoList.length)
    example.todoList.push(
        {
            "id": example.todoList.length + 1,
            "name": taskName,
            "Description": "S.L.",
            "Assignee": "",
            "Story Points": 1
        }
    )
    document.getElementById('newTaskName').value = ''; // Clear the input field after adding
    console.log(example.todoList.length)
}

export function deleteTask(index, list) {
    if (list.length === 1) {
        list.pop()
    } else {
        delete list[index];
    }
}


