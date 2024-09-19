/*
     Title: Requisition Reducer
     Description: Requisition Reducer
     Author: Alamgir Kabir
     Date: 04-May-2023
     Modified: 04-May-2023
*/

import { FETCH_REQUISITION_BY_MASTER_ID, FETCH_REQUISITION_BY_QUERY, LOADING } from './actionType';

const initialState = {
  loading: false,
  items: [],
  requisitionItems: [],
  total: 1,
  params: {},
  selectedItem: null,
  selectedRequisitionItem: []
};

export const requisitionReducer = ( state = initialState, action ) => {
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
    case FETCH_REQUISITION_BY_MASTER_ID: {
      const { selectedRequisitionItem } = payload;
      return {
        ...state,
        selectedRequisitionItem
      };
    }

    default:
      return state;
  }
};
