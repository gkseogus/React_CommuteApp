import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { ApplicationState } from './store';
import { Store } from 'redux';
import AllRoutesApp from './routesAll';
interface StoreFace {
  store: Store<ApplicationState>;
}

const App: React.FC<StoreFace> = ({ store }) => {
  return (
    <Provider store={store}>
      <AllRoutesApp />
    </Provider>
  );
};

export default App;
