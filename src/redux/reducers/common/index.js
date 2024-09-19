import { GET_ALL_STYLES_DROPDOWN_CM, IS_DATA_LOADED_CM, IS_DATA_PROGRESS_CM, IS_DATA_SUBMIT_PROGRESS_CM } from "../../action-types";

const initialState = {

    isDataLoadedCM: true,
    isDataProgressCM: false,
    iSubmitProgressCM: false,
    stylesDropdowncm: [],
    isStyleDropdowncm: true
};

const commonReducers = ( state = initialState, action ) => {
    switch ( action.type ) {

        case IS_DATA_LOADED_CM:
            return {
                ...state,
                isDataLoadedCM: action.isDataLoadedCM
            };
        case IS_DATA_PROGRESS_CM:
            return {
                ...state,
                isDataProgressCM: action.isDataProgressCM
            };
        case IS_DATA_SUBMIT_PROGRESS_CM:
            return {
                ...state,
                iSubmitProgressCM: action.iSubmitProgressCM
            };

        case GET_ALL_STYLES_DROPDOWN_CM:
            return {
                ...state,
                stylesDropdowncm: action.stylesDropdowncm,
                isStyleDropdowncm: action.isStyleDropdowncm
            };
        default:
            return state;
    }
};

export default commonReducers;
