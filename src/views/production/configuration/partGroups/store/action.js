/*
     Title: Action for part groups
     Description: Action for part groups
     Author: Alamgir Kabir
     Date: 02-July-2022
     Modified: 02-July-2022
*/
import { dataProgressCM } from 'redux/actions/common';
import { baseAxios } from 'services';
import { PART_GROUPS_API } from 'services/api-end-points/production/v1';
import { sleep } from 'utility/commonHelper';
import { notify } from 'utility/custom/notifications';
import { errorResponse } from 'utility/Utils';
import { FETCH_PART_GROUPS_BY_ID, FETCH_PART_GROUP_BY_QUERY, LOADING, TOGGLE_PART_GROUP_PART_SIDEBAR, TOGGLE_PART_GROUP_STATUS } from './actionType';
//Get Data by Query
export const fetchPartGroupByQuery = params => {
  return async dispatch => {
    try {
      dispatch( { type: LOADING, payload: true } );
      const res = await baseAxios.get( `${PART_GROUPS_API.fetch_by_query}`, {
        params
      } );
      dispatch( {
        type: FETCH_PART_GROUP_BY_QUERY,
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
export const fetchPartGroupById = id => {
  return async dispatch => {
    dispatch( dataProgressCM( true ) );

    try {
      const res = await baseAxios.get( PART_GROUPS_API.fetch_by_id, { params: { id } } );

      dispatch( {
        type: FETCH_PART_GROUPS_BY_ID,
        payload: { selectedItem: res.data.data ? res.data.data : null }
      } );
      dispatch( dataProgressCM( false ) );

    } catch ( error ) {
      errorResponse( error );
      dispatch( dataProgressCM( false ) );
    }
  };
};

//Toggle Sidebar
export const togglePartGroupSidebar = condition => dispatch => {
  dispatch( {
    type: TOGGLE_PART_GROUP_PART_SIDEBAR,
    payload: condition
  } );
};

//Toggle Sidebar
export const togglePartGroupStutas = condition => dispatch => {
  dispatch( {
    type: TOGGLE_PART_GROUP_STATUS,
    payload: condition
  } );
};
