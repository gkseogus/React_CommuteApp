import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { InventoryReducer } from './inventory/reducer';
import { InventoryState } from './inventory/types';
import { RouterState } from 'connected-react-router';

export interface ApplicationState {
  inventory: InventoryState;
  router: RouterState;
}

export const createRootReducer = (history: History) =>
  /** Combine each reducer into one and manage it as one reducer */
  combineReducers({
    inventory: InventoryReducer,
    router: connectRouter(history),
  });
