/*
     Title: Reducers for Line
     Description: Reducers for Line
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 06-January-2022
*/

import { mapArrayToDropdown } from 'utility/commonHelper';
import {
  FETCH_CRITICAL_PROCESS_BY_ID,
  FETCH_CRITICAL_PROCESS_BY_QUERY,
  FILL_CRITICAL_PROCESS_DDL,
  LOADING,
  RESET_CRITICAL_PROCESS_DDL,
  TOGGLE_CRITICAL_PROCESS_SIDEBAR
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 0,
  params: {},
  selectedItem: null,
  isOpenSidebar: false,
  criticalProcessDdl: []
};

export const criticalProcessReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case FETCH_CRITICAL_PROCESS_BY_QUERY:
      return { ...state, items: payload.items, total: payload.totalRecords, params: action.params };

    case TOGGLE_CRITICAL_PROCESS_SIDEBAR: {
      const updatedState = { ...state, isOpenSidebar: payload };
      if ( !payload ) updatedState.selectedItem = null;
      return updatedState;
    }

    case FILL_CRITICAL_PROCESS_DDL: {
      const criticalProcessDdl = mapArrayToDropdown( payload, 'name', 'id' );
      return { ...state, criticalProcessDdl };
    }

    case RESET_CRITICAL_PROCESS_DDL: {
      return { ...state, criticalProcessDdl: payload };
    }
    case FETCH_CRITICAL_PROCESS_BY_ID: {
      return {
        ...state,
        selectedItem: {
          ...payload,
          processType: { label: payload.processType, value: payload.processType }
        },
        isOpenSidebar: true
      };
    }

    default:
      return state;
  }
};

/** Change Log
 * 08-Jan-2022(Iqbal):Add TOGGLE_LINE_SIDEBAR, FETCH_LINE_BY_QUERY, ADD_LINE, DELETE_LINE, FETCH_LINE_BY_ID, UPDATE_LINE, DELETE_LINE_BY_RANGE
 */
