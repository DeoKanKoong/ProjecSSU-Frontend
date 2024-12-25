# Projec:SSU | 프로젝트 구인 서비스
![ProjecSSU_RendingPage](https://github.com/user-attachments/assets/7067900a-5e05-431e-bb12-32156dac1ca4)
전국에 개발 프로젝트에 참여하거나 팀을 꾸리고 싶은 분들은 팀 모집과 참여에 어려움을 겪고 있습니다. **팀 모집 과정에서 기존 플랫폼의 한계와 관심 부족으로 어려움을 겪고 있습니다.** 이를 해결하기 위해 **팀 모집을 지원하는 효율적인 플랫폼을 개발하고자 합니다.**

<br>

## ✨ 팀원

|                         김덕환                         |                            김선정                            |                         남윤형                         |  
|:------------------------------------------------------:|:------------------------------------------------------------:|:------------------------------------------------------:|
|  <img src="https://github.com/user-attachments/assets/6f254705-f679-4751-b9c4-15c7a4942ad1" width="100" height="100">   |    <img src="https://github.com/user-attachments/assets/d2dbfc54-50b0-4325-afb2-745ab31bb143" width="100" height="100">    |  <img src="https://github.com/user-attachments/assets/ec131f01-9e02-4ac0-afb3-75ad2c1c88b7" width="100" height="100">   |
| [DeoKanKoong](https://github.com/dbwp031) | [Seonjeongg](https://github.com/Seonjeongg) | [BBIYACK-0834](https://github.com/BBIYACK-0834) | 
|                  Design & Frontend                     |                           Backend                            |                         Backend                       |

<br>

## 📆 프로젝트 기간

- 기획: **2024.05.18 ~ 2024.05.27**
- 1차 개발(MVP): **2024.05.28 ~ 2024.07.15**
- 2차 개발(디벨롭): **2024.07.24 ~ 2024.08.12**

<br>

## 🛠️ 기술 스택

### 개발 환경

<p>
<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">
<img src="https://img.shields.io/badge/Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
</p>

<p>
<img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white">
<img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/MySql-00758F?style=for-the-badge&logo=MySql&logoColor=white">
<img src="https://img.shields.io/badge/WebSocket-007ACC?style=for-the-badge&logo=websocket&logoColor=white">
<img src="https://img.shields.io/badge/MYSQL%20DB-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
</p>

### 협업 도구

<p>
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
<img src="https://img.shields.io/badge/Github-000000?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white">
<img src="https://img.shields.io/badge/Discord-5865FE?style=for-the-badge&logo=discord&logoColor=white">
</p>

<br>

## 🏗️ 아키텍처

<img width="1646" alt="arch" src="https://github.com/user-attachments/assets/9499e4fc-ef20-41a3-935a-3f2efae94600">

## 📌 주요 기능
#### 로그인 
- DB값 검증
- ID찾기, PW찾기
- 로그인 시 쿠키(Cookie) 및 세션(Session) 생성
#### 회원가입 
- DB값 저장
#### 마이 페이지(프로필 조회)
- 회원정보 변경
#### 게시글(팀 모집 창)
- 게시글 작성(이름, 모집인원, 우대사항 등)
- 게시글 수정
- 해당 게시글에 댓글
- 해당 게시글에 지원하기 버튼
#### 메인 페이지
- 숭실대학교 비교과 프로그램(펀시스템) 연동(크롤러)로 공지사항 및 비교과 안내
- 게시글 미리보기
#### 지원하기+지원자 
- 내가 쓴 게시글의 지원자 보기 및 지원자 프로필(상세보기)
- 지원자와 채팅하기
- 해당 지원자와 같이 팀을 할지 정하고 팀 만들기
#### 채팅
- 해당 멤버와 실시간 채팅(websocket 사용)
#### 팀 프로젝트 관리 창
- 팀 선택 창
- 해당 팀과의 투두 리스트 작성

<br>

## API 명세서
| **기능**                   | **Method** | **URL**                                              |
|----------------------------|------------|------------------------------------------------------|
| 회원가입                  | POST       | /save                                                |
| 로그인                    | POST       | /login                                               |
| 로그아웃                  | POST       | /logout                                              |
| 회원 정보 수정            | POST       | /update/{id}                                         |
| 프로필 조회              | GET        | /profile/{id}                                        |
| 게시물 작성              | POST       | /articles/{user_id}                                  |
| 게시물 수정              | PUT        | /articles/{user_id}/{id}                            |
| 게시글 삭제              | DELETE     | /articles/{user_id}/{id}                            |
| 모든 게시글 조회          | GET        | /articles                                            |
| 해당 게시글 조회          | GET        | /articles/{id}                                       |
| 내가 쓴 글 조회           | GET        | /articles/my/{user_id}                              |
| 댓글 쓰기                | POST       | /api/articles/{articleId}/comments                  |
| 댓글 조회                | GET        | /api/articles/{articleId}/comments                  |
| 댓글 삭제                | DELETE     | /api/articles/{articleId}/comments/{commentId}      |
| 지원하기                 | POST       | /applications/apply?articleId=1&user_id=26          |
| 지원자 목록 보기           | GET        | /applications/apply/{articleId}                     |
| 지원자 - 프로필 보기      | GET        | /applications/{applicationId}                       |
| 해당 팀의 투두리스트 조회  | GET        | /teams/{team_id}/todos                               |
| 투두 리스트 등록          | POST       | /teams/{team_id}/todos                               |
| 할일 수정                | PATCH      | /teams/{team_id}/todos/{id}                         |
| 투두 삭제                | DELETE     | /teams/{team_id}/todos/{id}                         |
| 팀 생성                  | POST       | /teams                                               |
| 특정 게시물에 대한 지원자 목록 조회 | GET | /teams/article/{articleId}/applicants               |

<br>

## 주요 화면

#### 로그인
<img src="https://github.com/user-attachments/assets/cacde11f-f3fb-49b3-bc08-ebc663f171de" width="720" height="512">

#### 회원가입
<img src="https://github.com/user-attachments/assets/a032e7de-cfd1-432b-ac65-26ce833e6307" width="720" height="512">

#### 메인화면
<img src="https://github.com/user-attachments/assets/d534cfe8-820f-4e63-8d68-a97fcfd208fe" width="720" height="512">

#### 팀 모집 게시판
<img src="https://github.com/user-attachments/assets/77997795-0722-4e51-be89-938be510207e" width="720" height="512">

#### 게시물
<img src="https://github.com/user-attachments/assets/a812f5a5-9369-49a6-9709-1327c50039b2" width="720" height="512">

#### 내 모집글 지원 현황
<img src="https://github.com/user-attachments/assets/dd5675a2-bbc8-49aa-896c-c376b6119ab9" width="720" height="512">

#### 채팅창
<img src="https://github.com/user-attachments/assets/22fdb60b-f35b-4a5d-ac99-2ce2d05d7e95" width="720" height="512">













