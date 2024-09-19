/*
   Title: Reducers
   Description: Reducers
   Author: Iqbal Hossain
   Date: 05-January-2022
   Modified: 05-January-2022
*/

import {
  ADD_SAMPLE_TYPE,
  DELETE_SAMPLE_TYPE,
  DELETE_SAMPLE_TYPE_BY_RANGE,
  FETCH_SAMPLE_TYPE,
  FETCH_SAMPLE_TYPE_BY_ID,
  FETCH_SAMPLE_TYPE_BY_QUERY,
  LOADING,
  TOGGLE_SAMPLE_TYPE_SIDEBAR,
  TOGGLE_SAMPLE_TYPE_STATUS,
  UPDATE_SAMPLE_TYPE
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

export const sampleTypeReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case FETCH_SAMPLE_TYPE:
      return { ...state, items: payload };
    case TOGGLE_SAMPLE_TYPE_SIDEBAR:
      return { ...state, isOpenSidebar: payload };
    case TOGGLE_SAMPLE_TYPE_STATUS: {
      return { ...state, selectedItem: { ...state.selectedItem, status: payload } };
    }
    case FETCH_SAMPLE_TYPE_BY_ID:
      return { ...state, selectedItem: payload.selectedItem };
    case FETCH_SAMPLE_TYPE_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: payload.params
      };
    case ADD_SAMPLE_TYPE:
      return { ...state, total: state.total + 1 };
    case UPDATE_SAMPLE_TYPE:
      return { ...state, total: state.total + 1 };
    case DELETE_SAMPLE_TYPE:
      return { ...state, items: payload };
    case DELETE_SAMPLE_TYPE_BY_RANGE:
      return { ...state, items: payload };
    default:
      return state;
  }
};

/** Change Log
 * 09-Jan-2022(Iqbal):Add TOGGLE_SAMPLE_TYPE_SIDEBAR, FETCH_SAMPLE_TYPE_BY_QUERY, ADD_SAMPLE_TYPE, DELETE_SAMPLE_TYPE, FETCH_SAMPLE_TYPE_BY_ID, UPDATE_SAMPLE_TYPE, DELETE_SAMPLE_TYPE_BY_RANGE
 */
