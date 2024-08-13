async function fetchTeamNames() {
    try {
        const container = document.getElementById('team-container');
        if (!container) {
            console.error('team-container element not found');
            return;
        }

        const user_id = sessionStorage.getItem('id');
        if (!user_id) {
            alert("현재 로그아웃 상태입니다. 로그인을 하고 이용해주세요.");
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`http://43.201.254.244:8080/teams/my/${user_id}`);
        const data = await response.json();

        // 팀 이름들을 받아와서 버튼에 적용
        container.innerHTML = '';  // 기존 내용을 비웁니다.

        if (data && data.length > 0) {
            data.forEach(team => {
                const teamButton = document.createElement('div');
                teamButton.className = 'profile-box';  // 버튼에 profile-box 클래스를 적용
                teamButton.innerHTML = `
                    <div class="profile-text-container">
                        <div class="text-common">${team.name}</div>
                    </div>
                `;
                teamButton.onclick = () => navigateToMainProject(team.id);  // 팀 ID를 전달할 수 있습니다.

                container.appendChild(teamButton);
            });
        } else {
            container.textContent = '팀 이름을 불러올 수 없습니다.';
        }
    } catch (error) {
        console.error('Error fetching team names:', error);
        const container = document.getElementById('team-container');
        if (container) {
            container.textContent = '오류 발생';
        }
    }
}

function navigateToMainProject(teamId) {
    window.location.href = `MainProject.html?teamId=${teamId}`;
}

document.addEventListener('DOMContentLoaded', fetchTeamNames);
