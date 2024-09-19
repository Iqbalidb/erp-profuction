/*
     Title: Reducers for TIME_SLOTS
     Description: Reducers for TIME_SLOTS
     Author: Alamgir Kabir
     Date: 12-February-2022
     Modified: 12-February-2022
*/

import { FETCH_TIME_SLOT_BY_ID, FETCH_TIME_SLOT_BY_QUERY, FILL_TIME_SLOT_DDL, LOADING, TOGGLE_TIME_SLOT_SIDEBAR } from './actionType';

const initialState = {
  loading: false,
  items: [],
  total: 0,
  params: {},
  isOpenSidebar: false,
  selectedTimeSlot: null,
  dropDownItems: []
};
export const timeSlotReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case FETCH_TIME_SLOT_BY_QUERY: {
      return { ...state, items: payload.items, total: payload.total, params: action.params };
    }
    case LOADING: {
      return { ...state, loading: payload };
    }
    case FETCH_TIME_SLOT_BY_ID: {
      return { ...state, selectedTimeSlot: payload, isOpenSidebar: true };
    }
    case FILL_TIME_SLOT_DDL: {
      const { dropDownItems } = payload;
      return { ...state, dropDownItems };
    }
    case TOGGLE_TIME_SLOT_SIDEBAR: {
      const _updatedState = { ...state, isOpenSidebar: payload };
      if ( !payload ) _updatedState.selectedTimeSlot = null;
      return _updatedState;
      // return { ...state, isOpenSidebar: payload };
    }
    default:
      return state;
  }
};
