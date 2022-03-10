import { Reducer } from 'redux';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  CHECK_IN,
  CHECK_OUT,
  InventoryState,
} from './types';

export const initialState: InventoryState = {
  data: [],
  errors: undefined,
  loading: false,
};

// reducer : dispatch안 action의 type을 확인하고
// 그에 맞는 동작을 한다.
const reducer: Reducer<InventoryState> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      console.log('action payload', action.payload);
      // 단지 store의 상태만 수정
      return { ...state, loading: false, data: action.payload };
    }
    case FETCH_ERROR: {
      console.log('Error')
      return { ...state, loading: false, data: action.payload };
    }
    case CHECK_IN: {
      console.log('checkIn payload', action.payload);
      return { ...state, loading: false, checkIn: action.payload };
    }
    case CHECK_OUT: {
      console.log('checkOut payload', action.payload);
      return { ...state, loading: false, checkOut: action.payload };
    }
    default: {
      return state;
    }
  }
};

export { reducer as InventoryReducer };
