/*
     Title: Reducer for Production Process Group
     Description: Reducer for Production Process Group
     Author: Alamgir Kabir
     Date: 28-March-2022
     Modified: 28-March-2022
*/
import { mapArrayToDropdown } from 'utility/commonHelper';
import {
  FETCH_PRODUCTION_PROCESS_GROUP_BY_ID,
  FETCH_PRODUCTION_PROCESS_GROUP_BY_QUERY,
  FILL_PRODUCTION_PROCESS_GROUP_DDL,
  LOADING
} from './actionTypes';

const initialState = {
  loading: false,
  items: [],
  total: 0,
  selectedItem: null,
  dropDownItems: []
};

export const productionProcessGroupReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case FETCH_PRODUCTION_PROCESS_GROUP_BY_QUERY: {
      return { ...state, items: payload.items, total: payload.totalRecords, params: action.params };
    }
    case FETCH_PRODUCTION_PROCESS_GROUP_BY_ID: {
      return { ...state, selectedItem: payload };
    }
    case FILL_PRODUCTION_PROCESS_GROUP_DDL: {
      const productionProcessGroupDdl = mapArrayToDropdown( payload, 'groupName', 'id' );
      return {
        ...state,
        dropDownItems: [...productionProcessGroupDdl]
      };
    }
    default:
      return state;
  }
};
