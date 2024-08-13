let socket;
const params = new URLSearchParams(window.location.search);
const roomId = params.get('applicantId');
let userProfile = {}; // 사용자 프로필 정보를 저장할 변수
let username = ''; // 사용자 이름을 저장할 변수

function connectWebSocket() {
    socket = new WebSocket(`ws://43.201.254.244:8080/chat/rooms/${roomId}`);

    socket.onopen = function(event) {
        console.log("Connected to the WebSocket server.");
        fetchUsername(); // 연결 시 사용자 이름 가져오기
    };

    socket.onmessage = function(event) {    
        try {
            let data;
            
            // 메시지가 JSON 형식으로 올 경우
            if (event.data.startsWith("{") && event.data.endsWith("}")) {
                data = JSON.parse(event.data);
                console.log("Parsed JSON data:", data);

                if (data.content && data.content.startsWith("{") && data.content.endsWith("}")) {
                    data = JSON.parse(data.content); // content 필드를 다시 파싱
                    console.log("Re-parsed content:", data);
                }
            } else {
                const parts = event.data.split(" ");
                const timestamp = parts[0];
                const username = parts[1].slice(0, -1);
                const content = parts.slice(2).join(" ");  
                
                data = {
                    content: content,
                    timestamp: timestamp,
                    username: username
                };
            }
    
            if (data.content) {
                // 채팅 메시지 처리
                displayMessage(data);
            } else {
                // 다른 메시지 유형 처리
                console.log("Other message received:", data);
            }
        } catch (error) {
            console.error("Error parsing message:", error, "Message received:", event.data);
        }
    };
    
    

    socket.onclose = function(event) {
        console.log("Disconnected from the WebSocket server.");
    };
}

//ㄴㅁㅇㄹㅁㄴㅇㄹ
function displayMessage(data) {
    const chatbox = document.getElementById("chatbox");
    const messageDiv = document.createElement("div");

    const id = sessionStorage.getItem('id');
    fetch(`http://43.201.254.244:8080/profile/${id}`)
        .then(response => response.json())
        .then(post => {
            if(data.username == post.name) 
                messageDiv.className = 'message-bubble-left';
            else 
            messageDiv.className = 'message-bubble-right';

        })
        .catch(error => console.error('Error loading post data:', error));

    
    
    messageDiv.innerHTML = `
        <div class="message-text">${data.content}</div>
        <div class="message-time">${new Date(data.timestamp).toLocaleTimeString()}</div>
    `;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight; // 새로운 메시지가 추가될 때 자동으로 스크롤
}

// 사용자 이름 가져오기
async function fetchUsername() {
    try {
        //지원자 정보
        const applyid = params.get('applicantId');
        const response = await fetch(`http://43.201.254.244:8080/applications/${applyid}`);
        const data = await response.json();

        //현재 세션 정보
        const userid = sessionStorage.getItem('id');
        const response2 = await fetch(`http://43.201.254.244:8080/profile/${userid}`);
        const data2 = await response2.json();

        let userDepartment = 'null';
        let userYear = 'null';

        // 지원자 정보와 현재 세션 정보가 다르다면? 지원자 정보가 상대 이름 : 글쓴이 정보가 상대 이름
        if ( data.member.name != data2.name ){
            username = data.member.name; 
            userDepartment = data.member.department || 'Unknown User\'s Department'; // 학부 가져오기
        }
        else {
            const response3 = await fetch(`http://43.201.254.244:8080/articles/${data.articleId}`)
            const data3 = await response3.json();

            username = data3.authorName; 
            userDepartment = data3.authorDepartment; // 학부 가져오기
        }
        

        document.getElementById("chatUsername").textContent = username || 'Unknown User';
        document.getElementById("chatDetails").textContent = userDepartment || 'Unknown User\' Department ';
    } catch (error) {
        console.error('Error fetching username:', error);
    }
}

// 메시지 보내기
function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value;

    if (!message) return; // 빈 메시지는 보내지 않음

    if (socket && socket.readyState === WebSocket.OPEN) {
        try {
            const messageData = {
                type: 'messageData',
                content: message,
                username: username,
                roomId: roomId,
                timestamp: new Date().toISOString()
            };

            // JSON.stringify로 객체를 문자열로 변환하여 전송
            socket.send(JSON.stringify(messageData));
            input.value = ""; // 메시지 전송 후 입력 필드를 비움
        } catch (error) {
            console.error("Error sending message:", error);
        }
    } else {
        console.error("Socket is not open. Unable to send message.");
    }
}

// 페이지 로드 시 WebSocket 연결
window.onload = connectWebSocket;
