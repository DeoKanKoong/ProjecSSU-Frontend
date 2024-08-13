const id = sessionStorage.getItem('id');
if (id) {

    $(document).ready(function() {
        $("#navbar-container").load("navbar.html");
    
        $('#title').on('input', validateForm);
        $('#members').on('input', validateForm);
        $('#year').on('input', validateForm);
        $('#month').on('input', validateForm);
        $('#day').on('input', validateForm);
    
        function validateForm() {
            let isValid = true;
    
            const title = $('#title').val();
            const members = $('#members').val();
            const year = $('#year').val();
            const month = $('#month').val();
            const day = $('#day').val();
    
            if (title.length > 100) {
                $('#title-error').show();
                isValid = false;
            } else {
                $('#title-error').hide();
            }
    
            if (members > 100) {
                $('#members-error').show();
                isValid = false;
            } else {
                $('#members-error').hide();
            }
    
            if (year < 2024 || month < 1 || month > 12 || day < 1 || day > 31) {
                $('#date-error').show();
                isValid = false;
            } else {
                $('#date-error').hide();
            }
    
            if (isValid) {
                $('#submit-button').removeClass('disabled').addClass('active').attr('disabled', false);
            } else {
                $('#submit-button').removeClass('active').addClass('disabled').attr('disabled', true);
            }
        }
    
        $('#submit-button').on('click', function() {
            submitPost();
        });
    });
    
    function execCommand(command, value = null) {
        if (command === 'fontSize') {
            setFontSize(value);
        } else {
            document.execCommand(command, false, value);
        }
    }
    
    function setFontSize(value) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
    
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = value + 'px';
        range.surroundContents(span);
    }
    
    function submitPost() {
        const title = $('#title').val();
        const members = $('#members').val();
        const year = $('#year').val();
        const month = $('#month').val() - 1;  // JavaScript에서 월은 0부터 시작합니다.
        const day = $('#day').val();
        const preferences = $('#preferences').val();
        const field = $('#field').val();
        const content = $('#editor').html();
    
        const deadline = new Date(year, month, day).toISOString();  // 날짜를 ISO 문자열로 변환
    
        const data = {
            title: title,
            numberOfPeople: members,
            deadline: deadline,
            preferential_treatement: preferences,
            field: field,
            content: content
        };
    
        const user_id = sessionStorage.getItem('id');
        fetch(`http://43.201.254.244:8080/articles/${user_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.text();  // 응답을 텍스트로 처리
        })
        .then(text => {
            // 성공 메시지를 파싱하지 않고 단순히 확인
            console.log('Server response:', text);
            alert('등록되었습니다.');
            window.location.href = 'TeamRecruitBoard.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('등록 중 오류가 발생했습니다.');
        });
    }
}

