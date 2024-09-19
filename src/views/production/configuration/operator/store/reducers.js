/*
     Title: Operator Reducer
     Description: Operator Reducer
     Author: Alamgir Kabir
     Date: 12-December-2022
     Modified: 12-December-2022
*/

import {
  FETCH_OPERATOR_BY_ID,
  FETCH_OPERATOR_BY_QUERY,
  FETCH_OPERATOR_FOR_OPERATOR_GROUP,
  LOAD_OPERATOR,
  RESET_OPERATOR_STATE,
  TOGGLE_OPERATOR_SIDEBAR
} from './actionTypes';
const initialState = {
  loading: false,
  isOpenSidebar: false,
  items: [],
  total: 0,
  selectedItem: null,
  operatorDdl: []
};
export const OperatorReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOAD_OPERATOR: {
      return {
        ...state,
        loading: payload
      };
    }
    case TOGGLE_OPERATOR_SIDEBAR: {
      return {
        ...state,
        isOpenSidebar: !state.isOpenSidebar
      };
    }
    case FETCH_OPERATOR_BY_QUERY: {
      const { items, totalRecords } = payload;
      return {
        ...state,
        items,
        total: totalRecords
      };
    }

    case FETCH_OPERATOR_BY_ID: {
      const { selectedItem } = payload;
      return {
        ...state,
        selectedItem
      };
    }
    case FETCH_OPERATOR_FOR_OPERATOR_GROUP: {
      const { operatorDdl } = payload;
      return {
        ...state,
        operatorDdl
      };
    }
    case RESET_OPERATOR_STATE: {
      const { selectedItem } = payload;
      return {
        ...state,
        selectedItem
      };
    }

    default:
      return state;
  }
};
