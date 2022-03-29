import React from 'react';
import { useCallback, useEffect } from 'react';
import { GoogleLogout } from 'react-google-login';
import { trackPromise } from 'react-promise-tracker';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchRequest, fetchRequestToUpdate } from '../../store/inventory/action';
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

// javascript 로 로드되어있는 구글 api를 사용하기 위해 타입 정의
// declare는 컴파일이 되지 않고 타입 정보만 알린다.
declare global {
  interface Window {
    gapi: any;
  }
}


// 개발자 콘솔에서 불러올 클라이언트 ID 및 API 키
const CLIENT_ID = '653145946472-jn4efggid62mt7ceunkrvehioalffl32.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBG1aL8KaNnVAT4BLSNJRgrCrqrxXEi8pY';

// quickstart에서 사용하는 API용 API 탐색 문서 URL 배열
const DISCOVERY_DOCS = [
  'https://sheets.googleapis.com/$discovery/rest?version=v4',
];

// API에 필요한 인증 범위
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

export const AuthController = (_props: any) => {
  const dispatch = useDispatch();

  // 구글 로그인 상태가 변경되었을 때 호출되는 함수
  const updateSigninStatus = useCallback(
    (isSignedIn: boolean) => {
      // 로그인 성공시 스프레트 시트의 워크시트를 조회 및 생성
      if (isSignedIn) {
        trackPromise(
          loadTodaySheet().then((response: any) => {
            dispatch(fetchRequest(converToState(response)));
            dispatch(fetchRequestToUpdate(converToState(response)))
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
              window.gapi.auth2.getAuthInstance().isSignedIn.get()
            );
          } catch (error) {
            alert(error);
          }
        });
  }, [updateSigninStatus]);

  return (
    <div key={'GL'}>
      <LoginUser>{window.sessionStorage.user_name2}</LoginUser>
        <LoginContain>
          <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Sign Out"
            onLogoutSuccess={handleSignoutClick}
          ></GoogleLogout>
        </LoginContain>
    </div>
  );
};

export default React.memo(AuthController);