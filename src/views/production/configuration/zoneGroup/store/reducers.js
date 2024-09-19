import {
  FETCH_LINE_DROPDOWN_BY_FLOOR_AND_PRODUCTION_PROCESS,
  FETCH_ZONE_GROUP_BY_ID,
  FETCH_ZONE_GROUP_BY_QUERY,
  FETCH_ZONE_GROUP_DDL,
  LOADING,
  RESET_SELECTED_ZONE_GROUP,
  TOGGLE_ZONE_GROUP_DETAILS_MODAL
} from './actionTypes';

/*
     Title: Reducer for Zone Group
     Description: Reducer for Zone Group
     Author: Alamgir Kabir
     Date: 30-March-2022
     Modified: 30-March-2022
*/
const initialState = {
  loading: false,
  items: [],
  total: 0,
  params: {},
  selectedItem: null,
  isOpenModal: false,
  zoneGroupddlLine: [],
  lineDropdown: [],
  dropDownItems: []
};
export const zoneGroupReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return { ...state, loading: payload };
    }
    case FETCH_ZONE_GROUP_BY_QUERY: {
      const { items, total } = payload;
      return { ...state, items: [...items], total, params: action.params };
    }
    case FETCH_ZONE_GROUP_BY_ID: {
      const { selectedItem, lineDropdown } = payload;
      return {
        ...state,
        selectedItem,
        lineDropdown
      };
    }
    case TOGGLE_ZONE_GROUP_DETAILS_MODAL: {
      const { toggleDirection } = payload;
      return { ...state, isOpenModal: toggleDirection };
    }
    case RESET_SELECTED_ZONE_GROUP: {
      return { ...state, selectedItem: null };
    }
    case FETCH_LINE_DROPDOWN_BY_FLOOR_AND_PRODUCTION_PROCESS: {
      const { zoneGroupddlLine } = payload;
      return {
        ...state,
        zoneGroupddlLine
      };
    }
    case FETCH_ZONE_GROUP_DDL: {
      const { zoneGroupDdl } = payload;
      return {
        ...state,
        dropDownItems: zoneGroupDdl
      };
    }
    default:
      return state;
  }
};
