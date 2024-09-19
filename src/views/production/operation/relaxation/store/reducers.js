import { FETCH_REQUISITION_BY_QUERY } from '../../requisition/store/actionType';
import { FETCH_RELAXATION_BY_MASTER_ID, LOADING, RESET_RELAXATION } from './actionType';

/*
     Title: Relaxation Reducer
     Description: Relaxation Reducer
     Author: Alamgir Kabir
     Date: 16-May-2023
     Modified: 16-May-2023
*/
const initialState = {
  loading: false,
  items: [],
  relaxationItems: [],
  total: 1,
  params: {},
  selectedItem: null,
  selectedRelaxationItem: []
};

export const relaxationReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return {
        ...state,
        loading: payload
      };
    }

    case FETCH_REQUISITION_BY_QUERY: {
      const { items, totalRecords } = payload;
      return {
        ...state,
        items,
        total: totalRecords,
        params: payload.params
      };
    }

    case FETCH_RELAXATION_BY_MASTER_ID: {
      const { selectedRelaxationItem } = payload;
      return {
        ...state,
        selectedRelaxationItem
      };
    }
    case RESET_RELAXATION: {
      return {
        ...state,
        selectedRelaxationItem: []
      };
    }

    default:
      return state;
  }
};
