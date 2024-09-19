/*
     Title: Actions for ProductionProcess
     Description: Actions for ProductionProcess
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 06-January-2022
*/

import { dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PRODUCTION_PROCESS_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import { errorResponse } from 'utility/Utils';
import {
  DELETE_PRODUCTION_PROCESS,
  DELETE_PRODUCTION_PROCESS_BY_RANGE,
  FETCH_PRODUCTION_PROCESS,
  FETCH_PRODUCTION_PROCESS_BY_ID,
  FETCH_PRODUCTION_PROCESS_BY_QUERY,
  FILL_PRODUCTION_PROCESS_DDL,
  LOADING,
  TOGGLE_PRODUCTION_PROCESS_SIDEBAR,
  TOGGLE_PRODUCTION_PROCESS_STATUS
} from './actionType';
//Toggle Status
export const toggleProductionProcessStatus = status => dispatch => {
  dispatch( {
    type: TOGGLE_PRODUCTION_PROCESS_STATUS,
    payload: status
  } );
};

//Open Sidebar
export const toggleProductionProcessSidebar = condition => dispatch => {
  dispatch( {
    type: TOGGLE_PRODUCTION_PROCESS_SIDEBAR,
    payload: condition
  } );
};


/**
 * Get Production Process
 */
export const fetchProductionProcess = () => async dispatch => {
  const response = await baseAxios.get( PRODUCTION_PROCESS_API.fetch_by_query, {
    params: { page: 1, perPage: 200 }
  } );
  dispatch( {
    type: FETCH_PRODUCTION_PROCESS,
    payload: response.data
  } );
};

//Get Data by Query
export const fetchProductionProcessesByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      const res = await baseAxios.get( PRODUCTION_PROCESS_API.fetch_by_query, { params } );
      dispatch( {
        type: FETCH_PRODUCTION_PROCESS_BY_QUERY,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      await sleep( 2000 );

      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};

//Get by id
export const fetchProductionProcessById = id => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( PRODUCTION_PROCESS_API.fetch_by_id, { params: { id } } );
      dispatch( {
        type: FETCH_PRODUCTION_PROCESS_BY_ID,
        payload: res ? res.data.data : null
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }
  };
};

/// Get All Without Query
export const fillProductionProcessDdl = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( PRODUCTION_PROCESS_API.fetch_all_active );
      dispatch( {
        type: FILL_PRODUCTION_PROCESS_DDL,
        payload: res.data.data
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};

//Add new
export const addProductionProcess = ( data, { page, perPage } ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().productionProcessReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.post( PRODUCTION_PROCESS_API.add, data );
      notify( 'success', 'Production process has been added' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleProductionProcessSidebar( !isOpenSidebar ) );
      dispatch( fetchProductionProcessesByQuery( { page, perPage } ) );
      // dispatch( fillProductionProcessDdl() );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Update
export const updateProductionProcess = ( data, params ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().productionProcessReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.put( PRODUCTION_PROCESS_API.update, data, { params: { id: data.id } } );
      notify( 'success', 'Production process has been updated successfully!!!' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleProductionProcessSidebar( !isOpenSidebar ) );
      dispatch( fetchProductionProcessesByQuery( params ) );
      // dispatch( fillProductionProcessDdl() );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Delete
export const deleteProductionProcess = id => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${PRODUCTION_PROCESS_API.delete}`, { id } );
        dispatch( {
          type: DELETE_PRODUCTION_PROCESS,
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
export const deleteProductionProcessByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${PRODUCTION_PROCESS_API.delete_by_range}`, { ids } );
        dispatch( {
          type: DELETE_PRODUCTION_PROCESS_BY_RANGE,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please tyr again' );
      }
    }
  };
};


/** Change Log
 * 09-Jan-2022(Iqbal): Create Function/Method deleteProductionProcessByRange, deleteProductionProcess, updateProductionProcess, addProductionProcess, fetchProductionProcesssByQuery, fetchProductionProcessById
 */
