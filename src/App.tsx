import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { ApplicationState } from './store';
import { Store } from 'redux';
import { History } from 'history';
import AllRoutesApp from './routesAll';
interface MainProps {
  store: Store<ApplicationState>;
  history: History;
}

const App: React.FC<MainProps> = ({ store, history }) => {
  return (
    <Provider store={store}>
      <AllRoutesApp />
    </Provider>
  );
};

export default App;
