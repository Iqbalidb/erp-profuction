/*
     Title: Actions for WASH
     Description: Actions for WASH
     Author: Iqbal Hossain
     Date: 12-February-2022
     Modified: 12-February-2022
*/

import { createBrowserHistory } from 'history';
import { dataProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PRODUCTION_SUB_PROCESS_API, WASH_API } from 'services/api-end-points/production/v1';
import { SIZE_INFO_API } from 'services/api-end-points/production/v1/sizeInfo';
import { WASH_RECEIVE_API } from 'services/api-end-points/production/v1/washReceive';
import { mapArrayToDropdown } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import { errorResponse } from 'utility/Utils';
import {
  FETCH_NEXT_PRODUCTION_SUB_PROCESS_BY_CURRENT_PROCESS_AND_STYLE,
  FETCH_SIZE_INFO_BY_PROCESS_STYLE_COLOR_AND_LINE_ID,
  FETCH_SIZE_INFO_BY_PROCESS_STYLE_COLOR_AND_LINE_ID_FOR_WASH_RECEIVE,
  FETCH_WASH,
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

/**
 * Get All Wash Items
 */
export const fetchWash = () => async dispatch => {
  const response = await baseAxios.get( `${WASH_API.fetch_all}` );
  dispatch( {
    type: FETCH_WASH,
    payload: response.data
  } );
};

/**
 * Get Size By ProcessId,StyleId,ColorId and lineId
 */
export const fetchSizeInfoByProcessStyleColorAndLineId = ( processId, styleId, colorId, lineId ) => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );
    try {
      const response = await baseAxios.get(
        `${SIZE_INFO_API.fetch_size_wise_quantity_for_wash_by_process_style_color_and_line_id( processId, styleId, colorId, lineId )}`
      );
      dispatch( {
        type: FETCH_SIZE_INFO_BY_PROCESS_STYLE_COLOR_AND_LINE_ID,
        payload: {
          sizeDetailsForWash: response?.data?.data
        }
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }
  };
};
/**
 * Get Size By ProcessId,StyleId,ColorId and lineId For Wash Receive
 */
export const fetchSizeInfoByProcessStyleColorAndLineIdForWashReceive = ( processId, styleId, colorId, lineId ) => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );
    try {
      const response = await baseAxios.get(
        `${SIZE_INFO_API.fetch_size_wise_quantity_for_wash_receive_by_process_style_color_and_line_id( processId, styleId, colorId, lineId )}`
      );
      dispatch( {
        type: FETCH_SIZE_INFO_BY_PROCESS_STYLE_COLOR_AND_LINE_ID_FOR_WASH_RECEIVE,
        payload: {
          sizeDetailsForWashReceive: response?.data?.data
        }
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }

  };
};
/**
 * Get Next Production Sub Process By Current Process Id
 */
export const fetchNextProductionSubProcessByCurrentProcessAndStyle = ( currentProcessId, styleId, processType ) => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( PRODUCTION_SUB_PROCESS_API.fetch_next_process_by_current_process_and_style_id( currentProcessId, styleId ), {
        params: { processType }
      } );

      const nextProcessDdl = mapArrayToDropdown( res.data.data, 'name', 'id' );
      dispatch( {
        type: FETCH_NEXT_PRODUCTION_SUB_PROCESS_BY_CURRENT_PROCESS_AND_STYLE,
        payload: { nextProductionSubProcessDropDownItems: nextProcessDdl }
      } );
    } catch ( error ) {
      notify( 'error', error.message );
    }
  };
};
//Get Data by Query
export const fetchWashByQuery = params => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${WASH_API.fetch_by_query}`, params );
      dispatch( {
        type: FETCH_WASH_BY_QUERY,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};
/**
 * Get Wash By Master Id
 */
export const fetchWashByMasterId = masterId => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( `${WASH_API.fetch_by_master_id}`, { params: { masterId } } );
      dispatch( {
        type: FETCH_WASH_BY_MASTER_ID,
        payload: {
          selectedWashItemByMasterId: res.data.data
        }
      } );
      dispatch( dataProgressCM( false ) );
    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }
  };
};
/**
 * Get Selected Wash Received Details By Master Id
 */
export const fetchWashReceiveByMasterId = masterId => {
  return async dispatch => {
    const history = createBrowserHistory();
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( `${WASH_RECEIVE_API.fetch_wash_receive_by_master_id}`, { params: { masterId } } );
      dispatch( {
        type: FETCH_WASH_RECEIVE_BY_MASTER_ID,
        payload: {
          selectedWashReceiveItemByMasterId: res.data.data
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

/**
wash send items fetch by processId
 */
export const fetchWashSendItemByProcessId = params => {
  return async dispatch => {
    dispatch( {
      type: LOADING_WASH_ITEM,
      payload: {
        loading: true
      }
    } );
    try {
      const res = await baseAxios.get( `${WASH_API.fetch_send_wash_item_by_processid}`, { params } );
      dispatch( {
        type: FETCH_WASH_SEND_ITEM_BY_PROCESS_ID,
        payload: {
          washSendItems: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      dispatch( {
        type: LOADING_WASH_ITEM,
        payload: {
          loading: false
        }
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};
/**
wash Receive items fetch by processId
 */
export const fetchWashReceiveItemByProcessId = params => {
  return async dispatch => {
    dispatch( {
      type: LOADING_WASH_ITEM,
      payload: {
        loading: true
      }
    } );
    try {
      const res = await baseAxios.get( `${WASH_RECEIVE_API.fetch_receive_wash_item_by_processid}`, { params } );

      dispatch( {
        type: FETCH_WASH_RECEIVE_ITEM_BY_PROCESS_ID,
        payload: {
          washReceiveItems: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      dispatch( {
        type: LOADING_WASH_ITEM,
        payload: {
          loading: false
        }
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};
/**
 * Get Wash Passed Item By Process Id
 */
export const fetchWashPassedItemByProcessId = params => {
  return async dispatch => {
    dispatch( {
      type: LOADING_WASH_ITEM,
      payload: {
        loading: true
      }
    } );
    try {

      const res = await baseAxios.get( `${WASH_RECEIVE_API.fetch_receive_wash_item_by_processid}`, { params } );

      dispatch( {
        type: FETCH_WASH_PASSED_ITEM_BY_PROCESS_ID,
        payload: {
          washPassedItems: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      dispatch( {
        type: LOADING_WASH_ITEM,
        payload: {
          loading: false
        }
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Get by Range
export const fetchWashByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.get( `${WASH_API.get_by_range}`, { ids } );
        dispatch( {
          type: FETCH_WASH_BY_RANGE,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please tyr again' );
      }
    }
  };
};
//Reset Washing State
export const resetWashingState = () => {
  return dispatch => {
    dispatch( {
      type: RESET_WASHING_STATE
    } );
  };
};

/** Change Log
 * 12-Feb-2022(Iqbal): Create Function/Method fetchWASH, fetchWASHsByQuery
 */
