document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.login-button').addEventListener('click', function() {
        validateForm();
    });
});

function validateForm() {
    const studentId = document.querySelector('.input-box[type="text"]').value;
    const password = document.querySelector('.input-box[type="password"]').value;
    const studentIdError = document.getElementById('studentIdError');
    const passwordError = document.getElementById('passwordError');

    // 초기화
    studentIdError.textContent = '';
    passwordError.textContent = '';

    let valid = true;

    if (!studentId) {
        studentIdError.textContent = '아이디를 입력해주세요.';
        valid = false;
    }

    if (!password) {
        passwordError.textContent = '비밀번호를 입력해주세요.';
        valid = false;
    }

    if (valid) {
        // 서버로 로그인 요청 보내기
        const formData = {
            studentId: studentId,
            password: password
        };

        fetch('http://43.201.254.244:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('id', data); 
            sessionStorage.setItem('username', "asdf");
            if (data) {
                window.location.href = 'MainCommunity.html'; // 로그인 성공 시 리다이렉트
            } else {
                if (data.error === 'invalid_credentials') {
                    studentIdError.textContent = '아이디 또는 비밀번호가 틀렸습니다.';
                } else {
                    alert('알 수 없는 오류가 발생했습니다.');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        });
    }
}


function redirectToJoin() {
    window.location.href = 'join.html';
}

function redirectToForgottenId() {
    window.location.href = 'ForgottenId.html';
}

function redirectToForgottenPw() {
    window.location.href = 'ForgottenPw.html';
}
