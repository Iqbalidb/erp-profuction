/*
     Title: Actions for BUNDLE
     Description: Actions for BUNDLE
     Author: Iqbal Hossain
     Date: 23-January-2022
     Modified: 23-January-2022
*/

import { baseAxios } from 'services';
import { BUNDLE_API, PRODUCTION_SUB_PROCESS_API } from 'services/api-end-points/production/v1';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import {
  FETCH_PARTIAL_BUNDLE_FOR_ASSIGNED,
  FETCH_PARTIAL_BUNDLE_FOR_PASS,
  FETCH_PRODUCTION_SUB_PROCESS_BY_CURRENT_PROCESS_AND_STYLE,
  FETCH_PRODUCTION_SUB_PROCESS_BY_STATUS,
  LOADING,
  RESET_BUNDLE_STATE,
  TOGGLE_IS_BUNDLE_ASSIGN_TO_EXTERNAL_MODAL_OPEN
} from './actionType';

//Production Sub Process Ddl
export const fetchProductionSubProcessByStatus = processType => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( PRODUCTION_SUB_PROCESS_API.fetch_by_status( true, processType ) );
      const data = mapArrayToDropdown( res.data.data, 'name', 'id' );
      dispatch( {
        type: FETCH_PRODUCTION_SUB_PROCESS_BY_STATUS,
        payload: {
          productionSubProcessDropdownItems: data
        }
      } );
    } catch ( error ) {
      notify( 'error', error.message );
    }
  };
};
//Get Assigned To Bundle
export const fetchPartialBundleForPass = ( item, params ) => {

  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 500 );
    if ( item ) {
      try {
        const res = await baseAxios.get( BUNDLE_API.fetch_partial_bundle_process_for_pass( true, item.id ), { params } );
        dispatch( {
          type: FETCH_PARTIAL_BUNDLE_FOR_PASS,
          payload: {
            bundlePartialItemsForPass: res.data.data,
            totalRecords: res.data.totalRecords,
            params
          }
        } );
        dispatch( { type: LOADING, payload: false } );
      } catch ( error ) {

        notify( 'error', error.message );
      }
    }
  };
};
//Get Assigned Bundle
export const fetchPartialBundleForAssigned = ( item, params ) => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 1000 );
    try {
      const res = await baseAxios.get( BUNDLE_API.fetch_partial_bundle_process_for_assigned( true, item.id ), { params } );
      dispatch( {
        type: FETCH_PARTIAL_BUNDLE_FOR_ASSIGNED,
        payload: {
          bundlePartialItemsForAssigned: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', error.message );
    }
  };
};

//Get Production Sub Process for nex process ddl
export const fetchProductionSubProcessByCurrentProcessAndStyle = ( currentProcessId, styleId, processType ) => {
  console.log( {
    currentProcessId, styleId, processType
  } );
  return async dispatch => {
    try {
      const res = await baseAxios.get( PRODUCTION_SUB_PROCESS_API.fetch_by_current_process_and_style_id( currentProcessId, styleId ), {
        params: { processType }
      } );
      console.log( res.data.data );
      dispatch( {
        type: FETCH_PRODUCTION_SUB_PROCESS_BY_CURRENT_PROCESS_AND_STYLE,
        payload: { selectedProductionSubProcessDropDownItems: res.data.data }
      } );
    } catch ( error ) {
      notify( 'error', error.message );
    }
  };
};

//Reset Bundle State
export const resetBundleState = () => {
  return dispatch => {
    dispatch( {
      type: RESET_BUNDLE_STATE
    } );
  };
};

//Toggle Modal
export const toggleAssignToExternalModalOpen = () => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_IS_BUNDLE_ASSIGN_TO_EXTERNAL_MODAL_OPEN
    } );
  };
};
/** Change Log
 * 23-Jan-2022(Iqbal): Create Function/Method fetchBundle, fetchBundlesByQuery
 */
