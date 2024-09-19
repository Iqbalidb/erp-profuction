/*
     Title: Reducers for REJECT_TYPE
     Description: Reducers for REJECT_TYPE
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 10-January-2022
*/

import { FETCH_REJECT_TYPE_BY_ID, FETCH_REJECT_TYPE_BY_QUERY, LOADING, TOGGLE_REJECT_TYPE_SIDEBAR } from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 0,
  params: {},
  selectedItem: null,
  isOpenSidebar: false
};

export const rejectTypeReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case TOGGLE_REJECT_TYPE_SIDEBAR: {
      const updatedState = { ...state, isOpenSidebar: payload };
      if ( !payload ) updatedState.selectedItem = null;

      return updatedState;
    }

    case FETCH_REJECT_TYPE_BY_ID: {
      return {
        ...state,
        selectedItem: { ...payload },
        isOpenSidebar: true
      };
    }

    case FETCH_REJECT_TYPE_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: action.params
      };

    default:
      return state;
  }
};

/** Change Log
 * 10-Jan-2022(Iqbal): Add TOGGLE_REJECT_TYPE_SIDEBAR, FETCH_REJECT_TYPE_BY_QUERY, ADD_REJECT_TYPE, DELETE_REJECT_TYPE, FETCH_REJECT_TYPE_BY_ID, UPDATE_REJECT_TYPE, DELETE_REJECT_TYPE_BY_RANGE
 */
