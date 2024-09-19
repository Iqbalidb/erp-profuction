import { accountReducers } from "./accountReducer";
import { authReducer } from "./authRootReducer";
import commonReducers from './common';
import layout from './layout';
import navbar from './navbar';
import { productionReducers } from "./productionReducer";

export default ( {
    ...accountReducers,
    ...productionReducers,
    ...authReducer,
    commonReducers,
    layout,
    navbar
} );