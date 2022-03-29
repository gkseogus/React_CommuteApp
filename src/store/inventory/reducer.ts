import { Reducer } from 'redux';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  FETCH_UPDATE,
  InventoryState
} from './types';

export const initialState: InventoryState = {
  data: [],
  update: [],
  errors: undefined,
  loading: false,
};

const reducer: Reducer<InventoryState> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      return { ...state, loading: false, data: action.payload };
    }
    case FETCH_UPDATE: {
      return { ...state, loading: false, update: action.payload };
    }
    case FETCH_ERROR: {
      console.log('Error');
      return { ...state, loading: false, data: action.payload };
    }
    default: {
      return state;
    }
  }
};

export { reducer as InventoryReducer };
