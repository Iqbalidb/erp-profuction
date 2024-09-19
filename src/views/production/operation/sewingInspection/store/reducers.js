/*
     Title: Reducers for SEWING_INSPECTION
     Description: Reducers for SEWING_INSPECTION
     Author: Iqbal Hossain
     Date: 29-January-2022
     Modified: 29-January-2022
*/

import {
  FETCH_ASSIGN_TARGET_BY_LINE_ID_AND_ASSIGN_DATE,
  FETCH_LINE_DETAILS_FOR_SEWING_INSPECTION,
  FETCH_PREVIOUS_SEWING_INSPECTION,
  FETCH_SEWING_INSPECTION,
  FETCH_SEWING_INSPECTION_BY_ID,
  FETCH_SEWING_INSPECTION_BY_MASTER_ID,
  FETCH_SEWING_INSPECTION_BY_QUERY,
  FETCH_TODAYS_SEWING_INSPECTION,
  FILL_BUYER_DDL_BY_LINE_ID,
  FILL_STYLE_DDL_BY_LINE_AND_BUYER_ID,
  LOADING,
  RESET_SEWING_INSPECTION_DETAILS_DATA,
  RESET_SEWING_INSPECTION_STATE
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 1,
  params: {},
  selectedItem: null,
  lineDetailsForSewingInspection: [],
  assignTargetDetails: [],
  buyerDdlByLineId: [],
  styleDdlByLineAndBuyerId: [],
  todaysSewingInspection: [],
  previousSewingInspection: [],
  sewingInspectionDetails: []
};

export const sewingInspectionReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return {
        ...state,
        loading: payload
      };
    }
    case FETCH_SEWING_INSPECTION:
      return { ...state, items: payload };
    case FETCH_SEWING_INSPECTION_BY_ID:
      return { ...state, selectedItem: payload.selectedItem };
    case FETCH_SEWING_INSPECTION_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: payload.params
      };
    case FETCH_TODAYS_SEWING_INSPECTION: {
      const { todaysSewingInspection, totalRecords } = payload;
      return {
        ...state,
        todaysSewingInspection,
        total: totalRecords,
        params: payload.params
      };
    }
    case FETCH_PREVIOUS_SEWING_INSPECTION: {
      const { previousSewingInspection, totalRecords } = payload;
      return {
        ...state,
        previousSewingInspection,
        total: totalRecords,
        params: payload.params
      };
    }
    case FETCH_SEWING_INSPECTION_BY_MASTER_ID: {
      const { sewingInspectionDetails } = payload;
      return {
        ...state,
        sewingInspectionDetails
      };
    }

    case RESET_SEWING_INSPECTION_DETAILS_DATA: {
      const { sewingInspectionDetails } = payload;
      return {
        ...state,
        sewingInspectionDetails
      };
    }
    case FETCH_LINE_DETAILS_FOR_SEWING_INSPECTION: {
      const { lineDetailsForSewingInspection } = payload;
      return {
        ...state,
        lineDetailsForSewingInspection
      };
    }
    case FETCH_ASSIGN_TARGET_BY_LINE_ID_AND_ASSIGN_DATE: {
      const { assignTargetDetails } = payload;
      return {
        ...state,
        assignTargetDetails
      };
    }
    case FILL_BUYER_DDL_BY_LINE_ID: {
      const { buyerDdlByLineId } = payload;
      return {
        ...state,
        buyerDdlByLineId
      };
    }
    case FILL_STYLE_DDL_BY_LINE_AND_BUYER_ID: {
      const { styleDdlByLineAndBuyerId } = payload;
      return {
        ...state,
        styleDdlByLineAndBuyerId
      };
    }
    case RESET_SEWING_INSPECTION_STATE: {
      return {
        ...state,
        assignTargetDetails: [],
        lineDetailsForSewingInspection: []
      };
    }
    default:
      return state;
  }
};

/** Change Log
 * 29-Jan-2022(Iqbal):Add TOGGLE_SEWING_INSPECTION_SIDEBAR, FETCH_SEWING_INSPECTION_BY_QUERY, FETCH_SEWING_INSPECTION_BY_ID,
 * 05-nov-2022(Ashraful): Added RESET_SEWING_INSPECTION_DETAILS_DATA
 */
