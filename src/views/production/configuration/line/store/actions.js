/*
     Title: Actions for Line
     Description: Actions for Line
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 06-January-2022
*/

import { dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { LINE_API } from 'services/api-end-points/production/v1';
import { CRITICAL_PROCESS_LINES_API } from 'services/api-end-points/production/v1/criticalProcessInLines';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import { errorResponse } from 'utility/Utils';
import { fillCriticalProcessDdl } from '../../criticalProcess/store/actions';
import {
  ADD_LINE,
  CLOSE_CRITICAL_PROCESS_MANAGE_MODAL,
  DELETE_LINE,
  DELETE_LINE_BY_RANGE,
  FETCH_CRITICAL_PROCESS_IN_LINES_BY_LINE_ID,
  FETCH_LINE,
  FETCH_LINE_BY_ID,
  FETCH_LINE_BY_QUERY,
  FILL_LINE_BY_DDL,
  FILL_LINE_DDL_BY_ZONE_GROUP_ID,
  LOADING,
  OPEN_CRITICAL_PROCESS_MANAGE_MODAL,
  RESET_CRITICAL_PROCESS_STATE,
  TOGGLE_LINE_SIDEBAR,
  UPDATE_LINE
} from './actionType';
//Open Sidebar
export const toggleLineSidebar = condition => dispatch => {
  dispatch( {
    type: TOGGLE_LINE_SIDEBAR,
    payload: condition
  } );
};
/**
 * Get Line
 */
export const fetchLine = () => async dispatch => {
  const response = await baseAxios.get( `${LINE_API.fetch_all}` );
  dispatch( {
    type: FETCH_LINE,
    payload: response.data
  } );
};

//Get Data by Query
export const fetchLinesByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      await sleep( 2000 );
      const res = await baseAxios.get( LINE_API.fetch_by_query, { params } );
      dispatch( {
        type: FETCH_LINE_BY_QUERY,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

/**
 * Get Line by Id
 */
export const fetchLineById = id => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( LINE_API.fetch_by_id, { params: { id } } );
      dispatch( {
        type: FETCH_LINE_BY_ID,
        payload: res.data.data
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }
  };
};
//Get All Without Query
export const fillLineDdl = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( LINE_API.fetch_all_active );
      dispatch( {
        type: FILL_LINE_BY_DDL,
        payload: res.data.data
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};
//Get Line Ddl By Zone Group
export const fillLineDdlByZoneGroupId = zoneGroupId => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( LINE_API.fetch_line_by_zone_group_id( zoneGroupId ) );
      const lineDdlWithByZoneGroup = mapArrayToDropdown( res.data.data, 'name', 'id' );
      dispatch( {
        type: FILL_LINE_DDL_BY_ZONE_GROUP_ID,
        payload: { lineDdlWithByZoneGroup }
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Add new
export const addLine = ( data, params ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().lineReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      const res = await baseAxios.post( `${LINE_API.add}`, data );
      dispatch( {
        type: ADD_LINE,
        payload: data
      } );
      notify( 'success', res.data.message );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleLineSidebar( !isOpenSidebar ) );
      dispatch( fetchLinesByQuery( params ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Update
export const updateLine = ( data, paramsData ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().lineReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      const res = await baseAxios.put( LINE_API.update, data, { params: { id: data.id } } );
      dispatch( {
        type: UPDATE_LINE,
        payload: res.data.data
      } );
      notify( 'success', 'Line has been updated successfully!!!' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleLineSidebar( !isOpenSidebar ) );
      dispatch( fetchLinesByQuery( paramsData ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Delete
export const deleteLine = id => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${LINE_API.delete}`, { id } );
        dispatch( {
          type: DELETE_LINE,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please tyr again' );
      }
    }
  };
};

//Delete by Range
export const deleteLineByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${LINE_API.delete_by_range}`, { ids } );
        dispatch( {
          type: DELETE_LINE_BY_RANGE,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please tyr again' );
      }
    }
  };
};

//Fetch Critical Process In Lines By Line ID
export const fetchCriticalProcessInLinesByLineId = lineId => {
  return async dispatch => {
    if ( lineId ) {
      dispatch( dataProgressCM( true ) );
      try {
        const res = await baseAxios.get( CRITICAL_PROCESS_LINES_API.fetch_by_line( lineId ) );
        dispatch( {
          type: FETCH_CRITICAL_PROCESS_IN_LINES_BY_LINE_ID,
          payload: { loadCriticalProcessInLinesData: res.data.data }
        } );
        dispatch( dataProgressCM( false ) );

      } catch ( error ) {
        errorResponse( error );
        dispatch( dataProgressCM( false ) );
      }
    }
  };
};

//Manage Critical Process Modal Open openCriticalProcessManageModal
export const openCriticalProcessManageModal = line => {
  return dispatch => {
    dispatch( {
      type: OPEN_CRITICAL_PROCESS_MANAGE_MODAL,
      payload: line
    } );
    dispatch( fillCriticalProcessDdl() );
    dispatch( fetchCriticalProcessInLinesByLineId( line.id ) );
  };
};

//Critical Modal Close
export const closeCriticalProcessManageModal = () => {
  return dispatch => {
    dispatch( {
      type: CLOSE_CRITICAL_PROCESS_MANAGE_MODAL
    } );
  };
};
//Critical Modal Close
export const resetCriticalProcessState = () => {
  return dispatch => {
    dispatch( {
      type: RESET_CRITICAL_PROCESS_STATE
    } );
  };
};


/** Change Log
 * 08-Jan-2022(Iqbal): Create Function/Method deleteLineByRange, deleteLine, updateLine, addLine, fetchLinesByQuery, fetchLineById
 * 16-Feb-2022(Alamgir):Modify addLine, updateLine and fetchLineById
 * 24-Oct-2022(Ashraful Islam) : Added toggleCriticalProcessManageModal, fetchCriticalProcessInLinesByLineId
 */
