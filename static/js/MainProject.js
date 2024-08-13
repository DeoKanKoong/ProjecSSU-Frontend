document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('back-button');
    const menuItems = document.getElementById('menu-items');
    const addTaskButton = document.getElementById('add-task-button');

    backButton.addEventListener('click', function() {
        menuItems.classList.toggle('hidden');
        backButton.classList.toggle('flipped');
    });

    const params = new URLSearchParams(window.parent.location.search);
    const teamId = params.get('teamId');
    const id = sessionStorage.getItem('id');

    if (id) {
        fetch(`http://43.201.254.244:8080/teams/${teamId}/todos`, {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const todoListContainer = document.getElementById('todo-list');
            data.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.classList.add('todo-item');

                todoItem.innerHTML = `
                    <div class="todo-item-title">${todo.title}</div>
                    <div class="todo-item-description">${todo.description}</div>
                    <div class="todo-item-timestamp">Created at: ${new Date(todo.createdAt).toLocaleString()}</div>
                `;
                
                todoListContainer.appendChild(todoItem);
            });
        })
        .catch(error => {
            console.error('Error fetching team data:', error);
            alert('팀 정보를 불러오는 중 오류가 발생했습니다.');
        });
    } else {
        alert("현재 로그아웃 상태입니다. 로그인을 하신 후에 사용해주세요.");
        window.location.href = 'login.html';
    }

    addTaskButton.addEventListener('click', function() {
        const todoListContainer = document.getElementById('todo-list');

        const newTodoItem = document.createElement('div');
        newTodoItem.classList.add('todo-item');

        newTodoItem.innerHTML = `
            <input type="text" id="new-todo-title" class="todo-item-title" placeholder="Enter title">
            <textarea id="new-todo-description" class="todo-item-description" placeholder="Enter description"></textarea>
            <button id="save-task-button" class="save-task-button">Save</button>
        `;

        todoListContainer.appendChild(newTodoItem);

        const saveTaskButton = document.getElementById('save-task-button');

        saveTaskButton.addEventListener('click', function() {
            const title = document.getElementById('new-todo-title').value;
            const description = document.getElementById('new-todo-description').value;

            if (title && description) {
                const newTodo = {
                    title: title,
                    description: description
                };

                fetch(`http://43.201.254.244:8080/teams/${teamId}/todos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newTodo),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    alert('새로운 할 일이 성공적으로 추가되었습니다!');
                    location.reload(); // 새 항목을 보기 위해 페이지를 새로 고침
                })
                .catch(error => {
                    console.error('새로운 할 일 추가 중 오류 발생:', error);
                    alert('새로운 할 일을 추가하는 중 오류가 발생했습니다.');
                });
            } else {
                alert('모든 필드를 입력해주세요.');
            }
        });
    });
});
