/**
 * Title: Action Creators from production Sub process
 * Description: Action Creators from production Sub process
 * Author: Nasir Ahmed
 * Date: 07-February-2022
 * Modified: 08-February-2022
 **/

import { dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PRODUCTION_SUB_PROCESS_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import {
  FETCH_PRODUCTION_SUB_PROCESS_BY_ID,
  FETCH_PRODUCTION_SUB_PROCESS_BY_QUERY,
  FILL_PRODUCTION_SUB_PROCESS_DDL,
  LOADING,
  TOGGLE_PRODUCTION_SUB_PROCESS_SIDEBAR
} from './actionTypes';

// Fetch by query
export const fetchProductionSubProcessesByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      await sleep( 2000 );
      const res = await baseAxios.get( PRODUCTION_SUB_PROCESS_API.fetch_by_query, { params } );

      dispatch( {
        type: FETCH_PRODUCTION_SUB_PROCESS_BY_QUERY,
        payload: {
          items: res.data.data,
          total: res.data.totalRecords,
          params
        }
      } );
      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};

//Get by id
export const fetchProductionSubProcessById = id => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( PRODUCTION_SUB_PROCESS_API.fetch_by_id, { params: { id } } );
      dispatch( {
        type: FETCH_PRODUCTION_SUB_PROCESS_BY_ID,
        payload: res ? res.data.data : null
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }
  };
};
//Get Production Sub Process Dropdown
export const fillProductionSubProcessDdl = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( PRODUCTION_SUB_PROCESS_API.fetch_all_active );
      dispatch( {
        type: FILL_PRODUCTION_SUB_PROCESS_DDL,
        payload: res.data.data
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};
// Toggle Sidebar
export const toggleProductionSubProcessSidebar = condition => dispatch => {
  dispatch( {
    type: TOGGLE_PRODUCTION_SUB_PROCESS_SIDEBAR,
    payload: condition
  } );
};

// ADD
export const addProductionSubProcess = ( data, { page, perPage } ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().productionSubProcessReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.post( PRODUCTION_SUB_PROCESS_API.add, data );
      notify( 'success', 'Production sub-process has been added' );
      dispatch( toggleProductionSubProcessSidebar( !isOpenSidebar ) );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( fetchProductionSubProcessesByQuery( { page, perPage } ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Update
export const updateProductionSubProcess = ( data, params ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().productionSubProcessReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.put( PRODUCTION_SUB_PROCESS_API.update, data, { params: { id: data.id } } );
      notify( 'success', 'Production Sub-process has been updated successfully!!!' );
      dispatch( toggleProductionSubProcessSidebar( !isOpenSidebar ) );
      dispatch( dataSubmitProgressCM( false ) );

      dispatch( fetchProductionSubProcessesByQuery( params ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

/**
 * 08-Feb-2022 (nasir) : add and update production sub process
 **/
