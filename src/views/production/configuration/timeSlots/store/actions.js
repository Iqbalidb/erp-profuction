/*
     Title: Actions for Time Slots
     Description: Actions for  Time Slots
     Author: Alamgir Kabir
     Date: 12-February-2022
     Modified: 12-February-2022
*/

import { dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { TIME_SLOT_API } from 'services/api-end-points/production/v1/timeSlot';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { formattedTimeTwentyFourHours } from 'utility/dateHelpers';
import { errorResponse } from 'utility/Utils';
import { FETCH_TIME_SLOT_BY_ID, FETCH_TIME_SLOT_BY_QUERY, FILL_TIME_SLOT_DDL, LOADING, TOGGLE_TIME_SLOT_SIDEBAR } from './actionType';

//Open Sidebar
export const toggleTimeSlotSidebar = condition => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_TIME_SLOT_SIDEBAR,
      payload: condition
    } );
  };
};

//Get Data by Query
export const fetchTimeSlotByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      await sleep( 2000 );
      const res = await baseAxios.get( TIME_SLOT_API.fetch_by_query, { params } );
      dispatch( {
        type: FETCH_TIME_SLOT_BY_QUERY,
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

//Fill Time Slot DDL
export const fillTimeSlotDdl = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${TIME_SLOT_API.fetch_all_active}` );
      const timeSlotDdl = res.data.data.map( tc => ( { ...tc, label: formattedTimeTwentyFourHours( tc.toTime ), value: tc.id } ) );
      dispatch( {
        type: FILL_TIME_SLOT_DDL,
        payload: { dropDownItems: timeSlotDdl }
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};
//Get By Id
export const fetchTimeSlotById = id => {
  return async dispatch => {
    if ( id ) {
      dispatch( dataProgressCM( true ) );

      try {
        const res = await baseAxios.get( TIME_SLOT_API.fetch_by_id, { params: { id } } );
        dispatch( {
          type: FETCH_TIME_SLOT_BY_ID,
          payload: res.data.data
        } );
        dispatch( dataProgressCM( false ) );

      } catch ( error ) {
        errorResponse( error );
        dispatch( dataProgressCM( false ) );
      }
    }

  };
};
//Add New Time Slot
export const addTimeSlot = ( data, paramsData ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().timeSlotReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.post( TIME_SLOT_API.add, data );
      notify( 'success', 'Time has been updated Successfully!!!' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleTimeSlotSidebar( !isOpenSidebar ) );
      dispatch( fetchTimeSlotByQuery( paramsData ) );
    } catch ( error ) {
      errorResponse( error );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

// Update Time Slot
export const updateTimeSlot = ( data, paramsData ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().timeSlotReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.put( TIME_SLOT_API.update, data, { params: { id: data.id } } );
      notify( 'success', 'Time has been updated Successfully!!!' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleTimeSlotSidebar( !isOpenSidebar ) );
      dispatch( fetchTimeSlotByQuery( paramsData ) );
    } catch ( error ) {
      errorResponse( error );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};
