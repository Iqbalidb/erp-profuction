/*
     Title: Actions for ASSIGN_TARGET
     Description: Actions for ASSIGN_TARGET
     Author: Iqbal Hossain
     Date: 27-January-2022
     Modified: 27-January-2022
*/

import { createBrowserHistory } from 'history';
import { dataProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { ASSIGN_TARGET_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import {
  FETCH_ASSIGN_TARGET,
  FETCH_ASSIGN_TARGET_BY_ID,
  FETCH_ASSIGN_TARGET_BY_QUERY,
  FETCH_PREVIOUS_ASSIGN_TARGET,
  FETCH_TODAYS_ASSIGN_TARGET,
  LOADING,
  SET_ASSIGN_TARGET_BY_RANGE
} from './actionType';
/**
 * Get All Assign Target
 */
export const fetchAssignTarget = () => async dispatch => {
  const response = await baseAxios.get( `${ASSIGN_TARGET_API.fetch_all}` );
  dispatch( {
    type: FETCH_ASSIGN_TARGET,
    payload: response.data
  } );
};

//Get Data by Query
export const fetchAssignTargetByQuery = params => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${ASSIGN_TARGET_API.fetch_by_query}`, params );
      dispatch( {
        type: FETCH_ASSIGN_TARGET_BY_QUERY,
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
export const fetchAssignTargetById = rowId => {
  return async dispatch => {
    const history = createBrowserHistory();
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( `${ASSIGN_TARGET_API.fetch_by_id( rowId )}` );
      dispatch( {
        type: FETCH_ASSIGN_TARGET_BY_ID,
        payload: {
          selectedItem: res.data.data
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

//Get Todays Assign Target
export const fetchTodaysAssignTarget = params => {
  return async dispatch => {
    dispatch( {
      type: LOADING,
      payload: true
    } );
    try {
      const res = await baseAxios.get( `${ASSIGN_TARGET_API.fetch_all_todays( true )}`, { params } );
      const todaysTarget = res.data.data;
      const totalRecords = res.data.totalRecords;
      dispatch( {
        type: FETCH_TODAYS_ASSIGN_TARGET,
        payload: {
          todaysTarget,
          totalRecords,
          params
        }
      } );
      // await sleep( 500 );
      dispatch( {
        type: LOADING,
        payload: false
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Get Previous Assign Target
export const fetchPreviousAssignTarget = params => {
  return async dispatch => {
    dispatch( {
      type: LOADING,
      payload: true
    } );
    try {
      const res = await baseAxios.get( `${ASSIGN_TARGET_API.fetch_all_todays( false )}`, { params } );
      const previousTarget = res.data.data;
      const totalRecords = res.data.totalRecords;
      dispatch( {
        type: FETCH_PREVIOUS_ASSIGN_TARGET,
        payload: {
          previousTarget,
          totalRecords,
          params
        }
      } );
      await sleep( 500 );
      dispatch( {
        type: LOADING,
        payload: false
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Get by Range
export const setAssignTargetByRange = ( ids, target ) => {
  return async dispatch => {
    try {
      const res = await baseAxios.post( `${ASSIGN_TARGET_API.get_by_range}`, { ids, target } );
      dispatch( {
        type: SET_ASSIGN_TARGET_BY_RANGE,
        payload: res.data.data
      } );
      notify( 'success', res.data.message );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please tyr again' );
    }
  };
};

/** Change Log
 * 27-Jan-2022(Iqbal): Create Function/Method fetchASSIGN_TARGET, fetchASSIGN_TARGETsByQuery
 */
