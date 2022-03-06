import React from 'react';
import { Route } from 'react-router-dom';
// import HomePage from './components/HomePage';
import HomeDatePicker from './components/DatePicker';
import UserSearch from './components/UserSearch';

const Routes: React.SFC = () => (
  <div>
    {/* 첫 번째 route */}
    <Route
      exact
      path="/"
      render={() => (
        <div>
        <HomeDatePicker/>
        <UserSearch/>
        </div>
      )}
    />
  </div>
);

export default Routes;
