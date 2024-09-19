import { dataProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { STYLE_WISE_PRODUCTION_PROCESS_GROUP_API } from 'services/api-end-points/production/v1/styleWiseProductionProcessGroup';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import {
  FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_BY_ID,
  FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_BY_QUERY,
  FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_STATE,
  LOADING,
  TOGGLE_STYLE_WISE_PRODUCTION_PROCESS_GROUP_SIDEBAR
} from './actionType';

/*
     Title: Actions for Style Wise Production Process
     Description: Actions for Style Wise Production Process
     Author: Alamgir Kabir
     Date: 31-July-2022
     Modified: 31-July-2022
*/
//For Get Style Wise Production ProcessGroup
export const fetchStyleWiseProductionProcessGroupByQuery = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );

    try {
      const res = await baseAxios.get( STYLE_WISE_PRODUCTION_PROCESS_GROUP_API.fetch_all_active, { params } );
      dispatch( {
        type: FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_BY_QUERY,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      await sleep( 2000 );
      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};

//For Single Get Style Wise Production ProcessGroup
export const fetchStyleWiseProductionProcessGroupById = id => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );
    try {
      if ( id ) {
        const res = await baseAxios.get( STYLE_WISE_PRODUCTION_PROCESS_GROUP_API.fetch_by_id, { params: { id } } );
        dispatch( {
          type: FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_BY_ID,
          payload: res.data.data
        } );
        dispatch( dataProgressCM( false ) );

      }
    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }
  };
};

//For Toggle Sidebar
export const toggleStyleWiseProductionProcessGroupSidebar = () => {
  return dispatch => {
    dispatch( {
      type: TOGGLE_STYLE_WISE_PRODUCTION_PROCESS_GROUP_SIDEBAR
    } );
  };
};

//For Reset Style Wise Production ProcessGroup
export const resetStyleWiseProductionProcessGroup = () => {
  return dispatch => {
    dispatch( {
      type: FETCH_STYLE_WISE_PRODUCTION_PROCESS_GROUP_STATE
    } );
  };
};
