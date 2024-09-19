/*
     Title: Action for Zone Group
     Description: Action for Zone Group
     Author: Alamgir Kabir
     Date: 31-March-2022
     Modified: 31-March-2022
*/

import { createBrowserHistory } from 'history';
import { dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { LINE_API } from 'services/api-end-points/production/v1';
import { ZONE_GROUP_API } from 'services/api-end-points/production/v1/zoneGroup';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import {
  FETCH_LINE_DROPDOWN_BY_FLOOR_AND_PRODUCTION_PROCESS,
  FETCH_ZONE_GROUP_BY_ID,
  FETCH_ZONE_GROUP_BY_QUERY,
  FETCH_ZONE_GROUP_DDL,
  LOADING,
  TOGGLE_ZONE_GROUP_DETAILS_MODAL
} from './actionTypes';

//Fetch Zone Group By Query
export const fetchZoneGroupByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      const res = await baseAxios.get( ZONE_GROUP_API.fetch_by_query, { params } );
      dispatch( {
        type: FETCH_ZONE_GROUP_BY_QUERY,
        payload: {
          items: res.data.data,
          total: res.data.totalRecords,
          params
        }
      } );
      await sleep( 500 );

      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};
/**
 * For Zone Ddl
 */
export const fillZoneGroupDdl = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( ZONE_GROUP_API.fetch_all_active );
      const zoneGroupDdl = mapArrayToDropdown( res.data.data, 'zoneName', 'zoneId' );

      dispatch( {
        type: FETCH_ZONE_GROUP_DDL,
        payload: { zoneGroupDdl }
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};
//Fetch Zone Group By Id
export const fetchZoneGroupById = id => {
  return async ( dispatch, getState ) => {
    // const { selectedItem } = getState().zoneGroupReducer;
    const history = createBrowserHistory();
    dispatch( dataSubmitProgressCM( true ) );
    try {
      const res = await baseAxios.get( ZONE_GROUP_API.fetch_by_id, { params: { id } } );
      const selectedItem = res.data.data;
      if ( selectedItem ) {
        const response = await baseAxios.get(
          LINE_API.fetch_line_by_floor_and_production_process_id( selectedItem.floorId, selectedItem.productionProcessId )
        );
        const lineDropdown = mapArrayToDropdown( response.data.data, 'name', 'id' );
        dispatch( {
          type: FETCH_ZONE_GROUP_BY_ID,
          payload: { selectedItem, lineDropdown }
        } );
        dispatch( dataSubmitProgressCM( false ) );

      }
    } catch ( error ) {
      errorResponse( error );
      dispatch( dataSubmitProgressCM( false ) );
      history.back();
    }
  };
};
/**
 * Get Line Ddl by floor and production process id
 */
export const fetchLineDdlByFloorAndProductionProcess = item => {
  return async dispatch => {
    const res = await baseAxios.get( LINE_API.fetch_line_by_floor_and_production_process_id( item?.floorId, item?.productionProcessId ) );
    const lineDdl = res.data.data;
    dispatch( {
      type: FETCH_LINE_DROPDOWN_BY_FLOOR_AND_PRODUCTION_PROCESS,
      payload: { zoneGroupddlLine: lineDdl }
    } );
  };
};

//Toggle Zone Group Details
export const toggleZoneGroupDetails = condition => dispatch => {
  dispatch( {
    type: TOGGLE_ZONE_GROUP_DETAILS_MODAL,
    payload: condition
  } );
};
