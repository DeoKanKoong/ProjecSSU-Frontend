document.addEventListener('DOMContentLoaded', function() {
    const id = sessionStorage.getItem('id');

    // 사용자 정보 가져오기
    fetch(`http://43.201.254.244:8080/profile/${id}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(userInfo => {
        const name = userInfo.name;
        const department = userInfo.department;
        const authButton = document.getElementById('auth-button');

        if (name) {
            // 로그인 상태일 때 사용자 정보 표시
            document.getElementById('user-name').textContent = `이름: ${name}`;
            document.getElementById('user-department').textContent = `학과(부): ${department}`;
            authButton.textContent = '로그아웃';
        }

        // 로그아웃 버튼에 이벤트 리스너 추가
        authButton.addEventListener('click', handleAuth);
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
        document.getElementById('user-name').textContent = '로그아웃 상태입니다';
        document.getElementById('user-department').textContent = '';
        document.getElementById('auth-button').textContent = '로그인';

        const authButton = document.getElementById('auth-button');
        authButton.addEventListener('click', handleAuth);
    });

    // JSON 파일에서 프로그램 데이터 가져오기
    fetch('../static/js/programs.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(programs => {
        const programItemsContainer = document.getElementById('program-items');
        programItemsContainer.innerHTML = ''; // 기존 내용을 지우기

        programs.forEach(program => {
            const programItem = document.createElement('div');
            programItem.className = 'program-item';
            programItem.innerHTML = `
                <div class="program-item-title">${program.title}</div>
                <div class="program-item-desc">${program.dateRange}</div>
                <div class="program-item-meta">
                    <div><strong>종류:</strong> ${program.type}</div>
                    <div><strong>진행 상황:</strong> ${program.progress}</div>
                </div>
            `;
            programItemsContainer.appendChild(programItem);
        });
    })
    .catch(error => console.error('Error fetching programs:', error));

    // 팀 모집 게시글의 최근 게시글들을 가져와서 표시 (최대 6개)
    fetch('http://43.201.254.244:8080/articles')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const posts = data;

        // 배열인지 확인하고 처리
        if (Array.isArray(posts)) {
            const boardItemsContainer = document.getElementById('board-items');
            boardItemsContainer.innerHTML = ''; // 기존 내용 지우기
            posts.slice(0, 6).forEach(post => {
                const boardItem = document.createElement('div');
                boardItem.className = 'board-item';
                boardItem.onclick = () => {
                    window.location.href = `BBSPost.html?id=${post.id}`;
                };
                boardItem.innerHTML = `
                    <div class="post-content">
                        <h2 class="board-item-title">${post.title.length > 15 ? post.title.slice(0, 15) + '...' : post.title}</h2>
                        <p class="board-item-desc">${post.content}</p>
                        <div class="board-item-meta">
                            <div class="detail-item">
                                <span class="detail-label">분야</span>
                                <span class="detail-value">${post.field}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">우대사항</span>
                                <span class="detail-value">${post.preferentialTreatment}</span>
                            </div>
                        </div>
                        <div class="board-item-footer">
                            <span class="current-members">모집 인원: ${post.numberOfPeople}명</span>
                            <span class="deadline">마감 기한: ${post.deadline}</span>
                        </div>
                    </div>
                `;
                boardItemsContainer.appendChild(boardItem);
            });
        } else {
            console.error('Error: posts is not an array');
        }
    })
    .catch(error => console.error('Error fetching recent posts:', error));

    function handleAuth() {
        console.log('handleAuth called');
        const authButton = document.getElementById('auth-button');
        if (authButton.textContent === '로그아웃') {
            logout();
        } else {
            window.location.href = 'login.html';
        }
    }

    function logout() {
        sessionStorage.removeItem('id');
        window.location.reload();
    }

});

function redirectTo(page) {
    window.location.href = page;
}
