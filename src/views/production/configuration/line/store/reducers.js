/*
     Title: Reducers for Line
     Description: Reducers for Line
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 06-January-2022
*/

import { mapArrayToDropdown } from 'utility/commonHelper';
import {
  ADD_LINE,
  CLOSE_CRITICAL_PROCESS_MANAGE_MODAL,
  DELETE_LINE,
  DELETE_LINE_BY_RANGE,
  FETCH_CRITICAL_PROCESS_IN_LINES_BY_LINE_ID,
  FETCH_LINE,
  FETCH_LINE_BY_ID,
  FETCH_LINE_BY_QUERY,
  FILL_LINE_BY_DDL,
  FILL_LINE_DDL_BY_ZONE_GROUP_ID,
  LOADING,
  OPEN_CRITICAL_PROCESS_MANAGE_MODAL,
  RESET_CRITICAL_PROCESS_STATE,
  TOGGLE_LINE_SIDEBAR,
  UPDATE_LINE
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 0,
  params: {},
  selectedItem: null,
  isOpenSidebar: false,
  dropDownItems: [],
  lineDdlWithByZoneGroup: [],
  isOpenManageCriticalProcessModal: false,
  loadCriticalProcessInLinesData: [],
  lineDataForManageCriticalProcess: null
};

export const lineReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case FETCH_LINE:
      return { ...state, items: payload };

    case FETCH_LINE_BY_ID:
      return { ...state, selectedItem: payload, isOpenSidebar: true };
    case FETCH_LINE_BY_QUERY: {
      const { items, totalRecords, params } = payload;
      return {
        ...state,
        items,
        total: totalRecords,
        params
      };
    }
    case TOGGLE_LINE_SIDEBAR: {
      const _updatedState = { ...state, isOpenSidebar: payload };
      if ( !payload ) _updatedState.selectedItem = null;
      return _updatedState;
      // return { ...state, isOpenSidebar: payload };
    }
    case ADD_LINE:
      return { ...state, total: state.total + 1 };
    case UPDATE_LINE:
      return { ...state, total: state.total + 1 };
    case DELETE_LINE:
      return { ...state, items: payload };
    case DELETE_LINE_BY_RANGE:
      return { ...state, items: payload };

    case FILL_LINE_BY_DDL: {
      const lineddl = mapArrayToDropdown( payload, 'name', 'id' );
      return { ...state, dropDownItems: lineddl };
    }

    case OPEN_CRITICAL_PROCESS_MANAGE_MODAL: {
      return {
        ...state,
        lineDataForManageCriticalProcess: payload,
        isOpenManageCriticalProcessModal: !state.isOpenManageCriticalProcessModal
      };
    }

    case FETCH_CRITICAL_PROCESS_IN_LINES_BY_LINE_ID: {
      const { loadCriticalProcessInLinesData } = payload;
      return {
        ...state,
        loadCriticalProcessInLinesData
      };
    }

    case CLOSE_CRITICAL_PROCESS_MANAGE_MODAL: {
      return {
        ...state,
        lineDataForManageCriticalProcess: null,
        isOpenManageCriticalProcessModal: false,
        loadCriticalProcessInLinesData: null
      };
    }

    case FILL_LINE_DDL_BY_ZONE_GROUP_ID: {
      const { lineDdlWithByZoneGroup } = payload;
      return {
        ...state,
        lineDdlWithByZoneGroup
      };
    }
    case RESET_CRITICAL_PROCESS_STATE: {
      return {
        ...state,
        loadCriticalProcessInLinesData: [],
      };
    }
    default:
      return state;
  }
};

/** Change Log
 * 08-Jan-2022(Iqbal):Add TOGGLE_LINE_SIDEBAR, FETCH_LINE_BY_QUERY, ADD_LINE, DELETE_LINE, FETCH_LINE_BY_ID, UPDATE_LINE, DELETE_LINE_BY_RANGE
 * 16-Feb-2022(Alamgir):Modify TOGGLE_LINE_SIDEBAR and FETCH_LINE_BY_ID Reducers
 * 24-Oct-2022 Added MANAGE_CRITICAL_PROCESS_MODAL_OPEN, LINE_ID, FETCH_CRITICAL_PROCESS_IN_LINES_BY_LINE_ID
 */
