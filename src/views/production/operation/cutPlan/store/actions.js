/*
     Title: Actions for CUT_PLAN
     Description: Actions for CUT_PLAN
     Author: Iqbal Hossain
     Date: 18-January-2022
     Modified: 18-January-2022
*/

import axios from 'axios';
import { baseAxios } from 'services';
import { CUTTINGS_API, CUT_PLAN_API, MARKER_API } from 'services/api-end-points/production/v1';
import { PRODUCT_PARTS_IN_CUT_PLAN } from 'services/api-end-points/production/v1/productPartsInCutPlan';
import { sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import {
  DELETE_CUT_PLAN,
  DELETE_CUT_PLAN_BY_RANGE,
  FETCH_CUT_PLAN,
  FETCH_CUT_PLAN_BY_ID,
  FETCH_CUT_PLAN_BY_QUERY,
  LOADING,
  TOGGLE_CUT_PLAN_CONFIRM_MODAL_OPEN
} from './actionType';

export const fetchCutPlan = () => async dispatch => {
  const response = await baseAxios.get( `${CUT_PLAN_API.fetch_all}` );
  dispatch( {
    type: FETCH_CUT_PLAN,
    payload: response.data
  } );
};

//Get Data by Query
export const fetchCutPlansByQuery = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 1000 );
    try {
      const res = await baseAxios.get( `${CUT_PLAN_API.fetch_by_query}`, { params } );
      dispatch( {
        type: FETCH_CUT_PLAN_BY_QUERY,
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

//Get Data by ID
export const fetchCutPlanById = item => {
  return async dispatch => {
    if ( item ) {
      try {
        const res = await baseAxios.get( CUTTINGS_API.fetch_cuttings_details_by_cut_plan, { params: { id: item.id } } );
        const masterData = res.data.data;
        if ( masterData ) {
          const productPartsRequest = baseAxios.get( PRODUCT_PARTS_IN_CUT_PLAN.fetch_product_parts_cut_plan_id, {
            params: { cutPlanId: masterData.cutPlanId }
          } );
          const markerRequest = baseAxios.get( MARKER_API.fetch_markers_by_marker_size_id, { params: { id: masterData.markerId } } );
          const [markerResponse, productPartsResponse] = await axios.all( [markerRequest, productPartsRequest] );
          const productParts = productPartsResponse.data.data;

          const marker = markerResponse.data.data;
          await sleep( 1000 );
          dispatch( {
            type: FETCH_CUT_PLAN_BY_ID,
            payload: { masterData, marker, productParts }
          } );
        }
      } catch ( error ) {
        notify( 'error', 'Something went wrong!!! Please try again' );
      }
    }
  };
};

//Delete
export const deleteCutPlan = id => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${CUT_PLAN_API.delete}`, { id } );
        dispatch( {
          type: DELETE_CUT_PLAN,
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
export const deleteCutPlanByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${CUT_PLAN_API.delete_by_range}`, { ids } );
        dispatch( {
          type: DELETE_CUT_PLAN_BY_RANGE,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please tyr again' );
      }
    }
  };
};

//Open Confirm Modal
export const toggleCutPlanConfirmModal = condition => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_CUT_PLAN_CONFIRM_MODAL_OPEN,
      payload: condition
    } );
  };
};
/** Change Log
 * 18-Jan-2022(Iqbal): Create Function/Method fetchCutPlan, fetchCutPlansByQuery
 */
