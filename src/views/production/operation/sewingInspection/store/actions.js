/*
     Title: Actions for SEWING_INSPECTION
     Description: Actions for SEWING_INSPECTION
     Author: Iqbal Hossain
     Date: 29-January-2022
     Modified: 29-January-2022
*/

import { dataProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { ASSIGN_TARGET_API, LINE_API, SEWING_INSPECTION_API, STYLE_USE_INFO_API } from 'services/api-end-points/production/v1';
import { BUYER_INFO_API } from 'services/api-end-points/production/v1/buyerInfo';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import {
  FETCH_ASSIGN_TARGET_BY_LINE_ID_AND_ASSIGN_DATE,
  FETCH_LINE_DETAILS_FOR_SEWING_INSPECTION,
  FETCH_PREVIOUS_SEWING_INSPECTION,
  FETCH_SEWING_INSPECTION,
  FETCH_SEWING_INSPECTION_BY_MASTER_ID,
  FETCH_SEWING_INSPECTION_BY_QUERY,
  FETCH_TODAYS_SEWING_INSPECTION,
  FILL_BUYER_DDL_BY_LINE_ID,
  FILL_STYLE_DDL_BY_LINE_AND_BUYER_ID,
  LOADING,
  RESET_SEWING_INSPECTION_DETAILS_DATA,
  RESET_SEWING_INSPECTION_STATE
} from './actionType';

/**
 * Get All Sewing Items
 */
export const fetchSewingInspection = () => async dispatch => {
  const response = await baseAxios.get( `${SEWING_INSPECTION_API.fetch_all}` );
  dispatch( {
    type: FETCH_SEWING_INSPECTION,
    payload: response.data
  } );
};

//Get Buyer Ddl by line id
export const fillBuyerDdlByLineId = lineId => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( BUYER_INFO_API.fetch_buyer_by_line_id( lineId ) );
      const buyerDdlByLineId = mapArrayToDropdown( res.data.data, 'buyerName', 'buyerId' );
      dispatch( {
        type: FILL_BUYER_DDL_BY_LINE_ID,
        payload: { buyerDdlByLineId }
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};
//Get Style Ddl by line and buyer id
export const fillStyleDdlByLineAndBuyerId = ( lineId, buyerId ) => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( STYLE_USE_INFO_API.fetch_style_use_info_by_line_and_buyer_id( lineId, buyerId ) );
      const styleDdlByLineAndBuyerId = mapArrayToDropdown( res.data.data, 'styleNo', 'styleId' );
      dispatch( {
        type: FILL_STYLE_DDL_BY_LINE_AND_BUYER_ID,
        payload: { styleDdlByLineAndBuyerId }
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Fetch line details for sewing inspection list
export const fetchLindDetailsForSewingInspection = ( floorId, productionProcessId ) => {
  return async dispatch => {
    const response = await baseAxios.get( `${LINE_API.fetch_line_by_floor_and_production_process_id( floorId, productionProcessId )}` );
    const lineDetails = mapArrayToDropdown( response.data.data, 'name', 'id' );
    dispatch( {
      type: FETCH_LINE_DETAILS_FOR_SEWING_INSPECTION,
      payload: {
        lineDetailsForSewingInspection: lineDetails
      }
    } );
  };
};

//Fetch Assign Target By Line And Assign Date
export const fetchAssignTargetByLineIdAndAssignDate = ( lineId, assignDate ) => {
  return async dispatch => {
    try {
      const response = await baseAxios.get( `${ASSIGN_TARGET_API.fetch_assign_target_by_line_id_and_assign_date}/${lineId}/Date/${assignDate}` );
      if ( response.data.data ) {
        dispatch( {
          type: FETCH_ASSIGN_TARGET_BY_LINE_ID_AND_ASSIGN_DATE,
          payload: {
            assignTargetDetails: response.data.data
          }
        } );
      }
    } catch ( error ) {
      dispatch( {
        type: FETCH_ASSIGN_TARGET_BY_LINE_ID_AND_ASSIGN_DATE,
        payload: {
          assignTargetDetails: []
        }
      } );
      notify( 'warning', 'Target was not assign in selected date!!!' );
    }
  };
};

//Reset Sewing Inspection State
export const resetSewingInspectionState = () => {
  return ( dispatch ) => {
    dispatch( {
      type: RESET_SEWING_INSPECTION_STATE
    } );
  };
};

//Get Data by Query
export const fetchSewingInspectionsByQuery = params => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${SEWING_INSPECTION_API.fetch_by_query}`, params );
      dispatch( {
        type: FETCH_SEWING_INSPECTION_BY_QUERY,
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
//Get Data by Query
export const fetchTodaysSewingInspection = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );

    try {
      const res = await baseAxios.get( `${SEWING_INSPECTION_API.fetch_todays( true )}`, { params } );
      dispatch( {
        type: FETCH_TODAYS_SEWING_INSPECTION,
        payload: {
          todaysSewingInspection: res.data.data,
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
//Get Data by Query
export const fetchPreviousSewingInspection = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );

    try {
      const res = await baseAxios.get( `${SEWING_INSPECTION_API.fetch_previous( false )}`, { params } );
      dispatch( {
        type: FETCH_PREVIOUS_SEWING_INSPECTION,
        payload: {
          previousSewingInspection: res.data.data,
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
//Get Data by Query
export const fetchSewingInspectionByMasterId = id => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );

    try {
      const res = await baseAxios.get( `${SEWING_INSPECTION_API.fetch_by_master_id}`, { params: { masterId: id } } );
      dispatch( {
        type: FETCH_SEWING_INSPECTION_BY_MASTER_ID,
        payload: {
          sewingInspectionDetails: res.data.data
        }
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }
  };
};

//Reset sewing inspection details data  RESET_SEWING_INSPECTION_DETAILS_DATA
export const resetSewingInspectionDetails = () => {
  return async dispatch => {
    dispatch( {
      type: RESET_SEWING_INSPECTION_DETAILS_DATA,
      payload: {
        sewingInspectionDetails: []
      }
    } );
  };
};

/** Change Log
 * 29-Jan-2022(Iqbal): Create Function/Method fetchCutPlan, fetchCutPlansByQuery
 * 05-nov-2022(Ashraful): Created Function/Method resetSewingInspectionDetails
 */
