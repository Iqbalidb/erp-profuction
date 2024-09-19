import { dataProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { OPERATOR_API } from 'services/api-end-points/production/v1/operator';
import { mapArrayToDropdown, sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import {
  FETCH_OPERATOR_BY_ID,
  FETCH_OPERATOR_BY_QUERY,
  FETCH_OPERATOR_FOR_OPERATOR_GROUP,
  LOAD_OPERATOR,
  RESET_OPERATOR_STATE,
  TOGGLE_OPERATOR_SIDEBAR
} from './actionTypes';

/*
     Title: Operator Actions
     Description: Operator Actions
     Author: Alamgir Kabir
     Date: 12-December-2022
     Modified: 12-December-2022
*/
/**
 * Toggle Operator Sidebar
 */
export const toggleOperatorSidebar = () => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_OPERATOR_SIDEBAR
    } );
  };
};
/**
 * Get All Operator
 */
export const fetchAllOperator = params => {
  return async dispatch => {
    dispatch( {
      type: LOAD_OPERATOR,
      payload: true
    } );
    await sleep( 500 );
    try {
      const res = await baseAxios.get( OPERATOR_API.fetch_by_query, { params } );
      dispatch( {
        type: FETCH_OPERATOR_BY_QUERY,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords
        }
      } );
      dispatch( {
        type: LOAD_OPERATOR,
        payload: false
      } );
    } catch ( error ) {
      notify( 'warning', 'something went wrong!!!' );
    }
  };
};
/**
 * Get Operator by Id
 */
export const fetchOperatorById = operatorId => {
  return async dispatch => {
    if ( operatorId ) {
      dispatch( dataProgressCM( true ) );

      try {
        const res = await baseAxios.get( OPERATOR_API.fetch_by_id, {
          params: {
            id: operatorId
          }
        } );
        dispatch( {
          type: FETCH_OPERATOR_BY_ID,
          payload: {
            selectedItem: res.data.data
          }
        } );
        dispatch( dataProgressCM( false ) );
        dispatch( toggleOperatorSidebar() );
      } catch ( error ) {
        errorResponse( error );
        dispatch( dataProgressCM( false ) );
      }

    }
  };
};
/**
 * For Operator Ddl
 */
export const fetchOperatorForOperatorGroup = processId => {
  return async dispatch => {
    if ( processId ) {
      const res = await baseAxios.get( OPERATOR_API.fetch_operator_for_operator_group, { params: { productionProcessId: processId } } );
      const operatorDdl = mapArrayToDropdown( res.data.data, 'name', 'id' );
      dispatch( {
        type: FETCH_OPERATOR_FOR_OPERATOR_GROUP,
        payload: {
          operatorDdl
        }
      } );
    }
  };
};
/**
 * Reset Operator State
 */
export const resetOperatorState = () => {
  return dispatch => {
    dispatch( {
      type: RESET_OPERATOR_STATE,
      payload: {
        selectedItem: null
      }
    } );
  };
};
