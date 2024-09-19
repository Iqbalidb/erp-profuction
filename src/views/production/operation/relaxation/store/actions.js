/*
     Title: Relaxation action
     Description: Relaxation action
     Author: Alamgir Kabir
     Date: 16-May-2023
     Modified: 16-May-2023
*/

import { createBrowserHistory } from 'history';
import { dataProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { RELAXATION_API } from 'services/api-end-points/production/v1/relaxation';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import { FETCH_REQUISITION_BY_QUERY } from '../../requisition/store/actionType';
import { FETCH_RELAXATION_BY_MASTER_ID, LOADING, RESET_RELAXATION } from './actionType';

//fetch relaxation by query
export const fetch_relaxation_by_query = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 1000 );
    try {
      const res = await baseAxios.get( `${RELAXATION_API.fetch_all}`, { params } );
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

//fetch relaxation by masterid
export const fetch_relaxation_by_master_id = masterId => {
  return async dispatch => {
    const history = createBrowserHistory();
    dispatch( dataProgressCM( true ) );
    try {
      const res = await baseAxios.get( `${RELAXATION_API.fetch_relaxation_by_master_id}`, { params: { masterId } } );
      dispatch( {
        type: FETCH_RELAXATION_BY_MASTER_ID,
        payload: {
          selectedRelaxationItem: res.data.data
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
 * Reset Relaxation State
 */
export const resetRelaxationDetails = () => {
  return dispatch => {
    dispatch( {
      type: RESET_RELAXATION
    } );
  };
};
