/*
     Title: Actions for IncompleteType
     Description: Actions for IncompleteType
     Author: Iqbal Hossain
     Date: 06-January-2022
     Modified: 10-January-2022
*/

import { baseAxios } from 'services';
import { INCOMPLETE_TYPE_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import {
  ADD_INCOMPLETE_TYPE,
  DELETE_INCOMPLETE_TYPE,
  DELETE_INCOMPLETE_TYPE_BY_RANGE,
  FETCH_INCOMPLETE_TYPE,
  FETCH_INCOMPLETE_TYPE_BY_ID,
  FETCH_INCOMPLETE_TYPE_BY_QUERY,
  LOADING,
  TOGGLE_INCOMPLETE_TYPE_SIDEBAR,
  TOGGLE_INCOMPLETE_TYPE_STATUS,
  UPDATE_INCOMPLETE_TYPE
} from './actionType';

export const fetchIncompleteType = () => async dispatch => {
  const response = await baseAxios.get( `${INCOMPLETE_TYPE_API.fetch_all}` );
  dispatch( {
    type: FETCH_INCOMPLETE_TYPE,
    payload: response.data
  } );
};

//Get Data by Query
export const fetchIncompleteTypesByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      await sleep( 2000 );
      const res = await baseAxios.get( `${INCOMPLETE_TYPE_API.fetch_by_query}`, { params } );
      dispatch( {
        type: FETCH_INCOMPLETE_TYPE_BY_QUERY,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      dispatch( { type: LOADING, payload: false } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Get by id
export const fetchIncompleteTypeById = id => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${INCOMPLETE_TYPE_API.fetch_by_id}`, { id } );
      dispatch( {
        type: FETCH_INCOMPLETE_TYPE_BY_ID,
        payload: {
          selectedItem: res.data ? res.data : null
        }
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Add new
export const addIncompleteType = ( data, params ) => {
  return async dispatch => {
    try {
      const res = await baseAxios.post( `${INCOMPLETE_TYPE_API.add}`, data );
      dispatch( {
        type: ADD_INCOMPLETE_TYPE,
        payload: data
      } );
      notify( 'success', res.data.message );
      dispatch( fetchIncompleteTypesByQuery( params ) );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Update
export const updateIncompleteType = ( data, params ) => {
  return async dispatch => {
    try {
      const res = await baseAxios.post( `${INCOMPLETE_TYPE_API.update}`, { data } );
      dispatch( {
        type: UPDATE_INCOMPLETE_TYPE,
        payload: data
      } );
      notify( 'success', res.data.message );
      dispatch( fetchIncompleteTypesByQuery( params ) );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Delete
export const deleteIncompleteType = id => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${INCOMPLETE_TYPE_API.delete}`, { id } );
        dispatch( {
          type: DELETE_INCOMPLETE_TYPE,
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
export const deleteIncompleteTypeByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${INCOMPLETE_TYPE_API.delete_by_range}`, { ids } );
        dispatch( {
          type: DELETE_INCOMPLETE_TYPE_BY_RANGE,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please tyr again' );
      }
    }
  };
};

//Open Sidebar
export const toggleIncompleteTypeSidebar = condition => dispatch => {
  dispatch( {
    type: TOGGLE_INCOMPLETE_TYPE_SIDEBAR,
    payload: condition
  } );
};

//Toggle Status
export const toggleIncompleteTypeStatus = condition => dispatch => {
  dispatch( {
    type: TOGGLE_INCOMPLETE_TYPE_STATUS,
    payload: condition
  } );
};

/** Change Log
 * 10-Jan-2022(Iqbal): Create Function/Method deleteIncompleteTypeByRange, deleteIncompleteType, updateIncompleteType, addIncompleteType, fetchIncompleteTypesByQuery, fetchIncompleteTypeById
 */
