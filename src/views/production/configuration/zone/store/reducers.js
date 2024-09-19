/*
     Title: Reducers for ZONE
     Description: Reducers for ZONE
     Author: Iqbal Hossain
     Date: 09-January-2022
     Modified: 09-January-2022
*/

import { mapArrayToDropdown } from 'utility/commonHelper';
import {
  ADD_ZONE,
  DELETE_ZONE,
  DELETE_ZONE_BY_RANGE,
  FETCH_ZONE,
  FETCH_ZONE_BY_ID,
  FETCH_ZONE_BY_QUERY,
  FILL_ZONE_BY_DDL,
  FILL_ZONE_BY_FLOOR_ID_AND_PRODUCTION_PROCESS_ID,
  LOADING,
  TOGGLE_ZONE_SIDEBAR,
  UPDATE_ZONE
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
  zoneDdlItemWithFloorAndProductionProcess: []
};

export const zoneReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return { ...state, loading: payload };
    }
    case FETCH_ZONE:
      return { ...state, items: payload };

    case FETCH_ZONE_BY_ID: {
      return { ...state, selectedItem: payload, isOpenSidebar: true };
    }
    case FETCH_ZONE_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: action.params
      };
    case TOGGLE_ZONE_SIDEBAR: {
      const _updatedState = { ...state, isOpenSidebar: payload };
      if ( !payload ) _updatedState.selectedItem = null;
      return _updatedState;
      // return { ...state, isOpenSidebar: payload };
    }
    case ADD_ZONE:
      return { ...state, total: state.total + 1 };
    case UPDATE_ZONE:
      return { ...state, total: state.total + 1 };
    case DELETE_ZONE:
      return { ...state, items: payload };
    case DELETE_ZONE_BY_RANGE:
      return { ...state, items: payload };

    case FILL_ZONE_BY_DDL: {
      const zoneddl = mapArrayToDropdown( payload, 'name', 'id' );
      return { ...state, dropDownItems: [...zoneddl] };
    }

    case FILL_ZONE_BY_FLOOR_ID_AND_PRODUCTION_PROCESS_ID: {
      const { zoneDdlItemWithFloorAndProductionProcess } = payload;
      return {
        ...state,
        zoneDdlItemWithFloorAndProductionProcess
      };
    }
    default:
      return state;
  }
};

/** Change Log
 * 09-Jan-2022(Iqbal):Add TOGGLE_ZONE_SIDEBAR, FETCH_ZONE_BY_QUERY, ADD_ZONE, DELETE_ZONE, FETCH_ZONE_BY_ID, UPDATE_ZONE, DELETE_ZONE_BY_RANGE
 * 17-Feb-2022(Alamgir):Modify  FETCH_ZONE_BY_ID and FETCH_ZONE_BY_ID
 */
