import { merchandisingAxiosInstance } from 'services';
import { STYLES_API } from 'services/api-end-points/merchandising/v1';
import { FETCH_STYLE } from './actionType';

/*
     Title: Actions for STYLE
     Description: Actions for STYLE
     Author: Alamgir Kabir
     Date: 11-April-2022
     Modified: 11-April-2022
*/
export const fetchStyles = () => {
  return async dispatch => {
    const res = await merchandisingAxiosInstance.get( STYLES_API.fetch_all );
    dispatch( {
      type: FETCH_STYLE,
      payload: {
        items: res.data.data
      }
    } );
  };
};
