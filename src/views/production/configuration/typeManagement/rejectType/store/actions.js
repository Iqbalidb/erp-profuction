/*
     Title: Actions for RejectType
     Description: Actions for RejectType
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 10-January-2022
*/

import { dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { REJECT_TYPE_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import { errorResponse } from 'utility/Utils';
import {
  DELETE_REJECT_TYPE,
  DELETE_REJECT_TYPE_BY_RANGE,
  FETCH_REJECT_TYPE_BY_ID,
  FETCH_REJECT_TYPE_BY_QUERY,
  LOADING,
  RESET_REJECT_TYPE_STATE,
  TOGGLE_REJECT_TYPE_SIDEBAR
} from './actionType';

export const toggleRejectTypeSidebar = condition => dispatch => {
  dispatch( {
    type: TOGGLE_REJECT_TYPE_SIDEBAR,
    payload: condition
  } );
};

//Reset State
export const resetRejectTypeState = () => {
  return dispatch => {
    dispatch( {
      type: RESET_REJECT_TYPE_STATE
    } );
  };
};
//Get Data by Query
export const fetchRejectTypesByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );

      const res = await baseAxios.get( REJECT_TYPE_API.fetch_by_query, { params } );
      dispatch( {
        type: FETCH_REJECT_TYPE_BY_QUERY,
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

//Get reject type by id
export const fetchRejectTypeById = id => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );

    try {
      const res = await baseAxios.get( `${REJECT_TYPE_API.fetch_by_id}`, { params: { id } } );
      dispatch( {
        type: FETCH_REJECT_TYPE_BY_ID,
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
export const addRejectType = ( data, params ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().rejectTypeReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.post( `${REJECT_TYPE_API.add}`, data );
      notify( 'success', 'Reject Type has been added!!' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleRejectTypeSidebar( !isOpenSidebar ) );
      dispatch( fetchRejectTypesByQuery( params ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Update
export const updateRejectType = ( id, data, params ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().rejectTypeReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.put( `${REJECT_TYPE_API.update}`, data, { params: { id } } );
      notify( 'success', 'Reject Type has been updated Successfully!!!' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleRejectTypeSidebar( !isOpenSidebar ) );
      dispatch( fetchRejectTypesByQuery( params ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Delete
export const deleteRejectType = id => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${REJECT_TYPE_API.delete}`, { id } );
        dispatch( {
          type: DELETE_REJECT_TYPE,
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
export const deleteRejectTypeByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${REJECT_TYPE_API.delete_by_range}`, { ids } );
        dispatch( {
          type: DELETE_REJECT_TYPE_BY_RANGE,
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
 * 10-Jan-2022(Iqbal): Create Function/Method deleteRejectTypeByRange, deleteRejectType, updateRejectType, addRejectType, fetchRejectTypesByQuery, fetchRejectTypeById
 */
