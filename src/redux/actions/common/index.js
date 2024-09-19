import { merchandisingAxiosInstance } from "services";
import { STYLES_API } from "services/api-end-points/merchandising/v1";
import { errorResponse } from "utility/Utils";
import { status } from "utility/enums";
import { GET_ALL_STYLES_DROPDOWN_CM, IS_DATA_LOADED_CM, IS_DATA_PROGRESS_CM, IS_DATA_SUBMIT_PROGRESS_CM } from "../../action-types";


export const dataLoaderCM = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DATA_LOADED_CM,
        isDataLoadedCM: condition
    } );
};
export const dataProgressCM = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DATA_PROGRESS_CM,
        isDataProgressCM: condition
    } );
};
export const dataSubmitProgressCM = ( condition ) => dispatch => {
    dispatch( {
        type: IS_DATA_SUBMIT_PROGRESS_CM,
        iSubmitProgressCM: condition
    } );
};

export const getStyleDropdown = () => ( dispatch ) => {
    // endpoint
    const apiEndPoint = `${STYLES_API.fetch_all_grid}`;
    dispatch( {
        type: GET_ALL_STYLES_DROPDOWN_CM,
        stylesDropdowncm: [],
        isStyleDropdowncm: false
    } );
    merchandisingAxiosInstance.post( apiEndPoint, [] )
        .then( response => {
            console.log( { response } );
            if ( response.status === status.success ) {
                const stylesOptions = response.data.data.map( ( item ) => ( {
                    ...item,
                    label: item.styleNo,
                    value: item.id
                } ) );

                dispatch( {
                    type: GET_ALL_STYLES_DROPDOWN_CM,
                    stylesDropdowncm: stylesOptions,
                    isStyleDropdowncm: true
                } );
            }
        } ).catch( ( { response } ) => {
            errorResponse( response );
            dispatch( {
                type: GET_ALL_STYLES_DROPDOWN_CM,
                stylesDropdowncm: [],
                isStyleDropdowncm: true
            } );
        } );
};
