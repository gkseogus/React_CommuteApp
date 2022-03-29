import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { History } from 'history';

import { InventoryReducer } from './inventory/reducer';
import { InventoryState } from './inventory/types';

import { RouterState } from 'connected-react-router';

// ApplicationState: store의 상태
export interface ApplicationState {
  inventory: InventoryState;
  router: RouterState;
};

export const createRootReducer = (history: History) =>
  // combineReducers : 각각의 리듀서를 하나로 합쳐 하나의 리듀서로 관리 
  combineReducers({
    inventory: InventoryReducer,
    router: connectRouter(history)
  });
