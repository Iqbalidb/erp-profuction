/*
   Title: Reducers
   Description: Reducers
   Author: Iqbal Hossain
   Date: 05-January-2022
   Modified: 05-January-2022
*/

import {
  FETCH_COLOR_BY_LINE_AND_STYLE_ID,
  FETCH_PREVIOUS_SEWING_OUT,
  FETCH_SEWING_OUT_BY_MASTER_ID,
  FETCH_SIZE_INFO_BY_LINE_STYLE_AND_COLOR_ID,
  FETCH_TODAYS_SEWING_OUT,
  LOADING,
  RESET_SEWING_OUT_STATE
} from './actionType';

const initialState = {
  loading: false,
  items: [],
  queryData: [],
  total: 1,
  params: {},
  selectedItem: null,
  todaysSewingOut: [],
  previousSewingOut: [],
  colorDdl: [],
  sizeInfo: [],
  sewingOutDetails: []
};

export const sewingOutReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING: {
      return {
        ...state,
        loading: payload
      };
    }
    case FETCH_TODAYS_SEWING_OUT: {
      const { todaysSewingOut, totalRecords } = payload;
      return {
        ...state,
        todaysSewingOut,
        total: totalRecords,
        params: payload.params
      };
    }
    case FETCH_PREVIOUS_SEWING_OUT: {
      const { previousSewingOut, totalRecords } = payload;
      return {
        ...state,
        previousSewingOut,
        total: totalRecords,
        params: payload.params
      };
    }
    case FETCH_COLOR_BY_LINE_AND_STYLE_ID: {
      const { colorDdl } = payload;
      return {
        ...state,
        colorDdl
      };
    }
    case FETCH_SIZE_INFO_BY_LINE_STYLE_AND_COLOR_ID: {
      const { sizeInfo } = payload;
      return {
        ...state,
        sizeInfo
      };
    }
    case FETCH_SEWING_OUT_BY_MASTER_ID: {
      const { sewingOutDetails } = payload;
      return {
        ...state,
        sewingOutDetails
      };
    }
    case RESET_SEWING_OUT_STATE: {
      return {
        ...state,
        sizeInfo: []
      };
    }
    default:
      return state;
  }
};
