/**
 * Title: Action creators for product parts
 * Description: Action creators for product parts
 * Author: Nasir Ahmed
 * Date: 09-January-2022
 * Modified: 09-January-2022
 **/

import qs from 'querystring';
import { dataProgressCM, dataSubmitProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PRODUCT_PARTS_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { confirmDialog } from 'utility/custom/ConfirmDialog';
import { notify } from 'utility/custom/notifications';
import { confirmObj } from 'utility/enums';
import { errorResponse } from 'utility/Utils';
import {
  ADD_PRODUCT_PART,
  DELETE_PRODUCT_PART,
  DELETE_PRODUCT_PART_BY_RANGE,
  FETCH_PRODUCT_PARTS,
  FETCH_PRODUCT_PARTS_BY_QUERY,
  FETCH_PRODUCT_PART_BY_ID,
  LOADING,
  TOGGLE_PRODUCT_PART_SIDEBAR,
  TOGGLE_PRODUCT_PART_STATUS,
  UPDATE_PRODUCT_PART
} from './actionType';
//Toggle Sidebar
export const toggleProductPartSidebar = condition => dispatch => {
  dispatch( {
    type: TOGGLE_PRODUCT_PART_SIDEBAR,
    payload: condition
  } );
};

//Toggle Sidebar
export const toggleProductPartStutas = condition => dispatch => {
  dispatch( {
    type: TOGGLE_PRODUCT_PART_STATUS,
    payload: condition
  } );
};
/**
 * Get all Product Part
 */
export const fetchProductParts = () => async dispatch => {
  try {
    const response = await baseAxios.get( `${PRODUCT_PARTS_API.fetch_all}` );
    dispatch( {
      type: FETCH_PRODUCT_PARTS,
      payload: response.data
    } );
  } catch ( err ) {
    notify( 'error', 'Something went wrong!!! Please try again' );
  }
};

//Get Data by Query
export const fetchProductPartsByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      const res = await baseAxios.get( `${PRODUCT_PARTS_API.fetch_by_query}`, {
        params
      } );
      dispatch( {
        type: FETCH_PRODUCT_PARTS_BY_QUERY,
        payload: {
          items: res.data.data,
          totalRecords: res.data.totalRecords,
          params
        }
      } );
      await sleep( 500 );
      dispatch( { type: LOADING, payload: false } );
    } catch ( err ) {
      notify( 'error', 'Something went wrong!!! Please try again' );
    }
  };
};

//Get by id
export const fetchProductPartById = id => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );

    try {
      const queryParam = {
        id
      };
      const res = await baseAxios.get( `${PRODUCT_PARTS_API.fetch_by_id}?${qs.stringify( queryParam )}` );
      dispatch( {
        type: FETCH_PRODUCT_PART_BY_ID,
        payload: { selectedItem: res.data.data ? res.data.data : null }
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( err ) {
      errorResponse( err );
      dispatch( dataProgressCM( false ) );
    }
  };
};

//Add new
export const addProductPart = ( data, params ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().productPartReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      const res = await baseAxios.post( `${PRODUCT_PARTS_API.add}`, data );
      dispatch( {
        type: ADD_PRODUCT_PART,
        payload: data
      } );
      notify( 'success', "Product part has been added" );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleProductPartSidebar( !isOpenSidebar ) );
      dispatch( fetchProductPartsByQuery( params ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Update
export const updateProductPart = ( data, params ) => {
  return async ( dispatch, getState ) => {
    const { isOpenSidebar } = getState().productPartReducer;
    dispatch( dataSubmitProgressCM( true ) );
    try {
      const queryParam = {
        id: data.id
      };
      const res = await baseAxios.put( `${PRODUCT_PARTS_API.update}?${qs.stringify( queryParam )}`, data );
      dispatch( {
        type: UPDATE_PRODUCT_PART,
        payload: data
      } );
      notify( 'success', "Product part has been updated successfully!!!" );
      dispatch( dataSubmitProgressCM( false ) );
      dispatch( toggleProductPartSidebar( !isOpenSidebar ) );
      dispatch( fetchProductPartsByQuery( params ) );
    } catch ( err ) {
      errorResponse( err );
      dispatch( dataSubmitProgressCM( false ) );
    }
  };
};

//Delete
export const deleteProductPart = id => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${PRODUCT_PARTS_API.delete}`, { id } );
        dispatch( {
          type: DELETE_PRODUCT_PART,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please try again' );
      }
    }
  };
};
export const deleteProductPartByRange = ids => {
  return async dispatch => {
    const e = await confirmDialog( confirmObj );
    if ( e.isConfirmed ) {
      try {
        const res = await baseAxios.delete( `${PRODUCT_PARTS_API.delete_by_range}`, { ids } );
        dispatch( {
          type: DELETE_PRODUCT_PART_BY_RANGE,
          payload: res.data.data
        } );
        notify( 'success', res.data.message );
      } catch ( err ) {
        notify( 'error', 'Something went wrong!!! Please try again' );
      }
    }
  };
};
