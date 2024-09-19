/*
     Title: Reducers for INCOMPLETE_TYPE
     Description: Reducers for INCOMPLETE_TYPE
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 10-January-2022
*/

import {
  ADD_INCOMPLETE_TYPE,
  DELETE_INCOMPLETE_TYPE,
  DELETE_INCOMPLETE_TYPE_BY_RANGE,
  FETCH_INCOMPLETE_TYPE,
  FETCH_INCOMPLETE_TYPE_BY_ID,
  FETCH_INCOMPLETE_TYPE_BY_QUERY,
  LOADING,
  TOGGLE_INCOMPLETE_TYPE_SIDEBAR,
  TOGGLE_INCOMPLETE_TYPE_STATUS,
  UPDATE_INCOMPLETE_TYPE
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 1,
  params: {},
  selectedItem: null,
  isOpenSidebar: false
};

export const incompleteTypeReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case FETCH_INCOMPLETE_TYPE:
      return { ...state, items: payload };
    case TOGGLE_INCOMPLETE_TYPE_SIDEBAR:
      return { ...state, isOpenSidebar: payload };
    case TOGGLE_INCOMPLETE_TYPE_STATUS: {
      return { ...state, selectedItem: { ...state.selectedItem, status: payload } };
    }
    case FETCH_INCOMPLETE_TYPE_BY_ID:
      return { ...state, selectedItem: payload.selectedItem };
    case FETCH_INCOMPLETE_TYPE_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: action.params
      };
    case ADD_INCOMPLETE_TYPE:
      return { ...state, total: state.total + 1 };
    case UPDATE_INCOMPLETE_TYPE:
      return { ...state, total: state.total + 1 };
    case DELETE_INCOMPLETE_TYPE:
      return { ...state, items: payload };
    case DELETE_INCOMPLETE_TYPE_BY_RANGE:
      return { ...state, items: payload };
    default:
      return state;
  }
};

/** Change Log
 * 11-Jan-2022(Iqbal): Add TOGGLE_INCOMPLETE_TYPE_SIDEBAR, FETCH_INCOMPLETE_TYPE_BY_QUERY, ADD_INCOMPLETE_TYPE, DELETE_INCOMPLETE_TYPE, FETCH_INCOMPLETE_TYPE_BY_ID, UPDATE_INCOMPLETE_TYPE, DELETE_INCOMPLETE_TYPE_BY_RANGE
 */
