document.addEventListener('DOMContentLoaded', function () {
    fetchRecruitData();
});

async function fetchRecruitData() {
    try {
        const userId = sessionStorage.getItem('id');
        const response = await fetch(`http://43.201.254.244:8080/articles/my/${userId}`);
        const data = await response.json();  // data는 articleId 배열

        // 각 articleId에 대해 getApplicant 함수를 호출하고 결과를 수집
        const allApplicantData = await Promise.all(data.map(articleId => getApplicant(articleId)));
        // 모든 지원자 데이터를 표에 렌더링
        renderRecruitData(allApplicantData);
    } catch (error) {
        console.error('Error fetching recruit data:', error);
        document.getElementById('recruitDataContainer').innerHTML = `
            <p style="text-align: center;"><img src="../static/img/dumdum.jpg" class="icon"></p>
        `;
    }
}

async function getApplicant(articleId) {
    try {
        const response = await fetch(`http://43.201.254.244:8080/applications/apply/${articleId}`, {
            method: 'GET',
        });
        //applications/apply/articleId
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userInfo = await response.json();
        return { articleId, userInfo };  // articleId와 userInfo 객체를 함께 반환
    } catch (error) {
        console.error(`Error fetching applicant data for articleId ${articleId}:`, error);
        return { articleId, userInfo: [] };  // 오류가 발생하면 빈 배열 반환
    }
}

function renderRecruitData(allData) {
    const recruitDataContainer = document.getElementById('recruitDataContainer');
    if (!recruitDataContainer) {
        console.error('recruitDataContainer 요소를 찾을 수 없습니다.');
        return;
    }

    recruitDataContainer.innerHTML = ''; // 기존 데이터를 지우고 새 데이터로 채움
    
    allData.forEach((data) => {
        const { articleId, userInfo } = data;

        // 각 articleId별로 별도의 테이블 생성
        const tableContainer = document.createElement('div');
        tableContainer.classList.add('recruit-table-container');
        
        const titleInputContainer = document.createElement('div');
        titleInputContainer.classList.add('title-input-container');
        
        const titleElement = document.createElement('h2');
        titleElement.innerText = `게시물 ID ${articleId}의 모집현황`;

        const teamCreateButton = document.createElement('button');
        teamCreateButton.classList.add('team-create-button');
        teamCreateButton.innerText = '팀 확정하기';

        titleInputContainer.appendChild(titleElement);
        titleInputContainer.appendChild(teamCreateButton); // 팀 구성하기 버튼 추가

        tableContainer.appendChild(titleInputContainer);

        const tableElement = document.createElement('table');
        tableElement.classList.add('status-table'); // status-table 클래스 사용
        tableElement.innerHTML = `
            <thead>
                <tr>
                    <th>이름</th>
                    <th>학부</th>
                    <th>학년</th>
                    <th>지원 일자</th>
                    <th>포트폴리오</th>
                    <th>상태</th>
                    <th>채팅</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tableBody = tableElement.querySelector('tbody');

        if (userInfo.length > 0) {
            userInfo.forEach(recruit => {
                const recruitRow = document.createElement('tr');
                recruitRow.innerHTML = `
                    <td>${recruit.name}</td>
                    <td>${recruit.department}</td>
                    <td>${recruit.year}</td>
                    <td>${recruit.appliedAt}</td>
                    <td><button class="profile-btn" data-id="${recruit.id}">프로필</button></td>
                    <td>
                        <button class="accordion" data-member-id="${recruit.memberId}">${recruit.status || '미정'}</button>
                        <div class="panel">
                            <ul>
                                <li onclick="setStatus('미정', this, ${recruit.id})">미정</li>
                                <li onclick="setStatus('승인', this, ${recruit.id})">승인</li>
                                <li onclick="setStatus('미승인', this, ${recruit.id})">미승인</li>
                            </ul>
                        </div>
                    </td>
                    <td><button class="chat-btn" onclick="navigateToChat(${recruit.id})">채팅</button></td>
                `;
                tableBody.appendChild(recruitRow);
            });
        } else {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `
                <td colspan="7" style="text-align: center;">지원자가 없습니다.</td>
            `;
            tableBody.appendChild(noDataRow);
        }

        tableContainer.appendChild(tableElement);
        recruitDataContainer.appendChild(tableContainer);

        // 팀 확정하기 버튼 클릭 이벤트
        teamCreateButton.addEventListener('click', () => openTeamPopup(userInfo));
    });

    // 프로필 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.profile-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');  // 버튼의 data-id 속성에서 ID를 가져옴
            identifyToProfile(id);
        });
    });

    initAccordion(); // 아코디언 초기화
}

// 팀 구성 팝업 열기
function openTeamPopup(userInfo) {
    const teamMembers = userInfo.filter(member => member.status === '승인').map(member => member.name);
    const teamMembersText = teamMembers.length > 0 ? teamMembers.join(', ') : '없습니다';
    const teamPopupContent = document.getElementById('teamPopupContent');
    teamPopupContent.innerHTML = `
        <p>현재 구성된 팀원은 "${teamMembersText}"입니다.</p>
        <p>팀 제출하기를 누르면 선택하신 팀원으로 팀이 구성됩니다.</p>
    `;
    document.getElementById('teamPopup').style.display = 'block';
}

// 팀 구성 팝업 닫기
function closeTeamPopup() {
    document.getElementById('teamPopup').style.display = 'none';
}

// 팀 제출하기
function submitTeam() {
    const teamName = document.getElementById('teamName').value;
    const id = sessionStorage.getItem('id');

    // '승인'된 상태의 지원자들의 memberId를 수집
    const approvedMembers = [];
    document.querySelectorAll('.accordion').forEach(button => {
        if (button.innerText === '승인') {
            const memberId = button.getAttribute('data-member-id'); // recruit.memberId를 가져옴
            approvedMembers.push(memberId);
        }
    });

    if (teamName && approvedMembers.length > 0) {
        const requestData = {
            name: teamName,
            memberId: approvedMembers,
            creatorId: id
        };
        fetch(`http://43.201.254.244:8080/teams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('팀이 성공적으로 제출되었습니다.');
            closeTeamPopup();
        })
        .catch(error => {
            console.error('Error submitting team:', error);
        });
    } else {
        if (!teamName) {
            alert('팀 이름을 입력하세요.');
        } else if (approvedMembers.length === 0) {
            alert('승인된 팀원이 없습니다.');
        }
    }
}



function setStatus(status, element, applicationId) {
    var button = element.parentNode.parentNode.previousElementSibling;
    button.innerText = status;
    var panel = button.nextElementSibling;
    panel.style.display = "none";

    fetch(`http://43.201.254.244:8080/applications/${applicationId}/status?status=${status}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ applicationId, status })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('상태가 성공적으로 업데이트되었습니다.');
    })
    .catch(error => {
        console.error('Error updating status:', error);
    });
}

function identifyToProfile(id) {
    fetch(`http://43.201.254.244:8080/applications/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayProfileData(data);
        openPopup(); // 팝업 열기
    })
    .catch(error => {
        console.error('Error fetching profile data:', error);
    });
}

function displayProfileData(data) {
    const profileElement = document.getElementById('profileDetails');
    if (!profileElement) {
        console.error('Profile container not found.');
        return;
    }

    const member = data.member;

    profileElement.innerHTML = `
        <p><strong>Name:</strong> ${member.name}</p>
        <p><strong>Department:</strong> ${member.department}</p>
        <p><strong>Year:</strong> ${member.year}</p>
        <p><strong>Student ID:</strong> ${member.studentId}</p>
        <p><strong>Email:</strong> ${member.email}</p>
        <p><strong>Introduction:</strong> ${member.introduction}</p>
        <p><strong>Portfolio:</strong> ${member.portfolio}</p>
        <p><strong>Applied At:</strong> ${new Date(data.appliedAt).toLocaleString()}</p>
    `;
}

// 팝업 열기
function openPopup() {
    document.getElementById('profilePopup').style.display = 'block';
}

// 팝업 닫기
function closePopup() {
    document.getElementById('profilePopup').style.display = 'none';
}

function initAccordion() {
    var acc = document.getElementsByClassName("accordion");
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}

function navigateTo(url) {
    window.location.href = url;
}

// 채팅 페이지로 이동하는 함수
function navigateToChat(applicantId) {
    window.location.href = `chat.html?applicantId=${applicantId}`;
}
