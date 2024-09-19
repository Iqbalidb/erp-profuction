import {
  FETCH_BUYER_BY_PRODUCTION_PROCESS_ID,
  FETCH_FINISHING_BY_PRODUCTION_SUB_PROCESS_ID,
  FETCH_FINISHING_DETAILS_BY_MASTER_ID,
  FETCH_FINISHING_PASSED_BY_PRODUCTION_SUB_PROCESS_ID,
  FETCH_OPERATOR_BY_PRODUCTION_PROCESS_ID,
  FETCH_PRODUCTION_SUB_PROCESS_BY_PARENT_PROCESS_ID_AND_STATUS,
  FETCH_STYLE_BY_PRODUCTION_PROCESS_ID_AND_BUYER_ID,
  LOADING_FINISHING,
  RESET_FINISHING_STATE
} from './actionType';

/*
   Title: Reducers
   Description: Reducers
   Author: Iqbal Hossain
   Date: 05-January-2022
   Modified: 05-January-2022
*/
const initialState = {
  loading: false,
  productionSubProcessDdl: [],
  operatorDdl: [],
  styleDdl: [],
  buyerDdl: [],
  finishingItems: [],
  finishingPassedItems: [],
  total: 0,
  selectedItems: []
};
export const finishingReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING_FINISHING: {
      const { loading } = payload;
      return {
        ...state,
        loading
      };
    }
    case FETCH_PRODUCTION_SUB_PROCESS_BY_PARENT_PROCESS_ID_AND_STATUS: {
      const { productionSubProcessDdl } = payload;
      return {
        ...state,
        productionSubProcessDdl
      };
    }
    case FETCH_OPERATOR_BY_PRODUCTION_PROCESS_ID: {
      const { operatorDdl } = payload;
      return {
        ...state,
        operatorDdl
      };
    }
    case FETCH_BUYER_BY_PRODUCTION_PROCESS_ID: {
      const { buyerDdl } = payload;
      return {
        ...state,
        buyerDdl
      };
    }
    case FETCH_STYLE_BY_PRODUCTION_PROCESS_ID_AND_BUYER_ID: {
      const { styleDdl } = payload;
      return {
        ...state,
        styleDdl
      };
    }
    case FETCH_FINISHING_BY_PRODUCTION_SUB_PROCESS_ID: {
      const { finishingItems, totalRecords } = payload;
      return {
        ...state,
        finishingItems,
        total: totalRecords
      };
    }
    case FETCH_FINISHING_PASSED_BY_PRODUCTION_SUB_PROCESS_ID: {
      const { finishingPassedItems, totalRecords } = payload;
      return {
        ...state,
        finishingPassedItems,
        total: totalRecords
      };
    }
    case FETCH_FINISHING_DETAILS_BY_MASTER_ID: {
      const { selectedItems } = payload;
      return {
        ...state,
        selectedItems
      };
    }
    case RESET_FINISHING_STATE: {
      return {
        ...state,
        selectedItems: [],
        finishingItems: [],
        finishingPassedItems: [],
        operatorDdl: []
      };
    }

    default:
      return state;
  }
};
