let currentPage = 1;
const postsPerPage = 5;
let postsData = [];

async function fetchPosts() {
    const user_id = sessionStorage.getItem('id');
    try {
        const response = await fetch(`http://43.201.254.244:8080/applications/apply/my/${user_id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        postsData = data;

        renderPosts();
        renderPagination();
        await renderChatting(); // 각 게시글에 대해 채팅 기능 렌더링
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function renderPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToShow = postsData.slice(start, end);

    postsToShow.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        // 게시글 내용을 구성
        postElement.innerHTML = `
            <div class="post-content">
                <h2>${post.title}</h2>
                <p>${post.content}</p>
            </div>
            <div class="post-footer">
                <span>모집 인원 <img src="../static/img/gather.png" class="icon"> ${post.numberOfPeople}명</span>
                <span>마감 기한 <img src="../static/img/clock.png" class="icon"> ~ ${post.deadline}</span>
                <span><img src="../static/img/schedule.png" class="icon"> ${post.createAt}</span>
                <div id="chat-container-${post.id}"></div> <!-- chat-container 추가 -->
            </div>
        `;

        // 게시글 전체를 클릭할 때 게시글 페이지로 이동하도록 설정
        postElement.addEventListener('click', (event) => {
            // 클릭한 요소가 채팅 버튼이 아닐 경우에만 게시글로 이동
            if (!event.target.classList.contains('chat-btn')) {
                window.location.href = `BBSPost.html?id=${post.id}`;
            }
        });

        postsContainer.appendChild(postElement);
    });
}

async function renderChatting() {
    const user_id = sessionStorage.getItem('id');

    for (const post of postsData) {
        try {
            const response = await fetch(`http://43.201.254.244:8080/applications/apply/${post.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const matchingMember = data.find(member => member.memberId === parseInt(user_id));

            if (matchingMember) {
                const chatContainer = document.getElementById(`chat-container-${post.id}`);
                if (chatContainer) {  // chatContainer가 null이 아닌지 확인
                    const chatButton = document.createElement('button');
                    chatButton.className = 'chat-btn';
                    chatButton.innerText = '채팅';
                    chatButton.onclick = (e) => {
                        e.stopPropagation();  // 버튼 클릭 시 이벤트 전파를 막음 (게시글 이동 방지)
                        navigateToChat(matchingMember.id);
                    };
                    chatContainer.appendChild(chatButton);
                }
            }
        } catch (error) {
            console.error('Error fetching chat data:', error);
        }
    }
}



function navigateToChat(postId) {
    window.location.href = `Chat.html?postId=${postId}`;
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(postsData.length / postsPerPage);

    if (totalPages > 1) {
        const prevLink = document.createElement('a');
        prevLink.href = '#';
        prevLink.className = 'prev';
        prevLink.innerText = 'Previous';
        prevLink.onclick = (e) => {
            e.preventDefault();
            changePage(-1);
        };
        pagination.appendChild(prevLink);

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.className = 'page';
            pageLink.innerText = i;
            pageLink.onclick = (e) => {
                e.preventDefault();
                goToPage(i);
            };
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            pagination.appendChild(pageLink);
        }

        const nextLink = document.createElement('a');
        nextLink.href = '#';
        nextLink.className = 'next';
        nextLink.innerText = 'Next';
        nextLink.onclick = (e) => {
            e.preventDefault();
            changePage(1);
        };
        pagination.appendChild(nextLink);
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(postsData.length / postsPerPage);
    if (currentPage + direction > 0 && currentPage + direction <= totalPages) {
        currentPage += direction;
        renderPosts();
        renderPagination();
    }
}

function goToPage(pageNumber) {
    currentPage = pageNumber;
    renderPosts();
    renderPagination();
}

function navigateToChat(applicantId) {
    window.location.href = `chat.html?applicantId=${applicantId}`;
}


document.addEventListener('DOMContentLoaded', fetchPosts);
