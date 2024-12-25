// script.js

let item = "";
let todoList = [];
let filtered = 'all';

// Function to generate a unique ID
const generateId = () => Math.floor(Math.random() * 1000000);

function getCurrentDate() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date();

    const month = months[date.getMonth()]; // Get the month abbreviation
    const day = String(date.getDate()).padStart(2, '0'); // Ensure day is two digits
    const year = date.getFullYear(); // Get the full year

    return `${month} ${day}, ${year}`;
}


const today = getCurrentDate();
const dateOfToday = document.getElementById('today-date');
dateOfToday.innerHTML = today;

// local storage functions

function saveToLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

function loadFromLocalStorage() {
    const savedList = localStorage.getItem('todoList');
    if (savedList) {
        todoList = JSON.parse(savedList); // Parse the saved string back into an array
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage(); // Load saved data
    renderTodoItems(); // Render the tasks
});


// Function to update the displayed todo items
function renderTodoItems() {
    const todoListElement = document.getElementById('todoList');
    todoListElement.innerHTML = ''; // Clear existing items

    const filteredItems = todoList.filter(item => {
        if (filtered === 'completed') return item.checked;
        if (filtered === 'active') return !item.checked;
        return true;
    });

    filteredItems.reverse().forEach(todoItem => {
        const itemElement = document.createElement('div');
        itemElement.className = "flex items-center justify-between px-4 mt-6 transition-all ease-in-out";
        itemElement.setAttribute('data-id', todoItem.id);

        const checkboxId = `checkbox-${todoItem.id}`;

        const isChecked = todoItem.checked ? 'checked' : '';
        const lineThroughClass = todoItem.checked ? 'line-through' : '';
        const description = todoItem.describtion;

        itemElement.innerHTML = `
            <div class="flex gap-4">
                <input type="checkbox" ${isChecked} id="${checkboxId}" class="checkbox"/>
                <label for="${checkboxId}" class="checkbox-label"></label>
                <p class="${lineThroughClass} text-[#e6e6e7] text-wrap editable-task outline-0">
                    ${description}
                </p>
            </div>
            <span class=" cursor-pointer relative z-50">
                <img src="../images/bin (1).png" alt='bucket' class='w-5 h-5' />
            </span>
        `;

        // Attach event handlers
        itemElement.querySelector('.checkbox').addEventListener('change', () => handleCheckbox(todoItem.id));
        itemElement.querySelector('.editable-task').addEventListener('click', (e) => startEditing(todoItem.id, e.target));
        itemElement.querySelector('.editable-task').addEventListener('blur', (e) => finishEditing(todoItem.id, e.target));
        itemElement.querySelector('.editable-task').addEventListener('keydown', (e) => handleKeydown(e, todoItem.id, e.target));
        itemElement.querySelector('span').addEventListener('click', () => deleteItem(todoItem.id));

        todoListElement.appendChild(itemElement);
    });

    document.getElementById('itemsLeft').textContent = `${todoList.filter(item => !item.checked).length} items left`;

}

// Start editing
function startEditing(id, element) {
    element.contentEditable = "true";
    element.focus();
}

// Finish editing
function finishEditing(id, element) {
    const todoItem = todoList.find(item => item.id === id);
    if (todoItem) {
        todoItem.describtion = element.textContent.trim();
        element.contentEditable = "false";
        saveToLocalStorage();
        renderTodoItems(); // Re-render the updated list
    }
}

// Handle keydown event
function handleKeydown(event, id, element) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent adding a new line
        finishEditing(id, element); // Save changes and finish editing
    }
}


// Function to add a new todo item
function addItem() {
    if (!item) return;
    todoList.push({
        id: generateId(),
        checked: false,
        describtion: item,
    });
    item = ""; // Reset input
    document.getElementById('todoInput').value = ''; // Clear input field
    saveToLocalStorage();
    renderTodoItems();
    const message = "A new task was added !"
    addNotification(message);
}

// Function to handle checkbox toggle
function handleCheckbox(id) {
    todoList = todoList.map(todoItem => 
        todoItem.id === id ? { ...todoItem, checked: !todoItem.checked } : todoItem
    );
    saveToLocalStorage();
    renderTodoItems();
}


// Function to delete an item with animation
function deleteItem(itemId) {
    // Find the item element in the DOM
    const itemElement = document.querySelector(`[data-id="${itemId}"]`);

    if (itemElement) {
        // Add a class to trigger the animation
        itemElement.classList.add("fade-out");

        // Wait for the animation to complete
        itemElement.addEventListener("animationend", () => {
            // Remove the item from the DOM after the animation ends
            itemElement.remove();

            // Optionally update your items array (if you maintain one)
            todoList = todoList.filter(todoItem => todoItem.id !== itemId);
            saveToLocalStorage();
            renderTodoItems();
            const message = "A task was deleted !"
            addNotification(message);
        });
    }
}



// Function to clear completed items
function clearCompleted() {
    todoList = todoList.filter(item => !item.checked);
    saveToLocalStorage();
    renderTodoItems();
}

// Event listeners
document.getElementById('addButton').addEventListener('click', addItem);
document.getElementById('todoInput').addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        item = e.target.value;
        addItem();
    } else {
        item = e.target.value;
    }
});
document.getElementById('clearCompleted').addEventListener('click', clearCompleted);

// display Notifications

const notificationBox = document.getElementById('notification-box');

function addNotification(message){
    const notification = document.createElement('div');
    notification.className = "notification rounded";
    notification.innerHTML = `
            <p> ${message} </p>
        `;
    notificationBox.appendChild(notification);
    notification.addEventListener("animationend", () => {
        // Remove the item from the DOM after the animation ends
        notification.remove();

    });
}

console.log(localStorage)