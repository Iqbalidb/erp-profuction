/*
     Title: Actions for ASSIGN_INPUT_TABLE
     Description: Actions for ASSIGN_INPUT_TABLE
     Author: Iqbal Hossain
     Date: 24-January-2022
     Modified: 24-January-2022
*/

import { baseAxios } from 'services';
import { ASSIGN_INPUT_TABLE_API, PRODUCTION_SUB_PROCESS_API } from 'services/api-end-points/production/v1';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import {
  ASSIGN_INPUT_TABLE_PENDING_MODAL_OPEN,
  FETCH_ASSIGN_INPUT_FOR_ASSIGNED,
  FETCH_ASSIGN_INPUT_FOR_PENDING,
  FETCH_ASSIGN_INPUT_TABLE,
  FETCH_ASSIGN_INPUT_TABLE_BY_QUERY,
  FETCH_ASSIGN_INPUT_TABLE_BY_RANGE,
  FETCH_PRODUCTION_SUB_PROCESS_FOR_ASSIGN_INPUT_TABLE,
  LOADING,
  RESET_ASSIGN_INPUT_TABLE_STATE,
  SELECTED_ASSIGN_INPUT_BUNDLE
} from './actionType';
/**
 * Get All Assign Input Table Items
 */
export const fetchAssignInputTable = () => async dispatch => {
  const response = await baseAxios.get( `${ASSIGN_INPUT_TABLE_API.fetch_all}` );
  dispatch( {
    type: FETCH_ASSIGN_INPUT_TABLE,
    payload: response.data
  } );
};

//Get Data by Query
export const fetchAssignInputTableByQuery = params => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( `${ASSIGN_INPUT_TABLE_API.fetch_by_query}`, params );
      dispatch( {
        type: FETCH_ASSIGN_INPUT_TABLE_BY_QUERY,
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

//Fetch Production SubProcess
export const fetchProductionSubProcessForAssignInputTable = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( PRODUCTION_SUB_PROCESS_API.fetch_by_status( true, 'partial' ) );
      const data = mapArrayToDropdown( res.data.data, 'name', 'id' );
      dispatch( {
        type: FETCH_PRODUCTION_SUB_PROCESS_FOR_ASSIGN_INPUT_TABLE,
        payload: {
          productionSubProcessDropdownItems: data
        }
      } );
    } catch ( error ) {
      notify( 'error', error.message );
    }
  };
};

//Fetch data for pending
export const fetchAssignInputForPending = ( item, params ) => {

  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );

    try {
      const res = await baseAxios.get( ASSIGN_INPUT_TABLE_API.fetch_bundle_for_pending( true, item ), { params } );
      dispatch( {
        type: FETCH_ASSIGN_INPUT_FOR_PENDING,
        payload: {
          assignInputTablePendingItems: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      await sleep( 500 );
      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', error.message );
    }
  };
};
//Fetch data for assigned
export const fetchAssignInputForAssigned = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );

    try {
      const res = await baseAxios.get( ASSIGN_INPUT_TABLE_API.fetch_bundle_for_assigned( true ), { params } );
      dispatch( {
        type: FETCH_ASSIGN_INPUT_FOR_ASSIGNED,
        payload: {
          assignInputTableAssignedItems: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      await sleep( 500 );
      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', error.message );
    }
  };
};

//Get by Range
export const fetchAssignInputTableByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.get( `${ASSIGN_INPUT_TABLE_API.get_by_range}`, { ids } );
        dispatch( {
          type: FETCH_ASSIGN_INPUT_TABLE_BY_RANGE,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please tyr again' );
      }
    }
  };
};
//Selected Bundle
export const selectedBundleRow = selectedRow => {
  return async dispatch => {
    dispatch( {
      type: SELECTED_ASSIGN_INPUT_BUNDLE,
      payload: { selectedRow }
    } );
  };
};
//Assign Input Pending Modal
export const assignInputTablePendingModalOpen = () => {
  return dispatch => {
    dispatch( {
      type: ASSIGN_INPUT_TABLE_PENDING_MODAL_OPEN
    } );
  };
};

//Reset Assign Input Table State
export const resetAssignInputTableState = () => {
  return dispatch => {
    dispatch( {
      type: RESET_ASSIGN_INPUT_TABLE_STATE
    } );
  };
};
/** Change Log
 * 24-Jan-2022(Iqbal): Create Function/Method fetchASSIGN_INPUT_TABLE, fetchASSIGN_INPUT_TABLEsByQuery
 */
