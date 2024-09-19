/*
     Title: Reducers for ASSIGN_TARGET
     Description: Reducers for ASSIGN_TARGET
     Author: Iqbal Hossain
     Date: 27-January-2022
     Modified: 27-January-2022
*/

import {
  FETCH_ASSIGN_TARGET,
  FETCH_ASSIGN_TARGET_BY_ID,
  FETCH_ASSIGN_TARGET_BY_QUERY,
  FETCH_PREVIOUS_ASSIGN_TARGET,
  FETCH_TODAYS_ASSIGN_TARGET,
  LOADING,
  SET_ASSIGN_TARGET_BY_RANGE
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 1,
  params: {},
  selectedItem: null,
  todaysTarget: [],
  previousTarget: []
};

export const assignTargetReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return {
        ...state,
        loading: payload
      };
    }
    case FETCH_ASSIGN_TARGET:
      return { ...state, items: payload };
    case FETCH_ASSIGN_TARGET_BY_ID: {
      const { selectedItem } = payload;
      return { ...state, selectedItem };
    }
    case FETCH_ASSIGN_TARGET_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: payload.params
      };

    case FETCH_TODAYS_ASSIGN_TARGET: {
      const { todaysTarget, totalRecords } = payload;
      return {
        ...state,
        todaysTarget,
        total: totalRecords
      };
    }

    case FETCH_PREVIOUS_ASSIGN_TARGET: {
      const { previousTarget, totalRecords } = payload;
      return {
        ...state,
        previousTarget,
        total: totalRecords
      };
    }
    case SET_ASSIGN_TARGET_BY_RANGE:
      return { ...state, items: payload };
    default:
      return state;
  }
};

/** Change Log
 * 27-Jan-2022(Iqbal): Add FETCH_ASSIGN_TARGET_BY_QUERY,FETCH_ASSIGN_TARGET_BY_ID, FETCH_ASSIGN_TARGET_BY_RANGE
 */
