import React from 'react';
import { Route } from 'react-router-dom';
import GoogleLogOut from './components/GoogleLogOut/index';
import HomePage from './components/HomePage';
import GoogleLoginPage from './components/GoogleLoginPage';

const Routes: React.SFC = () => (
  <div>
    {/* 첫 번째 route */}
    <Route exact 
      path="/" 
      render={() => 
        <div>
        <GoogleLoginPage/>
        </div>
      } 
    />
    {/* 두 번째 route */}
    <Route exact
      path="/commute"
      render={() => 
        <div>
          <GoogleLogOut/>
          <HomePage/>
        </div>
      }
    />
  </div>
);

export default Routes;
