import React, { useState } from 'react';
import { useCallback, useEffect } from 'react';
import moment from 'moment';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { trackPromise } from 'react-promise-tracker';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  fetchRequest,
  fetchRequestToUpdate,
} from '../../store/inventory/action';
import { converToState, loadTodaySheet } from '../GoogleSheet';

const LoginContain = styled.div`
  position: fixed;
  right: 330px;
`;
const LoginUser = styled.div`
  position: fixed;
  right: 450px;
  padding: 5px;
  font-size: 20px;
  font-weight: bold;
`;

declare global {
  interface Window {
    gapi: any;
  }
}

const API_KEY = 'AIzaSyCXiff43VvXMTWyOCTxpe8TZjbNY_yG950';
const CLIENT_ID =
  '653145946472-oqs3s8edni5jt3romcdqm18cjtmsq4vi.apps.googleusercontent.com';
/** Array of API navigation document URLs for APIs used by quickstart */
const DISCOVERY_DOCS = [
  'https://sheets.googleapis.com/$discovery/rest?version=v4',
];
/** Authorization Scope Required by API */
let SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

const AuthController = (_props: any) => {
  const [loginCheck, setLoginCheck] = useState(true);
  const [userNameText, setUserNameText] = useState('');
  const dispatch = useDispatch();

  // 버튼 클릭 시 로그인한 사용자 정보를 출력
  const handleAuthClick = async (res: any) => {
    setLoginCheck(!loginCheck);
    window.localStorage.setItem('setTime', moment().format('YYYY MM월 DD일'));
    window.sessionStorage.setItem('user_id', res.profileObj.googleId);
    window.sessionStorage.setItem('user_email', res.profileObj.email);
    window.sessionStorage.setItem('user_name', res.profileObj.name);
    window.sessionStorage.setItem('user_name2', res.profileObj.name);
    setUserNameText(`안녕하세요! ${res.profileObj.name}님`);
  };

  // 구글 로그인 상태가 변경되었을 때 호출되는 함수
  const updateSigninStatus = useCallback(
    (isSignedIn: boolean) => {
      // 로그인 성공시 스프레트 시트의 워크시트를 조회 및 생성
      if (isSignedIn) {
        trackPromise(
          loadTodaySheet().then((response: any) => {
            dispatch(fetchRequest(converToState(response)));
            dispatch(fetchRequestToUpdate(converToState(response)));
          })
        );
      } else {
        // 로그아웃시 redux store에서 값 clear
        fetchRequest([]);
        fetchRequestToUpdate([]);
      }
    },
    [dispatch]
  );

  // 로그아웃 버튼 클릭 시 sessionStorage의 모든 데이터 삭제
  const handleSignoutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut();
    window.sessionStorage.clear();
    window.localStorage.clear();
    window.location.reload();
  };

  // Login Fail
  const responseFail = (err: void) => {
    console.error('Login Fail', err);
  };

  useEffect(() => {
    // 구글 OAuth 모듈 초기 내용 설정
    window.gapi.load('client:auth2', async () => {
      try {
        await window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        });

        // 로그인 상태 변경을 위한 listen(연결 요청 대기 메소드)
        window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(updateSigninStatus);

        // 초기 로그인 상태를 처리
        updateSigninStatus(
          window.gapi.auth2.getAuthInstance().isSignedIn.listen()
        );
      } catch (error) {
        alert(error);
      }
    });
  }, [updateSigninStatus]);

  /** 자동 팝업창 뜨려면 
    GoogleLogin 컴포넌트에 주면 됨
    render={(_renderProps) => <div></div>}
    uxMode="redirect"
    autoLoad={false}
   **/
  return (
    <div>
      <LoginUser>{userNameText}</LoginUser>
      <LoginContain>
        {loginCheck ? (
          <GoogleLogin
            clientId={CLIENT_ID}
            buttonText="Sign in"
            onSuccess={handleAuthClick}
            onFailure={responseFail}
            redirectUri="http://localhost:3000/api/auth/callback/google"
          ></GoogleLogin>
        ) : (
          <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Sign Out"
            onLogoutSuccess={handleSignoutClick}
          ></GoogleLogout>
        )}
      </LoginContain>
    </div>
  );
};

export default React.memo(AuthController);
