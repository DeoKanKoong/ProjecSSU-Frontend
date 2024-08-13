document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.button').addEventListener('click', function() {
        validateForm();
    });

    document.getElementById('verificationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        sendVerificationCode();
    });

    document.getElementById('codeVerificationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        verifyCode();
    });
});

function sendVerificationCode() {
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('emailError');

    // 이메일 유효성 검사
    if (!validateEmail(email)) {
        emailError.textContent = '유효한 이메일을 입력해주세요.';
        return;
    }

    // 이메일 오류 메시지 초기화
    emailError.textContent = '';

    // 실제 인증번호 요청 로직을 여기에 추가
    alert('인증번호가 이메일로 전송되었습니다.');

    // 폼 전송
    document.getElementById('verificationForm').submit();
}

function validateForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const code = document.getElementById('code').value;
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const codeError = document.getElementById('codeError');

    let valid = true;

    // 초기화
    nameError.textContent = '';
    emailError.textContent = '';
    codeError.textContent = '';

    // 이름 유효성 검사
    if (!name) {
        nameError.textContent = '유효한 이름을 입력해주세요.';
        valid = false;
    }

    // 이메일 유효성 검사
    if (!validateEmail(email)) {
        emailError.textContent = '유효한 이메일을 입력해주세요.';
        valid = false;
    }

    // 인증코드 유효성 검사
    if (!code) {
        codeError.textContent = '유효한 인증코드를 입력해주세요.';
        valid = false;
    }

    if (valid) {
        window.location.href = "login.html";
    }
}

function verifyCode() {
    const verificationCode = document.getElementById('verificationCode').value;
    const resultMessage = document.getElementById('resultMessage');

    // 인증 코드 유효성 검사
    if (!verificationCode) {
        resultMessage.textContent = '유효한 인증코드를 입력해주세요.';
        return;
    }

    // 실제 인증 코드 확인 로직을 여기에 추가
    alert('인증이 성공적으로 완료되었습니다.');

    // 폼 전송
    document.getElementById('codeVerificationForm').submit();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
