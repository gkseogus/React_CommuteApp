import React, { useCallback, useEffect, useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { trackPromise } from 'react-promise-tracker';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchRequest } from '../../store/inventory/action';
import { converToState, loadTodaySheet } from '../GoogleSheet';

const LoginContain = styled.div`
  position: fixed;
  right: 150px;
`;
const LoginUser = styled.div`
  position: fixed;
  right: 300px;
  padding: 5px;
  font-size: 20px;
  font-weight: bold;
`;
// javascript 로 로드되어있는 구글 api를 사용하기 위해 타입 정의
// declare는 컴파일이 되지 않고 타입 정보만 알린다.
declare global {
  interface Window {
    gapi: any;
  }
}

/**
 * 전체적으로 index.html 에 작성되어 있는 코드를 컴포넌트 화 시킴 (https://developers.google.com/sheets/api/quickstart/js)
 * ㄴ redux 스토어에 전달하기 위함 -> 리액트 컴포넌트 내에서 api를 요청해야 된다.
 * @returns
 */

// 개발자 콘솔에서 불러올 클라이언트 ID 및 API 키
var CLIENT_ID =
  '653145946472-jn4efggid62mt7ceunkrvehioalffl32.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBG1aL8KaNnVAT4BLSNJRgrCrqrxXEi8pY';

// quickstart에서 사용하는 API용 API 탐색 문서 URL 배열
var DISCOVERY_DOCS = [
  'https://sheets.googleapis.com/$discovery/rest?version=v4',
];

// API에 필요한 인증 범위
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

export const AuthController = (_props: any) => {
  // 구글 로그인 여부 상태 값
  const [isSignedIn, setIsSignedIn] = useState(false);

  const dispatch = useDispatch();

  // 구글 로그인 상태가 변경되었을 때 호출되는 함수
  const updateSigninStatus = useCallback(
    (isSignedIn: boolean) => {
      // 로그인 여부 상태값 업데이트
      setIsSignedIn(isSignedIn);

      if (isSignedIn) {
        // 로그인 성공시 스프레트 시트를 불러옴
        trackPromise(
          loadTodaySheet().then((response: any) => {
            // 불러온 스프레트 시트를 Inventory interface에 맞게 파싱하고 redux store에 전달
            dispatch(fetchRequest(converToState(response)));
          })
        );
      } else {
        // 로그아웃시 redux store에서 값 clear
        fetchRequest([]);
      }
    },
    [dispatch]
  );

  // AuthController 컴포넌트가 처음 렌더링 될 때 (마운트 될 때) 호출됨.
  useEffect(() => {
    // 구글 auth 모듈 초기 내용 설정
    window.gapi.load('client:auth2', async () => {
      try {
        await window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS, // API의 검색 문서는 API의 표면, API에 액세스하는 방법, API 요청 및 응답이 구조화되는 방법을 설명
          scope: SCOPES,
        });

        // 로그인 상태 변경을 위한 listen(연결 요청 대기 메소드)
        // getAuthInstance로 GoogleAuth를 불러온다.
        window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(updateSigninStatus);

        // 초기 로그인 상태를 처리
        updateSigninStatus(
          window.gapi.auth2.getAuthInstance().isSignedIn.get()
        );
      } catch (error) {
        alert(error);
      }
    });
  }, [updateSigninStatus]);

  // 버튼 클릭 시 로그인한 사용자 정보를 출력
  const handleAuthClick = async (res: any) => {
    window.gapi.auth2.getAuthInstance().signIn();
    window.sessionStorage.setItem('user_id', res.googleId);
    window.sessionStorage.setItem('user_email', res.Ju.zv);
    window.sessionStorage.setItem('user_name', res.Ju.sf);
    window.sessionStorage.setItem('user_name2', `안녕하세요! ${res.Ju.sf}님`);

    console.log('login state:', window.sessionStorage);
    console.log('user name:', res.Ju.sf);
    console.log('user email:', res.Ju.zv);
    window.location.reload();
  };

  // Login Fail
  const responseFail = (err: void) => {
    console.error('Login Fail', err);
  };

  // 로그아웃 버튼 클릭 시 sessionStorage의 모든 데이터 삭제
  const handleSignoutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut();
    window.sessionStorage.clear();
    window.localStorage.clear();
    window.location.reload();
  };

  // 로그인 여부 상태값에 따라 Sign In / Sign Out 버튼 렌더링
  return (
    <div key={'GL'}>
      <LoginUser>{window.sessionStorage.user_name2}</LoginUser>
      {isSignedIn ? (
        <LoginContain>
          <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Sign Out"
            onLogoutSuccess={handleSignoutClick}
          ></GoogleLogout>
        </LoginContain>
      ) : (
        <LoginContain>
          <GoogleLogin
            clientId={CLIENT_ID}
            buttonText="Sign In"
            onSuccess={handleAuthClick}
            onFailure={responseFail}
          ></GoogleLogin>
        </LoginContain>
      )}
    </div>
  );
};

export default React.memo(AuthController);
