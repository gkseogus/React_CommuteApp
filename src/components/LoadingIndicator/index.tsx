import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import styled from 'styled-components';
import { BallTriangle }  from 'react-loader-spinner';

const Container = styled.div`
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const LoadingIndicator = (_props: any) => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    <div key={'LI'}>
      <Container>
        {
          promiseInProgress && 
          <BallTriangle 
            color='black'
          >
          </BallTriangle>
        }
        {
          promiseInProgress && 
          <h1>loading...</h1>
        }
      </Container>
    </div>
    );
}

export default LoadingIndicator;