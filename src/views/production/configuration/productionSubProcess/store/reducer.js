/**
 * Title: Reducer from Production Sub Process
 * Description: Reducer from Production Sub Process
 * Author: Nasir Ahmed
 * Date: 07-February-2022
 * Modified: 07-February-2022
 **/

import { mapArrayToDropdown } from 'utility/commonHelper';
import {
  FETCH_PRODUCTION_SUB_PROCESS_BY_ID,
  FETCH_PRODUCTION_SUB_PROCESS_BY_QUERY,
  FILL_PRODUCTION_SUB_PROCESS_DDL,
  LOADING,
  TOGGLE_PRODUCTION_SUB_PROCESS_SIDEBAR
} from './actionTypes';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 0,
  params: {},
  selectedItem: null,
  isOpenSidebar: false,
  dropDownItems: []
};

export const productionSubProcessReducer = ( state = initialState, action ) => {
  const { type, payload } = action;

  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case FETCH_PRODUCTION_SUB_PROCESS_BY_QUERY: {
      const { items, total, params } = payload;
      return { ...state, items: [...items], total, params };
    }

    case FILL_PRODUCTION_SUB_PROCESS_DDL: {
      const productionSubProcessddl = mapArrayToDropdown( payload, 'name', 'id' );
      return { ...state, dropDownItems: [...productionSubProcessddl] };
    }
    case TOGGLE_PRODUCTION_SUB_PROCESS_SIDEBAR: {
      const updatedState = { ...state, isOpenSidebar: payload };
      if ( !payload ) updatedState.selectedItem = null;
      return updatedState;
    }

    case FETCH_PRODUCTION_SUB_PROCESS_BY_ID: {
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
