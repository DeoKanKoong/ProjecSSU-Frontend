document.addEventListener('DOMContentLoaded', function () {
    const basicInfoForm = document.getElementById('basic-info-form');
    const profileForm = document.getElementById('profile-form');
    const id = sessionStorage.getItem('id');

    let originalUserData = {};  // 원본 데이터를 저장하기 위한 변수

    // 사용자 정보 로드
    fetch(`http://43.201.254.244:8080/profile/${id}`)
        .then(response => response.json())
        .then(userData => {
            if (userData) {
                originalUserData = userData;  // 원본 데이터를 저장
                updateFormFields(userData);  // 폼 필드 업데이트
            } else {
                console.error('User object is empty or not in expected format.');
            }
        })
        .catch(error => console.error('Error fetching user data:', error));

    // 기본 정보 수정 제출
    basicInfoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(basicInfoForm);
        const updatedUser = { ...originalUserData, ...Object.fromEntries(formData) };

        fetch(`http://43.201.254.244:8080/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text);
                    });
                }
                return response.text();  // 서버가 텍스트 응답을 반환한다고 가정
            })
            .then(message => {
                alert('기본 정보가 성공적으로 수정되었습니다.');
                originalUserData = updatedUser;  // 원본 데이터 갱신
                updateFormFields(updatedUser);
            })
            .catch(error => {
                console.error('Error updating basic info:', error);
                alert('기본 정보 수정 중 오류 발생: ' + error.message);
            });
    });

    // 프로필 정보 수정 제출
    profileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(profileForm);
        const updatedUser = { ...originalUserData, ...Object.fromEntries(formData) };

        fetch(`http://43.201.254.244:8080/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text);
                    });
                }
                return response.text();  // 서버가 텍스트 응답을 반환한다고 가정
            })
            .then(message => {
                alert('프로필이 성공적으로 수정되었습니다.');
                originalUserData = updatedUser;  // 원본 데이터 갱신
                updateFormFields(updatedUser);
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                alert('프로필 수정 중 오류 발생: ' + error.message);
            });
    });

    // 폼 필드 업데이트 함수
    function updateFormFields(userData) {
        const nameField = document.getElementById('name');
        const departmentField = document.getElementById('department');
        const yearField = document.getElementById('year');
        const phoneNumberField = document.getElementById('phoneNumber');
        const emailField = document.getElementById('email');
        const introductionField = document.getElementById('introduction');
        const portfolioField = document.getElementById('portfolio');

        if (nameField) nameField.value = userData.name || '';
        if (departmentField) departmentField.value = userData.department || '';
        if (yearField) yearField.value = userData.year || '';
        if (phoneNumberField) phoneNumberField.value = userData.phoneNumber || '';
        if (emailField) emailField.value = userData.email || '';
        if (introductionField) introductionField.textContent = userData.introduction || '';
        if (portfolioField) portfolioField.value = userData.portfolio || '';
    }
});

function navigateTo(url) {
    window.location.href = url;
}