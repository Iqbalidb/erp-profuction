import { BIND_OPERATOR_INFO } from "../action-types";
import { initialOperatorModel } from "../model";

export const bindFocInfo = ( operatorInfo ) => dispatch => {
    if ( operatorInfo ) {
        dispatch( {
            type: BIND_OPERATOR_INFO,
            operatorInfo
        } );
    } else {
        dispatch( {
            type: BIND_OPERATOR_INFO,
            operatorInfo: initialOperatorModel
        } );
    }
};