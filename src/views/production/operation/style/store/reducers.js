import { mapArrayToDropdown } from 'utility/commonHelper';
import { FETCH_STYLE } from './actionType';

/*
     Title: Reducers for STYLE
     Description: Reducers for STYLE
     Author: Alamgir Kabir
     Date: 11-April-2022
     Modified: 11-April-2022
*/
const initialState = {
  items: []
};
export const styleReducer = ( state = initialState, action ) => {
  const { type, payload } = action;
  switch ( type ) {
    case FETCH_STYLE: {
      const modifiedStyle = mapArrayToDropdown( payload.items, 'styleNo', 'id' );
      return { ...state, items: modifiedStyle };
    }
    default:
      return state;
  }
};
