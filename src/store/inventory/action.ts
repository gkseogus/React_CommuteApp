import { Inventory, FETCH_ERROR,FETCH_SUCCESS, CHECK_IN, CHECK_OUT } from "./types";

import { ActionCreator, Action, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { ApplicationState } from "../index";

export type AppThunk = ActionCreator<
  ThunkAction<
   void, 
   ApplicationState, 
   null, Action<string>
  >
>;

type NewType = ThunkAction<void, ApplicationState, Inventory, Action<string>>;

// apiData를 받아와 reducer에게 데이터를 전송
export const fetchRequest: AppThunk = (item) => {
  return (dispatch: Dispatch): Action => {
    try {
      return dispatch({ // 리듀서에게 apiData.data 전송
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

export const checkInAction: AppThunk = (item) => {
  return (dispatch: Dispatch): Action => {
    try {
      return dispatch({
        type: CHECK_IN,
        payload: item 
      });
    } catch (e) { 
      return dispatch({
        type: FETCH_ERROR
      });
    }
  };
};

export const checkOutAction: AppThunk = (item) => {
  return (dispatch: Dispatch): Action => {
    try {
      return dispatch({
        type: CHECK_OUT,
        payload: item 
      });
    } catch (e) { 
      return dispatch({
        type: FETCH_ERROR
      });
    }
  };
};