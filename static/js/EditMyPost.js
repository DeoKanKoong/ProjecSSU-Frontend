document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 바 로드

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    
    if (postId) {
        fetch(`http://43.201.254.244:8080/articles/${postId}`)
            .then(response => response.json())
            .then(post => {
                document.getElementById('title').value = post.title;
                document.getElementById('members').value = post.numberOfPeople;

                const deadline = new Date(post.deadline);
                document.getElementById('year').value = deadline.getFullYear();
                document.getElementById('month').value = deadline.getMonth() + 1;
                document.getElementById('day').value = deadline.getDate();

                document.getElementById('preferences').value = post.preferentialTreatment;
                document.getElementById('field').value = post.field;
                document.getElementById('editor').innerHTML = post.content;
                
                validateForm();
            })
            .catch(error => console.error('Error loading post data:', error));
    }

    document.getElementById('title').addEventListener('input', validateForm);
    document.getElementById('members').addEventListener('input', validateForm);
    document.getElementById('year').addEventListener('input', validateForm);
    document.getElementById('month').addEventListener('input', validateForm);
    document.getElementById('day').addEventListener('input', validateForm);

    function validateForm() {
        let isValid = true;

        const title = document.getElementById('title').value;
        const members = document.getElementById('members').value;
        const year = document.getElementById('year').value;
        const month = document.getElementById('month').value;
        const day = document.getElementById('day').value;

        if (title.length > 100) {
            document.getElementById('title-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('title-error').style.display = 'none';
        }

        if (members > 100) {
            document.getElementById('members-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('members-error').style.display = 'none';
        }

        if (year < 2024 || month < 1 || month > 12 || day < 1 || day > 31) {
            document.getElementById('date-error').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('date-error').style.display = 'none';
        }

        const submitButton = document.getElementById('submit-button');
        if (isValid) {
            submitButton.classList.remove('disabled');
            submitButton.classList.add('active');
            submitButton.disabled = false;
        } else {
            submitButton.classList.add('disabled');
            submitButton.classList.remove('active');
            submitButton.disabled = true;
        }
    }

    document.getElementById('submit-button').addEventListener('click', function() {
        submitPost(postId);
    });
});

function execCommand(command, value = null) {
    document.execCommand(command, false, value);
}

function submitPost(postId) {
    const title = document.getElementById('title').value;
    const members = document.getElementById('members').value;
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value - 1;
    const day = document.getElementById('day').value;
    const preferences = document.getElementById('preferences').value;
    const field = document.getElementById('field').value;
    const content = document.getElementById('editor').innerHTML;

    const deadline = new Date(year, month, day).toISOString();

    const data = {
        title: title,
        numberOfPeople: members,
        deadline: deadline,
        preferentialTreatment: preferences,
        field: field,
        content: content,
    };
    
    const userId = sessionStorage.getItem('id');
    fetch(`http://43.201.254.244:8080/articles/${userId}/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(text => {
        console.log('Server response:', text);
        window.location.href = 'TeamRecruitBoard.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('수정 중 오류가 발생했습니다.');
    });
}
