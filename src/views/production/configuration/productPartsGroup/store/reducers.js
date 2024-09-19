/*
     Title: Reducers fro PRODUCTION_PARTS_GROUP
     Description: Reducers fro PRODUCTION_PARTS_GROUP
     Author: Alamgir Kabir
     Date: 14-May-2022
     Modified: 14-May-2022
*/
import { FETCH_PRODUCT_PARTS_GROUP_BY_ID, FETCH_PRODUCT_PARTS_GROUP_BY_QUERY, LOADING } from './actionType';
const initialState = {
  loading: false,
  items: [],
  total: 0,
  params: {},
  selectedItem: null
};
export const productionPartsGroup = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case LOADING:
      return { ...state, loading: payload };
    case FETCH_PRODUCT_PARTS_GROUP_BY_QUERY:
      return {
        ...state,
        items: payload.items,
        total: payload.totalRecords,
        params: action.params
      };
    case FETCH_PRODUCT_PARTS_GROUP_BY_ID: {
      return {
        ...state,
        selectedItem: payload
      };
    }
    default:
      return state;
  }
};
