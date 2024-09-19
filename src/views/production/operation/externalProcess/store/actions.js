/*
     Title: Actions for EXTERNAL_PROCESS
     Description: Actions for EXTERNAL_PROCESS
     Author: Iqbal Hossain
     Date: 24-January-2022
     Modified: 24-January-2022
*/

import { baseAxios } from 'services';
import { EXTERNAL_PROCESS_API, PANEL_CHECK_API, PRODUCTION_SUB_PROCESS_API } from 'services/api-end-points/production/v1';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import { SHOW_BACK_DROP } from '../../panelCheck/store/actionType';
import {
  FETCH_EXTERNAL_PROCESS,
  FETCH_EXTERNAL_PROCESS_BY_QUERY,
  FETCH_EXTERNAL_PROCESS_BY_RANGE,
  FETCH_PARTIAL_BUNDLE_INFO_FOR_PASSED,
  FETCH_PARTIAL_BUNDLE_INFO_FOR_PENDING,
  FETCH_PARTIAL_BUNDLE_INFO_FOR_RECEIVED,
  FETCH_PARTIAL_BUNDLE_INFO_FOR_SEND,
  FETCH_PRODUCTION_SUB_PROCESS_BY_STATUS_FOR_DDL,
  LOADING,
  RESET_EXTERNAL_PROCESS_STATE,
  TOGGLE_EXTERNAL_PROCESS_PASSED_MODAL,
  TOGGLE_EXTERNAL_PROCESS_PENDING_MODAL,
  TOGGLE_EXTERNAL_PROCESS_SEND_MODAL
} from './actionType';
/**
 * Get External Process Items
 */
export const fetchExternalProcess = () => async dispatch => {
  const response = await baseAxios.get( `${EXTERNAL_PROCESS_API.fetch_all}` );
  dispatch( {
    type: FETCH_EXTERNAL_PROCESS,
    payload: response.data
  } );
};
/**
 * Get Production Sub Process Ddl
 */
export const fetchProductionSubProcessDdlByStatus = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( PRODUCTION_SUB_PROCESS_API.fetch_production_sub_process_for_external_process( true ), {
        params: { processType: 'partial' }
      } );
      const data = mapArrayToDropdown( res.data.data, 'name', 'id' );

      dispatch( {
        type: FETCH_PRODUCTION_SUB_PROCESS_BY_STATUS_FOR_DDL,
        payload: { productionSubProcessDropdownItems: data }
      } );
    } catch ( error ) {
      notify( 'error', error.message );
    }
  };
};

/**
 * Fetch Pending Items
 */
export const fetchPartialBundleInfoForPending = ( item, params ) => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 1000 );
    if ( item ) {
      try {
        const res = await baseAxios.get( EXTERNAL_PROCESS_API.fetch_pending_bundle_for_external_process( true, item?.id ), { params } );
        dispatch( {
          type: FETCH_PARTIAL_BUNDLE_INFO_FOR_PENDING,
          payload: { partialBundleInfoForPending: res.data.data, totalRecords: res.data.totalRecords, params }
        } );
        dispatch( { type: LOADING, payload: false } );
      } catch ( error ) {
        notify( 'error', error.message );
      }
    }
  };
};

/**
 * Fetch Send Items
 */
export const fetchPartialBundleInfoForSend = ( item, params ) => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 1000 );
    if ( item ) {
      try {
        const res = await baseAxios.get( EXTERNAL_PROCESS_API.fetch_send_bundle_for_external_process( true, item?.id, 'send' ), { params } );
        dispatch( {
          type: FETCH_PARTIAL_BUNDLE_INFO_FOR_SEND,
          payload: { partialBundleInfoForSend: res.data.data, totalRecords: res.data.totalRecords, params }
        } );
        dispatch( { type: LOADING, payload: false } );
      } catch ( error ) {
        notify( 'error', error.message );
      }
    }
  };
};

/**
 * Fetch Receive Items
 */
export const fetchPartialBundleInfoForReceived = ( item, params ) => {
  return async dispatch => {
    // dispatch({ type: LOADING, payload: true });
    // await sleep(1000);
    if ( item ) {
      try {
        const res = await baseAxios.get( EXTERNAL_PROCESS_API.fetch_receive_bundle_for_external_process( true, item?.id, 'received' ), { params } );
        dispatch( {
          type: FETCH_PARTIAL_BUNDLE_INFO_FOR_RECEIVED,
          payload: { partialBundleInfoForReceived: res.data.data, totalRecords: res.data.totalRecords, params }
        } );
        // dispatch({ type: LOADING, payload: false });
      } catch ( error ) {
        notify( 'error', error.message );
      }
    }
  };
};
/**
 * Fetch Passed Items
 */
export const fetchPartialBundleInfoPassed = ( item, params ) => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 1000 );
    if ( item ) {
      try {
        const res = await baseAxios.get( EXTERNAL_PROCESS_API.fetch_passed_bundle_from_external_process( true, item?.id ), { params } );
        dispatch( {
          type: FETCH_PARTIAL_BUNDLE_INFO_FOR_PASSED,
          payload: { partialBundleInfoPassed: res.data.data, totalRecords: res.data.totalRecords, params }
        } );
        dispatch( { type: LOADING, payload: false } );
      } catch ( error ) {
        notify( 'error', error.message );
      }
    }
  };
};

//Get Data by Query
export const fetchExternalProcessByQuery = params => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${EXTERNAL_PROCESS_API.fetch_by_query}`, params );
      dispatch( {
        type: FETCH_EXTERNAL_PROCESS_BY_QUERY,
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

//Get by Range
export const fetchExternalProcessByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.get( `${EXTERNAL_PROCESS_API.get_by_range}`, { ids } );
        dispatch( {
          type: FETCH_EXTERNAL_PROCESS_BY_RANGE,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please tyr again' );
      }
    }
  };
};

//For External Process Reset
export const resetExternalProcessState = () => {
  return dispatch => {
    dispatch( {
      type: RESET_EXTERNAL_PROCESS_STATE
    } );
  };
};
/**
 * Damage Bundle Item From External Process
 */
export const toggleDamageBundleFromExternalProcess = item => {
  return async dispatch => {
    dispatch( { type: SHOW_BACK_DROP, payload: true } );
    await sleep( 500 );
    if ( item?.id ) {
      const res = await baseAxios.put( PANEL_CHECK_API.update_bundle_by_bundle_id_for_reject_status( item.id ) );
      if ( res.data.succeeded ) {
        notify( 'success', 'Success' );
        dispatch( resetExternalProcessState() );
      }
    }
    dispatch( { type: SHOW_BACK_DROP, payload: false } );
  };
};
//For External Process Pending Modal
export const toggleExternalProcessPendingModal = () => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_EXTERNAL_PROCESS_PENDING_MODAL
    } );
  };
};

//For External Process Pending Modal
export const toggleExternalProcessSendModal = () => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_EXTERNAL_PROCESS_SEND_MODAL
    } );
  };
};
//For External Process Pending Modal
export const toggleExternalProcessPassedModal = () => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_EXTERNAL_PROCESS_PASSED_MODAL
    } );
  };
};


/** Change Log
 * 24-Jan-2022(Iqbal): Create Function/Method fetchEXTERNAL_PROCESS, fetchEXTERNAL_PROCESSsByQuery
 */
