import { createBrowserHistory } from 'history';
import { dataProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { REQUISITION_API } from 'services/api-end-points/production/v1/requisition';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import { FETCH_REQUISITION_BY_MASTER_ID, FETCH_REQUISITION_BY_QUERY, LOADING } from './actionType';

/*
     Title: Requisition action
     Description: Requisition action
     Author: Alamgir Kabir
     Date: 04-May-2023
     Modified: 04-May-2023
*/

//fetch requisition by query
export const fetch_requisition_by_query = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 500 );
    try {
      const res = await baseAxios.get( `${REQUISITION_API.fetch_all}`, { params } );
      dispatch( {
        type: FETCH_REQUISITION_BY_QUERY,
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
//fetch requisition by masterid
export const fetch_requisition_by_master_id = masterId => {
  return async dispatch => {
    const history = createBrowserHistory();
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( `${REQUISITION_API.fetch_requisition_by_master_id}`, { params: { masterId } } );
      dispatch( {
        type: FETCH_REQUISITION_BY_MASTER_ID,
        payload: {
          selectedRequisitionItem: res.data.data
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
