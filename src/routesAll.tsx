import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthController from './components/AuthController/index';
import HomePage from './components/HomePage';

const routesAll = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <AuthController />
            <HomePage />
          </div>
        }
      />
    </Routes>
  </Router>
);

export default React.memo(routesAll);
