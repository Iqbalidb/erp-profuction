/*
     Title: Reducer for part groups
     Description: Reducer for part groups
     Author: Alamgir Kabir
     Date: 02-July-2022
     Modified: 02-July-2022
*/
import { FETCH_PART_GROUPS_BY_ID, FETCH_PART_GROUP_BY_QUERY, LOADING, TOGGLE_PART_GROUP_PART_SIDEBAR, TOGGLE_PART_GROUP_STATUS } from './actionType';
const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 0,
  params: {},
  selectedItem: null,
  isOpenSidebar: false
};
export const partGroupReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case TOGGLE_PART_GROUP_STATUS:
      return { ...state, selectedItem: { ...state.selectedItem, status: payload } };
    case FETCH_PART_GROUPS_BY_ID:
      return { ...state, selectedItem: payload.selectedItem, isOpenSidebar: true };
    case TOGGLE_PART_GROUP_PART_SIDEBAR: {
      const updatedState = { ...state, isOpenSidebar: payload };
      if ( !payload ) updatedState.selectedItem = null;
      return updatedState;
    }
    case FETCH_PART_GROUP_BY_QUERY:
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
