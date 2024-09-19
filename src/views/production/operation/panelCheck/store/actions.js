/*
     Title: Actions for PANEL_CHECK
     Description: Actions for PANEL_CHECK
     Author: Iqbal Hossain
     Date: 22-January-2022
     Modified: 22-January-2022
*/

import { baseAxios } from 'services';
import { PANEL_CHECK_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { fetchPartialBundleInfoForReceived } from '../../externalProcess/store/actions';
import {
  FETCH_CHECKED,
  FETCH_UNCHECKED,
  LOADING,
  SET_CHECKED_BUNDLE,
  SET_UNCHECKED_BUNDLE,
  SET_UNCHECKED_REJECT_BUNDLE,
  SHOW_BACK_DROP,
  TOGGLE_CHECKED,
  TOGGLE_CHECKED_BUNDLE_DAMAGE_STATUS,
  TOGGLE_REJECT_MODAL,
  TOGGLE_UNCHECKED,
  TOGGLE_UNCHECKED_BUNDLE_DAMAGE_STATUS,
  TOGGLE_UNCHECKED_MODAL,
  TOGGLE_UNCHECKED_REJECT_MODAL
} from './actionType';

export const fetchUnchecked = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 1000 );
    try {
      const res = await baseAxios.get( PANEL_CHECK_API.fetch_unchecked_bundles, {
        params
      } );
      const unchecked = res.data.data;
      const totalRecords = res.data.totalRecords;
      dispatch( {
        type: FETCH_UNCHECKED,
        payload: { uncheckedItems: unchecked, totalRecords, params }
      } );
      dispatch( { type: LOADING, payload: false } );
    } catch ( err ) {
      notify( 'error', err.message );
    }
  };
};

export const fetchChecked = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 1000 );
    try {
      const res = await baseAxios.get( PANEL_CHECK_API.fetch_checked_bundles, { params } );
      const checked = res.data.data;
      const totalRecords = res.data.totalRecords;
      dispatch( {
        type: FETCH_CHECKED,
        payload: {
          checkedItems: checked,
          totalRecords,
          params
        }
      } );
      dispatch( { type: LOADING, payload: false } );

    } catch ( error ) {
      notify( 'error', error.message );
    }
  };
};

export const toggleUnchecked = ( index, direction ) => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_UNCHECKED,
      payload: { index, direction }
    } );
  };
};

export const toggleChecked = ( index, direction ) => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_CHECKED,
      payload: {
        index,
        direction
      }
    } );
  };
};

export const setCheckedBundle = bundle => {
  return dispatch => {
    dispatch( {
      type: SET_CHECKED_BUNDLE,
      payload: { bundle }
    } );
  };
};

export const setUnCheckedBundle = selectedRowId => {
  return dispatch => {
    dispatch( {
      type: SET_UNCHECKED_BUNDLE,
      payload: {
        selectedRowId
      }
    } );
  };
};

export const setUnCheckedRejectBundle = bundles => {
  return async dispatch => {
    dispatch( {
      type: SET_UNCHECKED_REJECT_BUNDLE,
      payload: { bundles }
    } );
  };
};

export const onUnCheckedDamageChange = ( row, callback, selectedExternalProcess = null ) => {
  return async dispatch => {
    dispatch( { type: SHOW_BACK_DROP, payload: true } );
    await sleep( 500 );
    if ( row?.id ) {
      const res = await baseAxios.put( PANEL_CHECK_API.update_bundle_by_bundle_id_for_reject_status( row.id ) );
      if ( res.data.succeeded ) {
        notify( 'success', 'Success' );
        if ( selectedExternalProcess !== null ) {
          dispatch( fetchPartialBundleInfoForReceived( selectedExternalProcess ) );
        } else {
          dispatch( fetchUnchecked() );
        }
        if ( res.data.data ) {
          callback( row );
        }
      }
    }
    dispatch( {
      type: TOGGLE_UNCHECKED_BUNDLE_DAMAGE_STATUS
    } );
    dispatch( { type: SHOW_BACK_DROP, payload: false } );
  };
};

export const checkedItemsDamaggeChange = ( row, callback ) => {
  return async dispatch => {
    dispatch( { type: SHOW_BACK_DROP, payload: true } );
    if ( row?.id ) {
      const res = await baseAxios.put( PANEL_CHECK_API.update_bundle_by_bundle_id_for_reject_status( row.id ) );
      if ( res.data.succeeded ) {
        notify( 'success', 'Success' );
        dispatch( fetchChecked() );
        if ( res.data.data ) {
          callback( row );
        }
      }
    }

    dispatch( {
      type: TOGGLE_CHECKED_BUNDLE_DAMAGE_STATUS
    } );
    dispatch( { type: SHOW_BACK_DROP, payload: false } );
  };
};

export const toggleRejectModal = () => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_REJECT_MODAL
    } );
  };
};

export const toggleUncheckedModal = () => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_UNCHECKED_MODAL
    } );
  };
};

export const toggleUncheckedRejectModalOpen = () => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_UNCHECKED_REJECT_MODAL
    } );
  };
};
/** Change Log
 * 22-Jan-2022(Iqbal): Create Function/Method fetchCutPlan, fetchCutPlansByQuery
 */
