document.addEventListener('DOMContentLoaded', function() {
    // 부모 문서의 URL에서 파라미터를 가져옴
    const params = new URLSearchParams(window.parent.location.search);
    const teamId = params.get('teamId');
    console.log("teamId from URL inside iframe:", teamId); // teamId 값 확인

    const id = sessionStorage.getItem('id');

    if (id) {
        fetch(`http://43.201.254.244:8080/teams/my/${id}`, {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const team = data.find(team => team.id == teamId); // teamId와 일치하는 팀 찾기
            if (team) {
                // team.name을 가져와서 화면에 띄우기
                const teamInfoSpan = document.querySelector('.team-info span');
                if (teamInfoSpan) {
                    teamInfoSpan.textContent = `Team: ${team.name}`;
                }
                
                // 팀 멤버 정보를 추가합니다 (예: team.members 배열이 있다고 가정)
                const membersDiv = document.querySelector('.members');
                if (membersDiv && team.members) {
                    membersDiv.textContent = team.members.map(member => member.name).join(' ');
                }
            } else {
                console.error('No matching team found for the given teamId.');
            }
        })
        .catch(error => {
            console.error('Error fetching team data:', error);
            alert('팀 정보를 불러오는 중 오류가 발생했습니다.');
        });
    } else {
        alert("현재 로그아웃 상태입니다. 로그인을 하신 후에 사용해주세요.");
        window.location.href = 'login.html';
    }
});

function navigateTo(url) {
    window.parent.location.href = url; // 부모 창 전체를 이동시킵니다.
}
