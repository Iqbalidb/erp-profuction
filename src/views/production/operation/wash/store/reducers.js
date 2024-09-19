/*
     Title: Reducers for WASH
     Description: Reducers for WASH
     Author: Iqbal Hossain
     Date: 12-February-2022
     Modified: 12-February-2022
*/

import {
  FETCH_NEXT_PRODUCTION_SUB_PROCESS_BY_CURRENT_PROCESS_AND_STYLE,
  FETCH_SIZE_INFO_BY_PROCESS_STYLE_COLOR_AND_LINE_ID,
  FETCH_SIZE_INFO_BY_PROCESS_STYLE_COLOR_AND_LINE_ID_FOR_WASH_RECEIVE,
  FETCH_WASH,
  FETCH_WASH_BY_ID,
  FETCH_WASH_BY_MASTER_ID,
  FETCH_WASH_BY_QUERY,
  FETCH_WASH_BY_RANGE,
  FETCH_WASH_PASSED_ITEM_BY_PROCESS_ID,
  FETCH_WASH_RECEIVE_BY_MASTER_ID,
  FETCH_WASH_RECEIVE_ITEM_BY_PROCESS_ID,
  FETCH_WASH_SEND_ITEM_BY_PROCESS_ID,
  LOADING_WASH_ITEM,
  RESET_WASHING_STATE
} from './actionType';

const initialState = {
  items: [],
  queryData: [],
  total: 1,
  params: {},
  selectedItem: null,
  sizeDetailsForWash: [],
  washSendItems: [],
  washPassedItems: [],
  washReceiveItems: [],
  loading: false,
  selectedWashItemByMasterId: [],
  selectedWashReceiveItemByMasterId: [],
  sizeDetailsForWashReceive: [],
  nextProductionSubProcessDropDownItems: []
};

export const washReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING_WASH_ITEM: {
      const { loading } = payload;
      return {
        ...state,
        loading
      };
    }
    case FETCH_WASH:
      return { ...state, items: payload };
    case FETCH_WASH_BY_ID:
      return { ...state, selectedItem: payload.selectedItem };
    case FETCH_WASH_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: payload.params
      };
    case FETCH_WASH_SEND_ITEM_BY_PROCESS_ID: {
      const { washSendItems, totalRecords, params } = payload;
      return {
        ...state,
        washSendItems,
        total: totalRecords,
        params
      };
    }
    case FETCH_WASH_PASSED_ITEM_BY_PROCESS_ID: {
      const { washPassedItems, totalRecords, params } = payload;
      return {
        ...state,
        washPassedItems,
        total: totalRecords,
        params
      };
    }
    case FETCH_WASH_RECEIVE_ITEM_BY_PROCESS_ID: {
      const { washReceiveItems, totalRecords, params } = payload;
      return {
        ...state,
        washReceiveItems,
        total: totalRecords,
        params
      };
    }
    case FETCH_WASH_BY_MASTER_ID: {
      const { selectedWashItemByMasterId } = payload;
      return {
        ...state,
        selectedWashItemByMasterId
      };
    }
    case FETCH_WASH_RECEIVE_BY_MASTER_ID: {
      const { selectedWashReceiveItemByMasterId } = payload;
      return {
        ...state,
        selectedWashReceiveItemByMasterId
      };
    }
    case FETCH_WASH_BY_RANGE:
      return { ...state, items: payload };
    case FETCH_SIZE_INFO_BY_PROCESS_STYLE_COLOR_AND_LINE_ID: {
      const { sizeDetailsForWash } = payload;
      return {
        ...state,
        sizeDetailsForWash
      };
    }
    case FETCH_SIZE_INFO_BY_PROCESS_STYLE_COLOR_AND_LINE_ID_FOR_WASH_RECEIVE: {
      const { sizeDetailsForWashReceive } = payload;
      return {
        ...state,
        sizeDetailsForWashReceive
      };
    }
    case FETCH_NEXT_PRODUCTION_SUB_PROCESS_BY_CURRENT_PROCESS_AND_STYLE: {
      const { nextProductionSubProcessDropDownItems } = payload;
      return {
        ...state,
        nextProductionSubProcessDropDownItems
      };
    }
    case RESET_WASHING_STATE: {
      return {
        ...state,
        washSendItems: []
      };
    }
    default:
      return state;
  }
};

/** Change Log
 * 12-Feb-2022(Iqbal):Add FETCH_WASH_BY_QUERY, FETCH_WASH_BY_ID, FETCH_WASH_BY_RANGE
 */
