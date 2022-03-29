import moment from 'moment';
import React, { useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  background-size: cover;
`

const HnineFont = styled.h1`
  font-size: 200px;
  font-weight: 600;
  text-align: center;
  background: linear-gradient(to right top, #861657, #ffa69e);
  color: transparent;
  -webkit-background-clip: text;
`

// 개발자 콘솔에서 불러올 클라이언트 ID 및 API 키
const CLIENT_ID = '653145946472-jn4efggid62mt7ceunkrvehioalffl32.apps.googleusercontent.com';

const LoginPage = (res: any) => {
  const history = useHistory();
  
  // 버튼 클릭 시 로그인한 사용자 정보를 출력
  const handleAuthClick = async (res: any) => {
    window.localStorage.setItem('setTime',moment().format('YYYY MM월 DD일'));

    window.sessionStorage.setItem('user_id', res.googleId);
    window.sessionStorage.setItem('user_email', res.Ju.zv);
    window.sessionStorage.setItem('user_name', res.Ju.sf);
    window.sessionStorage.setItem('user_name2', `안녕하세요! ${res.Ju.sf}님`);

    window.location.reload();
  };

  // Login Fail
  const responseFail = (err: void) => {
    console.error('Login Fail', err);
  };

  useEffect(() => {
    if(window.sessionStorage.length !== 0){
      history.push('/');
    }
  });

    return (
      <Container>
        <HnineFont>HNINE</HnineFont>
        <GoogleLogin
          clientId={CLIENT_ID}
          onSuccess={handleAuthClick}
          onFailure={responseFail}
          render={_renderProps => (<div></div>)}
          uxMode='redirect'
          redirectUri='http://localhost:3000/api/auth/callback/google'
          autoLoad={true}
        ></GoogleLogin>
      </Container>
    );
};

export default React.memo(LoginPage);