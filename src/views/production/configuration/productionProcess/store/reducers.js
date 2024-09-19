/*
     Title: Reducers for PRODUCTION_PROCESS
     Description: Reducers for PRODUCTION_PROCESS
     Author: Iqbal Hossain
     Date: 09-January-2022
     Modified: 09-January-2022
*/

import { mapArrayToDropdown } from 'utility/commonHelper';
import {
  FETCH_PRODUCTION_PROCESS_BY_ID,
  FETCH_PRODUCTION_PROCESS_BY_QUERY,
  FILL_PRODUCTION_PROCESS_DDL,
  LOADING,
  TOGGLE_PRODUCTION_PROCESS_SIDEBAR,
  TOGGLE_PRODUCTION_PROCESS_STATUS
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 0,
  selectedItem: null,
  isOpenSidebar: false,
  params: {},
  dropDownItems: []
};

export const productionProcessReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case TOGGLE_PRODUCTION_PROCESS_SIDEBAR: {
      const updatedState = { ...state, isOpenSidebar: payload };
      if ( !payload ) updatedState.selectedItem = null;
      return updatedState;
    }

    case TOGGLE_PRODUCTION_PROCESS_STATUS: {
      return { ...state, selectedItem: { ...state.selectedItem, status: payload } };
    }

    case FETCH_PRODUCTION_PROCESS_BY_ID: {
      return {
        ...state,
        selectedItem: {
          ...payload,
          processType: { label: payload.processType, value: payload.processType }
        },
        isOpenSidebar: true
      };
    }

    case FETCH_PRODUCTION_PROCESS_BY_QUERY: {
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: action.params
      };
    }

    case FILL_PRODUCTION_PROCESS_DDL: {
      const productionProcessddl = mapArrayToDropdown( payload, 'name', 'id' );

      return { ...state, dropDownItems: [...productionProcessddl] };
    }

    default:
      return state;
  }
};

/** Change Log
 * 08-Jan-2022(Iqbal):Add TOGGLE_PRODUCTION_PROCESS_SIDEBAR, FETCH_PRODUCTION_PROCESS_BY_QUERY, ADD_PRODUCTION_PROCESS, DELETE_PRODUCTION_PROCESS, FETCH_PRODUCTION_PROCESS_BY_ID, UPDATE_PRODUCTION_PROCESS, DELETE_PRODUCTION_PROCESS_BY_RANGE
 */
