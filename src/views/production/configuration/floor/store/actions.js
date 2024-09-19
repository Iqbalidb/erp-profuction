/*
     Title: Actions for Floor
     Description: Actions for Floor
     Author: Alamgir Kabir
     Date: 14-February-2022
     Modified: 14-February-2022
*/

import { createBrowserHistory } from 'history';
import { dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { FLOOR_API } from 'services/api-end-points/production/v1/floor';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import { FETCH_FLOOR_BY_ID, FETCH_FLOOR_BY_QUERY, FILL_FLOOR_DDL, LOADING, TOGGLE_FLOOR_SIDEBAR } from './actionType';

// Get Data By Query
export const fetchFloorByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      await sleep( 2000 );
      const res = await baseAxios.get( FLOOR_API.fetch_by_query, { params } );
      dispatch( {
        type: FETCH_FLOOR_BY_QUERY,
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

//Get All Without Query
export const fillFloorDdl = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( FLOOR_API.fetch_all_active );
      const floorDdl = mapArrayToDropdown( res.data.data, 'name', 'id' );
      dispatch( {
        type: FILL_FLOOR_DDL,
        payload: { floorDdl }
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};
// Get Data By ID
export const fetchFloorById = id => {
  return async dispatch => {
    const history = createBrowserHistory();
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( FLOOR_API.fetch_by_id, { params: { id } } );
      dispatch( {
        type: FETCH_FLOOR_BY_ID,
        payload: res.data.data
      } );
      dispatch( dataProgressCM( false ) );
    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
      history.back();
    }
  };
};
//Open Sidebar
export const toggleFloorSidebar = condition => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_FLOOR_SIDEBAR,
      payload: condition
    } );
  };
};
//Add New Data
export const addFloor = data => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().floorReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.post( FLOOR_API.add, data );
      notify( 'success', 'Floor has been added' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleFloorSidebar( !isOpenSidebar ) );
      dispatch( fetchFloorByQuery() );
    } catch ( error ) {
      errorResponse( error );
      dispatch( dataSubmitProgressCM( false ) );

    }
  };
};
//Update Data
export const updateFloor = ( data, paramsData ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().floorReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.put( FLOOR_API.update, data, { params: { id: data.id } } );

      notify( 'success', 'Floor has been updated successfully!!!' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleFloorSidebar( !isOpenSidebar ) );
      dispatch( fetchFloorByQuery( paramsData ) );


    } catch ( error ) {
      errorResponse( error );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};


/** Change Log

 * 16-Feb-2022(Alamgir):Add fillFloorDdl
 */
