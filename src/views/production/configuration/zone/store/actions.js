/*
     Title: Actions for Zone
     Description: Actions for Zone
     Author: Iqbal Hossain
     Date: 09-January-2022
     Modified: 09-January-2022
*/

import { dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { ZONE_API } from 'services/api-end-points/production/v1';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import { errorResponse } from 'utility/Utils';
import {
  ADD_ZONE,
  DELETE_ZONE,
  DELETE_ZONE_BY_RANGE,
  FETCH_ZONE,
  FETCH_ZONE_BY_ID,
  FETCH_ZONE_BY_QUERY,
  FILL_ZONE_BY_DDL,
  FILL_ZONE_BY_FLOOR_ID_AND_PRODUCTION_PROCESS_ID,
  LOADING,
  TOGGLE_ZONE_SIDEBAR,
  UPDATE_ZONE
} from './actionType';
//Open Sidebar
export const toggleZoneSidebar = condition => dispatch => {
  dispatch( {
    type: TOGGLE_ZONE_SIDEBAR,
    payload: condition
  } );
};
/**
 * Get All Zone
 */
export const fetchZone = () => async dispatch => {
  const response = await baseAxios.get( `${ZONE_API.fetch_all}` );
  dispatch( {
    type: FETCH_ZONE,
    payload: response.data
  } );
};

//Get Data by Query
export const fetchZonesByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      await sleep( 2000 );
      const res = await baseAxios.get( ZONE_API.fetch_by_query, { params } );
      dispatch( {
        type: FETCH_ZONE_BY_QUERY,
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

//Get Zone by id
export const fetchZoneById = id => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );

    try {
      const res = await baseAxios.get( `${ZONE_API.fetch_by_id}`, { params: { id } } );
      dispatch( {
        type: FETCH_ZONE_BY_ID,
        payload: res.data.data
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( err ) {
      errorResponse( err );
      dispatch( dataProgressCM( false ) );
    }
  };
};
//Get Zone Ddl
export const fillZoneDdl = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${ZONE_API.fetch_all_active}` );
      dispatch( {
        type: FILL_ZONE_BY_DDL,
        payload: res.data.data
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};
//Fill Zone ddl by floorId and production processId
export const fillZoneDdlByFloorIdAndProductionProcessId = ( floorId, productionProcessId ) => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${ZONE_API.fetch_zone_by_floor_and_production_process_id( floorId, productionProcessId )}` );
      const zoneDdlItemWithFloorAndProductionProcess = mapArrayToDropdown( res.data.data, 'name', 'id' );
      dispatch( {
        type: FILL_ZONE_BY_FLOOR_ID_AND_PRODUCTION_PROCESS_ID,
        payload: { zoneDdlItemWithFloorAndProductionProcess }
      } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Add new
export const addZone = ( data, params ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().zoneReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      const res = await baseAxios.post( `${ZONE_API.add}`, data );
      dispatch( {
        type: ADD_ZONE,
        payload: data
      } );
      notify( 'success', 'Zone has been added' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleZoneSidebar( !isOpenSidebar ) );
      dispatch( fetchZonesByQuery( params ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Update Zone
export const updateZone = ( data, paramsData ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().zoneReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      await baseAxios.put( ZONE_API.update, data, { params: { id: data.id } } );
      dispatch( {
        type: UPDATE_ZONE,
        payload: data
      } );
      notify( 'success', 'Zone has been updated successfully!!!' );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleZoneSidebar( !isOpenSidebar ) );
      dispatch( fetchZonesByQuery( paramsData ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Delete Zone
export const deleteZone = id => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${ZONE_API.delete}`, { id } );
        dispatch( {
          type: DELETE_ZONE,
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
export const deleteZoneByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${ZONE_API.delete_by_range}`, { ids } );
        dispatch( {
          type: DELETE_ZONE_BY_RANGE,
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
 * 09-Jan-2022(Iqbal): Create Function/Method deleteZoneByRange, deleteZone, updateZone, addZone, fetchZonesByQuery, fetchZoneById
 * 17-Feb-2022(Alamgir):Modify addZone,updateZone and fetchZoneById
 */
