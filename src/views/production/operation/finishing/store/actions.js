/*
   Title: Action
   Description: Action
   Author: Iqbal Hossain
   Date: 05-January-2022
   Modified: 05-January-2022
*/
import { createBrowserHistory } from 'history';
import { dataProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PRODUCTION_SUB_PROCESS_API, STYLE_USE_INFO_API } from 'services/api-end-points/production/v1';
import { BUYER_INFO_API } from 'services/api-end-points/production/v1/buyerInfo';
import { FINISHING_API } from 'services/api-end-points/production/v1/finishing';
import { OPERATOR_API } from 'services/api-end-points/production/v1/operator';
import { TRANSFER_STORE_API } from 'services/api-end-points/production/v1/transfarStore';
import { mapArrayToDropdown } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';

const {
  FETCH_PRODUCTION_SUB_PROCESS_BY_PARENT_PROCESS_ID_AND_STATUS,
  FETCH_OPERATOR_BY_PRODUCTION_PROCESS_ID,
  FETCH_BUYER_BY_PRODUCTION_PROCESS_ID,
  FETCH_STYLE_BY_PRODUCTION_PROCESS_ID_AND_BUYER_ID,
  FETCH_TRANSFER_STORE_ASSIGNED_QUANTITY,
  FETCH_FINISHING_BY_PRODUCTION_SUB_PROCESS_ID,
  FETCH_FINISHING_PASSED_BY_PRODUCTION_SUB_PROCESS_ID,
  FETCH_FINISHING_DETAILS_BY_MASTER_ID,
  RESET_FINISHING_STATE,
  LOADING_FINISHING
} = require( './actionType' );


/**
 * Get Production Sub Process By Parent Process Id
 */
export const fetchProductionSubProcessByParentProcessIdAndStatus = ( parentProcessId, status ) => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( PRODUCTION_SUB_PROCESS_API.fetch_by_parent_id, {
        params: {
          parentId: parentProcessId,
          status
        }
      } );
      const productionSubProcess = mapArrayToDropdown( res?.data.data, 'name', 'id' );
      dispatch( {
        type: FETCH_PRODUCTION_SUB_PROCESS_BY_PARENT_PROCESS_ID_AND_STATUS,
        payload: {
          productionSubProcessDdl: productionSubProcess
        }
      } );
    } catch ( err ) {
      notify( 'warning', err );
    }
  };
};
/**
 * Get Operator By Production Process Id
 */
export const fetchOperatorByProductionProcessId = processId => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );

    try {
      const res = await baseAxios.get( OPERATOR_API.fetch_operator_by_operator_group, { params: { productionProcessId: processId } } );
      const operatorDdl = mapArrayToDropdown( res.data.data, 'name', 'id' );
      dispatch( {
        type: FETCH_OPERATOR_BY_PRODUCTION_PROCESS_ID,
        payload: {
          operatorDdl
        }
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }
  };
};
/**
 * Get Operator By Buyer Process Id
 */
export const fetchBuyerByProductionProcessId = processId => {
  return async dispatch => {
    const res = await baseAxios.get( `${BUYER_INFO_API.fetch_buyer_by_production_process_id}/${processId}` );
    const buyerDdl = mapArrayToDropdown( res.data.data, 'buyerName', 'buyerId' );
    dispatch( {
      type: FETCH_BUYER_BY_PRODUCTION_PROCESS_ID,
      payload: {
        buyerDdl
      }
    } );
  };
};
/**
 * Get Style By Production Process Id and Buyer Id
 */
export const fetchStyleByProductionProcessIdAndBuyerId = ( processId, buyerId ) => {
  return async dispatch => {
    const res = await baseAxios.get( STYLE_USE_INFO_API.fetch_style_use_info_by_productionProcessId_and_buyer_id( processId, buyerId ) );
    const styleDdl = mapArrayToDropdown( res.data.data, 'styleNo', 'styleId' );
    dispatch( {
      type: FETCH_STYLE_BY_PRODUCTION_PROCESS_ID_AND_BUYER_ID,
      payload: {
        styleDdl
      }
    } );

  };
};
/**
 * Get Assign Quantity
 */
export const fetchTransferStoreAssignedQuantity = ( buyerId, styleId, productionProcessId ) => {
  return async dispatch => {
    const res = await baseAxios.get(
      TRANSFER_STORE_API.fetch_assigned_quantity_by_buyer_style_production_process_id( buyerId, styleId, productionProcessId )
    );
    const styleDdl = mapArrayToDropdown( res.data.data, 'styleNo', 'styleId' );
    dispatch( {
      type: FETCH_TRANSFER_STORE_ASSIGNED_QUANTITY,
      payload: {
        styleDdl
      }
    } );
  };
};
/**
 * Get Finishing By Production Sub Process Id
 */
export const fetchFinishingByProductionSubProcessId = params => {
  return async dispatch => {
    dispatch( {
      type: LOADING_FINISHING,
      payload: {
        loading: true
      }
    } );
    try {
      const res = await baseAxios.get( FINISHING_API.fetch_finishing_by_production_sub_process_id, { params } );
      dispatch( {
        type: FETCH_FINISHING_BY_PRODUCTION_SUB_PROCESS_ID,
        payload: {
          finishingItems: res.data.data,
          totalRecords: res.data.totalRecords
        }
      } );
      dispatch( {
        type: LOADING_FINISHING,
        payload: {
          loading: false
        }
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};
/**
 * Get Finishing Passed Items By Production Sub Process Id
 */
export const fetchFinishingPassedByProductionSubProcessId = params => {
  return async dispatch => {
    dispatch( {
      type: LOADING_FINISHING,
      payload: {
        loading: true
      }
    } );
    try {
      const res = await baseAxios.get( FINISHING_API.fetch_finishing_passed_by_production_sub_process_id, { params } );
      dispatch( {
        type: FETCH_FINISHING_PASSED_BY_PRODUCTION_SUB_PROCESS_ID,
        payload: {
          finishingPassedItems: res.data.data,
          totalRecords: res.data.totalRecords
        }
      } );
      dispatch( {
        type: LOADING_FINISHING,
        payload: {
          loading: false
        }
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};
/**
 * Get Finishing By Master Id
 */
export const fetchFinishingDetailsByMasterId = masterId => {
  return async dispatch => {
    const history = createBrowserHistory();
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( FINISHING_API.fetch_finishing_details_by_master_id( masterId ) );
      dispatch( {
        type: FETCH_FINISHING_DETAILS_BY_MASTER_ID,
        payload: {
          selectedItems: res.data.data
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
/**
 * Reset Finishing State
 */
export const resetFinishingState = () => {
  return dispatch => {
    dispatch( {
      type: RESET_FINISHING_STATE
    } );
  };
};
