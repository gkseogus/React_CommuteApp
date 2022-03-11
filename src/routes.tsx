import React from 'react';
import { Route } from 'react-router-dom';
import GoogleLogin from './components/GoogleLogin/index';
import HomePage from './components/HomePage';

const Routes: React.SFC = () => (
  <div>
    {/* 첫 번째 route */}
    <Route exact 
      path="/" 
      render={() => 
        <div>
        <GoogleLogin/>
        <HomePage />
        </div>
      } 
    />
  </div>
);

export default Routes;
