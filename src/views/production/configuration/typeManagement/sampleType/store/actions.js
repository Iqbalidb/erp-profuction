/*
   Title: Action
   Description: Action
   Author: Iqbal Hossain
   Date: 05-January-2022
   Modified: 05-January-2022
*/

import { baseAxios } from 'services';
import { SAMPLE_TYPE_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import {
  ADD_SAMPLE_TYPE,
  DELETE_SAMPLE_TYPE,
  DELETE_SAMPLE_TYPE_BY_RANGE,
  FETCH_SAMPLE_TYPE,
  FETCH_SAMPLE_TYPE_BY_ID,
  FETCH_SAMPLE_TYPE_BY_QUERY,
  LOADING,
  TOGGLE_SAMPLE_TYPE_SIDEBAR,
  TOGGLE_SAMPLE_TYPE_STATUS,
  UPDATE_SAMPLE_TYPE
} from './actionType';

export const fetchSampleType = () => async dispatch => {
  const response = await baseAxios.get( `${SAMPLE_TYPE_API.fetch_all}` );
  dispatch( {
    type: FETCH_SAMPLE_TYPE,
    payload: response.data
  } );
};

//Get Data by Query
export const fetchSampleTypesByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      await sleep( 2000 );
      const res = await baseAxios.get( `${SAMPLE_TYPE_API.fetch_by_query}`, params );
      dispatch( {
        type: FETCH_SAMPLE_TYPE_BY_QUERY,
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

//Get by id
export const fetchSampleTypeById = id => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${SAMPLE_TYPE_API.fetch_by_id}`, { id } );
      dispatch( {
        type: FETCH_SAMPLE_TYPE_BY_ID,
        payload: {
          selectedItem: res.data.data ? res.data.data : null
        }
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Add new
export const addSampleType = ( data, params ) => {
  return async dispatch => {
    try {
      const res = await baseAxios.post( `${SAMPLE_TYPE_API.add}`, data );
      dispatch( {
        type: ADD_SAMPLE_TYPE,
        payload: data
      } );
      notify( 'success', res.data.message );
      dispatch( fetchSampleTypesByQuery( params ) );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Update
export const updateSampleType = ( data, params ) => {
  return async dispatch => {
    try {
      const res = await baseAxios.post( `${SAMPLE_TYPE_API.update}`, { data } );
      dispatch( {
        type: UPDATE_SAMPLE_TYPE,
        payload: data
      } );
      notify( 'success', res.data.message );
      dispatch( fetchSampleTypesByQuery( params ) );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Delete
export const deleteSampleType = id => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${SAMPLE_TYPE_API.delete}`, { id } );
        dispatch( {
          type: DELETE_SAMPLE_TYPE,
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
export const deleteSampleTypeByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${SAMPLE_TYPE_API.delete_by_range}`, { ids } );
        dispatch( {
          type: DELETE_SAMPLE_TYPE_BY_RANGE,
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
export const toggleSampleTypeSidebar = condition => dispatch => {
  dispatch( {
    type: TOGGLE_SAMPLE_TYPE_SIDEBAR,
    payload: condition
  } );
};

//Toggle Status
export const toggleSampleTypeStatus = condition => dispatch => {
  dispatch( {
    type: TOGGLE_SAMPLE_TYPE_STATUS,
    payload: condition
  } );
};
/** Change Log
 * 09-Jan-2022(Iqbal): Create Function/Method deleteSampleTypeByRange, deleteSampleType, updateSampleType, addSampleType, fetchSampleTypesByQuery, fetchSampleTypeById
 */
