let taskIdCounter = 1;

document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskContent = prompt('Enter task description:');
    if (taskContent && taskContent.trim() !== '') {
        createTask(taskContent);
    }
});

function createTask(content) {
    const task = document.createElement('div');
    task.classList.add('task');
    task.setAttribute('draggable', 'true');
    task.setAttribute('id', `task-${taskIdCounter++}`);
    task.innerText = content;

    task.addEventListener('dragstart', drag);
    
    document.querySelector('#todo .task-list').appendChild(task);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    
    // Ensure we drop into the .task-list container, not onto another task
    let dropTarget = ev.target;
    if (dropTarget.classList.contains('task')) {
        dropTarget = dropTarget.parentElement;
    } else if (dropTarget.classList.contains('column')) {
        dropTarget = dropTarget.querySelector('.task-list');
    }
    
    if (dropTarget && dropTarget.classList.contains('task-list')) {
        dropTarget.appendChild(draggedElement);
    }
}