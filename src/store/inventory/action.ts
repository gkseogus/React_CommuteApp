import { FETCH_ERROR, FETCH_SUCCESS, FETCH_UPDATE } from './types';

import { ActionCreator, Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { ApplicationState } from '../index';

export type AppThunk = ActionCreator<
  ThunkAction<void, ApplicationState, null, Action<string>>
>;

/** Receive apiData and send data to reducer */
export const fetchRequest: AppThunk = (item) => {
  return (dispatch: Dispatch): Action => {
    try {
      return dispatch({
        type: FETCH_SUCCESS,
        payload: item,
      });
    } catch (e) {
      return dispatch({
        type: FETCH_ERROR,
      });
    }
  };
};

/** Receive apiData and send update to reducer */
export const fetchRequestToUpdate: AppThunk = (item) => {
  return (dispatch: Dispatch): Action => {
    try {
      return dispatch({
        type: FETCH_UPDATE,
        payload: item,
      });
    } catch (e) {
      return dispatch({
        type: FETCH_ERROR,
      });
    }
  };
};
