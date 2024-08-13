let currentPage = 1;
const postsPerPage = 5;
let postsData = [];

async function fetchPosts() {
    const user_id = sessionStorage.getItem('id');
    try {
        const response = await fetch(`http://43.201.254.244:8080/articles/myarticle/${user_id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        postsData = data;
        console.log(postsData);
        renderPosts();
        renderPagination();
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
        postElement.onclick = () => {
            window.location.href = `BBSPost.html?id=${post.id}`;
        };
        postElement.innerHTML = `
            <div class="post-content">
                <h2>${post.title}</h2>
                <p>${post.content}</p>
            </div>
            <div class="post-footer">
                <span>모집 인원 <img src="../static/img/gather.png" class="icon"> ${post.numberOfPeople}명</span>
                <span>마감 기한 <img src="../static/img/clock.png" class="icon"> ~ ${post.deadline}</span>
                <span><img src="../static/img/schedule.png" class="icon"> ${post.createAt}</span>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

document.addEventListener('DOMContentLoaded', fetchPosts);



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
    const totalPages = Math.ceil(postsData.totalElements / postsPerPage);
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

function navigateTo(url) {
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', fetchPosts);


