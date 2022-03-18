import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import styled from 'styled-components';

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
          <h1>Loading...</h1>
        }
      </Container>
    </div>
    );
}

export default LoadingIndicator;