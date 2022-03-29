import { FETCH_ERROR,FETCH_SUCCESS, FETCH_UPDATE } from './types';

import { ActionCreator, Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { ApplicationState } from '../index';

export type AppThunk = ActionCreator<
  ThunkAction<
   void, 
   ApplicationState, 
   null, Action<string>
  >
>;

// apiData를 받아와 reducer에게 데이터를 전송
export const fetchRequest: AppThunk = (item) => {
  return (dispatch: Dispatch): Action => {
    try {
      return dispatch({ 
        type: FETCH_SUCCESS,
        payload: item 
      });
    } catch (e) { 
      return dispatch({
        type: FETCH_ERROR
      });
    }
  };
};

export const fetchRequestToUpdate: AppThunk = (item) => {
  return (dispatch: Dispatch): Action => {
    try {
      return dispatch({ 
        type: FETCH_UPDATE,
        payload: item 
      });
    } catch (e) { 
      return dispatch({
        type: FETCH_ERROR
      });
    }
  };
};