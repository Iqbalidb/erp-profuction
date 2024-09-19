import { createBrowserHistory } from 'history';
import { dataProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { COLOR_INFO_API } from 'services/api-end-points/production/v1/colorInfo';
import { SEWING_OUT_API } from 'services/api-end-points/production/v1/sewingOut';
import { SIZE_INFO_API } from 'services/api-end-points/production/v1/sizeInfo';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import {
  FETCH_COLOR_BY_LINE_AND_STYLE_ID,
  FETCH_PREVIOUS_SEWING_OUT,
  FETCH_SEWING_OUT_BY_MASTER_ID,
  FETCH_SIZE_INFO_BY_LINE_STYLE_AND_COLOR_ID,
  FETCH_TODAYS_SEWING_OUT,
  LOADING,
  RESET_SEWING_OUT_STATE
} from './actionType';

/*
   Title: Action
   Description: Action
   Author: Iqbal Hossain
   Date: 05-January-2022
   Modified: 05-January-2022
*/

/**
 * Get Todays Sewing Out Items
 */
export const fetchTodaysSewingOut = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    try {
      const res = await baseAxios.get( `${SEWING_OUT_API.fetch_todays( true )}`, { params } );
      dispatch( {
        type: FETCH_TODAYS_SEWING_OUT,
        payload: {
          todaysSewingOut: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      await sleep( 500 );
      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

/**
 * Get Previous Sewing Out Items
 */
export const fetchPreviousSewingOut = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    try {
      const res = await baseAxios.get( `${SEWING_OUT_API.fetch_previous( false )}`, { params } );
      dispatch( {
        type: FETCH_PREVIOUS_SEWING_OUT,
        payload: {
          previousSewingOut: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      await sleep( 500 );
      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

/**
 * Get Color Ddl by line id and style id
 */
export const fetchColorByLineAndStyleId = ( lineId, styleId ) => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${COLOR_INFO_API.fetch_color_by_line_and_style_id( lineId, styleId )}` );
      const colorDdl = mapArrayToDropdown( res.data.data, 'colorName', 'colorId' );
      dispatch( {
        type: FETCH_COLOR_BY_LINE_AND_STYLE_ID,
        payload: {
          colorDdl
        }
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};
//Fetch Size Info
export const fetchSizeInfo = ( lineId, styleId, colorId ) => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );

    try {
      const res = await baseAxios.get( `${SIZE_INFO_API.fetch_size_info_by_line_style_and_color_id( lineId, styleId, colorId )}` );
      dispatch( {
        type: FETCH_SIZE_INFO_BY_LINE_STYLE_AND_COLOR_ID,
        payload: {
          sizeInfo: res.data.data
        }
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }
  };
};
//Fetch Size Info
export const fetchSewingOutByMasterId = masterId => {
  return async dispatch => {
    const history = createBrowserHistory();
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( `${SEWING_OUT_API.fetch_by_masterId( masterId )}` );
      dispatch( {
        type: FETCH_SEWING_OUT_BY_MASTER_ID,
        payload: {
          sewingOutDetails: res.data.data
        }
      } );

      dispatch( dataProgressCM( false ) );
    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
      history.back();
    }
  };
};

export const resetSewingOutState = () => {
  return dispatch => {
    dispatch( {
      type: RESET_SEWING_OUT_STATE
    } );
  };
};
