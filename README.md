# About The Project
코로나로 인한 재택 출퇴근이 많아짐에 따라 재택 출 퇴근이 가능한 웹 사이트를 구축
사용자의 편의성을 위해 출퇴근 기능에만 초점을 두었다.

# Feature List 
1. 직원 정보 테이블
2. 날짜 검색 기능
3. 유저 검색 기능
4. 출,퇴근 버튼 기능
5. 로그인 기능
6. 현재 유저 이름 출력 기능

<br/>

# Feature List Details
1. 사용자가 구글 로그인을 하면 출/퇴근 버튼이 활성화 된다.
2. 사용자가 구글 로그아웃을 하면 출/퇴근 버튼이 비 활성화 된다.
3. 사용자가 출/퇴근 버튼을 누르면 시트에 데이터가 업데이트 된다.
4. 사용자가 출/퇴근 버튼을 누르면 
최초 1회를 기준으로 그 날(년/월/일) 기준에는 출 퇴근 버튼을 누르지 못한다.
5. 최초 사용자가 로그인 할 시 해당 날짜(년/월/일)을 제목으로 갖는 워크 시트가 1회만 생성된다. 
6. 구글 로그인/로그아웃은 웹 관리자에게 허가 된 사람만 가능하다.
7. 시트의 접근 권한은 시트 관리자에게 허가 된 사람만 가능하며 이는 시트 업데이트를 의미한다.

# Data
* 테이블의 데이터 구성 요소

-컬럼 종류 -

A : 팀명, B : 사용자명, C : 체크인, D : 체크아웃, E : 근무시간, F : 근무상태, G : 사용자 이메일, H : 재택여부
![컬럼데이터](https://user-images.githubusercontent.com/76561461/190063308-952a6c4c-da10-4961-bf44-25b945c58b45.png)
<br/>

* One row data

 출 퇴근 시스템이면 사용자가 근무를 언제 하였고 언제 끝났는지만 보는게 중요하다 생각해 
 사용자의 맨 처음 출근과 마지막 퇴근만 기록  되도록 하였다.
이러면 하나의 row 데이터 만으로 사용자의 근무 상태를 파악 가능하다.

* Team data

팀 데이터 같은 경우는 다른 데이터와 다르게
한 사용자에 대한 팀은 고정적 이므로
하나의 더미 데이터를 생성  
키 값은 사용자의 이메일 값

![팀데이터](https://user-images.githubusercontent.com/76561461/190063404-f7a0ac81-6899-4fde-9efc-9331510c7be3.png)
<br/>

# Test 
* 1인 사용자 일 경우 테스트
-새로고침을 하여도 버튼 활성화 상태가 유지 되는지 확인-
1.  로그인 - 출근 - 퇴근(변경) - 새로고침
2.  로그인 - 출근 - 퇴근(변경안함) - 새로고침
3.  로그인 - 회사- 퇴근(변경) - 새로고침
4.  로그인 - 회사- 퇴근(변경안함) - 새로고침
5.  로그인 - 새로고침 - 출근 - 퇴근 - 새로고침
6.  로그인 - 새로고침 - 회사 - 퇴근 - 새로고침
<br/>

-데이터가 정상적으로 변하는지 확인-
1.  출근 후 9시간 경과면 근무상태 정상
2.  출근, 회사버튼 누르고 로그아웃 할 경우 출근 데이터가 날라가지 않는지
<br/>

* 다수의 사용자 일 경우의 테스트
( 다수란 2인 이상을 의미하며 테스트 상황은 2대의 데스크탑에서 테스트를 진행)
<br/>

-데이터가 정상적으로 시트에 저장되는지 확인-
1. 두 사용자가 동시에 접속 및 로그인 할 경우
2. 두 사용자가 동시에 출근 버튼을 눌렸을 경우
3. 두 사용자가 동시에 회사 버튼을 눌렸을 경우
4. 두 사용자가 동시에 퇴근 버튼(변경안함)을 눌렀을 경우
5. 두 사용자가 동시에 퇴근 버튼(변경)을 눌렀을 경우
6. 한 사용자는 출근, 한 사용자는 회사를 눌렀을 경우
7. 한 사용자는 퇴근(변경안함), 한 사용자는 퇴근(변경)을 눌렀을 경우
<br/>

* 비 정상적인 유저의 행동
1. 로딩중 페이지 나가기
2. 로딩중 버튼 클릭시 데이터 변경되는지
<br/>

* 시트 권한 테스트
1. 시트 권한 없는 사용자가 접속시 시트 데이터가 출력되지 않는지 확인
2.  Oauth 권한 없는 사용자가 접속시 로그인이 되는지 확인

# Web Deployment
* AWS - Amplify 사용

도메인 구축 및 운영 서버 분리

# Code Convention

Google Code Convention 적용

# Demo
https://user-images.githubusercontent.com/76561461/190063666-79458aa3-8e6c-4116-bbbc-47039047cfd0.mp4
