const taskInput = document.getElementById("taskInput");
const addButton = document.querySelector(".todo-input button");
const todoList = document.querySelector(".todo-list");

const API_URL = "http://127.0.0.1:8000/api/tasks/";

// Load tasks when page opens
window.onload = fetchTasks;

// Fetch tasks from Django
async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    todoList.innerHTML = "";

    tasks.forEach(task => {
        displayTask(task);
    });
}

// Display task
function displayTask(task) {
    const li = document.createElement("li");

    li.innerHTML = `
        <span style="${task.completed ? 'text-decoration:line-through;color:gray;' : ''}">
            ${task.title}
        </span>

        <div>
            <button class="complete">✓</button>
            <button class="delete">✗</button>
        </div>
    `;

    // Complete Task
    li.querySelector(".complete").addEventListener("click", async () => {
        await fetch(API_URL + task.id + "/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: task.title,
                completed: !task.completed
            })
        });

        fetchTasks();
    });

    // Delete Task
    li.querySelector(".delete").addEventListener("click", async () => {
        await fetch(API_URL + task.id + "/", {
            method: "DELETE"
        });

        fetchTasks();
    });

    todoList.appendChild(li);
}

// Add Task
addButton.addEventListener("click", async () => {

    const title = taskInput.value.trim();

    if (!title) return;

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            completed: false
        })
    });

    taskInput.value = "";

    fetchTasks();
});