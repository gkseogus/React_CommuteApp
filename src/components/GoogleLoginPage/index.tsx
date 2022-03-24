import React, { useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const LoginContain = styled.div`
  position: fixed;
  right: 330px;
`;

// 개발자 콘솔에서 불러올 클라이언트 ID 및 API 키
var CLIENT_ID =
  '653145946472-jn4efggid62mt7ceunkrvehioalffl32.apps.googleusercontent.com';

const LoginPage = (res: any) => {

  const history = useHistory();

  useEffect(() => {
    if(window.sessionStorage.length !== 0){
      history.push('/');
    }
  })

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

    
    return (
        <div>
            <LoginContain>
                <GoogleLogin
                    clientId={CLIENT_ID}
                    buttonText="Sign In"
                    onSuccess={handleAuthClick}
                    onFailure={responseFail}
                ></GoogleLogin>
        </LoginContain> 
        </div>
    );
};

export default LoginPage;