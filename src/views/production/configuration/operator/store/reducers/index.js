import { BIND_OPERATOR_INFO, GET_ALL_OPERATOR_BY_QUERY } from '../action-types';
import { initialOperatorModel } from '../model';

const initialState = {
    allData: [],
    total: 0,
    params: {},
    queryObj: [],
    operatorInfo: { ...initialOperatorModel },
};

export const operatorsReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case BIND_OPERATOR_INFO:
            return {
                ...state,
                operatorInfo: action.operatorInfo
            };
        case GET_ALL_OPERATOR_BY_QUERY:
            return {
                ...state,
                allData: action.allData,
                total: action.totalRecords,
                params: action.params,
                queryObj: action.queryObj
            };
        default:
            return state;
    }

};
