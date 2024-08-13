document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    const currentUserId = sessionStorage.getItem('id'); // 세션에서 현재 사용자 ID 가져오기

    if (postId) {
        try {
            const response = await fetch(`http://43.201.254.244:8080/articles/${postId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const post = await response.json();

            // 게시물의 정보를 페이지에 렌더링
            const postNameElement = document.getElementById('post-author');
            const postTitleElement = document.getElementById('post-title');
            const postContentElement = document.getElementById('post-content');
            const postFieldElement = document.getElementById('post-field');
            const postPreferentialElement = document.getElementById('post-preferential');
            const postNumberOfPeopleElement = document.getElementById('post-numberOfPeople');
            const postDurationElement = document.getElementById('post-duration');
            const postCreateAtElement = document.getElementById('post-createAt');
            const postStatusElement = document.getElementById('post-status');
            const actionButton = document.getElementById('action-button'); // 지원하기/모집완료 버튼
            const editButton = document.getElementById('edit-button'); // 수정 버튼
            const deleteButton = document.getElementById('delete-button'); // 삭제 버튼

            if (postNameElement) postNameElement.textContent = post.authorName + " / " + post.authorDepartment;
            if (postTitleElement) postTitleElement.textContent = post.title;
            if (postContentElement) postContentElement.textContent = post.content;
            if (postFieldElement) postFieldElement.textContent = post.field;
            if (postPreferentialElement) postPreferentialElement.textContent = post.preferentialTreatment;
            if (postNumberOfPeopleElement) postNumberOfPeopleElement.textContent = `${post.numberOfPeople}명`;
            if (postDurationElement) postDurationElement.textContent = post.deadline;
            if (postCreateAtElement) postCreateAtElement.textContent = `작성일: ${post.createAt}`;
            
            // 모집 상태에 따라 상태 표시
            if (post.status === 'completed') {
                postStatusElement.textContent = '모집 완료';
                actionButton.textContent = '모집 완료';
                actionButton.disabled = true;
            } else {
                actionButton.textContent = '지원하기';
                actionButton.disabled = false;
            }

            const response1 = await fetch(`http://43.201.254.244:8080/applications/apply/is/${postId}/user/${currentUserId}`);
            if (!response1.ok) {
                throw new Error(`HTTP error! status: ${response1.status}`);
            }
            const indentifyApply = await response1.json();

            if (indentifyApply && !actionButton.disabled) {
                actionButton.textContent = '지원완료';
                actionButton.disabled = true;
            }

            // 작성자인지 확인하고 버튼 텍스트 변경
            if (post.memberId == currentUserId) {
                actionButton.textContent = '모집 완료하기';
                actionButton.disabled = false; // 작성자는 모집 완료를 할 수 있게 활성화

                // 수정 및 삭제 버튼 표시
                editButton.style.display = 'inline-block';
                deleteButton.style.display = 'inline-block';

                // 수정 버튼 클릭 이벤트 핸들러
                editButton.addEventListener('click', function() {
                    window.location.href = `EditMyPost.html?id=${postId}`; // 수정 페이지로 이동
                });

                // 삭제 버튼 클릭 이벤트 핸들러
                deleteButton.addEventListener('click', function() {
                    if (confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
                        fetch(`http://43.201.254.244:8080/articles/${currentUserId}/${postId}`, {
                            method: 'DELETE',
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            alert('게시물이 삭제되었습니다.');
                            window.location.href = 'MyPost.html'; // 삭제 후 메인 페이지로 이동
                        })
                        .catch(error => {
                            console.error('삭제 중 오류 발생:', error);
                            alert('삭제 중 오류가 발생했습니다.');
                        });
                    }
                });

                // 모집 완료 버튼 클릭 이벤트 핸들러
                actionButton.addEventListener('click', async function() {
                    try {
                        // 모집 상태를 '모집 완료'로 업데이트
                        postStatusElement.textContent = '모집 완료';
                        actionButton.textContent = '모집 완료';
                        actionButton.disabled = true;

                        alert('모집이 완료되었습니다.');
                    } catch (error) {
                        console.error('Error completing recruitment:', error);
                        alert('모집 완료 처리 중 오류가 발생했습니다.');
                    }
                });
            } else {
                // 지원하기 버튼 클릭 이벤트 핸들러
                actionButton.addEventListener('click', function() {
                    const url = `http://43.201.254.244:8080/applications/apply?articleId=${postId}&memberId=${currentUserId}`;
                    
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
            
                        return response.text().then(text => text ? JSON.parse(text) : {});
                    })
                    .then(data => {
                        alert('지원이 성공적으로 완료되었습니다.');
                        location.reload(); // 새로고침하여 상태를 반영
                    })
                    .catch(error => {
                        console.error('지원 중 오류 발생:', error);
                        alert('지원 중 오류가 발생했습니다.');
                    });
                });
            }

        } catch (error) {
            console.error('Error fetching post data:', error);
        }
    } else {
        console.error('No post ID found in the URL');
    }
});
