/*
     Title: Action for Production Process Group
     Description: Action for Production Process Group
     Author: Alamgir Kabir
     Date: 28-March-2022
     Modified: 28-March-2022
*/

import { createBrowserHistory } from 'history';
import { dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PRODUCTION_PROCESS_GROUP_API } from 'services/api-end-points/production/v1/productionProcessGroup';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import {
  FETCH_PRODUCTION_PROCESS_GROUP_BY_ID,
  FETCH_PRODUCTION_PROCESS_GROUP_BY_QUERY,
  FILL_PRODUCTION_PROCESS_GROUP_DDL,
  LOADING
} from './actionTypes';

//Fetch Production Process By Query
export const fetchProductionProcessGroupByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      await sleep( 2000 );
      const res = await baseAxios.get( PRODUCTION_PROCESS_GROUP_API.fetch_by_query, { params } );
      dispatch( {
        type: FETCH_PRODUCTION_PROCESS_GROUP_BY_QUERY,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};

export const fillProductionProcessGroupDdl = () => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( PRODUCTION_PROCESS_GROUP_API.fetch_all_active );
      dispatch( {
        type: FILL_PRODUCTION_PROCESS_GROUP_DDL,
        payload: res.data.data
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};

export const fetchProductionProcessGroupById = id => {
  return async dispatch => {
    const history = createBrowserHistory();
    dispatch( dataProgressCM( true ) );

    dispatch( dataSubmitProgressCM( true ) );
    try {
      const res = await baseAxios.get( PRODUCTION_PROCESS_GROUP_API.fetch_by_id, {
        params: { id }
      } );
      dispatch( {
        type: FETCH_PRODUCTION_PROCESS_GROUP_BY_ID,
        payload: res.data.data
      } );
      dispatch( dataProgressCM( false ) );

      dispatch( dataSubmitProgressCM( false ) );

    } catch ( err ) {
      errorResponse( err );
      dispatch( dataProgressCM( false ) );

      dispatch( dataSubmitProgressCM( false ) );
      history.back();
    }
  };
};
