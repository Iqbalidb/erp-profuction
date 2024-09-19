/* eslint-disable no-case-declarations */

import { AUTH_TOKEN_STORE, GET_AUTHENTICATE_USER, GET_AUTHENTICATE_USER_PERMISSION, IS_OPEN_INSTANT_LOGIN_MODAL, IS_USER_LOGGED_IN, LOGIN, LOGOUT, SESSION_DURATION } from "../../action-types";


// **  Initial State
const initialState = {
  isOpenInstantLoginModal: false,
  authToken: null,
  userData: {},
  authenticateUser: null,
  authenticateUserPermission: [],
  isUserLoggedIn: true,
  userPermission: {},
  sessionTime: {}
};

const authReducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case LOGIN:
      return {
        ...state,
        userData: action.data
      };
    case LOGOUT:
      return {
        ...initialState
      };

    case AUTH_TOKEN_STORE:
      return { ...state, authToken: action.authToken };

    case IS_OPEN_INSTANT_LOGIN_MODAL:
      return { ...state, isOpenInstantLoginModal: action.isOpenInstantLoginModal };

    case GET_AUTHENTICATE_USER:
      return { ...state, authenticateUser: action.authenticateUser };

    case GET_AUTHENTICATE_USER_PERMISSION:
      return {
        ...state,
        authenticateUserPermission: action.authenticateUserPermission,
        userPermission: action.userPermission
      };

    case SESSION_DURATION:
      return { ...state, sessionTime: action.sessionTime };

    case IS_USER_LOGGED_IN:
      return { ...state, isUserLoggedIn: action.isUserLoggedIn };
    default:
      return state;
  }
};

export default authReducer;
