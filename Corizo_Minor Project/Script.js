 document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const taskForm = document.getElementById('taskForm');
            const editForm = document.getElementById('editForm');
            const editModal = document.getElementById('editModal');
            const closeBtn = document.querySelector('.close-btn');
            const taskContainer = document.getElementById('taskContainer');
            const notification = document.getElementById('notification');
            
            // Load tasks from localStorage
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // Show notification
            function showNotification(message, type) {
                notification.textContent = message;
                notification.className = `notification ${type}`;
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
            
            // Generate unique ID
            function generateId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            }
            
            // Save tasks to localStorage
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            
            // Create task element
            function createTaskElement(task) {
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.dataset.id = task.id;
                
                const formattedDate = new Date(task.createdAt).toLocaleString();
                
                taskItem.innerHTML = `
                    <div class="task-header">
                        <div class="task-title">${task.title}</div>
                        <div class="task-actions">
                            <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                            <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                        </div>
                    </div>
                    <div class="task-description">${task.description || 'No description provided'}</div>
                    <div class="task-meta">
                        <span>Created: ${formattedDate}</span>
                        <span>ID: ${task.id}</span>
                    </div>
                `;
                
                // Add event listeners
                const editBtn = taskItem.querySelector('.edit-btn');
                const deleteBtn = taskItem.querySelector('.delete-btn');
                
                editBtn.addEventListener('click', () => openEditModal(task.id));
                deleteBtn.addEventListener('click', () => deleteTask(task.id));
                
                return taskItem;
            }
            
            // Render tasks
            function renderTasks() {
                taskContainer.innerHTML = '';
                
                if (tasks.length === 0) {
                    taskContainer.innerHTML = `
                        <div class="empty-state">
                            <div style="font-size: 4rem; margin-bottom: 15px;">📋</div>
                            <h3>No tasks yet</h3>
                            <p>Add a new task to get started!</p>
                        </div>
                    `;
                    return;
                }
                
                tasks.forEach(task => {
                    taskContainer.appendChild(createTaskElement(task));
                });
            }
            
            // Add new task
            taskForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const title = document.getElementById('title').value.trim();
                const description = document.getElementById('description').value.trim();
                
                if (!title) {
                    showNotification('Please enter a task title', 'error');
                    return;
                }
                
                const newTask = {
                    id: generateId(),
                    title,
                    description,
                    createdAt: new Date().toISOString()
                };
                
                tasks.unshift(newTask);
                saveTasks();
                renderTasks();
                
                // Reset form
                taskForm.reset();
                
                showNotification('Task added successfully!', 'success');
            });
            
            // Delete task
            function deleteTask(id) {
                if (confirm('Are you sure you want to delete this task?')) {
                    tasks = tasks.filter(task => task.id !== id);
                    saveTasks();
                    renderTasks();
                    showNotification('Task deleted successfully!', 'success');
                }
            }
            
            // Open edit modal
            function openEditModal(id) {
                const task = tasks.find(task => task.id === id);
                
                if (!task) {
                    showNotification('Task not found!', 'error');
                    return;
                }
                
                document.getElementById('editId').value = task.id;
                document.getElementById('editTitle').value = task.title;
                document.getElementById('editDescription').value = task.description;
                
                editModal.style.display = 'flex';
            }
            
            // Close modal
            closeBtn.addEventListener('click', () => {
                editModal.style.display = 'none';
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === editModal) {
                    editModal.style.display = 'none';
                }
            });
            
            // Update task
            editForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const id = document.getElementById('editId').value;
                const title = document.getElementById('editTitle').value.trim();
                const description = document.getElementById('editDescription').value.trim();
                
                if (!title) {
                    showNotification('Please enter a task title', 'error');
                    return;
                }
                
                const taskIndex = tasks.findIndex(task => task.id === id);
                
                if (taskIndex === -1) {
                    showNotification('Task not found!', 'error');
                    return;
                }
                
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title,
                    description,
                    updatedAt: new Date().toISOString()
                };
                
                saveTasks();
                renderTasks();
                editModal.style.display = 'none';
                
                showNotification('Task updated successfully!', 'success');
            });
            
            // Initial render
            renderTasks();
        });
    