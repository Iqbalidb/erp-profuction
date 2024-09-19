/*
     Title: Reducers for FLOOR
     Description: Reducers for FLOOR
     Author: Alamgir Kabir
     Date: 14-February-2022
     Modified: 14-February-2022
*/
import { FETCH_FLOOR_BY_ID, FETCH_FLOOR_BY_QUERY, FILL_FLOOR_DDL, LOADING, TOGGLE_FLOOR_SIDEBAR } from './actionType';

const initialState = {
  loading: false,
  items: [],
  total: 0,
  params: {},
  isOpenSidebar: false,
  selectedFloor: null,
  dropDownItems: []
};
export const floorReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case FETCH_FLOOR_BY_QUERY: {
      return { ...state, items: payload.items, total: payload.total, params: action.params };
    }
    case FETCH_FLOOR_BY_ID: {
      return { ...state, selectedFloor: payload, isOpenSidebar: true };
    }
    case FILL_FLOOR_DDL: {
      const { floorDdl } = payload;
      return { ...state, dropDownItems: floorDdl };
    }
    case TOGGLE_FLOOR_SIDEBAR: {
      const _updatedState = { ...state, isOpenSidebar: payload };
      if ( !payload ) _updatedState.selectedFloor = null;
      return _updatedState;
    }
    default:
      return state;
  }
};
/** Change Log

 * 16-February-2022(Alamgir):Add FILL_FLOOR_DDL
 */
