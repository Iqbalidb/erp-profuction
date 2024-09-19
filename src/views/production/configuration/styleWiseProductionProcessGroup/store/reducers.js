import {
  FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_BY_ID,
  FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_BY_QUERY,
  FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_STATE,
  LOADING,
  TOGGLE_STYLE_WISE_PRODUCTION_PROCESS_GROUP_SIDEBAR
} from './actionType';

/*
     Title: Style Wise Production Process Group Reducer
     Description: Style Wise Production Process Group Reducer
     Author: Alamgir Kabir
     Date: 31-July-2022
     Modified: 31-July-2022
*/
const initialState = {
  loading: false,
  items: [],
  total: 0,
  params: {},
  selectedItem: null,
  isOpenSidebar: false
};
export const styleWiseProductionProcessGroupReducer = ( state = initialState, action ) => {
  const { type, payload } = action;

  switch ( type ) {
    case LOADING: {
      return {
        ...state,
        loading: payload
      };
    }

    case FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_BY_QUERY: {
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: action.params
      };
    }

    case FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_BY_ID: {
      return {
        ...state,
        selectedItem: payload,
        isOpenSidebar: true
      };
    }

    case TOGGLE_STYLE_WISE_PRODUCTION_PROCESS_GROUP_SIDEBAR: {
      return {
        ...state,
        isOpenSidebar: !state.isOpenSidebar
      };
    }

    case FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_STATE: {
      return {
        ...state,
        isOpenSidebar: !state.isOpenSidebar,
        selectedItem: null
      };
    }

    default:
      return state;
  }
};
