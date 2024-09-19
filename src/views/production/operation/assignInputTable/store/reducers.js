/*
     Title: Reducers for ASSIGN_INPUT_TABLE
     Description: Reducers for ASSIGN_INPUT_TABLE
     Author: Iqbal Hossain
     Date: 26-January-2022
     Modified: 26-January-2022
*/

import {
  ASSIGN_INPUT_TABLE_PENDING_MODAL_OPEN,
  FETCH_ASSIGN_INPUT_FOR_ASSIGNED,
  FETCH_ASSIGN_INPUT_FOR_PENDING,
  FETCH_ASSIGN_INPUT_TABLE,
  FETCH_ASSIGN_INPUT_TABLE_BY_ID,
  FETCH_ASSIGN_INPUT_TABLE_BY_QUERY,
  FETCH_ASSIGN_INPUT_TABLE_BY_RANGE,
  FETCH_PRODUCTION_SUB_PROCESS_FOR_ASSIGN_INPUT_TABLE,
  LOADING,
  RESET_ASSIGN_INPUT_TABLE_STATE,
  SELECTED_ASSIGN_INPUT_BUNDLE
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 1,
  params: {},
  selectedItem: null,
  productionSubProcessDropdownItems: [],
  assignInputTablePendingItems: [],
  assignInputTableAssignedItems: [],
  isOpenAssignInputPendingModal: false,
  selecRowData: [],
};

export const assignInputTableReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return {
        ...state,
        loading: payload
      };
    }
    case FETCH_ASSIGN_INPUT_TABLE:
      return { ...state, items: payload };
    case FETCH_ASSIGN_INPUT_TABLE_BY_ID:
      return { ...state, selectedItem: payload.selectedItem };
    case FETCH_ASSIGN_INPUT_TABLE_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: payload.params
      };

    case FETCH_PRODUCTION_SUB_PROCESS_FOR_ASSIGN_INPUT_TABLE: {
      const { productionSubProcessDropdownItems } = payload;
      return {
        ...state,
        productionSubProcessDropdownItems
      };
    }

    case FETCH_ASSIGN_INPUT_FOR_PENDING: {
      const { assignInputTablePendingItems, totalRecords } = payload;
      return {
        ...state,
        assignInputTablePendingItems,
        total: totalRecords,
        params: action.params
      };
    }
    case FETCH_ASSIGN_INPUT_FOR_ASSIGNED: {
      const { assignInputTableAssignedItems, totalRecords } = payload;
      return {
        ...state,
        assignInputTableAssignedItems,
        total: totalRecords,
        params: action.params
      };
    }

    case ASSIGN_INPUT_TABLE_PENDING_MODAL_OPEN: {
      return {
        ...state,
        isOpenAssignInputPendingModal: !state.isOpenAssignInputPendingModal
      };
    }
    case SELECTED_ASSIGN_INPUT_BUNDLE: {
      const { selectedRow } = payload;
      return {
        ...state,
        selecRowData: selectedRow
      };
    }

    case RESET_ASSIGN_INPUT_TABLE_STATE: {
      return {
        ...state,
        selectedItem: null,
        selecRowData: []
      };
    }
    case FETCH_ASSIGN_INPUT_TABLE_BY_RANGE:
      return { ...state, items: payload };
    default:
      return state;
  }
};

/** Change Log
 * 26-Jan-2022(Iqbal): Add FETCH_ASSIGN_INPUT_TABLE_BY_QUERY,FETCH_ASSIGN_INPUT_TABLE_BY_ID, FETCH_ASSIGN_INPUT_TABLE_BY_RANGE
 */
