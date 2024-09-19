/**
 * Title: Action Creator for Critical Process
 * Description: Action Creator for Critical Process
 * Author: Nasir Ahmed
 * Date: 10-January-2022
 * Modified: 10-January-2022
 **/

import { dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { CRITICAL_PROCESS_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import { errorResponse } from 'utility/Utils';
import {
  DELETE_CRITICAL_PROCESS,
  DELETE_CRITICAL_PROCESS_BY_RANGE,
  FETCH_CRITICAL_PROCESS_BY_ID,
  FETCH_CRITICAL_PROCESS_BY_QUERY,
  FILL_CRITICAL_PROCESS_DDL,
  LOADING,
  RESET_CRITICAL_PROCESS_DDL,
  TOGGLE_CRITICAL_PROCESS_SIDEBAR
} from './actionType';

//Toggle Sidebar
export const toggleCritcalProcessSidebar = condition => dispatch => {
  dispatch( {
    type: TOGGLE_CRITICAL_PROCESS_SIDEBAR,
    payload: condition
  } );
};

//Get Data by Query
export const fetchCriticalProcessByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );

      const res = await baseAxios.get( CRITICAL_PROCESS_API.fetch_by_query, { params } );
      dispatch( {
        type: FETCH_CRITICAL_PROCESS_BY_QUERY,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      await sleep( 500 );
      dispatch( { type: LOADING, payload: false } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Get by id
export const fetchCriticalProcessById = id => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( `${CRITICAL_PROCESS_API.fetch_by_id}`, { params: { id } } );
      dispatch( {
        type: FETCH_CRITICAL_PROCESS_BY_ID,
        payload: res ? res.data.data : null
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( err ) {
      errorResponse( err );
      dispatch( dataProgressCM( false ) );
    }
  };
};

//Add new
export const addCriticalProcess = ( data, params ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().criticalProcessReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.post( `${CRITICAL_PROCESS_API.add}`, data );
      notify( 'success', 'Critical process has been added' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleCritcalProcessSidebar( !isOpenSidebar ) );
      dispatch( fetchCriticalProcessByQuery( params ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Update
export const updateCriticalProcess = ( data, params ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().criticalProcessReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.put( `${CRITICAL_PROCESS_API.update}`, data, { params: { id: data.id } } );
      notify( 'success', 'Critical process has been updated Successfully!!' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleCritcalProcessSidebar( !isOpenSidebar ) );
      dispatch( fetchCriticalProcessByQuery( params ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Delete
export const deleteCriticalProcess = id => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${CRITICAL_PROCESS_API.delete}`, { id } );
        dispatch( {
          type: DELETE_CRITICAL_PROCESS,
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
export const deleteCriticalProcessByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${CRITICAL_PROCESS_API.delete_by_range}`, { ids } );
        dispatch( {
          type: DELETE_CRITICAL_PROCESS_BY_RANGE,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please tyr again' );
      }
    }
  };
};

//Fill Critical Process Dropdown
export const fillCriticalProcessDdl = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( CRITICAL_PROCESS_API.fetch_all_active );
      dispatch( {
        type: FILL_CRITICAL_PROCESS_DDL,
        payload: res.data.data
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Reset Critical Process Dropdown
export const resetCriticalProcessDdl = () => {
  return async dispatch => {
    dispatch( {
      type: RESET_CRITICAL_PROCESS_DDL,
      payload: []
    } );
  };
};


/** Change Log
 * 12-Jan-2022: add toggleCritcalProcessStatus for status change
 * 24-Oct-2022(Ashraful Islam): Added fillCriticalProcessDdl,
 */
