document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.querySelector('.toggle-switch');
    if (toggleSwitch) {
        toggleSwitch.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
});


// 로그인 페이지 이동
function redirectToLogin() {
    fetch('/login.html')
        .then(response => {
            if (response.ok) {
                window.location.href = '/login.html';
            } else {
                alert('페이지를 불러오는 데 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        });
}
