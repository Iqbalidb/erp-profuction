/*
      Title: Actions for PRODUCT_PARTS_GROUP
      Description: Actions for PRODUCT_PARTS_GROUP
      Author: Alamgir Kabir
      Date: 14-May-2022
      Modified: 14-May-2022
*/
import { baseAxios } from 'services';
import { STYLE_WISE_PRODUCT_PARTS_GROUP_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { FETCH_PRODUCT_PARTS_GROUP_BY_ID, FETCH_PRODUCT_PARTS_GROUP_BY_QUERY, LOADING } from './actionType';

/**
 * Get Product Parts Group by Query
 */
export const fetchProductPartsGroupByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      const res = await baseAxios.get( `${STYLE_WISE_PRODUCT_PARTS_GROUP_API.fetch_by_query}`, { params } );
      dispatch( {
        type: FETCH_PRODUCT_PARTS_GROUP_BY_QUERY,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      await sleep( 500 );
      dispatch( { type: LOADING, payload: false } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

/**
 * Get Product Parts Group by Id
 */
export const fetchProductPratsGroupById = id => {
  return async dispatch => {
    try {
      const res = await baseAxios.get( STYLE_WISE_PRODUCT_PARTS_GROUP_API.fetch_by_id, { params: { id } } );
      dispatch( {
        type: FETCH_PRODUCT_PARTS_GROUP_BY_ID,
        payload: res.data.data
      } );
    } catch ( error ) {
      notify( 'error', 'Something went wrong!! Please try again' );
    }
  };
};
