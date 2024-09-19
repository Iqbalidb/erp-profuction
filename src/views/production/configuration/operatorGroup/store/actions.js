import { baseAxios } from 'services';
import { OPERATOR_GROUP_API } from 'services/api-end-points/production/v1/operatorGroup';
import { sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import {
  EDIT_ACTIVE_OPERATOR_GROUP,
  FETCH_ACTIVE_OPERATOR_GROUP, LOADING_OPERATOR_GROUP, TOGGLE_OPERATOR_GROUP_SIDEBAR
} from './actionTypes';

/*
     Title: Operator Group Actions
     Description: Operator Group Actions
     Author: Alamgir Kabir
     Date: 15-December-2022
     Modified: 15-December-2022
*/
/**
 * Get Active Operator Group
 */
export const fetchActiveOperatorGroup = params => {
  return async dispatch => {
    dispatch( {
      type: LOADING_OPERATOR_GROUP,
      payload: true
    } );
    await sleep( 500 );
    try {
      const res = await baseAxios.get( OPERATOR_GROUP_API.fetch_all_operator_group, { params } );
      dispatch( {
        type: FETCH_ACTIVE_OPERATOR_GROUP,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords
        }
      } );
      dispatch( {
        type: LOADING_OPERATOR_GROUP,
        payload: false
      } );
    } catch ( error ) {
      notify( 'warning', 'something went wrong!!!' );
    }
  };
};
/**
 * Edit Active Operator Group
 */
export const editActiveOperatorGroup = row => {
  return async dispatch => {
    if ( row !== null ) {
      const rowId = row?.id;
      const updatedStatus = !row?.status;
      const confirmStatus = await confirmDialog( confirmObj );
      if ( confirmStatus.isConfirmed ) {
        try {
          const res = await baseAxios.put( OPERATOR_GROUP_API.update, null, { params: { id: rowId, status: updatedStatus } } );
          if ( res.status === 200 ) {

            notify( 'success', res.statusText );

          }
          dispatch( {
            type: EDIT_ACTIVE_OPERATOR_GROUP
          } );

        } catch ( error ) {
          notify( 'error', error );
        }
      }
    }
  };
};
/**
 * Toggle Operator Group Sidebar
 */
export const toggleOperatorGroupSidebar = () => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_OPERATOR_GROUP_SIDEBAR
    } );
  };
};
