import { baseAxios } from 'services';
import { CONTRAST_PARTS_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { FETCH_PARTS_STOCK, FETCH_PARTS_STOCK_BY_QUERY, LOADING } from './actionTypes';
/**
 * Get Part Stock
 */
export const fetchPartsStock = () => async dispatch => {
  const response = await baseAxios.get( `${CONTRAST_PARTS_API.fetch_all}` );
  dispatch( {
    type: FETCH_PARTS_STOCK,
    payload: response.data
  } );
};

//Get Data by Query
export const fetchPartsStocksByQuery = params => {
  return async dispatch => {
    dispatch( { type: LOADING, payload: true } );
    await sleep( 500 );
    try {
      const res = await baseAxios.get( `${CONTRAST_PARTS_API.fetch_all_balance}`, { params } );
      dispatch( {
        type: FETCH_PARTS_STOCK_BY_QUERY,
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
