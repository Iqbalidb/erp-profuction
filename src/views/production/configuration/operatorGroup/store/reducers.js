import {
  EDIT_ACTIVE_OPERATOR_GROUP,
  FETCH_ACTIVE_OPERATOR_GROUP,
  FETCH_IN_ACTIVE_OPERATOR_GROUP,
  LOADING_OPERATOR_GROUP,
  TOGGLE_OPERATOR_GROUP_SIDEBAR
} from './actionTypes';

/*
     Title: Operator Group Reducer
     Description: Operator Group Reducer
     Author: Alamgir Kabir
     Date: 15-December-2022
     Modified: 15-December-2022
*/
const initialState = {
  loading: false,
  isOpenSidebar: false,
  items: [],
  total: 0,
  selectedItem: null,
  activeOperatorGroups: [],
  inActiveOperatorGroups: []
};
export const OperatorGroupReducer = ( state = initialState, action ) => {
  const { type, payload } = action;

  switch ( type ) {
    case LOADING_OPERATOR_GROUP: {
      return {
        ...state,
        loading: payload
      };
    }
    case FETCH_ACTIVE_OPERATOR_GROUP: {
      const { items, totalRecords } = payload;
      return {
        ...state,
        items,
        total: totalRecords
      };
    }
    case FETCH_IN_ACTIVE_OPERATOR_GROUP: {
      const { inActiveOperatorGroups, totalRecords } = payload;
      return {
        ...state,
        inActiveOperatorGroups,
        total: totalRecords
      };
    }
    case TOGGLE_OPERATOR_GROUP_SIDEBAR: {
      return {
        ...state,
        isOpenSidebar: !state.isOpenSidebar
      };
    }
    case EDIT_ACTIVE_OPERATOR_GROUP: {
      return {
        ...state
      };
    }
    default:
      return state;
  }
};
