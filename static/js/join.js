document.addEventListener('DOMContentLoaded', function() {
    const checkAll = document.getElementById('checkAll');
    const checkboxes = document.querySelectorAll('input[name="agreement"]');
    const requiredCheckboxes = document.querySelectorAll('.checkbox.required');
    const submitButton = document.getElementById('submitButton');
    const confirmButton = document.getElementById('confirmButton');
    const backButton = document.getElementById('backButton');

    let userInfo = {};

    checkAll.addEventListener('change', function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = checkAll.checked;
        });
        updateSubmitButton();
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            checkAll.checked = [...checkboxes].every(cb => cb.checked);
            updateSubmitButton();
        });
    });

    const userIdField = document.getElementById('userId');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const gradeField = document.getElementById('grade');
    const phoneField = document.getElementById('phone');
    const emailField = document.getElementById('email');

    userIdField.addEventListener('input', validateUserId);
    passwordField.addEventListener('input', validatePassword);
    confirmPasswordField.addEventListener('input', validateConfirmPassword);
    gradeField.addEventListener('input', validateGrade);
    phoneField.addEventListener('input', validatePhone);
    emailField.addEventListener('input', validateEmail);

    function validateUserId() {
        const value = userIdField.value;
        const regex = /[0-9]{8}$/;
        const isValid = regex.test(value);
        const errorField = document.getElementById('userIdError');

        if (!isValid) {
            errorField.textContent = '아이디는 학번이어야 합니다.';
        } else {
            errorField.textContent = '';
        }
        updateSubmitButton();
    }

    function validatePassword() {
        const value = passwordField.value;
        const regex = /^[A-Za-z0-9]{1,20}$/;
        const isValid = regex.test(value);
        const errorField = document.getElementById('passwordError');

        if (!isValid) {
            errorField.textContent = '비밀번호는 영어 8글자 이하 + 숫자 4개 이하로 구성되어야 합니다.';
        } else {
            errorField.textContent = '';
        }
        validateConfirmPassword();
        updateSubmitButton();
    }

    function validateConfirmPassword() {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        const errorField = document.getElementById('confirmPasswordError');

        if (password !== confirmPassword) {
            errorField.textContent = '비밀번호가 일치하지 않습니다.';
        } else {
            errorField.textContent = '';
        }
        updateSubmitButton();
    }

    function validateGrade() {
        const value = gradeField.value;
        const regex = /^[1-4]$/;
        const isValid = regex.test(value);
        const errorField = document.getElementById('gradeError');

        if (!isValid) {
            errorField.textContent = '학년은 1에서 4 사이의 숫자여야 합니다.';
        } else {
            errorField.textContent = '';
        }
        updateSubmitButton();
    }

    function validatePhone() {
        const value = phoneField.value;
        const regex = /^[0-9]{11}$/;
        const isValid = regex.test(value);
        const errorField = document.getElementById('phoneError');

        if (!isValid) {
            errorField.textContent = '전화번호는 숫자 11자리여야 합니다.';
        } else {
            errorField.textContent = '';
        }
        updateSubmitButton();
    }

    function validateEmail() {
        const value = emailField.value;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = regex.test(value);
        const errorField = document.getElementById('emailError');

        if (!isValid) {
            errorField.textContent = '유효한 이메일 형식이 아닙니다.';
        } else {
            errorField.textContent = '';
        }
        updateSubmitButton();
    }

    function updateSubmitButton() {
        const isUserIdValid = document.getElementById('userIdError').textContent === '';
        const isPasswordValid = document.getElementById('passwordError').textContent === '';
        const isConfirmPasswordValid = document.getElementById('confirmPasswordError').textContent === '';
        const isGradeValid = document.getElementById('gradeError').textContent === '';
        const isPhoneValid = document.getElementById('phoneError').textContent === '';
        const isEmailValid = document.getElementById('emailError').textContent === '';
        const areAgreementsChecked = [...requiredCheckboxes].every(cb => cb.checked);

        submitButton.disabled = !(isUserIdValid && isPasswordValid && isConfirmPasswordValid && isGradeValid && isPhoneValid && isEmailValid && areAgreementsChecked);
    }

    submitButton.addEventListener('click', function() {
        userInfo.userId = userIdField.value;
        userInfo.password = passwordField.value;
        userInfo.confirmPassword = confirmPasswordField.value;
        userInfo.name = document.getElementById('name').value;
        userInfo.department = document.getElementById('department').value;
        userInfo.grade = gradeField.value;
        userInfo.phone = phoneField.value;
        userInfo.email = emailField.value;

        document.getElementById('container1').style.display = 'none';
        document.getElementById('container2').style.display = 'flex';
        document.getElementById('welcomeText').innerHTML = `Projec:SSU에 가입한 ${userInfo.name}님 환영합니다!<br>
            Projec:SSU는 프로젝트 혹은 팀플을 위한 팀 매칭을 원활히 도와주는<br> 웹 서비스입니다.<br>
            아래는 팀 지원시 팀장이 확인할 수 있는 본인의 포트폴리오로 사용됩니다.<br>
            작성한 내용은 추후에 마이페이지에서 수정가능합니다.`;
    });

    confirmButton.addEventListener('click', function() {
        userInfo.selfIntroduction = document.getElementById('selfIntroduction').value;
        userInfo.portfolios = Array.from(document.querySelectorAll('#portfolioSection .portfolio-link input')).map(input => input.value).join(',');
    
        // 객체 생성, 각 필드의 값을 문자열로 전송
        const data = {
            studentId: userInfo.userId,
            password: userInfo.password,
            name: userInfo.name,
            department: userInfo.department,
            year: userInfo.grade,
            phoneNumber: userInfo.phone,
            email: userInfo.email,
            introduction: userInfo.selfIntroduction,
            portfolio: userInfo.portfolios
        };
    
        // fetch API를 사용하여 데이터 전송
        fetch('http://43.201.254.244:8080/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text(); 
        })
        .then(text => {
            console.log('Server response:', text);
    
            if (text.startsWith('{') || text.startsWith('[')) {
                const jsonResponse = JSON.parse(text);
                alert('가입이 완료되었습니다.');
                window.location.href = 'login.html';
            } else {
                alert('가입이 완료되었습니다.');
                window.location.href = 'login.html';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('가입 중 오류가 발생했습니다.');
        });
    });
    
    

    backButton.addEventListener('click', function() {
        document.getElementById('container2').style.display = 'none';
        document.getElementById('container1').style.display = 'flex';
    });

});

let portfolioCount = 1;

function validateEmail() {
    const value = emailField.value;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(value);
    const errorField = document.getElementById('emailError');

    if (!isValid) {
        errorField.textContent = '유효한 이메일 형식이 아닙니다.';
    } else {
        errorField.textContent = '';
    }
    updateSubmitButton();
}
