import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { BallTriangle } from 'react-loader-spinner';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const LoadingText = styled.h1`
  font-size: 600;
`;

const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    <Container>
      {promiseInProgress && <BallTriangle color="black"></BallTriangle>}
      {promiseInProgress && <LoadingText>loading...</LoadingText>}
    </Container>
  );
};

export default React.memo(LoadingIndicator);
